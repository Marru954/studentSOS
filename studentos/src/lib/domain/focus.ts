/**
 * Focus-session aggregation. Pure: ranges and clocks come from the caller.
 * Course matching is accent/case-insensitive so user-typed libretto names
 * meet the ALL-CAPS synced names ("Basi di dati" ↔ "BASI DI DATI").
 */
import type { FocusSession, Grade, IsoDateTime, LibrettoEntry } from "./types";
import { normalize } from "./notes";

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
