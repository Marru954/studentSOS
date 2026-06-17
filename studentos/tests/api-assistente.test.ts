/**
 * Integration tests for POST /api/assistente — the server-side Groq proxy.
 *
 * No real Groq call: `globalThis.fetch` is stubbed per test. GROQ_API_KEY is set
 * so the handler gets past the config gate. We assert: validation (no messages →
 * 400), that the untrusted context is clamped by sanitizeContext before it reaches
 * the upstream system prompt, that a Groq timeout is handled (not a crash), and
 * that an upstream error never leaks the provider's raw body to the client.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "@/app/api/assistente/route";

// The route reads GROQ_API_KEY per request, so setting it before any POST() is
// enough to get past the config gate.
process.env.GROQ_API_KEY = "test-key";

function chatReq(body: unknown, raw?: string): Request {
  return new Request("https://studentos.app/api/assistente", {
    method: "POST",
    headers: {
      "sec-fetch-site": "same-origin",
      // unique-ish IP not strictly needed: assistente limit is 10/min and each
      // test sends one request, but a stable known IP keeps us out of the
      // fail-closed "unknown" bucket.
      "x-forwarded-for": "2.2.2.2",
      "Content-Type": "application/json",
    },
    body: raw ?? JSON.stringify(body),
  });
}

/** Run `fn` with a temporary global fetch, always restoring the original. */
async function withFetch<T>(stub: typeof fetch, fn: () => Promise<T>): Promise<T> {
  const orig = globalThis.fetch;
  globalThis.fetch = stub;
  try {
    return await fn();
  } finally {
    globalThis.fetch = orig;
  }
}

/** A minimal SSE Response like Groq returns when streaming. */
function sseResponse(deltas: string[]): Response {
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      for (const d of deltas) {
        c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: d } }] })}\n\n`));
      }
      c.enqueue(enc.encode("data: [DONE]\n\n"));
      c.close();
    },
  });
  return new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } });
}

// ── validation ─────────────────────────────────────────────────────────────────

test("assistente: body without messages → 400", async () => {
  const res = await POST(chatReq({ context: {} }));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(typeof json.error, "string");
});

test("assistente: empty messages array → 400", async () => {
  const res = await POST(chatReq({ messages: [] }));
  assert.equal(res.status, 400);
});

// ── sanitizeContext clamps the untrusted context ─────────────────────────────────

test("assistente: oversized context is truncated before reaching the upstream prompt", async () => {
  // 50 exams (cap 30) + a courseName far past MAX_FIELD (120).
  const longName = "X".repeat(500);
  const upcomingExams = Array.from({ length: 50 }, (_, i) => ({
    courseName: i === 0 ? longName : `EXAM_${i}`,
    date: "22 giu",
  }));

  let sentBody: { messages: { content: string }[] } | undefined;
  await withFetch(
    (async (_url: string, init: RequestInit) => {
      sentBody = JSON.parse(init.body as string);
      return sseResponse(["ok"]);
    }) as unknown as typeof fetch,
    async () => {
      const res = await POST(
        chatReq({ messages: [{ role: "user", content: "ciao" }], context: { upcomingExams } }),
      );
      assert.equal(res.status, 200);
    },
  );

  const systemPrompt: string = sentBody!.messages[0].content;
  // The 31st+ exam must have been dropped (only 30 kept).
  assert.ok(systemPrompt.includes("EXAM_1"), "early exam should survive");
  assert.ok(!systemPrompt.includes("EXAM_40"), "exam #40 must be clamped away");
  // The 500-char name must be sliced down to MAX_FIELD (120).
  assert.ok(!systemPrompt.includes("X".repeat(121)), "long field must be sliced to <=120 chars");
});

// ── upstream error handling ──────────────────────────────────────────────────────

test("assistente: Groq timeout (fetch throws) → handled error, not a crash", async () => {
  const res = await withFetch(
    (async () => {
      const err = new Error("The operation timed out");
      err.name = "TimeoutError";
      throw err;
    }) as unknown as typeof fetch,
    () => POST(chatReq({ messages: [{ role: "user", content: "ciao" }] })),
  );
  // The route maps a fetch throw to a generic handled error (502).
  assert.equal(res.status, 502);
  const json = await res.json();
  assert.equal(typeof json.error, "string");
});

test("assistente: Groq responds with an error → generic message, raw body NOT leaked", async () => {
  const secret = "INTERNAL_GROQ_STACKTRACE_apikey_sk-leak-me";
  const res = await withFetch(
    (async () => new Response(secret, { status: 500 })) as unknown as typeof fetch,
    () => POST(chatReq({ messages: [{ role: "user", content: "ciao" }] })),
  );
  assert.equal(res.status, 502);
  const text = await res.text();
  assert.ok(!text.includes("sk-leak-me"), "upstream raw body must never reach the client");
  assert.ok(!text.includes("STACKTRACE"), "upstream raw body must never reach the client");
});

// ── happy path: stream is forwarded as plain text ────────────────────────────────

test("assistente: valid messages → 200 plain-text stream of content deltas", async () => {
  const res = await withFetch(
    (async () => sseResponse(["Ciao", " ", "studente"])) as unknown as typeof fetch,
    () => POST(chatReq({ messages: [{ role: "user", content: "ciao" }] })),
  );
  assert.equal(res.status, 200);
  assert.match(res.headers.get("Content-Type") ?? "", /text\/plain/);
  const text = await res.text();
  assert.equal(text, "Ciao studente");
});
