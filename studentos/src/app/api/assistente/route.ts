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
  type AssistantExam,
  type AssistantLesson,
  type ChatMessage,
} from "@/lib/assistente";
import { guardAiPost } from "@/lib/api/aiGuard";
import { apiLog } from "@/lib/api/logger";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const MAX_MESSAGES = 20;
const MAX_CONTENT = 4000;
/** Bounds on the client-supplied context so a hostile (same-origin) caller can't
 *  inflate the system prompt into a cost/abuse vector. */
const MAX_EXAMS = 30;
const MAX_LESSONS = 20;
const MAX_FIELD = 120;

const str = (v: unknown, max = MAX_FIELD): string =>
  typeof v === "string" ? v.slice(0, max) : "";
const optStr = (v: unknown): string | undefined => {
  const s = str(v);
  return s || undefined;
};
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

/** Coerce + clamp the untrusted context into the shape buildSystemPrompt expects. */
function sanitizeContext(input: unknown): AssistantContext {
  const c = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const exams: AssistantExam[] = Array.isArray(c.upcomingExams)
    ? c.upcomingExams.slice(0, MAX_EXAMS).map((e) => {
        const o = (e && typeof e === "object" ? e : {}) as Record<string, unknown>;
        return { courseName: str(o.courseName), date: str(o.date), time: optStr(o.time) };
      })
    : [];
  const lessons: AssistantLesson[] = Array.isArray(c.todayLessons)
    ? c.todayLessons.slice(0, MAX_LESSONS).map((l) => {
        const o = (l && typeof l === "object" ? l : {}) as Record<string, unknown>;
        return { courseName: str(o.courseName), time: str(o.time), room: optStr(o.room) };
      })
    : [];
  return {
    ateneo: optStr(c.ateneo),
    programme: optStr(c.programme),
    year: num(c.year),
    upcomingExams: exams,
    todayLessons: lessons,
    average: num(c.average),
    earnedCfu: num(c.earnedCfu) ?? 0,
    focusMinutesThisWeek: num(c.focusMinutesThisWeek) ?? 0,
  };
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
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
  const { response: blocked, remaining } = await guardAiPost(req, "assistente", {
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
  const context = sanitizeContext((body as { context?: unknown })?.context);

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
    // Log the upstream detail server-side only; never echo the provider's raw
    // response body to the client (info disclosure).
    const detail = await groqRes.text().catch(() => "");
    apiLog("error", "assistente", "upstream Groq error", {
      status: groqRes.status,
      detail: detail.slice(0, 200),
    });
    return jsonError("Impossibile contattare l'assistente. Riprova.", 502);
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
    "X-Content-Type-Options": "nosniff",
    "X-Accel-Buffering": "no",
  };
  // Solo per debug in sviluppo: non esporre lo stato del rate-limit in produzione.
  if (process.env.NODE_ENV !== "production") {
    headers["X-RateLimit-Remaining"] = String(remaining);
  }
  return new Response(stream, { headers });
}
