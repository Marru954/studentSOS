/**
 * Server-side PDF interpreter for "Importa da PDF". Receives the text already
 * extracted client-side from a timetable ("orario") or exam ("esami") PDF and
 * asks Groq (llama-3.3-70b-versatile, JSON mode) to return structured rows. The
 * raw rows are handed back for the client to normalize (lib/domain/pdfImport)
 * and preview before anything is saved. GROQ_API_KEY stays on the server;
 * nothing is persisted here. Mirrors the existing /api/assistente proxy.
 */
import { guardPost } from "@/lib/api/guard";
import { apiLog } from "@/lib/api/logger";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/** A full timetable/exam PDF is a few KB of text; cap to stay within budget. */
const MAX_TEXT = 16_000;

/** Never cache an AI extraction. */
export const dynamic = "force-dynamic";

type Kind = "orario" | "esami";

function jsonError(error: string, code: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error, code }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** The system prompt must mention JSON for Groq's json_object mode to engage. */
function systemPrompt(kind: Kind): string {
  if (kind === "orario") {
    return [
      "Sei un estrattore di dati. Ricevi il testo grezzo di un PDF con l'orario delle lezioni universitarie.",
      "Estrai TUTTE le lezioni che trovi. Rispondi SOLO con JSON valido, senza testo attorno, in questa forma:",
      '{"items":[{"corso":"","giorno":"","oraInizio":"","oraFine":"","aula":"","tipo":""}]}.',
      "Regole: giorno = uno tra lun, mar, mer, gio, ven, sab, dom.",
      "oraInizio e oraFine in formato 24 ore HH:MM. tipo = lezione, laboratorio o esercitazione.",
      "Lascia la stringa vuota se un dato non è presente. Non inventare nulla: includi solo ciò che leggi davvero nel testo.",
    ].join(" ");
  }
  return [
    "Sei un estrattore di dati. Ricevi il testo grezzo di un PDF con il calendario degli esami (appelli) universitari.",
    "Estrai TUTTI gli appelli che trovi. Rispondi SOLO con JSON valido, senza testo attorno, in questa forma:",
    '{"items":[{"corso":"","data":"","ora":"","aula":"","tipo":"","docente":""}]}.',
    "Regole: data in formato YYYY-MM-DD. ora in formato 24 ore HH:MM. tipo = scritto, orale o scritto+orale.",
    "Lascia la stringa vuota se un dato non è presente. Non inventare nulla: includi solo ciò che leggi davvero nel testo.",
  ].join(" ");
}

export async function POST(req: Request): Promise<Response> {
  const { response: blocked, remaining, setCookie } = guardPost(req, "import-pdf", {
    limit: 10,
    windowMs: 60_000,
  });
  if (blocked) return blocked;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(
      "Import da PDF non configurato: manca GROQ_API_KEY sul server.",
      "config",
      503,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Corpo della richiesta non valido.", "badrequest", 400);
  }

  const kind = (body as { kind?: unknown })?.kind;
  const text = (body as { text?: unknown })?.text;
  if ((kind !== "orario" && kind !== "esami") || typeof text !== "string") {
    return jsonError("Parametri non validi.", "badrequest", 400);
  }

  const clipped = text.trim().slice(0, MAX_TEXT);
  if (clipped.length < 20) {
    return jsonError("Il PDF non contiene testo leggibile.", "empty", 422);
  }

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt(kind) },
          { role: "user", content: clipped },
        ],
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });
  } catch {
    return jsonError(
      "Impossibile contattare il servizio AI. Riprova tra poco.",
      "upstream",
      502,
    );
  }

  if (groqRes.status === 429) {
    return jsonError(
      "Quota AI esaurita per ora. Riprova più tardi o inserisci i dati a mano.",
      "quota",
      429,
    );
  }
  if (!groqRes.ok) {
    // Log upstream detail server-side only; don't echo the provider body to the
    // client (info disclosure).
    const detail = await groqRes.text().catch(() => "");
    apiLog("error", "import-pdf", "upstream Groq error", {
      status: groqRes.status,
      detail: detail.slice(0, 160),
    });
    return jsonError(
      "Errore dal servizio AI. Riprova tra poco o inserisci i dati a mano.",
      "upstream",
      502,
    );
  }

  let content: string;
  try {
    const payload = (await groqRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    content = payload.choices?.[0]?.message?.content ?? "";
  } catch {
    return jsonError("Risposta del servizio AI illeggibile.", "parse", 422);
  }

  let items: unknown;
  try {
    const parsed: unknown = JSON.parse(content);
    items = Array.isArray(parsed)
      ? parsed
      : (parsed as { items?: unknown })?.items;
  } catch {
    return jsonError(
      "Non sono riuscito a interpretare il PDF. Riprova o inserisci i dati a mano.",
      "parse",
      422,
    );
  }
  if (!Array.isArray(items)) {
    return jsonError(
      "Non sono riuscito a interpretare il PDF. Riprova o inserisci i dati a mano.",
      "parse",
      422,
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  // Persisti il contatore del rate-limit cross-istanza nel cookie firmato.
  if (setCookie) headers["Set-Cookie"] = setCookie;
  // Solo per debug in sviluppo: non esporre lo stato del rate-limit in produzione.
  if (process.env.NODE_ENV !== "production") {
    headers["X-RateLimit-Remaining"] = String(remaining);
  }
  return new Response(JSON.stringify({ ok: true, items }), { headers });
}
