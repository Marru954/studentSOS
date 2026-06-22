/**
 * Guard AI proxy routes (/api/assistente, /api/import-pdf).
 * Livelli sopra al guard per-IP di guard.ts:
 *
 *   A — Auth gate:      sessione richiesta quando Supabase è configurato
 *   B — Circuit-breaker: contatore globale al minuto (backstop vs. abuso)
 *   C — Cap giornaliero: contatore globale a finestra di 24h (difesa quota Groq)
 *
 * I livelli B e C usano ora un contatore DISTRIBUITO su Supabase
 * (`distributedRateLimit` → tabella `rate_limits`, migration 0002): un solo
 * contatore condiviso tra TUTTE le istanze serverless. Prima erano in-memory
 * per-istanza, quindi con N istanze la quota effettiva era N× — un limite
 * "globale" che globale non era. Le chiavi ("ai:cb", "ai:daily") sono decise
 * dal server, senza input del client → non falsificabili. Se Supabase non è
 * configurato o è irraggiungibile, `distributedRateLimit` degrada al backstop
 * in-memory per-istanza (vedi nota fail-safe nel suo file).
 *
 * Tunable via env:
 *   AI_CB_LIMIT    — chiamate AI/minuto globali (default 60)
 *   AI_DAILY_CAP   — chiamate AI/giorno globali (default 500)
 */
import { cookies } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";
import { distributedRateLimit } from "@/lib/api/distributedRateLimit";
import { guardPost } from "./guard";

// ── Level B: circuit-breaker globale per-minuto ──────────────────────────────
const CB_LIMIT = Number(process.env.AI_CB_LIMIT) || 60;
const CB_WINDOW_MS = 60_000;

// ── Level C: cap giornaliero globale (finestra fissa di 24h) ─────────────────
const DAILY_CAP = Number(process.env.AI_DAILY_CAP) || 500;
const DAILY_WINDOW_MS = 86_400_000;

// ── Helper ────────────────────────────────────────────────────────────────────
function jsonErr(error: string, status: number, retryAfter?: number): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };
  if (retryAfter !== undefined) headers["Retry-After"] = String(retryAfter);
  return new Response(JSON.stringify({ ok: false, error }), { status, headers });
}

/**
 * Gate AI proxy POST handlers.
 * Ordine: A (auth) → B (circuit-breaker) → C (cap giornaliero) → per-IP (guardPost).
 * @param req richiesta in arrivo
 * @param name nome della route (rende indipendenti le chiavi per-IP)
 * @param opts soglia e finestra del rate-limit per-IP
 * @returns `response` non-null se la richiesta va respinta; `remaining` per
 *          l'header di debug; `setCookie` del layer per-IP cross-istanza
 */
export async function guardAiPost(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
): Promise<{ response: Response | null; remaining: number; setCookie: string | null }> {
  // Level A — auth gate (attivo solo se Supabase è configurato)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const cookieStore = await cookies();
      const supabase = getServerSupabase({
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      });
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          return {
            response: jsonErr("Accedi per usare l'assistente AI.", 401),
            remaining: 0,
            setCookie: null,
          };
        }
      }
    } catch {
      // Supabase irraggiungibile → fail closed: protegge la chiave Groq.
      return {
        response: jsonErr(
          "Impossibile verificare la sessione. Riprova tra poco.",
          503,
        ),
        remaining: 0,
        setCookie: null,
      };
    }
  }

  // Level B — circuit-breaker globale cross-istanza
  const cb = await distributedRateLimit("ai:cb", {
    limit: CB_LIMIT,
    windowMs: CB_WINDOW_MS,
  });
  if (!cb.ok) {
    return {
      response: jsonErr(
        "Servizio AI momentaneamente saturo. Riprova tra poco.",
        429,
        cb.retryAfter,
      ),
      remaining: 0,
      setCookie: null,
    };
  }

  // Level C — cap giornaliero globale cross-istanza
  const cap = await distributedRateLimit("ai:daily", {
    limit: DAILY_CAP,
    windowMs: DAILY_WINDOW_MS,
  });
  if (!cap.ok) {
    return {
      response: jsonErr(
        "Limite giornaliero raggiunto. Riprova più tardi.",
        429,
        cap.retryAfter,
      ),
      remaining: 0,
      setCookie: null,
    };
  }

  // Existing per-IP guard (same-origin + rate-limit + cookie cross-istanza)
  return guardPost(req, name, opts);
}
