import assert from "node:assert/strict";
import { test } from "node:test";
import { requiredAverage, simulateAverage } from "@/lib/domain/projection";
import type { LibrettoEntry } from "@/lib/domain/types";

function entry(cfu: number, value: number): LibrettoEntry {
  return {
    id: `${cfu}-${value}-${Math.trunc(value * cfu)}`,
    courseName: "X",
    cfu,
    grade: { kind: "numeric", value, laude: false },
    date: "2025-06-20",
  };
}

// ── simulateAverage ─────────────────────────────────────────────────────────

test("a hypothetical exam shifts the weighted average", () => {
  // 27 on 12 CFU + hypothetical 30 on 6 CFU → (324+180)/18 = 28
  assert.equal(simulateAverage([entry(12, 27)], 6, 30), 28);
});

test("with an empty libretto the simulated average is the grade itself", () => {
  assert.equal(simulateAverage([], 6, 27), 27);
});

test("pass and excluded entries don't dilute the simulation", () => {
  const entries: LibrettoEntry[] = [
    entry(12, 27),
    { ...entry(3, 0), id: "pass", grade: { kind: "pass" } },
    { ...entry(6, 18), id: "excl", excludeFromAverage: true },
  ];
  assert.equal(simulateAverage(entries, 6, 30), 28);
});

// ── requiredAverage ─────────────────────────────────────────────────────────

test("required average to reach the target is reachable when ≤ 30", () => {
  // 27 on 60 CFU, 120 CFU left, target 28 → (28·180 − 1620)/120 = 28.5
  const got = requiredAverage([entry(60, 27)], 120, 28);
  assert.deepEqual(got, { kind: "reachable", average: 28.5 });
});

test("target already safe: any passing grade keeps it", () => {
  // 30 on 150 CFU, 30 left, target 27 → needed 12 → met
  assert.deepEqual(requiredAverage([entry(150, 30)], 30, 27), { kind: "met" });
});

test("target out of reach beyond 30", () => {
  // 20 on 150 CFU, 30 left, target 25 → needed 50
  const got = requiredAverage([entry(150, 20)], 30, 25);
  assert.equal(got.kind, "unreachable");
  assert.equal(got.kind === "unreachable" && got.average, 50);
});

test("plan complete: met if the average holds, no-remaining otherwise", () => {
  assert.deepEqual(requiredAverage([entry(180, 28)], 0, 27), { kind: "met" });
  assert.deepEqual(requiredAverage([entry(180, 26)], 0, 27), {
    kind: "no-remaining",
  });
  assert.deepEqual(requiredAverage([], 0, 27), { kind: "no-remaining" });
});
