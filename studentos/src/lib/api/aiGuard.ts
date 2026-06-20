/**
 * Guard AI proxy routes (/api/assistente, /api/import-pdf).
 * Three layers on top of the existing per-IP guard in guard.ts:
 *
 *   A — Auth gate:   session required when Supabase is configured
 *   B — Circuit-breaker: global call counter per minute (backstop vs. IP split)
 *   C — Daily cap:   global call counter per UTC day
 *
 * Tutti i contatori sono in-memory per-istanza (no Redis). In serverless il
 * limite NON è condiviso tra istanze; è best-effort, come il per-IP già in
 * guard.ts, ma impedisce a ogni singola istanza di svuotare la quota Groq.
 *
 * Tunable via env:
 *   AI_CB_LIMIT    — chiamate AI/minuto per istanza (default 60)
 *   AI_DAILY_CAP   — chiamate AI/giorno per istanza (default 500)
 */
import { cookies } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";
import { guardPost } from "./guard";

// ── Level B: circuit-breaker globale per-minuto ──────────────────────────────
const CB_LIMIT = Number(process.env.AI_CB_LIMIT) || 60;
const CB_WINDOW_MS = 60_000;

let cbCount = 0;
let cbReset = 0;

function checkCircuitBreaker(now = Date.now()): { ok: boolean; retryAfter: number } {
  if (now >= cbReset) {
    cbCount = 1;
    cbReset = now + CB_WINDOW_MS;
    return { ok: true, retryAfter: 0 };
  }
  cbCount += 1;
  if (cbCount > CB_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((cbReset - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// ── Level C: cap giornaliero globale ─────────────────────────────────────────
const DAILY_CAP = Number(process.env.AI_DAILY_CAP) || 500;

let capCount = 0;
let capDay = "";

function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function checkDailyCap(now = Date.now()): boolean {
  const today = utcDay(now);
  if (capDay !== today) {
    capDay = today;
    capCount = 1;
    return true;
  }
  return ++capCount <= DAILY_CAP;
}

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

  // Level B — circuit-breaker globale
  const cb = checkCircuitBreaker();
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

  // Level C — cap giornaliero
  if (!checkDailyCap()) {
    return {
      response: jsonErr("Limite giornaliero raggiunto. Riprova domani.", 429),
      remaining: 0,
      setCookie: null,
    };
  }

  // Existing per-IP guard (same-origin + rate-limit)
  return guardPost(req, name, opts);
}
