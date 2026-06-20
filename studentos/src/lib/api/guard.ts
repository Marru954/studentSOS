/**
 * Difese leggere per i proxy server (`/api/{assistente,import-pdf,alerts,sync,sync-delphi,…}`):
 * blocco cross-site + rate-limit. Niente auth obbligatoria (romperebbe il
 * local-only) e nessuna dipendenza nuova.
 *
 * Il rate-limit è a DUE LIVELLI sovrapposti (defense-in-depth), entrambi devono
 * concedere il passaggio:
 *
 *  1) PERSISTENTE CROSS-ISTANZA — un fixed-window firmato HMAC trasportato in un
 *     cookie (`srl_<route>`). Il contatore viaggia COL CLIENT, quindi qualunque
 *     istanza serverless legge lo stesso stato della finestra. È la correzione
 *     della falla principale: un limite in-memory (vedi sotto) su Vercel vive in
 *     una Map locale al processo, così ogni istanza riparte da zero e basta
 *     colpire istanze diverse per aggirarlo. Il cookie lega invece il conteggio
 *     all'identità persistente del client, non all'istanza.
 *
 *  2) BACKSTOP PER-IP IN-MEMORY — il vecchio fixed-window per-IP, mantenuto di
 *     proposito (vedi TRADEOFF).
 *
 * TRADEOFF (scelto e documentato): un cookie è stateless lato server, quindi un
 * client OSTILE può (a) NON rimandarlo → finestra sempre nuova, o (b) RIGIOCARE
 * un vecchio cookie a conteggio basso. La firma HMAC impedisce di FORGIARE un
 * conteggio diverso, NON di scartare/rigiocare il cookie. Per questo NON si
 * rimuove il backstop per-IP: continua a limitare il caso drop/replay per-istanza
 * (esattamente come prima del fix), mentre il cookie rende il limite corretto
 * cross-istanza per i browser onesti — cioè proprio lo scenario segnalato. La
 * difesa "forte" sarebbe uno store condiviso (Redis/Upstash/Vercel KV), ma
 * richiede una DIPENDENZA NPM NUOVA, qui vietata: opzione scartata di proposito
 * (era l'opzione 1 preferita ma non praticabile entro i vincoli). HMAC-SHA256
 * arriva da `node:crypto` (built-in), quindi zero dipendenze nuove.
 *
 * SEGRETO DI FIRMA: `RATE_LIMIT_SECRET`, con fallback su `GROQ_API_KEY` (le route
 * AI funzionano solo se quest'ultima è impostata, quindi il layer cookie è attivo
 * "out of the box" dove serve). L'HMAC è A SENSO UNICO: il cookie contiene solo
 * il digest, MAI la chiave — nessun secret/API key esposto. Se nessuno dei due è
 * presente il layer cookie è spento e resta solo il backstop in-memory (build
 * locale/offline → comportamento identico a prima).
 *
 * Anti-spoof per-IP preservato: `x-forwarded-for` usa l'ultimo hop (scritto dal
 * proxy di fiducia, non dichiarato dal client) e fallisce CHIUSO (bucket stretto
 * e condiviso) quando l'IP non è determinabile.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

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

/** Oltre questa soglia facciamo una passata di pulizia delle finestre scadute,
 *  così la Map non cresce illimitata su un server di lunga durata (ogni IP unico
 *  lasciava altrimenti un'entry permanente → leak di memoria). */
const SWEEP_THRESHOLD = 5_000;

function sweepExpired(now: number): void {
  for (const [key, b] of buckets) {
    if (now >= b.reset) buckets.delete(key);
  }
}

/** Rate-limit fixed-window in-memory. Ritorna ok + secondi di attesa al
 *  superamento + richieste residue nella finestra corrente (per header di debug). */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
  now: number = Date.now(),
): { ok: boolean; retryAfter: number; remaining: number } {
  const b = buckets.get(key);
  if (!b || now >= b.reset) {
    if (buckets.size >= SWEEP_THRESHOLD) sweepExpired(now);
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

// ── Layer persistente cross-istanza: fixed-window firmato in un cookie ────────

/** Chiave di firma del cookie: env dedicata, con fallback sulla GROQ_API_KEY
 *  (le route AI funzionano solo se è impostata). `null` → layer cookie spento. */
function signingSecret(): string | null {
  return process.env.RATE_LIMIT_SECRET || process.env.GROQ_API_KEY || null;
}

/** Versione del formato cookie, per poter invalidare in blocco i vecchi token. */
const COOKIE_VERSION = "v1";

/** HMAC-SHA256 base64url del payload. A senso unico: non rivela mai la chiave. */
function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Confronto a tempo costante di due stringhe ASCII (no early-exit timing leak). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Estrae dal `Cookie` header il valore grezzo del cookie `name`, o `null`. */
function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

/** Costruisce il `Set-Cookie`. Path = endpoint corrente (il cookie viaggia solo
 *  su quella route, non su ogni richiesta). `Secure` solo in produzione: in dev
 *  su http un cookie Secure verrebbe scartato dal browser. HttpOnly + SameSite
 *  Strict: il JS di pagina non lo legge e non parte cross-site. */
function buildSetCookie(
  req: Request,
  name: string,
  value: string,
  maxAgeSec: number,
): string {
  let path = "/";
  try {
    path = new URL(req.url).pathname || "/";
  } catch {
    path = "/";
  }
  const attrs = [
    `${name}=${value}`,
    `Path=${path}`,
    `Max-Age=${maxAgeSec}`,
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (process.env.NODE_ENV === "production") attrs.push("Secure");
  return attrs.join("; ");
}

interface CookieResult {
  ok: boolean;
  retryAfter: number;
  remaining: number;
  /** Cookie aggiornato da rimandare al client (anche quando `ok` è false: il
   *  conteggio incrementato deve persistere). */
  setCookie: string;
}

/**
 * Fixed-window come `rateLimit`, ma lo stato vive nel cookie firmato `srl_<name>`
 * invece che in una Map per-processo → è lo STESSO contatore su ogni istanza.
 * Cookie assente / firma non valida / finestra scaduta = nuova finestra (count 1):
 * la firma blocca la FORGIA di un conteggio, non lo scarto — per quello c'è il
 * backstop per-IP (vedi `guardPost`). Formato: `v1.<count>.<reset>.<sig>`.
 */
function cookieRateLimit(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
  secret: string,
  now: number = Date.now(),
): CookieResult {
  const cname = `srl_${name}`;
  let count = 0;
  let reset = 0;

  const raw = readCookie(req, cname);
  if (raw) {
    const segs = raw.split(".");
    if (segs.length === 4 && segs[0] === COOKIE_VERSION) {
      const [, c, r, sig] = segs;
      const c2 = Number(c);
      const r2 = Number(r);
      if (
        Number.isFinite(c2) &&
        Number.isFinite(r2) &&
        now < r2 &&
        safeEqual(sig, sign(`${name}.${c}.${r}`, secret))
      ) {
        count = c2;
        reset = r2;
      }
    }
  }

  // Finestra nuova se il cookie è assente, manomesso o scaduto.
  if (reset === 0) {
    reset = now + opts.windowMs;
    count = 0;
  }
  count += 1;

  const ok = count <= opts.limit;
  const value = `${COOKIE_VERSION}.${count}.${reset}.${sign(`${name}.${count}.${reset}`, secret)}`;
  const retryAfter = Math.ceil((reset - now) / 1000);
  return {
    ok,
    retryAfter: ok ? 0 : retryAfter,
    remaining: Math.max(0, opts.limit - count),
    setCookie: buildSetCookie(req, cname, value, Math.max(1, retryAfter)),
  };
}

/**
 * Gate da chiamare in testa a un handler POST: blocco cross-site + rate-limit a
 * due livelli (cookie persistente cross-istanza + backstop per-IP in-memory).
 * Ritorna `{ response, remaining, setCookie }`:
 *  - `response`: una Response (403/429) se la richiesta va respinta, altrimenti
 *    `null`. La 429 porta già il proprio `Set-Cookie` (il conteggio persiste).
 *  - `remaining`: richieste residue nella finestra (solo per un header di debug).
 *  - `setCookie`: header `Set-Cookie` da applicare alla risposta di SUCCESSO
 *    dell'handler (così il contatore della finestra persiste cross-istanza), o
 *    `null` se il layer cookie è spento (nessun secret) o la richiesta è 403.
 * `name` rende le chiavi del rate-limit indipendenti tra route.
 */
export function guardPost(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
): { response: Response | null; remaining: number; setCookie: string | null } {
  if (!isSameOrigin(req)) {
    return {
      response: new Response(
        JSON.stringify({ ok: false, error: "Origine non consentita." }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        },
      ),
      remaining: 0,
      setCookie: null,
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
  const ipRes = rateLimit(`${name}:${ip}`, effective);

  // Layer persistente: attivo solo se c'è un segreto di firma. Il cookie usa il
  // limite pieno (`opts`): il tightening "unknown IP" è una difesa anti-spoof
  // dell'IP, non riguarda l'identità del cookie.
  const secret = signingSecret();
  const cookieRes = secret ? cookieRateLimit(req, name, opts, secret) : null;
  const setCookie = cookieRes?.setCookie ?? null;

  if (!ipRes.ok || (cookieRes !== null && !cookieRes.ok)) {
    const retryAfter = Math.max(
      ipRes.ok ? 0 : ipRes.retryAfter,
      cookieRes && !cookieRes.ok ? cookieRes.retryAfter : 0,
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "Retry-After": String(retryAfter),
    };
    // Anche sul blocco rimandiamo il cookie aggiornato: lo stato della finestra
    // deve persistere, altrimenti scartando la 429 si otterrebbe un reset.
    if (setCookie) headers["Set-Cookie"] = setCookie;
    return {
      response: new Response(
        JSON.stringify({
          ok: false,
          error: "Troppe richieste. Riprova tra poco.",
        }),
        { status: 429, headers },
      ),
      remaining: 0,
      setCookie,
    };
  }

  const remaining = cookieRes
    ? Math.min(ipRes.remaining, cookieRes.remaining)
    : ipRes.remaining;
  return { response: null, remaining, setCookie };
}
