/**
 * Libretto math: pure derivations from the user's manual grade records.
 * Conventions follow the Italian system: weighted average over CFU,
 * lode counted as 30, "idoneo" (pass) and flagged entries excluded.
 */
import type { Grade, LibrettoEntry } from "./types";

/** CFU actually earned — every recorded entry counts, pass/fail included. */
export function earnedCfu(entries: LibrettoEntry[]): number {
  return entries.reduce((sum, e) => sum + e.cfu, 0);
}

function averageValue(grade: Grade): number | undefined {
  return grade.kind === "numeric" ? grade.value : undefined;
}

function averageable(entries: LibrettoEntry[]): LibrettoEntry[] {
  return entries.filter(
    (e) => !e.excludeFromAverage && averageValue(e.grade) !== undefined,
  );
}

/** CFU and grade-points of the entries that count toward the average. */
export function gradedTotals(entries: LibrettoEntry[]): {
  cfu: number;
  points: number;
} {
  const graded = averageable(entries);
  return {
    cfu: graded.reduce((sum, e) => sum + e.cfu, 0),
    points: graded.reduce(
      (sum, e) => sum + (averageValue(e.grade) ?? 0) * e.cfu,
      0,
    ),
  };
}

/** CFU-weighted average of numeric grades; undefined with no graded exams. */
export function weightedAverage(entries: LibrettoEntry[]): number | undefined {
  const { cfu, points } = gradedTotals(entries);
  return cfu === 0 ? undefined : points / cfu;
}

/** Base di laurea: the weighted average rescaled to /110. */
export function graduationBase(average: number): number {
  return (average / 30) * 110;
}

/** Running weighted average after each exam, chronological — one point per
 *  graded exam, ready for a sparkline. */
export function averageSeries(entries: LibrettoEntry[]): number[] {
  const graded = [...averageable(entries)].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const series: number[] = [];
  let cfu = 0;
  let points = 0;
  for (const e of graded) {
    cfu += e.cfu;
    points += (averageValue(e.grade) ?? 0) * e.cfu;
    series.push(points / cfu);
  }
  return series;
}
