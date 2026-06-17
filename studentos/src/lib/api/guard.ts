/**
 * Difese leggere per i proxy server (`/api/{assistente,import-pdf,sync,sync-delphi}`):
 * blocco cross-site + rate-limit per-IP. Niente auth obbligatoria (romperebbe il
 * local-only) e nessuna dipendenza nuova.
 *
 * LIMITE ARCHITETTURALE NOTO E ACCETTATO: il rate-limit è in-memory fixed-window.
 * In serverless ogni istanza ha la propria Map e ogni cold-start riparte da zero,
 * quindi il limite NON è condiviso tra istanze → è best-effort: alza il costo
 * dell'abuso, non lo azzera. Una difesa forte richiederebbe uno store condiviso
 * (Redis/Upstash/KV); è fuori scope ora e si è scelto di NON aggiungerlo. Questo
 * file mitiga invece la falla peggiore — lo spoof di `x-forwarded-for`, che
 * regalava a ogni richiesta un bucket nuovo — usando l'ultimo hop (quello scritto
 * dal proxy di fiducia, non quello dichiarato dal client) e fallendo CHIUSO
 * (bucket stretto e condiviso) quando l'IP non è determinabile.
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

/** Rate-limit fixed-window in-memory. Ritorna ok + secondi di attesa al
 *  superamento + richieste residue nella finestra corrente (per header di debug). */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
  now: number = Date.now(),
): { ok: boolean; retryAfter: number; remaining: number } {
  const b = buckets.get(key);
  if (!b || now >= b.reset) {
    buckets.set(key, { count: 1, reset: now + opts.windowMs });
    return { ok: true, retryAfter: 0, remaining: Math.max(0, opts.limit - 1) };
  }
  b.count += 1;
  if (b.count > opts.limit) {
    return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000), remaining: 0 };
  }
  return { ok: true, retryAfter: 0, remaining: Math.max(0, opts.limit - b.count) };
}

/** IPv4 puntato o IPv6 (anche in forma compressa `::`). Validazione volutamente
 *  permissiva: serve solo a scartare un `x-forwarded-for` palesemente malformato
 *  (es. spoof testuale), non a normalizzare l'indirizzo. */
function isPlausibleIp(s: string): boolean {
  if (!s) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(s)) {
    return s.split(".").every((o) => Number(o) <= 255);
  }
  return s.includes(":") && /^[0-9a-fA-F:.]+$/.test(s);
}

/**
 * IP del client per la chiave del rate-limit.
 *
 * Anti-spoof: `x-forwarded-for` è una lista "client, proxy1, …, proxyDiFiducia".
 * Il client può PREPENDERE valori arbitrari ma non può rimuovere l'hop che il
 * proxy di fiducia (Vercel) AGGIUNGE in coda. Prendiamo quindi SEMPRE l'ultimo
 * hop, non il primo (che è quello dichiarato — e falsificabile — dal client).
 * Header assente o ultimo hop malformato → "unknown": chi chiama applicherà il
 * bucket fail-closed invece di regalare un secchiello fresco a ogni richiesta.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    return last && isPlausibleIp(last) ? last : "unknown";
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real && isPlausibleIp(real)) return real;
  return "unknown";
}

/** Bucket stretto applicato quando l'IP non è determinabile ("unknown"): un solo
 *  secchiello condiviso da TUTTE queste richieste, così lo spoof non scala. */
const UNKNOWN_IP_LIMIT = 3;

/**
 * Gate da chiamare in testa a un handler POST: blocco cross-site + rate-limit.
 * Ritorna `{ response, remaining }`: `response` è una Response (403/429) se la
 * richiesta va respinta, altrimenti `null`; `remaining` sono le richieste residue
 * nella finestra (utile solo per un header di debug). `name` rende le chiavi del
 * rate-limit indipendenti tra route.
 */
export function guardPost(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
): { response: Response | null; remaining: number } {
  if (!isSameOrigin(req)) {
    return {
      response: new Response(
        JSON.stringify({ ok: false, error: "Origine non consentita." }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      ),
      remaining: 0,
    };
  }
  const ip = clientIp(req);
  // Fail-closed: con un IP non determinabile tutte le richieste condividono un
  // unico bucket stretto, così lo spoof di x-forwarded-for non garantisce più
  // un secchiello fresco a ogni colpo.
  const effective =
    ip === "unknown"
      ? { limit: Math.min(opts.limit, UNKNOWN_IP_LIMIT), windowMs: opts.windowMs }
      : opts;
  const { ok, retryAfter, remaining } = rateLimit(`${name}:${ip}`, effective);
  if (!ok) {
    return {
      response: new Response(
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
      ),
      remaining: 0,
    };
  }
  return { response: null, remaining };
}
