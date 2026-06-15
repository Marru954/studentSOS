/**
 * Pure month-grid construction for the exams calendar. Monday-first weeks,
 * spillover days from adjacent months flagged. All math in UTC so the grid is
 * deterministic and testable; the caller maps exams (plain IsoDates) onto it.
 */
import { daysBetweenIso } from "@/lib/format";
import type { ExamCall, IsoDate } from "./types";

export interface MonthDay {
  /** YYYY-MM-DD. */
  date: IsoDate;
  /** Day of month, 1–31. */
  day: number;
  /** False for leading/trailing days borrowed from adjacent months. */
  inMonth: boolean;
}

function iso(year: number, month0: number, day: number): IsoDate {
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Weeks covering `month0` (0-based), each exactly 7 days. Monday-first by
 *  default; pass "sun" for a Sunday-first grid. */
export function buildMonthGrid(
  year: number,
  month0: number,
  weekStartsOn: "mon" | "sun" = "mon",
): MonthDay[][] {
  const first = new Date(Date.UTC(year, month0, 1));
  const startOffset =
    weekStartsOn === "sun"
      ? first.getUTCDay() // Sunday = 0
      : (first.getUTCDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const weeksNeeded = Math.ceil((startOffset + daysInMonth) / 7);

  const weeks: MonthDay[][] = [];
  let cursor = new Date(Date.UTC(year, month0, 1 - startOffset));
  for (let w = 0; w < weeksNeeded; w++) {
    const week: MonthDay[] = [];
    for (let d = 0; d < 7; d++) {
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const day = cursor.getUTCDate();
      week.push({ date: iso(y, m, day), day, inMonth: m === month0 });
      cursor = new Date(cursor.getTime() + 86_400_000);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Group exams by their IsoDate for O(1) day lookup while rendering. */
export function examsByDate(exams: ExamCall[]): Map<IsoDate, ExamCall[]> {
  const map = new Map<IsoDate, ExamCall[]>();
  for (const exam of exams) {
    const list = map.get(exam.date);
    if (list) list.push(exam);
    else map.set(exam.date, [exam]);
  }
  return map;
}

export type ExamFilter = "tutti" | "urgenti" | "futuri" | "passati";

/** Days-ahead threshold for the "Urgenti" filter. */
const URGENT_DAYS = 7;

/** Pure exam filtering for the chip row. `today` comes from the caller. */
export function filterExams(
  exams: ExamCall[],
  filter: ExamFilter,
  today: IsoDate,
): ExamCall[] {
  switch (filter) {
    case "tutti":
      return exams;
    case "futuri":
      return exams.filter((e) => daysBetweenIso(today, e.date) >= 0);
    case "passati":
      return exams.filter((e) => daysBetweenIso(today, e.date) < 0);
    case "urgenti":
      return exams.filter((e) => {
        const d = daysBetweenIso(today, e.date);
        return d >= 0 && d <= URGENT_DAYS;
      });
  }
}
