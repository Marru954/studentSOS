import assert from "node:assert/strict";
import { test } from "node:test";
import { cfuPerMonth, gradePoints } from "@/lib/domain/libretto";
import {
  estimateGraduation,
  requiredAverage,
  simulateAverage,
} from "@/lib/domain/projection";
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

function dated(cfu: number, value: number, date: string): LibrettoEntry {
  return { ...entry(cfu, value), id: `${cfu}-${value}-${date}`, date };
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

// ── gradePoints ─────────────────────────────────────────────────────────────

test("gradePoints returns numeric grades chronologically, idoneità excluded", () => {
  const entries: LibrettoEntry[] = [
    dated(6, 28, "2025-06-20"),
    dated(9, 24, "2025-02-10"),
    { ...dated(3, 0, "2025-09-01"), grade: { kind: "pass" } },
  ];
  assert.deepEqual(gradePoints(entries), [
    { courseName: "X", date: "2025-02-10", value: 24, laude: false },
    { courseName: "X", date: "2025-06-20", value: 28, laude: false },
  ]);
});

// ── cfuPerMonth ─────────────────────────────────────────────────────────────

test("cfuPerMonth divides earned CFU by the active span", () => {
  // 30 CFU over ~6 months (Jan→Jul) → ~5 CFU/month
  const pace = cfuPerMonth([
    dated(12, 27, "2025-01-15"),
    dated(18, 25, "2025-07-15"),
  ]);
  assert.ok(pace !== undefined && pace > 4.5 && pace < 5.5, `pace=${pace}`);
});

test("cfuPerMonth floors the span at one month for same-day bursts", () => {
  // both same day → span floored to 1 month → 18 CFU/month, not infinity
  assert.equal(cfuPerMonth([dated(9, 30, "2025-06-20"), dated(9, 28, "2025-06-20")]), 18);
});

test("cfuPerMonth is undefined with no entries", () => {
  assert.equal(cfuPerMonth([]), undefined);
});

// ── estimateGraduation ──────────────────────────────────────────────────────

test("estimateGraduation extrapolates the remaining CFU at the current pace", () => {
  // 30 CFU earned over ~6 months → 5 CFU/month; 150 left → 30 months ahead
  const now = new Date("2025-07-15T00:00:00.000Z");
  const eta = estimateGraduation(
    [dated(12, 27, "2025-01-15"), dated(18, 25, "2025-07-15")],
    180,
    now,
  );
  assert.ok(eta instanceof Date);
  // 30 months after Jul 2025 → Jan 2028 (allow ±1 month for rounding)
  const months = (eta!.getFullYear() - 2025) * 12 + eta!.getMonth() - 6;
  assert.ok(months >= 29 && months <= 31, `months=${months}`);
});

test("estimateGraduation is undefined when the plan is already complete", () => {
  const now = new Date("2025-07-15T00:00:00.000Z");
  assert.equal(
    estimateGraduation([dated(180, 28, "2025-01-15")], 180, now),
    undefined,
  );
});
