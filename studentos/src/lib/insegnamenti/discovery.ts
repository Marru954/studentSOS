/**
 * Manifesto-URL discovery (server-side only).
 *
 * Finds the public web page that lists a degree's insegnamenti (the "manifesto
 * degli studi"), so the scraper can fetch + parse it. Runs SERVER-SIDE because:
 *   1. browsers can't fetch other universities' sites (CORS), exactly like
 *      `/api/sync`; and
 *   2. the validity check is a server-safe string scan — we deliberately do NOT
 *      use `DOMParser` here (it doesn't exist in Node; the real DOM parse runs
 *      client-side in `parser.ts`).
 *
 * SSRF posture (this module is the sole network egress for the feature):
 *   - We only ever fetch hosts in a CURATED allowlist derived from `ATENEI`.
 *     An unknown `ateneo` resolves to no host → we never fetch → `null`. The
 *     caller's `corso` can only fill a path *template*, never the host.
 *   - Every candidate host is resolved and rejected if it lands on a private /
 *     internal IP (DNS-rebinding / hijacked-record defence), reusing the same
 *     `isPrivateIp` the sync proxy uses.
 *   - `redirect: "manual"` so a 3xx can't bounce a validated host onto an
 *     internal one after the check; a 3xx is simply treated as "not a manifesto".
 *
 * Honesty note (project rule: "wrong data is worse than none"): most Italian
 * course catalogues are client-rendered SPAs whose static HTML carries no CFU
 * table, so discovery validates the fetched HTML (`<table>` + "CFU"/"crediti")
 * and returns `null` — i.e. the degree falls back to MANUAL entry — unless a
 * real server-rendered table is actually present. A stale map entry therefore
 * self-heals to manual instead of shipping garbage.
 */
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isPrivateIp } from "@/lib/sync/validateUrl";

/** Response shape returned by `POST /api/insegnamenti/sync`. The server can't
 *  parse (no DOMParser) nor persist (no IndexedDB), so on success it hands the
 *  raw HTML back to the client, which parses + saves and computes the count. */
export type ManifestoApiResponse =
  | { status: "ok"; url: string; html: string }
  | { status: "manual" }
  | { status: "error"; error: string };

interface AteneoSource {
  /** Origin(s) that define this ateneo's SSRF allowlist. */
  base: string;
  /** Explicit ateneo-level candidate manifesto URLs, tried first (STEP C). */
  urls?: string[];
  /** Corso-specific candidate URLs, tried when a `corso` is known — best yield
   *  where the catalogue is server-rendered per degree (e.g. Bologna). */
  corsoUrls?: (corsoSlug: string) => string[];
}

/**
 * Curated map (STEP C). Keys are ateneo "stems"; a preset id like
 * `unifi-informatica` matches the `unifi` stem (see `resolveAteneo`). Hosts here
 * — and ONLY these — form the SSRF allowlist. URLs are best-effort entry points,
 * validated at fetch time; an entry that no longer serves a static CFU table
 * simply yields manual mode. Real domains only, never invented endpoints.
 */
const ATENEI: Record<string, AteneoSource> = {
  // Roma "Tor Vergata" — didattica.uniroma2.it è JS-driven, ma il dipartimento
  // di Informatica pubblica il manifesto (triennale/magistrale) come pagina
  // WordPress server-rendered con una vera tabella CFU su
  // informatica.uniroma2.it: puntiamo lì. La corsoUrls scatta solo per i corsi
  // di Informatica; gli altri corsi di Tor Vergata restano in manuale.
  uniroma2: {
    base: "https://informatica.uniroma2.it",
    corsoUrls: (slug) => {
      if (!slug.includes("informatica")) return [];
      const livello = slug.includes("magistr") ? "magistrale" : "triennale";
      return [`https://informatica.uniroma2.it/home/${livello}/studiare/insegnamenti/`];
    },
  },
  // Politecnico di Torino — "Guida dello studente" is server-rendered per cds/aa
  // but corso-keyed by numeric code we don't hold; probe generic paths only.
  polito: { base: "https://didattica.polito.it" },
  // Bologna — per-degree catalogue pages exist under /laurea|/magistrale.
  unibo: {
    base: "https://corsi.unibo.it",
    corsoUrls: (s) => [
      `https://corsi.unibo.it/laurea/${s}/insegnamenti`,
      `https://corsi.unibo.it/magistrale/${s}/insegnamenti`,
    ],
  },
  // Firenze.
  unifi: { base: "https://www.unifi.it" },
  // Trieste.
  units: { base: "https://corsi.units.it" },
  // Padova.
  unipd: { base: "https://didattica.unipd.it" },
  // Genova.
  unige: { base: "https://corsi.unige.it" },
};

/** STEP B: generic relative paths probed against a known ateneo base when no
 *  explicit / corso-specific candidate matched. */
const GENERIC_PATHS = ["/didattica/insegnamenti", "/corsi/manifesto", "/manifesto-studi"] as const;

/** Per-fetch budget (STEP B requirement: 5s timeout). */
const DISCOVERY_TIMEOUT_MS = 5_000;
/** Refuse absurdly large bodies before scanning (cheap DoS guard). */
const MAX_HTML_BYTES = 4_000_000;

let cachedHosts: Set<string> | undefined;

/** Hostnames discovery is allowed to reach (lowercased), derived from `ATENEI`. */
function allowedHosts(): ReadonlySet<string> {
  if (cachedHosts) return cachedHosts;
  const hosts = new Set<string>();
  const add = (raw: string) => {
    try {
      hosts.add(new URL(raw).hostname.toLowerCase());
    } catch {
      // a malformed map URL just doesn't widen the allowlist
    }
  };
  for (const entry of Object.values(ATENEI)) {
    add(entry.base);
    for (const u of entry.urls ?? []) add(u);
  }
  cachedHosts = hosts;
  return hosts;
}

/** Resolve a preset id / ateneo name to its curated entry. Matches the exact
 *  stem or any `stem-…` prefix (so `units-ingegneria-informatica` → `units`). */
function resolveAteneo(ateneo: string): AteneoSource | undefined {
  const id = ateneo.trim().toLowerCase();
  if (ATENEI[id]) return ATENEI[id];
  for (const stem of Object.keys(ATENEI)) {
    if (id.startsWith(`${stem}-`)) return ATENEI[stem];
  }
  return undefined;
}

/** "Ingegneria Informatica" → "ingegneria-informatica" (diacritics stripped).
 *  Exported for unit testing (pure). */
export function slugify(corso: string): string {
  return corso
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCandidates(entry: AteneoSource, corso?: string): string[] {
  const out: string[] = [];
  const slug = corso ? slugify(corso) : "";
  if (slug && entry.corsoUrls) out.push(...entry.corsoUrls(slug));
  if (entry.urls) out.push(...entry.urls);
  for (const path of GENERIC_PATHS) out.push(`${entry.base.replace(/\/+$/, "")}${path}`);
  return [...new Set(out)];
}

/** A manifesto page must carry a real table and the CFU/crediti token.
 *  Exported for unit testing (pure). */
export function isManifestoHtml(html: string): boolean {
  return /<table[\s>]/i.test(html) && /\bCFU\b|crediti/i.test(html);
}

/**
 * Fetch one candidate under the full SSRF posture. Returns the HTML on success,
 * `null` for anything unsafe / non-matching (never throws to the caller).
 */
async function tryFetch(rawUrl: string, signal: AbortSignal): Promise<string | null> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (!allowedHosts().has(host)) return null; // SSRF: curated hosts only

  // Resolve + reject private/internal addresses (DNS-rebinding defence).
  let addresses: string[];
  try {
    const bare = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
    addresses = isIP(bare) ? [bare] : (await lookup(host, { all: true })).map((r) => r.address);
  } catch {
    return null;
  }
  if (addresses.length === 0 || addresses.some(isPrivateIp)) return null;

  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "manual",
      signal,
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
  } catch {
    return null;
  }
  if (res.status < 200 || res.status >= 300) return null; // 3xx (manual) / errors
  if (!(res.headers.get("content-type") ?? "").toLowerCase().includes("html")) return null;

  const length = Number(res.headers.get("content-length") ?? 0);
  if (length > MAX_HTML_BYTES) return null;

  const html = await res.text().catch(() => "");
  if (!html || html.length > MAX_HTML_BYTES) return null;
  return isManifestoHtml(html) ? html : null;
}

/**
 * Discover + fetch the manifesto in one pass (so the API route doesn't fetch the
 * same URL twice). Returns `{ url, html }` for the first valid candidate, or
 * `null` (→ manual mode) when none is reachable / parseable.
 */
export async function discoverManifesto(
  ateneo: string,
  corso?: string,
): Promise<{ url: string; html: string } | null> {
  const entry = resolveAteneo(ateneo);
  if (!entry) return null; // unknown ateneo → never fetch an arbitrary host
  for (const candidate of buildCandidates(entry, corso)) {
    const html = await tryFetch(candidate, AbortSignal.timeout(DISCOVERY_TIMEOUT_MS));
    if (html) return { url: candidate, html };
  }
  return null;
}

/**
 * Spec entry point: resolve an ateneo to a usable manifesto URL, or `null`.
 * Thin wrapper over `discoverManifesto` (which also returns the body, reused by
 * the route to avoid a second round-trip).
 */
export async function discoverManifestoUrl(ateneo: string, corso?: string): Promise<string | null> {
  return (await discoverManifesto(ateneo, corso))?.url ?? null;
}
