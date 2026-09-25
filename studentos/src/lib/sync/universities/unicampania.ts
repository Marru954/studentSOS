/**
 * Preset: Università della Campania "Luigi Vanvitelli" — the WHOLE ateneo
 * (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live by driving the real easyacademy adapter end-to-end (grid_call /
 * test_call, non-empty `celle` / `Appelli`) on 2026-06-17. Codes captured by
 * GET, NEVER invented. Courses without verifiable timetable data stay manual
 * (ateneo-courses.ts). Per-course status is in _unicampania-ingegneria_coverage.md.
 * Re-verify each September and bump ANNO.
 *
 * Base host: easyacademy.easystaff.it/agendastudenti (EasyStaff multi-tenant
 * host; this ateneo lives under /agendastudenti). `scuola` is
 * "DipartimentodiIngegneria" for the engineering corsi and empty for the
 * science / pharmacy ones. The 2025/26 ordinamento reform splits most degrees
 * across a year-1 "V<nn>" ("primo anno") corso and a year-2+ "A/B<nn>" base
 * corso, each with its own curriculum-coded anno2.
 *
 * Exams are PER-DEGREE: the engineering corsi expose easytest appelli
 * (exams: true); the science / pharmacy corsi keep their exam calendar outside
 * EasyAcademy, so they ship timetable-only (the `false` 6th arg). Wrong data is
 * worse than none.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.easystaff.it/agendastudenti";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Ingegneria Aerospaziale",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale", "DipartimentodiIngegneria", [
      { year: 1, corso: "V15", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "V15", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria Aerospaziale, Meccanica, Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale-meccanica-energetica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V14", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "V14", anno2: ["133|2", "A36|2", "134|2"] },
      { year: 3, corso: "B14", anno2: ["133|3", "A36|3", "134|3"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V04", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "V04", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "B04", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "DipartimentodiIngegneria", [
      { year: 1, corso: "V99", anno2: ["A025|1", "A024|1", "A019|1", "A018|1", "A023|1"] },
      { year: 2, corso: "V99", anno2: ["A025|2", "A024|2", "A019|2", "A018|2", "A023|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile - Edile - Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-edile-ambientale", "DipartimentodiIngegneria", [
      { year: 1, corso: "V92", anno2: ["A12|1", "130|1", "135|1", "A054|1"] },
      { year: 2, corso: "V92", anno2: ["A12|2", "130|2", "135|2", "A054|2"] },
      { year: 3, corso: "A92", anno2: ["A12|3", "A032|3", "130|3", "135|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "DipartimentodiIngegneria", [
      { year: 1, corso: "A17", anno2: ["A005|1", "A006|1"] },
      { year: 2, corso: "A17", anno2: ["A005|2", "A006|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica e Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-informatica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V13", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "V13", anno2: ["132|2", "131|2"] },
      { year: 3, corso: "A13", anno2: ["132|3", "131|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "DipartimentodiIngegneria", [
      { year: 1, corso: "B02", anno2: ["GEN|1"] },
      { year: 2, corso: "B02", anno2: ["GEN|2"] },
      { year: 3, corso: "B03", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica", "DipartimentodiIngegneria", [
      { year: 1, corso: "A18", anno2: ["GEN|1"] },
      { year: 2, corso: "A18", anno2: ["A14|2", "A13|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "DipartimentodiIngegneria", [
      { year: 1, corso: "A19", anno2: ["GEN|1"] },
      { year: 2, corso: "A19", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'energia e L'ambiente",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-energia-e-l-ambiente", "DipartimentodiIngegneria", [
      { year: 1, corso: "V98", anno2: ["A35|1", "A34|1", "A056|1", "A055|1"] },
      { year: 2, corso: "V98", anno2: ["A35|2", "A34|2"] },
    ]),
  },
];

export const unicampania: UniversityPreset = {
  id: "unicampania-ingegneria",
  name: "Università della Campania \"Luigi Vanvitelli\"",
  shortName: "Vanvitelli",
  city: "Caserta",
  programme: "Ingegneria Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
