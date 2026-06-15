/**
 * Server-side proxy to the Google Gemini API for /assistente. Keeps
 * GEMINI_API_KEY on the server (never shipped to the client). Accepts POST
 * { messages, context }, builds the locale system prompt from the student
 * context, and streams Gemini's SSE back to the client as a plain-text token
 * stream (so the client stays provider-agnostic — it still sends/receives
 * OpenAI-style user/assistant turns; the mapping to Gemini lives here).
 *
 * Model: gemini-2.0-flash (override with GEMINI_MODEL).
 */
import {
  buildSystemPrompt,
  type AssistantContext,
  type ChatMessage,
} from "@/lib/assistente";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

const MAX_MESSAGES = 20;
const MAX_CONTENT = 4000;

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Keep only well-formed user/assistant turns, trimmed and length-capped. */
function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const out: ChatMessage[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      continue;
    }
    const text = content.trim().slice(0, MAX_CONTENT);
    if (text) out.push({ role, content: text });
  }
  return out.slice(-MAX_MESSAGES);
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(
      "Assistente non configurato: manca GEMINI_API_KEY sul server.",
      503,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Corpo della richiesta non valido.", 400);
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  if (messages.length === 0) {
    return jsonError("Nessun messaggio da inviare.", 400);
  }
  const context = ((body as { context?: AssistantContext })?.context ?? {
    upcomingExams: [],
    todayLessons: [],
    earnedCfu: 0,
    focusMinutesThisWeek: 0,
  }) as AssistantContext;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(context) }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
      }),
    });
  } catch {
    return jsonError("Impossibile contattare l'assistente. Riprova.", 502);
  }

  if (!geminiRes.ok || !geminiRes.body) {
    if (geminiRes.status === 429) {
      return jsonError(
        "Limite di richieste Gemini raggiunto (quota). Riprova più tardi.",
        429,
      );
    }
    const detail = await geminiRes.text().catch(() => "");
    return jsonError(
      `Errore dall'assistente (${geminiRes.status}). ${detail.slice(0, 200)}`,
      502,
    );
  }

  // Gemini SSE (alt=sse): "data: {json}\n\n" per chunk, each with
  // candidates[0].content.parts[].text. No "[DONE]" sentinel — the stream
  // simply closes. Emit just the text deltas as a plain-text stream.
  const upstream = geminiRes.body;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data) continue;
            try {
              const parts = JSON.parse(data)?.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                for (const part of parts) {
                  if (typeof part?.text === "string" && part.text) {
                    controller.enqueue(encoder.encode(part.text));
                  }
                }
              }
            } catch {
              // partial/non-JSON keepalive line — ignore
            }
          }
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
    cancel() {
      void upstream.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
