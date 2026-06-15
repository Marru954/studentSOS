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
 *  for bare and namespaced (per-programme) source ids. Manual + imported
 *  entries ("manual…"/"ical…") are the user's own records with no meaningful
 *  curriculum year, so they are NEVER hidden by the year chips — otherwise a
 *  manually-added exam (tagged manual-anno-1 by default) would vanish the
 *  moment the student selects 2° or 3° anno. */
export function matchesYear(sourceId: string, year: number | "all"): boolean {
  if (year === "all") return true;
  if (sourceId.startsWith("manual") || sourceId.startsWith("ical")) return true;
  return yearOfSource(sourceId) === year;
}
