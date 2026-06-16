import assert from "node:assert/strict";
import { test } from "node:test";
import type { TrophyLedger, TrophyStatus } from "@/lib/domain/achievements";
import {
  type CelebrationState,
  decideCelebrations,
  RELOCK_WINDOW_MS,
} from "@/lib/domain/celebrations";

// Fixed clock: 2026-06-16 12:00 UTC.
const NOW = "2026-06-16T12:00:00.000Z";
const MIN_30_AGO = "2026-06-16T11:30:00.000Z";
const HOURS_2_AGO = "2026-06-16T10:00:00.000Z";

function ev(id: string, unlocked: boolean): TrophyStatus {
  return { id, nature: "event", unlocked };
}
function th(id: string, unlocked: boolean): TrophyStatus {
  return {
    id,
    nature: "threshold",
    unlocked,
    progress: { current: unlocked ? 60 : 0, target: 60, fraction: unlocked ? 1 : 0 },
  };
}

const noState: CelebrationState = { relockedAt: {} };
const earned = (id: string): TrophyLedger => ({ [id]: { firstUnlockedAt: HOURS_2_AGO } });

test("RELOCK_WINDOW_MS is one hour", () => {
  assert.equal(RELOCK_WINDOW_MS, 60 * 60 * 1000);
});

test("first-ever event unlock plays the scenic", () => {
  const d = decideCelebrations(
    [ev("first-30", false)],
    [ev("first-30", true)],
    {},
    noState,
    NOW,
  );
  assert.deepEqual(d.scenic, ["first-30"]);
  assert.deepEqual(d.toast, []);
});

test("threshold unlock fires a toast, never a scenic", () => {
  const d = decideCelebrations([th("cfu-60", false)], [th("cfu-60", true)], {}, noState, NOW);
  assert.deepEqual(d.scenic, []);
  assert.deepEqual(d.toast, ["cfu-60"]);
});

test("re-unlock within 1h of the relock is silent (input-error fix)", () => {
  const state: CelebrationState = { relockedAt: { "first-30": MIN_30_AGO } };
  const d = decideCelebrations(
    [ev("first-30", false)],
    [ev("first-30", true)],
    earned("first-30"),
    state,
    NOW,
  );
  assert.deepEqual(d.scenic, []);
  assert.deepEqual(d.toast, []);
  // the pending relock clock is cleared now that it is unlocked again
  assert.equal(d.state.relockedAt["first-30"], undefined);
});

test("re-unlock more than 1h after the relock replays the scenic", () => {
  const state: CelebrationState = { relockedAt: { "first-30": HOURS_2_AGO } };
  const d = decideCelebrations(
    [ev("first-30", false)],
    [ev("first-30", true)],
    earned("first-30"),
    state,
    NOW,
  );
  assert.deepEqual(d.scenic, ["first-30"]);
  assert.equal(d.state.relockedAt["first-30"], undefined);
});

test("an earned event re-unlocking with no relock record stays silent (e.g. reload)", () => {
  // ledger already has it, prev locked → next unlocked, but nothing in the
  // relock log → not a genuine new event, do not animate.
  const d = decideCelebrations(
    [ev("first-30", false)],
    [ev("first-30", true)],
    earned("first-30"),
    noState,
    NOW,
  );
  assert.deepEqual(d.scenic, []);
  assert.deepEqual(d.toast, []);
});

test("an event relocking (unlock→lock) records the relock moment", () => {
  const d = decideCelebrations(
    [ev("first-30", true)],
    [ev("first-30", false)],
    earned("first-30"),
    noState,
    NOW,
  );
  assert.deepEqual(d.scenic, []);
  assert.deepEqual(d.toast, []);
  assert.equal(d.state.relockedAt["first-30"], NOW);
});

test("thresholds do not record relock timestamps", () => {
  const d = decideCelebrations([th("cfu-60", true)], [th("cfu-60", false)], {}, noState, NOW);
  assert.deepEqual(d.state.relockedAt, {});
});

test("no transition yields nothing", () => {
  const d = decideCelebrations(
    [ev("first-30", true), th("cfu-60", true)],
    [ev("first-30", true), th("cfu-60", true)],
    earned("first-30"),
    noState,
    NOW,
  );
  assert.deepEqual(d.scenic, []);
  assert.deepEqual(d.toast, []);
});

test("several trophies unlocking at once are all reported", () => {
  const prev = [ev("first-exam", false), ev("first-30", false), th("cfu-30", false)];
  const next = [ev("first-exam", true), ev("first-30", true), th("cfu-30", true)];
  const d = decideCelebrations(prev, next, {}, noState, NOW);
  assert.deepEqual(new Set(d.scenic), new Set(["first-exam", "first-30"]));
  assert.deepEqual(d.toast, ["cfu-30"]);
});

test("does not mutate the input state", () => {
  const state: CelebrationState = { relockedAt: { "first-30": MIN_30_AGO } };
  decideCelebrations([ev("first-30", true)], [ev("first-30", false)], {}, state, NOW);
  assert.deepEqual(state.relockedAt, { "first-30": MIN_30_AGO });
});
