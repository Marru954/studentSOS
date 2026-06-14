/**
 * Preset: Università di Roma "Tor Vergata" — Informatica (triennale, H02).
 * The first concrete wiring of the pluggable engine. Endpoints verified live
 * on 2026-06-12. Students enable only the sources for their year.
 */
import type { UniversityPreset } from "../provider";

const EASY_BASE = "https://easyutv.uniroma2.it/agendaweb";
const SCUOLA = "FacoltadiScienzeMatematiche-FisicheeNaturali";
const CORSO = "H02";
/** Academic year start; bump each September or expose in settings UI. */
const ANNO = "2025";

export const uniroma2Informatica: UniversityPreset = {
  id: "uniroma2-informatica-triennale",
  name: 'Università di Roma "Tor Vergata"',
  shortName: "Tor Vergata",
  city: "Roma",
  programme: "Informatica (triennale, H02)",
  programmes: ["Informatica (triennale, H02)"],
  liveSources: true,
  sources: [
    ...[1, 2, 3].map((year) => ({
      id: `orario-anno-${year}`,
      label: `Orario lezioni — ${year}° anno`,
      capability: "timetable" as const,
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: EASY_BASE,
        anno: ANNO,
        scuola: SCUOLA,
        corso: CORSO,
        anno2: [`comune|${year}`],
      },
    })),
    ...[1, 2, 3].map((year) => ({
      id: `esami-anno-${year}`,
      label: `Appelli d'esame — ${year}° anno`,
      capability: "exams" as const,
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: EASY_BASE,
        scuola: SCUOLA,
        cdl: CORSO,
        anno2: [String(year)],
      },
    })),
    {
      id: "avvisi-dipartimento",
      label: "Avvisi del corso di laurea",
      capability: "news",
      providerId: "wordpress-news",
      params: { baseUrl: "https://informatica.uniroma2.it" },
    },
  ],
};
