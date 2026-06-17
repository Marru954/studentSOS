/**
 * Server-side proxy to the Groq chat API for /assistente. Keeps GROQ_API_KEY on
 * the server (never shipped to the client). Accepts POST { messages, context },
 * prepends the locale system prompt built from the student context, and streams
 * Groq's SSE back to the client as a plain-text token stream.
 *
 * Model: llama-3.3-70b-versatile (the live successor to the decommissioned
 * llama-3.1-70b-versatile), overridable with GROQ_MODEL.
 */
import {
  buildSystemPrompt,
  type AssistantContext,
  type ChatMessage,
} from "@/lib/assistente";
import { guardPost } from "@/lib/api/guard";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

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
  const { response: blocked, remaining } = guardPost(req, "assistente", {
    limit: 10,
    windowMs: 60_000,
  });
  if (blocked) return blocked;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(
      "Assistente non configurato: manca GROQ_API_KEY sul server.",
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

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(context) },
          ...messages,
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 800,
      }),
    });
  } catch {
    return jsonError("Impossibile contattare l'assistente. Riprova.", 502);
  }

  if (!groqRes.ok || !groqRes.body) {
    const detail = await groqRes.text().catch(() => "");
    return jsonError(
      `Errore dall'assistente (${groqRes.status}). ${detail.slice(0, 200)}`,
      502,
    );
  }

  // Transform Groq's SSE ("data: {json}\n\n", terminated by "data: [DONE]") into
  // a plain-text stream of just the content deltas, so the client stays simple.
  const upstream = groqRes.body;
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
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                controller.enqueue(encoder.encode(delta));
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

  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Accel-Buffering": "no",
  };
  // Solo per debug in sviluppo: non esporre lo stato del rate-limit in produzione.
  if (process.env.NODE_ENV !== "production") {
    headers["X-RateLimit-Remaining"] = String(remaining);
  }
  return new Response(stream, { headers });
}
