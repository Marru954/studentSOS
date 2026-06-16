/**
 * Libretto math: pure derivations from the user's manual grade records.
 * Conventions follow the Italian system: weighted average over CFU,
 * lode counted as 30, "idoneo" (pass) and flagged entries excluded.
 */
import type { Grade, IsoDate, LibrettoEntry } from "./types";

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

/** How many exams actually feed the weighted average (numeric, not excluded).
 *  Average-based trophies use this to demand consistency over several exams
 *  rather than firing on a single lucky grade. */
export function gradedCount(entries: LibrettoEntry[]): number {
  return averageable(entries).length;
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

/** One numeric grade plotted in time — fuel for the andamento scatter chart. */
export interface GradePoint {
  courseName: string;
  date: IsoDate;
  /** 18–30, lode counted as 30. */
  value: number;
  laude: boolean;
}

/** Every numeric grade as a (date, value) point, chronological. Idoneità and
 *  excluded entries carry no comparable voto, so they're left out. */
export function gradePoints(entries: LibrettoEntry[]): GradePoint[] {
  return entries
    .filter((e) => e.grade.kind === "numeric")
    .map((e) => {
      const g = e.grade as Extract<Grade, { kind: "numeric" }>;
      return {
        courseName: e.courseName,
        date: e.date,
        value: g.value,
        laude: g.laude,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

const MS_PER_DAY = 86_400_000;
const DAYS_PER_MONTH = 30.44;

function isoToUtc(date: IsoDate): number {
  return Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
}

/** Earned CFU per month over the student's active span (first→last exam).
 *  The span is floored at one month so a single session can't inflate the
 *  rate to infinity. Undefined with no entries. A rough, honest estimate. */
export function cfuPerMonth(entries: LibrettoEntry[]): number | undefined {
  if (entries.length === 0) return undefined;
  const dates = entries.map((e) => e.date).sort();
  const spanDays = (isoToUtc(dates[dates.length - 1]) - isoToUtc(dates[0])) / MS_PER_DAY;
  const months = Math.max(spanDays / DAYS_PER_MONTH, 1);
  return earnedCfu(entries) / months;
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
