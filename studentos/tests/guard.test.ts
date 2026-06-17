import assert from "node:assert/strict";
import { test } from "node:test";
import { clientIp, guardPost, rateLimit } from "@/lib/api/guard";

/** Helper: build a POST Request with the given headers. */
function req(headers: Record<string, string>): Request {
  return new Request("https://studentos.app/api/x", {
    method: "POST",
    headers,
  });
}

// ── clientIp: anti-spoof on x-forwarded-for ──────────────────────────────────

test("clientIp: single XFF entry is used", () => {
  assert.equal(clientIp(req({ "x-forwarded-for": "1.2.3.4" })), "1.2.3.4");
});

test("clientIp: multiple XFF hops → takes the LAST (proxy-appended), not the client-declared first", () => {
  // Spoof scenario: client prepends a fake IP; the trusted proxy appends the
  // real one at the end. We must trust only the last hop.
  assert.equal(
    clientIp(req({ "x-forwarded-for": "9.9.9.9, 5.6.7.8" })),
    "5.6.7.8",
  );
  assert.equal(
    clientIp(req({ "x-forwarded-for": "evil-spoof, 203.0.113.7" })),
    "203.0.113.7",
  );
});

test("clientIp: absent XFF and no x-real-ip → 'unknown' (fail-closed)", () => {
  assert.equal(clientIp(req({})), "unknown");
});

test("clientIp: malformed last hop → 'unknown'", () => {
  assert.equal(clientIp(req({ "x-forwarded-for": "1.2.3.4, not-an-ip" })), "unknown");
  assert.equal(clientIp(req({ "x-forwarded-for": "999.999.999.999" })), "unknown");
});

test("clientIp: falls back to a valid x-real-ip when XFF absent", () => {
  assert.equal(clientIp(req({ "x-real-ip": "8.8.8.8" })), "8.8.8.8");
});

test("clientIp: accepts an IPv6 last hop", () => {
  assert.equal(
    clientIp(req({ "x-forwarded-for": "spoof, 2001:db8::1" })),
    "2001:db8::1",
  );
});

// ── rateLimit: window + remaining ────────────────────────────────────────────

test("rateLimit: counts down remaining and blocks past the limit", () => {
  const now = 1_000_000;
  const opts = { limit: 3, windowMs: 60_000 };
  const r1 = rateLimit("test-rl:ip", opts, now);
  assert.deepEqual([r1.ok, r1.remaining], [true, 2]);
  const r2 = rateLimit("test-rl:ip", opts, now + 1);
  assert.deepEqual([r2.ok, r2.remaining], [true, 1]);
  const r3 = rateLimit("test-rl:ip", opts, now + 2);
  assert.deepEqual([r3.ok, r3.remaining], [true, 0]);
  const r4 = rateLimit("test-rl:ip", opts, now + 3);
  assert.equal(r4.ok, false);
  assert.ok(r4.retryAfter > 0);
});

test("rateLimit: window reset reopens the bucket", () => {
  const opts = { limit: 1, windowMs: 1_000 };
  const a = rateLimit("test-rl-reset:ip", opts, 0);
  assert.equal(a.ok, true);
  const b = rateLimit("test-rl-reset:ip", opts, 500);
  assert.equal(b.ok, false);
  const c = rateLimit("test-rl-reset:ip", opts, 1_000);
  assert.equal(c.ok, true);
});

// ── guardPost: cross-site + fail-closed unknown bucket ───────────────────────

test("guardPost: cross-site request is rejected with 403", () => {
  const { response } = guardPost(
    req({ "sec-fetch-site": "cross-site" }),
    "test-cs",
    { limit: 10, windowMs: 60_000 },
  );
  assert.ok(response);
  assert.equal(response!.status, 403);
});

test("guardPost: a known IP gets the full limit", () => {
  const headers = { "sec-fetch-site": "same-origin", "x-forwarded-for": "10.0.0.9" };
  const opts = { limit: 5, windowMs: 60_000 };
  for (let i = 0; i < 5; i++) {
    const { response } = guardPost(req(headers), "test-known", opts);
    assert.equal(response, null, `request ${i + 1} should pass`);
  }
});

test("guardPost: an 'unknown' IP is fail-closed to the tight 3-req bucket", () => {
  // No XFF / no x-real-ip → clientIp 'unknown'. Even though the route asks for a
  // generous limit of 20, the unknown bucket caps at 3 so a spoofer who strips
  // the header can't get a fresh allowance.
  const headers = { "sec-fetch-site": "same-origin" };
  const opts = { limit: 20, windowMs: 60_000 };
  for (let i = 0; i < 3; i++) {
    const { response } = guardPost(req(headers), "test-unknown", opts);
    assert.equal(response, null, `request ${i + 1} should pass`);
  }
  const { response } = guardPost(req(headers), "test-unknown", opts);
  assert.ok(response);
  assert.equal(response!.status, 429);
});
