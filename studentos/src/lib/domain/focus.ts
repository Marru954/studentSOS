/**
 * Focus-session aggregation. Pure: ranges and clocks come from the caller.
 * Course matching is accent/case-insensitive so user-typed libretto names
 * meet the ALL-CAPS synced names ("Basi di dati" ↔ "BASI DI DATI").
 */
import type { FocusSession, Grade, IsoDate, IsoDateTime, LibrettoEntry } from "./types";
import { normalize } from "./notes";

/** Local calendar day (YYYY-MM-DD) of an ISO datetime — same zone the UI renders in. */
const isoDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Bucket label for sessions without a linked course. */
export const NO_COURSE = "Senza corso";

export function minutesInRange(
  sessions: FocusSession[],
  from: IsoDateTime,
  to: IsoDateTime,
): number {
  return sessions
    .filter((s) => s.startedAt >= from && s.startedAt < to)
    .reduce((sum, s) => sum + s.minutes, 0);
}

export interface CourseFocus {
  courseName: string;
  minutes: number;
  /** Libretto grade for the same course, when recorded — the "ore vs voto" join. */
  grade?: Grade;
}

/** Total focused minutes per course, most-studied first. */
export function focusByCourse(
  sessions: FocusSession[],
  libretto: LibrettoEntry[],
): CourseFocus[] {
  const byCourse = new Map<string, CourseFocus>();
  for (const s of sessions) {
    const name = s.courseName?.trim() || NO_COURSE;
    const key = normalize(name);
    const row = byCourse.get(key) ?? { courseName: name, minutes: 0 };
    row.minutes += s.minutes;
    byCourse.set(key, row);
  }
  for (const entry of libretto) {
    const row = byCourse.get(normalize(entry.courseName));
    if (row) row.grade = entry.grade;
  }
  return [...byCourse.values()].sort((a, b) => b.minutes - a.minutes);
}

/**
 * Total focused minutes per weekday, as a length-7 array, **Monday-first**
 * (index 0 = lunedì … 6 = domenica). Local zone, since study habits are felt
 * in local time. Drives the per-weekday bar chart.
 */
export function minutesByWeekday(sessions: FocusSession[]): number[] {
  const totals = [0, 0, 0, 0, 0, 0, 0];
  for (const s of sessions) {
    // getDay(): 0=domenica … 6=sabato → shift so lunedì is 0.
    const idx = (new Date(s.startedAt).getDay() + 6) % 7;
    totals[idx] += s.minutes;
  }
  return totals;
}

/**
 * Total focused minutes per local calendar day (YYYY-MM-DD → minutes).
 * Drives the study heatmap; days with no session are simply absent from the map.
 */
export function dailyMinutes(sessions: FocusSession[]): Map<IsoDate, number> {
  const byDay = new Map<IsoDate, number>();
  for (const s of sessions) {
    const day = isoDay.format(new Date(s.startedAt));
    byDay.set(day, (byDay.get(day) ?? 0) + s.minutes);
  }
  return byDay;
}

/** The single longest session (minutes + its day), or null if none. */
export function longestSession(
  sessions: FocusSession[],
): { minutes: number; date: IsoDateTime } | null {
  let best: FocusSession | null = null;
  for (const s of sessions) {
    if (!best || s.minutes > best.minutes) best = s;
  }
  return best ? { minutes: best.minutes, date: best.startedAt } : null;
}

/** The most-studied calendar day (local), or null if none. */
export function bestDay(
  sessions: FocusSession[],
): { day: IsoDate; minutes: number } | null {
  let best: { day: IsoDate; minutes: number } | null = null;
  for (const [day, minutes] of dailyMinutes(sessions)) {
    if (!best || minutes > best.minutes) best = { day, minutes };
  }
  return best;
}
