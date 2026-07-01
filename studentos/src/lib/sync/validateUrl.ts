/**
 * SSRF guard for the sync proxy (`/api/sync`).
 *
 * The proxy forwards client-supplied URLs (a source's `params.baseUrl` / `url`)
 * to server-side `fetch()`. Without validation a caller could aim the server at
 * `http://169.254.169.254/` (cloud metadata), `127.0.0.1`, or any private host.
 *
 * Two independent layers:
 *  1. ALLOWLIST — the host *and its port* must be one already shipped in a
 *     university preset. Matching on `URL.host` (hostname[:port]), not just the
 *     hostname, stops a caller from smuggling `preset-host:9999` past the check
 *     to port-scan or reach an off-port internal service on the same host.
 *     Every legitimate URL the app ever fetches is declared there, so the
 *     allowlist is exhaustive by construction (derived, never hand-maintained).
 *     It is also scoped PER PROVIDER: a host is only reachable under the
 *     `providerId` that shipped it, so a caller can't borrow one provider's
 *     allowlisted host to relay arbitrary params through another provider's
 *     adapter (e.g. a news host driven as an easyacademy timetable endpoint).
 *  2. IP CHECK — before trusting an allowlisted host we resolve it and reject
 *     any answer that lands in a private/internal range (defence against DNS
 *     rebinding / a hijacked university DNS record).
 *
 * Callers also pass `redirect: "manual"` to `fetch()` so a 3xx can't bounce a
 * validated host onto an internal one after the check.
 *
 * Errors are deliberately generic (no host/IP echoed) so the API never leaks
 * which internal addresses were probed; the `/api/sync` guard maps any throw to
 * a single 400. No new npm dependency — only Node built-ins (`node:dns`/`node:net`).
 */
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { SyncSource } from "./provider";
import { UNIVERSITY_PRESETS } from "./universities";

/** Raised when a URL fails allowlist or IP validation. Message stays generic. */
export class SyncUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SyncUrlError";
  }
}

/** Resolve a hostname to its IP address strings. Injectable for tests. */
export type DnsResolver = (host: string) => Promise<string[]>;

const defaultResolver: DnsResolver = async (host) => {
  const records = await lookup(host, { all: true });
  return records.map((r) => r.address);
};

// ── allowlist (derived from the shipped presets) ───────────────────────────────

const URL_KEYS = ["baseUrl", "url"] as const;

/** Pull every fetchable URL out of one source's (untyped) params. */
export function sourceUrls(source: SyncSource): string[] {
  const params = source.params;
  if (!params || typeof params !== "object") return [];
  const out: string[] = [];
  for (const key of URL_KEYS) {
    const value = (params as Record<string, unknown>)[key];
    if (typeof value === "string" && value) out.push(value);
  }
  return out;
}

/** Build `providerId → Set<host[:port]>` from the shipped presets: a host is
 *  registered ONLY under the provider whose source declared it. */
function collectAllowed(): Map<string, Set<string>> {
  const byProvider = new Map<string, Set<string>>();
  const add = (providerId: string, host: string) => {
    let set = byProvider.get(providerId);
    if (!set) byProvider.set(providerId, (set = new Set<string>()));
    set.add(host);
  };
  const addFrom = (sources: readonly SyncSource[]) => {
    for (const source of sources) {
      for (const raw of sourceUrls(source)) {
        try {
          // `host` = hostname[:port]; presets omit the port (default 443/80),
          // so an entry is bare hostname unless a preset pins a non-default port.
          add(source.providerId, new URL(raw).host.toLowerCase());
        } catch {
          // a malformed preset URL simply doesn't widen the allowlist
        }
      }
    }
  };
  for (const preset of UNIVERSITY_PRESETS) {
    addFrom(preset.sources ?? []);
    for (const lp of preset.livePrograms ?? []) addFrom(lp.sources);
  }
  return byProvider;
}

let cachedByProvider: Map<string, Set<string>> | undefined;
let cachedUnion: Set<string> | undefined;

const EMPTY_HOSTS: ReadonlySet<string> = new Set<string>();

function allowedByProvider(): Map<string, Set<string>> {
  return (cachedByProvider ??= collectAllowed());
}

/** The host[:port] entries reachable under a given `providerId` (lowercased);
 *  empty for an unknown provider. */
export function allowedHostsFor(providerId: string): ReadonlySet<string> {
  return allowedByProvider().get(providerId) ?? EMPTY_HOSTS;
}

/** Union of every provider's host[:port] entries (lowercased). Kept for the
 *  insegnamenti discovery guard, which is not provider-scoped. */
export function allowedHosts(): ReadonlySet<string> {
  if (!cachedUnion) {
    const union = new Set<string>();
    for (const set of allowedByProvider().values()) for (const h of set) union.add(h);
    cachedUnion = union;
  }
  return cachedUnion;
}

// ── private / internal IP detection ────────────────────────────────────────────

function isPrivateV4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true; // unparseable → treat as unsafe
  }
  const [a, b] = parts;
  if (a === 0) return true; // 0.0.0.0/8 (unspecified)
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8 (loopback)
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local / cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  return false;
}

function isPrivateV6(ip: string): boolean {
  const addr = ip.toLowerCase().split("%")[0]; // drop any zone id
  if (addr === "::1" || addr === "::") return true; // loopback / unspecified
  const mapped = addr.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (mapped) return isPrivateV4(mapped[1]); // IPv4-mapped IPv6
  if (/^f[cd]/.test(addr)) return true; // fc00::/7 (unique local)
  if (/^fe[89ab]/.test(addr)) return true; // fe80::/10 (link-local)
  return false;
}

/** True for loopback, private, link-local, ULA, or any non-IP-literal input. */
export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateV4(ip);
  if (version === 6) return isPrivateV6(ip);
  return true; // not a literal IP → never trust it
}

// ── the guard ──────────────────────────────────────────────────────────────────

/**
 * Validate a client-supplied URL before the server fetches it. Resolves to the
 * parsed `URL` on success; throws `SyncUrlError` (generic message) otherwise.
 * `opts.allowlist` / `opts.resolve` are injectable for deterministic tests.
 */
export async function validateSyncUrl(
  raw: string,
  opts: { allowlist?: ReadonlySet<string>; resolve?: DnsResolver } = {},
): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new SyncUrlError("URL non valido");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SyncUrlError("protocollo non consentito");
  }

  // Allowlist is keyed on host[:port] (`URL.host`) so a smuggled `:9999` fails;
  // the IP check below runs on the bare `hostname` (no port) for DNS resolution.
  const hostKey = url.host.toLowerCase();
  const hostname = url.hostname.toLowerCase();
  const allowlist = opts.allowlist ?? allowedHosts();
  if (!allowlist.has(hostKey)) {
    throw new SyncUrlError("host non consentito");
  }

  // IPv6 literals arrive bracketed from `URL.hostname` ("[::1]"); strip for isIP.
  const bare = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
  const literal = isIP(bare) !== 0;
  const addresses = literal ? [bare] : await (opts.resolve ?? defaultResolver)(hostname);

  if (addresses.length === 0) throw new SyncUrlError("host non risolvibile");
  for (const address of addresses) {
    if (isPrivateIp(address)) throw new SyncUrlError("indirizzo interno non consentito");
  }

  return url;
}

/**
 * Validate every URL carried by a batch of sources, de-duplicated. Throws on the
 * first offending URL. Used by `/api/sync` before handing sources to the engine.
 *
 * Each URL is checked against the allowlist scoped to its OWN source's
 * `providerId` (unless `opts.allowlist` overrides it, for tests), so a host
 * shipped for one provider can't be relayed through another's adapter.
 */
export async function validateSources(
  sources: readonly SyncSource[],
  opts: { allowlist?: ReadonlySet<string>; resolve?: DnsResolver } = {},
): Promise<void> {
  const seen = new Set<string>();
  const tasks: Promise<URL>[] = [];
  for (const source of sources) {
    const allowlist = opts.allowlist ?? allowedHostsFor(source.providerId);
    for (const raw of sourceUrls(source)) {
      // De-dup per (provider, url): the same host may be legitimate under one
      // provider and forbidden under another, so the key can't be the URL alone.
      const key = `${source.providerId}\n${raw}`;
      if (seen.has(key)) continue;
      seen.add(key);
      tasks.push(validateSyncUrl(raw, { allowlist, resolve: opts.resolve }));
    }
  }
  await Promise.all(tasks);
}
