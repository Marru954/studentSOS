/**
 * Difese leggere per i proxy server (`/api/{assistente,import-pdf,sync,sync-delphi}`):
 * blocco cross-site + rate-limit per-IP. Niente auth obbligatoria (romperebbe il
 * local-only) e nessuna dipendenza nuova.
 *
 * NOTA ONESTA: il rate-limit è in-memory fixed-window. In serverless lo stato è
 * per-istanza → best-effort: alza il costo dell'abuso, non lo azzera. Per una
 * difesa forte servirebbe uno store condiviso (Redis/Upstash), fuori scope.
 */

/** Accetta richieste same-origin/same-site; rifiuta cross-site. */
export function isSameOrigin(req: Request): boolean {
  // Browser moderni: Sec-Fetch-Site è il segnale autorevole e non falsificabile dal JS di pagina.
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "same-site" || site === "none";

  // Fallback (browser/datati senza Fetch Metadata): confronta Origin con l'host.
  const origin = req.headers.get("origin");
  if (!origin) return true; // navigazioni/strumenti senza Origin: non blocchiamo (no auth richiesta)
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

interface Bucket {
  count: number;
  reset: number; // epoch ms in cui la finestra si azzera
}
const buckets = new Map<string, Bucket>();

/** Rate-limit fixed-window in-memory. Ritorna ok + secondi di attesa al superamento. */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
  now: number = Date.now(),
): { ok: boolean; retryAfter: number } {
  const b = buckets.get(key);
  if (!b || now >= b.reset) {
    buckets.set(key, { count: 1, reset: now + opts.windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > opts.limit) {
    return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** IP del client dal primo hop di x-forwarded-for, con fallback. */
function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "local";
}

/**
 * Gate da chiamare in testa a un handler POST: blocco cross-site + rate-limit.
 * Ritorna una Response (403/429) se la richiesta va respinta, altrimenti null.
 * `name` rende le chiavi del rate-limit indipendenti tra route.
 */
export function guardPost(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
): Response | null {
  if (!isSameOrigin(req)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Origine non consentita." }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  const { ok, retryAfter } = rateLimit(`${name}:${clientIp(req)}`, opts);
  if (!ok) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Troppe richieste. Riprova tra poco.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      },
    );
  }
  return null;
}
