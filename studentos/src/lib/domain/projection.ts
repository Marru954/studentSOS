/**
 * What-if projections over the libretto. Pure math, same conventions as
 * lib/domain/libretto (lode = 30, pass/excluded entries skip the average).
 * "Remaining CFU" assumes the rest of the plan is graded — stated in the UI.
 */
import { cfuPerMonth, earnedCfu, gradedTotals } from "./libretto";
import type { LibrettoEntry } from "./types";

/** Estimated graduation month: remaining CFU divided by the current pace,
 *  added to `now`. Undefined when there's no pace yet (empty libretto) or the
 *  plan is already complete. A coarse extrapolation — labelled as such. */
export function estimateGraduation(
  entries: LibrettoEntry[],
  totalCfu: number,
  now: Date,
): Date | undefined {
  const pace = cfuPerMonth(entries);
  if (pace === undefined || pace <= 0) return undefined;
  const remaining = totalCfu - earnedCfu(entries);
  if (remaining <= 0) return undefined;
  const monthsLeft = Math.ceil(remaining / pace);
  const d = new Date(now);
  d.setMonth(d.getMonth() + monthsLeft);
  return d;
}

/** Weighted average after a hypothetical graded exam of `cfu` × `value`. */
export function simulateAverage(
  entries: LibrettoEntry[],
  cfu: number,
  value: number,
): number {
  const { cfu: gradedCfu, points } = gradedTotals(entries);
  return (points + value * cfu) / (gradedCfu + cfu);
}

export type RequiredOutcome =
  /** Plan complete (or nothing left to grade) and the target wasn't reached. */
  | { kind: "no-remaining" }
  /** Any passing grade (≥ 18) on the remaining CFU keeps the target. */
  | { kind: "met" }
  | { kind: "reachable"; average: number }
  /** Needs more than 30 on the remaining CFU. */
  | { kind: "unreachable"; average: number };

/** Average needed on the remaining graded CFU to end at `target`. */
export function requiredAverage(
  entries: LibrettoEntry[],
  remainingCfu: number,
  target: number,
): RequiredOutcome {
  const { cfu, points } = gradedTotals(entries);
  if (remainingCfu <= 0) {
    return cfu > 0 && points / cfu >= target
      ? { kind: "met" }
      : { kind: "no-remaining" };
  }
  const needed = (target * (cfu + remainingCfu) - points) / remainingCfu;
  if (needed <= 18) return { kind: "met" };
  if (needed > 30) return { kind: "unreachable", average: needed };
  return { kind: "reachable", average: needed };
}
