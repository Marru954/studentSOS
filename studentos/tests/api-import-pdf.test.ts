/**
 * Integration tests for POST /api/import-pdf — the Groq PDF-text interpreter.
 *
 * NOTE: the route does NOT receive a file. The PDF is parsed client-side (pdfjs)
 * and only the extracted TEXT is posted as JSON { kind, text }. So "no file" /
 * "not a PDF" map to the route's actual validation: missing/invalid params and
 * unreadable (too-short) text. `globalThis.fetch` is stubbed; GROQ_API_KEY is set.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "@/app/api/import-pdf/route";

process.env.GROQ_API_KEY = "test-key";

function pdfReq(body: unknown, raw?: string): Request {
  return new Request("https://studentos.app/api/import-pdf", {
    method: "POST",
    headers: {
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": "3.3.3.3",
      "Content-Type": "application/json",
    },
    body: raw ?? JSON.stringify(body),
  });
}

async function withFetch<T>(stub: typeof fetch, fn: () => Promise<T>): Promise<T> {
  const orig = globalThis.fetch;
  globalThis.fetch = stub;
  try {
    return await fn();
  } finally {
    globalThis.fetch = orig;
  }
}

const SOME_TEXT =
  "Lunedì Analisi Matematica 09:00 11:00 Aula 1; Martedì Fisica 14:00 16:00 Lab 2";

// ── validation: no payload / wrong shape ("no file" / "not a PDF") ───────────────

test("import-pdf: malformed JSON body → 400", async () => {
  const res = await POST(pdfReq(null, "{nope"));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.ok, false);
});

test("import-pdf: missing kind/text (≈ no file attached) → 400", async () => {
  const res = await POST(pdfReq({}));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.code, "badrequest");
});

test("import-pdf: invalid kind (≈ wrong/non-PDF source) → 400", async () => {
  const res = await POST(pdfReq({ kind: "spreadsheet", text: SOME_TEXT }));
  assert.equal(res.status, 400);
});

test("import-pdf: empty/too-short text (no readable PDF text) → 422", async () => {
  const res = await POST(pdfReq({ kind: "orario", text: "   x   " }));
  assert.equal(res.status, 422);
  const json = await res.json();
  assert.equal(json.code, "empty");
});

// ── upstream error handling ──────────────────────────────────────────────────────

test("import-pdf: Groq timeout (fetch throws) → handled 502, not a crash", async () => {
  const res = await withFetch(
    (async () => {
      const err = new Error("timed out");
      err.name = "TimeoutError";
      throw err;
    }) as unknown as typeof fetch,
    () => POST(pdfReq({ kind: "orario", text: SOME_TEXT })),
  );
  assert.equal(res.status, 502);
  const json = await res.json();
  assert.equal(json.code, "upstream");
});

test("import-pdf: Groq 429 → quota error surfaced as 429", async () => {
  const res = await withFetch(
    (async () => new Response("rate limited", { status: 429 })) as unknown as typeof fetch,
    () => POST(pdfReq({ kind: "esami", text: SOME_TEXT })),
  );
  assert.equal(res.status, 429);
  const json = await res.json();
  assert.equal(json.code, "quota");
});

test("import-pdf: Groq 500 → generic upstream error, raw body NOT leaked", async () => {
  const secret = "GROQ_INTERNAL_apikey_sk-leak";
  const res = await withFetch(
    (async () => new Response(secret, { status: 500 })) as unknown as typeof fetch,
    () => POST(pdfReq({ kind: "orario", text: SOME_TEXT })),
  );
  assert.equal(res.status, 502);
  const text = await res.text();
  assert.ok(!text.includes("sk-leak"), "upstream raw body must never reach the client");
});

// ── happy path: well-formed JSON-mode reply → 200 with items ─────────────────────

test("import-pdf: valid reply → 200 { ok:true, items }", async () => {
  const items = [{ corso: "Analisi", giorno: "lun", oraInizio: "09:00", oraFine: "11:00", aula: "1", tipo: "lezione" }];
  const groqBody = JSON.stringify({ choices: [{ message: { content: JSON.stringify({ items }) } }] });
  const res = await withFetch(
    (async () => new Response(groqBody, { status: 200, headers: { "Content-Type": "application/json" } })) as unknown as typeof fetch,
    () => POST(pdfReq({ kind: "orario", text: SOME_TEXT })),
  );
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.ok, true);
  assert.equal(json.items.length, 1);
  assert.equal(json.items[0].corso, "Analisi");
});
