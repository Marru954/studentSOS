/**
 * Rate-limit distribuito (cross-istanza) a finestra fissa, backed da Supabase.
 *
 * PROBLEMA RISOLTO: i contatori di rate-limit del proxy AI erano in-memory
 * per-istanza. Su serverless ogni istanza ha la propria Map, quindi un limite
 * "globale" (circuit-breaker/minuto, cap/giorno a difesa della quota Groq) NON
 * era condiviso: con N istanze la quota effettiva era N×. Qui il contatore vive
 * in un'unica tabella Supabase (`rate_limits`) incrementata atomicamente dalla
 * funzione SECURITY DEFINER `rate_limit_hit` (migration 0002): un solo contatore
 * per tutte le istanze.
 *
 * CHIAVE NON FALSIFICABILE: le chiavi usate per i limiti globali ("ai:cb",
 * "ai:daily") sono decise dal server e non contengono input del client, quindi
 * non sono spoofabili. (Il layer per-IP resta in `guard.ts`, che usa l'ultimo
 * hop di `x-forwarded-for` — quello scritto dal proxy di fiducia — e non il
 * primo dichiarato dal client; limite residuo: client dietro lo stesso proxy/NAT
 * condividono il bucket per-IP.)
 *
 * FINESTRA: fixed-window (la più semplice che regge il caso d'uso, come il
 * `rateLimit` in guard.ts). La finestra riparte dal primo colpo e si azzera alla
 * scadenza. Scelta sliding-window scartata: richiederebbe più stato/round-trip
 * senza un guadagno reale per questi limiti.
 *
 * FAIL-SAFE = FAIL-OPEN-VERSO-BACKSTOP (scelta esplicita): se Supabase non è
 * configurato (build locale/offline) o la chiamata RPC fallisce, si degrada al
 * fixed-window IN-MEMORY per-istanza (sotto). Motivazione: (1) le route AI hanno
 * già un auth-gate che FALLISCE CHIUSO quando Supabase è irraggiungibile (vedi
 * aiGuard.ts), quindi un'indisponibilità di Supabase blocca comunque a monte le
 * richieste autenticate; (2) far cadere del tutto la feature per un errore
 * transitorio del contatore è peggio che mantenere un limite per-istanza. Il
 * backstop in-memory resta sempre un limite (solo non condiviso), coerente con
 * la filosofia "best-effort: alza il costo dell'abuso" del resto del modulo.
 */
import { getServerSupabase } from "@/lib/supabase/server";
import { apiLog } from "@/lib/api/logger";

/** Esito di una valutazione di rate-limit. */
export interface RateDecision {
  /** True se la richiesta è entro la soglia della finestra corrente. */
  ok: boolean;
  /** Secondi di attesa fino al reset della finestra (0 quando `ok`). */
  retryAfter: number;
  /** Colpi nella finestra corrente, incluso questo. */
  count: number;
}

/** Stato di una finestra fissa: inizio (epoch ms) + conteggio. */
export interface WindowState {
  windowStart: number;
  count: number;
}

/**
 * Passo puro di fixed-window — gemello TypeScript della SQL in `rate_limit_hit`.
 * Dato lo stato salvato (o null), calcola lo stato successivo e la decisione.
 * @param prev stato della finestra corrente, o null se non esiste
 * @param now epoch ms corrente
 * @param limit colpi massimi consentiti nella finestra
 * @param windowMs durata della finestra in ms
 * @returns lo stato aggiornato e la decisione di rate-limit
 */
export function fixedWindowStep(
  prev: WindowState | null,
  now: number,
  limit: number,
  windowMs: number,
): { next: WindowState; decision: RateDecision } {
  const expired = !prev || now >= prev.windowStart + windowMs;
  const next: WindowState = expired
    ? { windowStart: now, count: 1 }
    : { windowStart: prev!.windowStart, count: prev!.count + 1 };
  const ok = next.count <= limit;
  const retryAfter = ok
    ? 0
    : Math.max(0, Math.ceil((next.windowStart + windowMs - now) / 1000));
  return { next, decision: { ok, retryAfter, count: next.count } };
}

/** Store di backstop in-memory per-istanza (usato quando il layer distribuito
 *  non è disponibile). Globale al modulo come la Map in guard.ts. */
const fallbackStore = new Map<string, WindowState>();

/** Applica un passo di fixed-window al backstop in-memory e ritorna la decisione. */
function fallbackStep(
  key: string,
  now: number,
  limit: number,
  windowMs: number,
  store: Map<string, WindowState> = fallbackStore,
): RateDecision {
  const { next, decision } = fixedWindowStep(store.get(key) ?? null, now, limit, windowMs);
  store.set(key, next);
  return decision;
}

/** Funzione che interroga lo store distribuito. Ritorna la decisione o LANCIA
 *  in caso di errore (così il chiamante può degradare al backstop). */
export type RateLimitRpc = (
  key: string,
  limit: number,
  windowSeconds: number,
) => Promise<RateDecision>;

/** RPC di default: chiama `rate_limit_hit` su Supabase con un client anon
 *  (la funzione è SECURITY DEFINER, non serve la sessione utente). Lancia se
 *  Supabase non è configurato o se la RPC ritorna un errore. */
const defaultRpc: RateLimitRpc = async (key, limit, windowSeconds) => {
  // Nessuna sessione necessaria per il contatore globale: cookie bridge vuoto.
  const supabase = getServerSupabase({ getAll: () => [], setAll: () => {} });
  if (!supabase) throw new Error("supabase-not-configured");
  const { data, error } = await supabase.rpc("rate_limit_hit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new Error(error.message);
  const row = (Array.isArray(data) ? data[0] : data) as
    | { allowed: boolean; current_count: number; retry_after: number }
    | undefined;
  if (!row) throw new Error("rate_limit_hit: risposta vuota");
  return {
    ok: row.allowed,
    retryAfter: row.retry_after ?? 0,
    count: row.current_count ?? 0,
  };
};

/** Dipendenze iniettabili (per i test). */
export interface RateLimitDeps {
  /** Override della RPC distribuita. `null` forza il backstop in-memory;
   *  `undefined` usa il default (Supabase se configurato, altrimenti backstop). */
  rpc?: RateLimitRpc | null;
  /** Epoch ms iniettato (default Date.now). Usato solo dal backstop. */
  now?: number;
  /** Store di backstop iniettabile (i test passano una Map fresca). */
  fallback?: Map<string, WindowState>;
}

/** True quando il layer online (Supabase) è configurato via env. */
function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Valuta (e incrementa) il rate-limit per `key` su una finestra fissa, usando lo
 * store distribuito quando disponibile e degradando al backstop in-memory in
 * caso di assenza/errore (vedi nota FAIL-SAFE in testa al file).
 * @param key chiave del bucket, decisa dal server (es. "ai:cb")
 * @param opts soglia e durata finestra: `{ limit, windowMs }`
 * @param deps dipendenze iniettabili per i test
 * @returns la decisione di rate-limit (ok/retryAfter/count)
 */
export async function distributedRateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
  deps: RateLimitDeps = {},
): Promise<RateDecision> {
  const now = deps.now ?? Date.now();
  const windowSeconds = Math.max(1, Math.ceil(opts.windowMs / 1000));

  const rpc =
    deps.rpc !== undefined ? deps.rpc : supabaseConfigured() ? defaultRpc : null;

  // Nessuno store distribuito → backstop per-istanza (normale in locale/offline).
  if (!rpc) return fallbackStep(key, now, opts.limit, opts.windowMs, deps.fallback);

  try {
    return await rpc(key, opts.limit, windowSeconds);
  } catch (err) {
    // FAIL-OPEN-VERSO-BACKSTOP: errore transitorio del contatore distribuito →
    // si degrada al limite in-memory per-istanza (ancora un limite, non azzerato).
    apiLog("warn", "ratelimit", "rate-limit distribuito non disponibile, uso backstop", {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
    return fallbackStep(key, now, opts.limit, opts.windowMs, deps.fallback);
  }
}
