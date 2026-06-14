/**
 * EasyStaff / agendaweb preset builder.
 *
 * Tor Vergata (uniroma2-informatica) proved the pattern: the same
 * `easyacademy` adapter drives any EasyStaff agendaweb instance — only the
 * `baseUrl` and the institution's internal codes (`scuola`, `corso`/`cdl`,
 * academic-year `anno`) change. This helper turns those few values into a fully
 * wired multi-year preset so adding an EasyStaff ateneo is config, not code.
 *
 * VERIFIED base URLs of Italian EasyStaff instances (found live, 2026-06):
 *   Trieste   https://orari.units.it/agendaweb
 *   Perugia   https://easyacademy.unipg.it/agendaweb
 *   Cagliari  https://unica.easystaff.it/AgendaWeb
 *   Trento    https://easyacademy.unitn.it/   (agendaweb path varies)
 *
 * What is NOT auto-discoverable from outside: each course's internal `scuola` /
 * `corso` codes — the agendaweb course picker loads them over POST JSON, so
 * they must be captured once from the live site (browser network tab on
 * grid_call.php / test_call.php) before a preset is flipped to `liveSources`.
 * Until then the ateneo stays in honest manual mode. Build a verified one with:
 *
 *   easyStaffPreset({
 *     id: "units-informatica", name: "Università di Trieste",
 *     shortName: "Trieste", city: "Trieste",
 *     baseUrl: "https://orari.units.it/agendaweb",
 *     scuola: "<from grid_call.php>", corso: "<corso code>",
 *     anno: "2025", years: 3, programme: "Informatica",
 *     newsBaseUrl: "https://www.units.it",
 *   })
 */
import type { SyncSource, UniversityPreset } from "../provider";

/** Known, verified base URLs for Italian EasyStaff agendaweb instances. */
export const EASYSTAFF_BASES: Record<string, string> = {
  units: "https://orari.units.it/agendaweb",
  unipg: "https://easyacademy.unipg.it/agendaweb",
  unica: "https://unica.easystaff.it/AgendaWeb",
};

export interface EasyStaffConfig {
  id: string;
  name: string;
  shortName: string;
  city?: string;
  programme: string;
  programmes?: string[];
  /** agendaweb base, e.g. https://orari.units.it/agendaweb */
  baseUrl: string;
  /** EasyStaff faculty/school code. */
  scuola: string;
  /** Degree course code (agendaweb `corso` and easytest `esami_cdl`). */
  corso: string;
  /** Academic-year start, e.g. "2025" for 2025/26. */
  anno: string;
  /** How many years the course runs (3 triennale, 2 magistrale, …). */
  years: number;
  /** Optional department site for the WordPress news source. */
  newsBaseUrl?: string;
}

/** Wire a verified EasyStaff course into a full, live UniversityPreset. */
export function easyStaffPreset(cfg: EasyStaffConfig): UniversityPreset {
  const years = Array.from({ length: cfg.years }, (_, i) => i + 1);
  const sources: SyncSource[] = [
    ...years.map((year) => ({
      id: `orario-anno-${year}`,
      label: `Orario ${year}° anno`,
      capability: "timetable" as const,
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: cfg.baseUrl,
        anno: cfg.anno,
        scuola: cfg.scuola,
        corso: cfg.corso,
        anno2: [`comune|${year}`],
      },
    })),
    ...years.map((year) => ({
      id: `esami-anno-${year}`,
      label: `Appelli ${year}° anno`,
      capability: "exams" as const,
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: cfg.baseUrl,
        scuola: cfg.scuola,
        cdl: cfg.corso,
        anno2: [String(year)],
      },
    })),
  ];
  if (cfg.newsBaseUrl) {
    sources.push({
      id: "avvisi-dipartimento",
      label: "Avvisi del dipartimento",
      capability: "news",
      providerId: "wordpress-news",
      params: { baseUrl: cfg.newsBaseUrl },
    });
  }
  return {
    id: cfg.id,
    name: cfg.name,
    shortName: cfg.shortName,
    city: cfg.city,
    programme: cfg.programme,
    programmes: cfg.programmes ?? [cfg.programme],
    liveSources: true,
    sources,
  };
}
