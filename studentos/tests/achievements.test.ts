import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyUnlocks,
  evaluateAll,
  evaluateTrophy,
  TROPHIES,
  type TrophyLedger,
  type TrophyStatus,
} from "@/lib/domain/achievements";
import type { Grade, LibrettoEntry } from "@/lib/domain/types";

let seq = 0;
function entry(
  cfu: number,
  grade: Grade,
  overrides: Partial<LibrettoEntry> = {},
): LibrettoEntry {
  seq += 1;
  return {
    id: `e${seq}`,
    courseName: `Corso ${seq}`,
    cfu,
    grade,
    date: "2026-01-15",
    ...overrides,
  };
}

const num = (value: number, laude = false): Grade => ({
  kind: "numeric",
  value,
  laude,
});
const pass: Grade = { kind: "pass" };

function status(entries: LibrettoEntry[], id: string): TrophyStatus {
  const s = evaluateAll(entries).find((x) => x.id === id);
  assert.ok(s, `trophy ${id} should exist`);
  return s;
}

// ── config sanity ────────────────────────────────────────────────────────────

test("ships the seven seeded trophies with unique ids", () => {
  const ids = TROPHIES.map((t) => t.id);
  assert.deepEqual(
    new Set(ids).size,
    ids.length,
    "trophy ids must be unique",
  );
  assert.deepEqual(new Set(ids), new Set([
    "first-exam",
    "first-30",
    "first-30-lode",
    "cfu-30",
    "cfu-60",
    "cfu-120",
    "media-27",
  ]));
});

test("every trophy carries an italian title and condition", () => {
  for (const t of TROPHIES) {
    assert.ok(t.title.length > 0, `${t.id} needs a title`);
    assert.ok(t.condition.length > 0, `${t.id} needs a condition`);
  }
});

// ── empty libretto: everything locked, thresholds at zero progress ───────────

test("empty libretto leaves every trophy locked", () => {
  const all = evaluateAll([]);
  assert.equal(all.length, TROPHIES.length);
  for (const s of all) assert.equal(s.unlocked, false);
});

test("threshold trophies expose current/target/fraction; events do not", () => {
  const all = evaluateAll([]);
  const cfu60 = all.find((s) => s.id === "cfu-60")!;
  assert.equal(cfu60.nature, "threshold");
  assert.deepEqual(cfu60.progress, { current: 0, target: 60, fraction: 0 });

  const firstExam = all.find((s) => s.id === "first-exam")!;
  assert.equal(firstExam.nature, "event");
  assert.equal(firstExam.progress, undefined);
});

// ── event trophies ───────────────────────────────────────────────────────────

test("first-exam unlocks at the first recorded exam — idoneità counts", () => {
  assert.equal(status([], "first-exam").unlocked, false);
  assert.equal(status([entry(6, pass)], "first-exam").unlocked, true);
});

test("first-30 unlocks on any 30, with or without lode", () => {
  assert.equal(status([entry(6, num(29))], "first-30").unlocked, false);
  assert.equal(status([entry(6, num(30))], "first-30").unlocked, true);
  assert.equal(status([entry(6, num(30, true))], "first-30").unlocked, true);
});

test("first-30-lode unlocks only on a 30 e lode", () => {
  assert.equal(status([entry(6, num(30))], "first-30-lode").unlocked, false);
  assert.equal(
    status([entry(6, num(30, true))], "first-30-lode").unlocked,
    true,
  );
});

// ── CFU threshold trophies ───────────────────────────────────────────────────

test("cfu thresholds count every entry, idoneità included", () => {
  const entries = [entry(20, num(28)), entry(10, pass)]; // 30 CFU
  const s = status(entries, "cfu-30");
  assert.equal(s.unlocked, true);
  assert.deepEqual(s.progress, { current: 30, target: 30, fraction: 1 });
});

test("cfu-60 reports partial progress below target", () => {
  const s = status([entry(24, num(27))], "cfu-60");
  assert.equal(s.unlocked, false);
  assert.equal(s.progress?.current, 24);
  assert.equal(s.progress?.fraction, 24 / 60);
});

test("cfu fraction is clamped to 1 once past target", () => {
  const s = status([entry(200, num(30))], "cfu-120");
  assert.equal(s.unlocked, true);
  assert.equal(s.progress?.fraction, 1);
});

test("cfu trophies have no minimum-exam gate — one big exam suffices", () => {
  // 30 CFU in a single exam unlocks cfu-30; the gate is media-only.
  const s = status([entry(30, num(18))], "cfu-30");
  assert.equal(s.unlocked, true);
});

// ── media threshold (rewards consistency over several exams) ─────────────────

test("media-27 unlocks at exactly 27 (>= 27) once enough exams exist", () => {
  const s = status(
    [entry(6, num(27)), entry(6, num(27)), entry(6, num(27))],
    "media-27",
  );
  assert.equal(s.unlocked, true);
  assert.equal(s.progress?.current, 27);
  assert.equal(s.progress?.fraction, 1);
});

test("media-27 needs at least 3 graded exams, not just one lucky grade", () => {
  // average is 30 but a single exam proves no consistency → locked, and the
  // live average is still reported so a progress bar can fill.
  const one = status([entry(6, num(30))], "media-27");
  assert.equal(one.unlocked, false);
  assert.equal(one.progress?.current, 30);
  assert.equal(one.progress?.fraction, 1);

  const two = status([entry(6, num(30)), entry(6, num(28))], "media-27");
  assert.equal(two.unlocked, false);

  const three = status(
    [entry(6, num(30)), entry(6, num(28)), entry(6, num(27))],
    "media-27",
  );
  assert.equal(three.unlocked, true);
});

test("media-27 stays locked below 27 and reports the live average", () => {
  const s = status(
    [entry(6, num(24)), entry(6, num(28)), entry(6, num(26))],
    "media-27",
  ); // avg 26 over 3 exams → only the average condition fails
  assert.equal(s.unlocked, false);
  assert.equal(s.progress?.current, 26);
});

test("media-27 counts only graded exams toward the 3-exam gate", () => {
  // two real grades + an idoneità: the idoneità never feeds the average, so it
  // does not count toward the gate either → still locked.
  const idoneita = [entry(6, num(30)), entry(6, num(30)), entry(6, pass)];
  assert.equal(status(idoneita, "media-27").unlocked, false);

  // excluded entries are likewise outside the average and the gate.
  const excluded = [
    entry(6, num(30)),
    entry(6, num(30)),
    entry(6, num(18), { excludeFromAverage: true }),
  ];
  assert.equal(status(excluded, "media-27").unlocked, false);
});

test("media-27 average ignores idoneità and excluded entries", () => {
  // three 30s clear both the gate and the average; the idoneità and the
  // excluded 18 must not drag the average down.
  const entries = [
    entry(6, num(30)),
    entry(6, num(30)),
    entry(6, num(30)),
    entry(6, pass),
    entry(6, num(18), { excludeFromAverage: true }),
  ];
  const s = status(entries, "media-27");
  assert.equal(s.unlocked, true);
  assert.equal(s.progress?.current, 30);
});

test("media-27 is zero, not NaN, with no graded exams", () => {
  const s = status([entry(6, pass)], "media-27");
  assert.equal(s.unlocked, false);
  assert.deepEqual(s.progress, { current: 0, target: 27, fraction: 0 });
});

// ── evaluateTrophy matches evaluateAll for a single def ──────────────────────

test("evaluateTrophy agrees with evaluateAll", () => {
  const entries = [entry(30, num(30, true))];
  for (const def of TROPHIES) {
    const one = evaluateTrophy(def, entries);
    const fromAll = evaluateAll(entries).find((s) => s.id === def.id)!;
    assert.deepEqual(one, fromAll);
  }
});

// ── ledger: append-only first-unlock stamping ────────────────────────────────

const T1 = "2026-01-15T10:00:00.000Z";
const T2 = "2026-03-20T10:00:00.000Z";

test("applyUnlocks stamps firstUnlockedAt for newly unlocked trophies", () => {
  const statuses = evaluateAll([entry(6, num(30, true))]);
  const { ledger, changed, newlyUnlocked } = applyUnlocks({}, statuses, T1);
  assert.equal(changed, true);
  // one 30 e lode unlocks the three voto events; media-27 is gated by the
  // 3-exam minimum and cfu-30 by 6 < 30 CFU, so neither stamps.
  assert.deepEqual(new Set(newlyUnlocked), new Set([
    "first-exam",
    "first-30",
    "first-30-lode",
  ]));
  assert.equal(ledger["first-30-lode"].firstUnlockedAt, T1);
  assert.equal(ledger["media-27"], undefined); // gated by exam count
  assert.equal(ledger["cfu-30"], undefined); // still locked, not stamped
});

test("media-27 relocks under 3 exams but the ledger keeps firstUnlockedAt", () => {
  const earned = [entry(6, num(30)), entry(6, num(30)), entry(6, num(30))];
  const first = applyUnlocks({}, evaluateAll(earned), T1);
  assert.ok(first.ledger["media-27"], "3 graded exams at avg 30 should earn it");

  // delete two exams → one graded left → live status relocks
  assert.equal(status([entry(6, num(30))], "media-27").unlocked, false);

  // recompute against the shrunken libretto: nothing new, original date kept
  const after = applyUnlocks(first.ledger, evaluateAll([entry(6, num(30))]), T2);
  assert.equal(after.changed, false);
  assert.deepEqual(after.newlyUnlocked, []);
  assert.equal(after.ledger["media-27"].firstUnlockedAt, T1);
});

test("applyUnlocks keeps the original date and is idempotent", () => {
  const statuses = evaluateAll([entry(6, num(30))]);
  const first = applyUnlocks({}, statuses, T1);
  const second = applyUnlocks(first.ledger, statuses, T2);
  assert.equal(second.changed, false);
  assert.deepEqual(second.newlyUnlocked, []);
  assert.equal(second.ledger["first-30"].firstUnlockedAt, T1); // not T2
});

test("applyUnlocks never relocks: a removed exam keeps its earned date", () => {
  const ledger: TrophyLedger = {
    "first-30": { firstUnlockedAt: T1 },
    "first-exam": { firstUnlockedAt: T1 },
  };
  // libretto now empty (exam deleted) → live status relocks, ledger preserved
  const { ledger: next, changed, newlyUnlocked } = applyUnlocks(
    ledger,
    evaluateAll([]),
    T2,
  );
  assert.equal(changed, false);
  assert.deepEqual(newlyUnlocked, []);
  assert.equal(next["first-30"].firstUnlockedAt, T1);
});

test("applyUnlocks does not mutate the input ledger", () => {
  const input: TrophyLedger = {};
  applyUnlocks(input, evaluateAll([entry(6, pass)]), T1);
  assert.deepEqual(input, {}, "input ledger must be untouched");
});
