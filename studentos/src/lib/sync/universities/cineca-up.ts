/**
 * Source builder for degrees on Cineca University Planner — the UP twin of
 * `degreeSources` (easystaff.ts). No preset uses it yet: the adapter is dormant
 * until a real fixture confirms its contract (see adapters/cineca-up.ts).
 */
import type { SyncSource } from "../provider";

/**
 * Build one degree's timetable sources: one per year, namespaced
 * `<slug>-orario-anno-N` so the year chips (`matchesYear`) work and two degrees
 * of one ateneo never share a cache key. The public UP calendar carries no exam
 * calls, so UP degrees keep exams manual.
 *
 * Every id is captured from the ateneo (scripts/probe-cineca-up.ts), never
 * invented. `filterByYear` is for a calendar that carries the whole degree: the
 * source then keeps only impegni whose didactic details declare that year.
 */
export function upProgramSources(
  baseUrl: string,
  clienteId: string,
  slug: string,
  years: { year: number; linkCalendarioIds: string[]; filterByYear?: boolean }[],
): SyncSource[] {
  return years.map((y) => ({
    id: `${slug}-orario-anno-${y.year}`,
    label: `Orario lezioni — ${y.year}° anno`,
    capability: "timetable",
    providerId: "cineca-up",
    params: {
      kind: "timetable",
      baseUrl,
      clienteId,
      linkCalendarioIds: y.linkCalendarioIds,
      ...(y.filterByYear ? { anniCorso: [y.year] } : {}),
    },
  }));
}
