/**
 * What-if projections over the libretto. Pure math, same conventions as
 * lib/domain/libretto (lode = 30, pass/excluded entries skip the average).
 * "Remaining CFU" assumes the rest of the plan is graded — stated in the UI.
 */
import { gradedTotals } from "./libretto";
import type { LibrettoEntry } from "./types";

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
