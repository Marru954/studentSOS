/**
 * Shared, polite HTTP client for server-side fetches towards university portals.
 *
 *  - Identifiable `User-Agent` on every request (portal admins can tell who we are).
 *  - Conditional GETs: when a previous 200 carried `ETag`/`Last-Modified` we resend
 *    `If-None-Match`/`If-Modified-Since`; a 304 is "nothing changed" and is served
 *    to the caller as the cached 200 (never a failure). Portals that send no
 *    validators are simply never conditional.
 *  - 429/503: honour `Retry-After` (seconds or HTTP-date), else exponential
 *    backoff with jitter; bounded attempts, never an immediate burst. A wait that
 *    would outlast the caller's budget gives up and returns the 429/503 response.
 *  - Timeouts / dropped connections: a few plain retries, then the error surfaces.
 *
 * SSRF stays the caller's job (host allowlist + private-IP check); this client
 * defaults to `redirect: "manual"` so a 3xx can never bounce past that guard.
 */

/** Descriptive UA. TODO: replace the contact placeholder with a real address. */
export const USER_AGENT =
  "StudentOS/1.0 (+https://github.com/Marru954/studentSOS; contatto: DA-DEFINIRE)";

const MAX_RETRIES_STATUS = 3;
const MAX_RETRIES_NETWORK = 2;
const BACKOFF_BASE_MS = 1_000;
/** Longest single wait we accept (Retry-After above this → give up, don't stall the sync). */
const MAX_WAIT_MS = 10_000;
const ATTEMPT_TIMEOUT_MS = 15_000;
const CACHE_MAX_ENTRIES = 64;
const CACHE_MAX_BODY_BYTES = 2_000_000;

export interface PoliteFetchOptions {
  /** Test seams. */
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
  attemptTimeoutMs?: number;
}

interface CachedEntry {
  etag?: string;
  lastModified?: string;
  body: string;
  status: number;
  headers: [string, string][];
}

// Per-process validator + body cache (server instances are ephemeral: best effort).
const cache = new Map<string, CachedEntry>();

export function _resetPoliteFetchCache(): void {
  cache.clear();
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Parse `Retry-After` (delta-seconds or HTTP-date) into ms, or null. */
export function parseRetryAfter(value: string | null, now = Date.now()): number | null {
  if (!value) return null;
  const v = value.trim();
  if (/^\d+$/.test(v)) return Number(v) * 1000;
  const at = Date.parse(v);
  return Number.isNaN(at) ? null : Math.max(0, at - now);
}

function isAbort(err: unknown): boolean {
  return err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError");
}

export async function politeFetch(
  input: string | URL,
  init: RequestInit = {},
  opts: PoliteFetchOptions = {},
): Promise<Response> {
  const doFetch = opts.fetchImpl ?? fetch;
  const sleep = opts.sleep ?? defaultSleep;
  const random = opts.random ?? Math.random;
  const attemptTimeout = opts.attemptTimeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const url = input.toString();
  const method = (init.method ?? "GET").toUpperCase();
  const callerSignal = init.signal ?? undefined;

  const headers = new Headers(init.headers);
  if (!headers.has("User-Agent")) headers.set("User-Agent", USER_AGENT);

  // Conditional only for GET, and only if a validator was previously received.
  const cached = method === "GET" ? cache.get(url) : undefined;
  if (cached?.etag) headers.set("If-None-Match", cached.etag);
  if (cached?.lastModified) headers.set("If-Modified-Since", cached.lastModified);

  let statusRetries = 0;
  let networkRetries = 0;

  for (;;) {
    const signal = callerSignal
      ? AbortSignal.any([callerSignal, AbortSignal.timeout(attemptTimeout)])
      : AbortSignal.timeout(attemptTimeout);

    let res: Response;
    try {
      res = await doFetch(url, { redirect: "manual", ...init, headers, signal });
    } catch (err) {
      // Caller's own budget is gone (or it cancelled): retrying is pointless.
      if (callerSignal?.aborted) throw err;
      if (!isAbort(err) && !(err instanceof TypeError)) throw err;
      if (networkRetries >= MAX_RETRIES_NETWORK) throw err;
      networkRetries++;
      await sleep(BACKOFF_BASE_MS * 2 ** (networkRetries - 1) + random() * 250);
      continue;
    }

    if (res.status === 304 && cached) {
      return new Response(cached.body, { status: cached.status, headers: cached.headers });
    }

    if ((res.status === 429 || res.status === 503) && statusRetries < MAX_RETRIES_STATUS) {
      const retryAfter = parseRetryAfter(res.headers.get("retry-after"));
      const wait = retryAfter ?? BACKOFF_BASE_MS * 2 ** statusRetries + random() * 250;
      if (wait > MAX_WAIT_MS) return res; // caller sees the 429/503 and isolates the failure
      statusRetries++;
      await res.body?.cancel().catch(() => {});
      await sleep(wait);
      continue;
    }

    if (method === "GET" && res.status === 200) {
      const etag = res.headers.get("etag") ?? undefined;
      const lastModified = res.headers.get("last-modified") ?? undefined;
      if (etag || lastModified) {
        const body = await res.clone().text();
        if (body.length <= CACHE_MAX_BODY_BYTES) {
          if (cache.size >= CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
          cache.set(url, {
            etag,
            lastModified,
            body,
            status: res.status,
            // body is already decoded: drop the transport headers that no longer match it
            headers: [...res.headers.entries()].filter(
              ([k]) => !["content-encoding", "content-length", "transfer-encoding"].includes(k),
            ),
          });
        }
      } else {
        cache.delete(url);
      }
    }
    return res;
  }
}
