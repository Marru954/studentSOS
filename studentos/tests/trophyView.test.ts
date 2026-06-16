import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateAll, type TrophyLedger } from "@/lib/domain/achievements";
import type { Grade, LibrettoEntry } from "@/lib/domain/types";
import { buildTrophyView } from "@/lib/domain/trophyView";

let seq = 0;
function entry(cfu: number, grade: Grade): LibrettoEntry {
  seq += 1;
  return { id: `e${seq}`, courseName: `C${seq}`, cfu, grade, date: "2026-01-10" };
}
const num = (value: number, laude = false): Grade => ({ kind: "numeric", value, laude });
const pass: Grade = { kind: "pass" };

/** Build a ledger stamping the given ids at the given ISO dates. */
function ledgerOf(map: Record<string, string>): TrophyLedger {
  const l: TrophyLedger = {};
  for (const [id, d] of Object.entries(map)) l[id] = { firstUnlockedAt: d };
  return l;
}

function card(view: ReturnType<typeof buildTrophyView>, id: string) {
  const all = [...view.unlocked, ...view.locked];
  const c = all.find((x) => x.id === id);
  assert.ok(c, `card ${id} should exist`);
  return c;
}

test("locked event shows only its condition — no detail, no bar", () => {
  const entries = [entry(6, num(30))]; // a 30, but not lode
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  const c = card(view, "first-30-lode");
  assert.equal(c.unlocked, false);
  assert.equal(c.nature, "event");
  assert.equal(c.condition, "Prendi un 30 e lode");
  assert.equal(c.detail, undefined);
  assert.equal(c.bar, undefined);
});

test("locked CFU threshold shows sei a current/target + a progress bar", () => {
  const entries = [entry(42, num(28))]; // 42 CFU
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  const c = card(view, "cfu-60");
  assert.equal(c.unlocked, false);
  assert.equal(c.detail, "sei a 42/60");
  assert.equal(c.bar?.fraction, 42 / 60);
});

test("locked media below target reports the live average and exam count", () => {
  const entries = [entry(6, num(24)), entry(6, num(28))]; // avg 26, 2 exams
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  const c = card(view, "media-27");
  assert.equal(c.unlocked, false);
  assert.equal(c.detail, "sei a 26,0 con 2 esami");
});

test("media with a full bar but too few exams explains WHY it is locked", () => {
  const entries = [entry(6, num(30)), entry(6, num(30))]; // avg 30, only 2 exams
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  const c = card(view, "media-27");
  assert.equal(c.unlocked, false);
  assert.equal(c.bar?.fraction, 1); // bar is full…
  // …but the text names the real blocker, so it never reads as a bug
  assert.equal(c.detail, "media già a 30,0 — ti manca 1 esame su 3");
});

test("media missing two exams pluralises correctly", () => {
  const entries = [entry(6, num(30))]; // avg 30, 1 exam
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  const c = card(view, "media-27");
  assert.equal(c.detail, "media già a 30,0 — ti mancano 2 esami su 3");
});

test("unlocked trophies carry the firstUnlockedAt date and sit in the unlocked bucket", () => {
  const entries = [entry(6, num(30, true))]; // unlocks first-exam, first-30, first-30-lode
  const ledger = ledgerOf({
    "first-exam": "2026-01-10T09:00:00.000Z",
    "first-30": "2026-01-10T09:00:00.000Z",
    "first-30-lode": "2026-03-01T09:00:00.000Z",
  });
  const view = buildTrophyView(evaluateAll(entries), ledger, entries);
  const ids = view.unlocked.map((c) => c.id);
  assert.ok(ids.includes("first-30-lode"));
  const c = card(view, "first-30-lode");
  assert.equal(c.unlocked, true);
  assert.equal(c.unlockedAt, "2026-03-01T09:00:00.000Z");
  assert.equal(c.detail, undefined);
});

test("unlocked bucket is sorted newest-first by firstUnlockedAt", () => {
  const entries = [entry(6, num(30, true))];
  const ledger = ledgerOf({
    "first-exam": "2026-01-01T00:00:00.000Z",
    "first-30": "2026-02-01T00:00:00.000Z",
    "first-30-lode": "2026-03-01T00:00:00.000Z",
  });
  const view = buildTrophyView(evaluateAll(entries), ledger, entries);
  assert.deepEqual(
    view.unlocked.map((c) => c.id),
    ["first-30-lode", "first-30", "first-exam"],
  );
});

test("locked bucket keeps canonical trophy order", () => {
  const view = buildTrophyView(evaluateAll([]), {}, []);
  // empty libretto → everything locked, in declaration order
  assert.deepEqual(
    view.locked.map((c) => c.id),
    ["first-exam", "first-30", "first-30-lode", "cfu-30", "cfu-60", "cfu-120", "media-27"],
  );
  assert.equal(view.unlocked.length, 0);
});

test("idoneità-only libretto: cfu detail counts the pass, media counts zero exams", () => {
  const entries = [entry(6, pass)]; // 6 CFU earned, 0 graded exams
  const view = buildTrophyView(evaluateAll(entries), {}, entries);
  assert.equal(card(view, "cfu-30").detail, "sei a 6/30");
  assert.equal(card(view, "media-27").detail, "sei a 0,0 con 0 esami");
});
