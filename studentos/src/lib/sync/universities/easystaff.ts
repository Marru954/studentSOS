/**
 * EasyAcademy / agendaweb preset builder.
 *
 * Tor Vergata (uniroma2-informatica) proved the pattern: the same `easyacademy`
 * adapter drives any agendaweb instance — only the `baseUrl`, the institution's
 * `scuola` code and the per-year `corso` + `anno2[]` selectors change.
 *
 * How the codes are captured (and why each year carries its own):
 *  - The public combo cascade `combo.php?sw=ec_&aa=<YEAR>&page=corsi` returns
 *    `var elenco_corsi = [...]`; every entry has its `scuola`, `valore` (= the
 *    `corso` code) and `elenco_anni[].valore` (= the timetable `anno2[]`
 *    selector, curriculum-coded, e.g. "IN05+5+|2" or the clean "GEN|2").
 *  - The 2025/26 ministerial ordinamento switch split many triennali across two
 *    `corso` codes — a brand-new first year vs. the older 2nd/3rd years — so a
 *    single year → (corso, anno2[]) mapping is required, not one corso for all.
 *  - Exams (`test_call.php`) instead take the *plain year number* as `anno2[]`
 *    and `esami_cdl` = the corso code.
 *
 * Only flip a preset to `liveSources: true` after POSTing grid_call.php /
 * test_call.php and seeing real `celle` / `Appelli` come back — never guess the
 * codes (wrong data is worse than none).
 */
import type { SyncSource, UniversityPreset } from "../provider";

/** Known, verified base URLs for Italian EasyAcademy agendaweb instances. */
export const EASYSTAFF_BASES: Record<string, string> = {
  units: "https://orari.units.it/agendaweb",
  unipg: "https://easyacademy.unipg.it/agendaweb",
  unica: "https://unica.easystaff.it/AgendaWeb",
};

/** One year of a degree, with the exact selectors its timetable + exams need. */
export interface EasyAcademyYear {
  /** Course year (1 = first year). */
  year: number;
  /** agendaweb `corso` code for this year's timetable (grid_call.php). */
  corso: string;
  /** agendaweb `anno2[]` selectors for this year's timetable — curriculum-coded,
   *  e.g. ["IN05+5+|2","IN05+6+|2"] or ["GEN|2"]. Captured from elenco_corsi. */
  anno2: string[];
  /** easytest `esami_cdl` for this year's exams. Defaults to `corso`. */
  examCdl?: string;
  /** easytest `anno2[]` for exams. Defaults to the plain year number. */
  examAnno2?: string[];
}

export interface EasyAcademyPresetConfig {
  id: string;
  name: string;
  shortName: string;
  city?: string;
  programme: string;
  programmes?: string[];
  /** agendaweb base, e.g. https://orari.units.it/agendaweb */
  baseUrl: string;
  /** EasyAcademy faculty/school code, shared by every year. */
  scuola: string;
  /** Academic-year start, e.g. "2025" for 2025/26. */
  anno: string;
  /** Per-year selectors — every entry verified live before shipping. */
  years: EasyAcademyYear[];
  /** Some atenei publish the timetable via EasyAcademy but keep exams in Esse3
   *  (test_call.php returns nothing). Set false to ship timetable-only. */
  exams?: boolean;
  /** Optional department site for the WordPress news source. */
  newsBaseUrl?: string;
}

/** Wire a verified EasyAcademy course into a full, live UniversityPreset. */
export function easyAcademyPreset(
  cfg: EasyAcademyPresetConfig,
): UniversityPreset {
  const sources: SyncSource[] = [];
  for (const y of cfg.years) {
    sources.push({
      id: `orario-anno-${y.year}`,
      label: `Orario ${y.year}° anno`,
      capability: "timetable",
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: cfg.baseUrl,
        anno: cfg.anno,
        scuola: cfg.scuola,
        corso: y.corso,
        anno2: y.anno2,
      },
    });
    if (cfg.exams !== false) {
      sources.push({
        id: `esami-anno-${y.year}`,
        label: `Appelli ${y.year}° anno`,
        capability: "exams",
        providerId: "easyacademy",
        params: {
          kind: "exams",
          baseUrl: cfg.baseUrl,
          scuola: cfg.scuola,
          cdl: y.examCdl ?? y.corso,
          anno2: y.examAnno2 ?? [String(y.year)],
        },
      });
    }
  }
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
