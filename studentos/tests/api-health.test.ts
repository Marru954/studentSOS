/**
 * Tests for GET /api/health — must always 200, expose the expected fields, and
 * never leak the actual values of env vars (only presence/absence).
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "@/app/api/health/route";

test("health: GET responds 200 with the expected fields", async () => {
  const res = await GET();
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.status, "ok");
  assert.match(json.timestamp, /^\d{4}-\d{2}-\d{2}T.*Z$/);
  assert.ok(["configured", "not-configured"].includes(json.supabase));
  assert.ok(["configured", "not-configured"].includes(json.groq));
  assert.equal(typeof json.version, "string");
  assert.ok(json.version.length > 0);
});

test("health: never exposes env var values, only presence", async () => {
  // Set a recognisable secret; the body must report "configured" but never the value.
  const secret = "super-secret-groq-key-DO-NOT-LEAK";
  const prev = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = secret;
  try {
    const res = await GET();
    const text = await res.text();
    assert.ok(!text.includes(secret), "the env var value must never appear in the body");
    assert.ok(text.includes('"groq":"configured"'));
  } finally {
    if (prev === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = prev;
  }
});

test("health: reports not-configured when an integration env var is absent", async () => {
  const prev = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  try {
    const res = await GET();
    const json = await res.json();
    assert.equal(json.groq, "not-configured");
  } finally {
    if (prev !== undefined) process.env.GROQ_API_KEY = prev;
  }
});
