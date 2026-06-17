/**
 * Smoke tests for POST /api/sync-delphi — the credentialed Delphi libretto
 * scrape. The success path logs into delphi.uniroma2.it with real credentials,
 * which can't run in CI, so we only assert the route exists, the guard is wired,
 * and malformed/invalid bodies are rejected with 400 before any scrape.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "@/app/api/sync-delphi/route";

function delphiReq(headers: Record<string, string>, raw: string): Request {
  return new Request("https://studentos.app/api/sync-delphi", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: raw,
  });
}

const SAME_ORIGIN = { "sec-fetch-site": "same-origin", "x-forwarded-for": "4.4.4.4" };

test("sync-delphi: route exports a POST handler", () => {
  assert.equal(typeof POST, "function");
});

test("sync-delphi: cross-site request is blocked by the guard (403)", async () => {
  const res = await POST(
    delphiReq({ "sec-fetch-site": "cross-site" }, JSON.stringify({ login: "x", password: "y" })),
  );
  assert.equal(res.status, 403);
});

test("sync-delphi: malformed JSON body → 400", async () => {
  const res = await POST(delphiReq(SAME_ORIGIN, "{not json"));
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.ok, false);
  assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
});

test("sync-delphi: valid JSON missing required fields → 400 (Zod)", async () => {
  const res = await POST(delphiReq({ ...SAME_ORIGIN, "x-forwarded-for": "4.4.4.5" }, JSON.stringify({ login: "" })));
  assert.equal(res.status, 400);
});
