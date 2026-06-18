/**
 * Integration tests for POST /api/alerts — the server-side parity surface for
 * the smart-alerts engine. The route receives the caller's current synced +
 * manual snapshot as JSON, runs the pure `detectAlerts`, and returns `Alert[]`.
 *
 * No `fetch` stubbing needed: detection is pure and self-contained. We exercise
 * the guard (cross-site block), body validation (400s), and the happy path.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "@/app/api/alerts/route";
import { AlertType } from "@/lib/domain/alerts";

/** Same-origin, plausible IP — passes guardPost. */
function req(body: unknown, raw?: string): Request {
  return new Request("https://studentos.app/api/alerts", {
    method: "POST",
    headers: {
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": "4.4.4.4",
      "Content-Type": "application/json",
    },
    body: raw ?? JSON.stringify(body),
  });
}

// ── guard ──────────────────────────────────────────────────────────────────

test("alerts: cross-site request → 403", async () => {
  const r = new Request("https://studentos.app/api/alerts", {
    method: "POST",
    headers: {
      "sec-fetch-site": "cross-site",
      "x-forwarded-for": "4.4.4.4",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  const res = await POST(r);
  assert.equal(res.status, 403);
});

// ── validation ──────────────────────────────────────────────────────────────

test("alerts: malformed JSON body → 400", async () => {
  const res = await POST(req(null, "{nope"));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.ok, false);
});

test("alerts: non-object body (number) → 400", async () => {
  const res = await POST(req(42));
  assert.equal(res.status, 400);
});

test("alerts: array body → 400", async () => {
  const res = await POST(req([1, 2, 3]));
  assert.equal(res.status, 400);
});

test("alerts: wrong field type (classEvents not an array) → 400", async () => {
  const res = await POST(req({ classEvents: "nope" }));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.ok, false);
});

test("alerts: wrong previousMedia type (string) → 400", async () => {
  const res = await POST(req({ previousMedia: "27" }));
  assert.equal(res.status, 400);
});

// ── happy path ───────────────────────────────────────────────────────────────

test("alerts: empty snapshot → 200 with an empty array", async () => {
  const res = await POST(req({}));
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(Array.isArray(json));
  assert.equal(json.length, 0);
});

test("alerts: a new exam → 200 with a NUOVO_ESAME alert", async () => {
  const res = await POST(
    req({
      examCalls: [
        {
          id: "ex-new",
          courseName: "FISICA",
          date: "2026-12-25",
          kind: "written",
          sourceId: "esami-anno-1",
        },
      ],
      previousExamIds: ["ex-seed"],
    }),
  );
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(Array.isArray(json));
  const nuovo = json.filter((a: { type: string }) => a.type === AlertType.NUOVO_ESAME);
  assert.equal(nuovo.length, 1);
  assert.equal(nuovo[0].sourceId, "ex-new");
  // Date fields serialize to ISO strings over the wire.
  assert.equal(typeof nuovo[0].expiresAt, "string");
});

test("alerts: failed sync sources collapse into one SYNC_FALLITO alert", async () => {
  const res = await POST(
    req({
      syncMeta: [
        { sourceId: "orario-anno-1", capability: "timetable", lastAttemptAt: "2026-06-12T10:00:00.000Z", ok: false, itemCount: 0 },
        { sourceId: "esami-anno-1", capability: "exams", lastAttemptAt: "2026-06-12T10:00:00.000Z", ok: false, itemCount: 0 },
      ],
    }),
  );
  assert.equal(res.status, 200);
  const json = await res.json();
  const failed = json.filter((a: { type: string }) => a.type === AlertType.SYNC_FALLITO);
  assert.equal(failed.length, 1);
});
