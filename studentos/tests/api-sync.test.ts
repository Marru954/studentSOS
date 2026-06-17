/**
 * Integration tests for POST /api/sync — the browser↔university bridge.
 *
 * No browser, no real network. The route imports `validateSources` (real DNS +
 * allowlist) and `runSources` (the engine) directly, so — since module mocking
 * is unavailable under tsx — the cases are designed to be hermetic by input:
 *  - sources with empty params carry no URL → `validateSources` is a no-op (no DNS),
 *  - an unknown `providerId` makes the engine return a per-source error result
 *    WITHOUT ever calling `fetch` (failure isolation), so the route still 200s.
 * `globalThis.fetch` is stubbed to throw, guaranteeing no test touches the network.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "@/app/api/sync/route";

// A throwing fetch: if any code path reaches the network, the test fails loudly.
const NO_NETWORK = () => {
  throw new Error("fetch must not be called in this test");
};

/** Build a same-origin POST Request with a unique client IP (own rate bucket). */
function syncReq(ip: string, body: unknown, raw?: string): Request {
  return new Request("https://studentos.app/api/sync", {
    method: "POST",
    headers: {
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": ip,
      "Content-Type": "application/json",
    },
    body: raw ?? JSON.stringify(body),
  });
}

const validBody = (sources: unknown[]) => ({
  range: { from: "2025-09-01", to: "2025-12-15" },
  sources,
});

const mockSource = (id: string) => ({
  id,
  label: id,
  capability: "timetable" as const,
  // unknown provider → engine returns an isolated error result, never fetches
  providerId: "mock-provider",
  params: {}, // no baseUrl/url → validateSources has nothing to resolve
});

// ── body / schema validation ─────────────────────────────────────────────────

test("sync: malformed JSON body → 400", async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = NO_NETWORK as typeof fetch;
  try {
    const res = await POST(syncReq("1.1.1.1", null, "{not json"));
    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(typeof json.error, "string");
    assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
  } finally {
    globalThis.fetch = orig;
  }
});

test("sync: payload that fails the Zod schema → 400", async () => {
  // empty sources array (min 1), bad date format
  const res = await POST(
    syncReq("1.1.1.2", { range: { from: "ieri", to: "domani" }, sources: [] }),
  );
  assert.equal(res.status, 400);
});

// ── SSRF guard (validateSources) ──────────────────────────────────────────────

test("sync: source URL not in the allowlist → 400 (generic)", async () => {
  const res = await POST(
    syncReq("1.1.1.3", validBody([
      {
        id: "evil",
        label: "evil",
        capability: "timetable",
        providerId: "ical",
        params: { url: "https://evil.example.com/feed.ics" },
      },
    ])),
  );
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.error, "sorgente non consentita");
});

test("sync: private/internal IP URL → 400 (collapsed to the same generic error)", async () => {
  // The route never echoes which internal address was probed: allowlist miss
  // and private-IP both surface as one generic 400.
  const res = await POST(
    syncReq("1.1.1.4", validBody([
      {
        id: "meta",
        label: "meta",
        capability: "timetable",
        providerId: "ical",
        params: { url: "http://169.254.169.254/latest/meta-data/" },
      },
    ])),
  );
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.error, "sorgente non consentita");
});

// ── happy path: valid payload + mock sources → 200 with the right shape ───────

test("sync: valid payload + mock sources → 200 with { syncedAt, results }", async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = NO_NETWORK as typeof fetch;
  try {
    const res = await POST(
      syncReq("1.1.1.5", validBody([mockSource("a"), mockSource("b")])),
    );
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
    const json = await res.json();
    assert.match(json.syncedAt, /^\d{4}-\d{2}-\d{2}T.*Z$/);
    assert.ok(Array.isArray(json.results));
    assert.equal(json.results.length, 2);
    // Each mock source resolves to an isolated failure, never a thrown 500.
    for (const r of json.results) {
      assert.equal(r.ok, false);
      assert.match(r.error, /provider sconosciuto/);
    }
  } finally {
    globalThis.fetch = orig;
  }
});

// ── guard: cross-site + rate-limit ─────────────────────────────────────────────

test("sync: cross-site request is rejected with 403 before any work", async () => {
  const res = await POST(
    new Request("https://studentos.app/api/sync", {
      method: "POST",
      headers: { "sec-fetch-site": "cross-site" },
      body: "{}",
    }),
  );
  assert.equal(res.status, 403);
});

test("sync: per-IP rate limit fires a 429 past the window limit", async () => {
  const ip = "1.1.9.9"; // dedicated bucket
  // sync limit is 20/min. 20 malformed-body requests still pass the guard (it
  // runs first and counts), each returning 400; the 21st is blocked at the guard.
  for (let i = 0; i < 20; i++) {
    const res = await POST(syncReq(ip, null, "{bad"));
    assert.equal(res.status, 400, `request ${i + 1} should reach the body parser`);
  }
  const blocked = await POST(syncReq(ip, null, "{bad"));
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("Retry-After")) > 0);
});
