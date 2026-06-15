/** Year encoded in a sync source id. Live timetable/exam sources end in
 *  "…anno-N" — bare ("orario-anno-2") or per-programme namespaced
 *  ("matematica-esami-anno-2") — so the course year is the trailing number.
 *  Returns null when the id carries no year (e.g. the department news feed). */
export function yearOfSource(sourceId: string): number | null {
  const m = /anno-(\d+)$/.exec(sourceId);
  return m ? Number(m[1]) : null;
}

/** Whether a source id belongs to the given course year; "all" matches every
 *  source. Shared by /orario and /appelli so the year filter behaves the same
 *  for bare and namespaced (per-programme) source ids. */
export function matchesYear(sourceId: string, year: number | "all"): boolean {
  return year === "all" || yearOfSource(sourceId) === year;
}
