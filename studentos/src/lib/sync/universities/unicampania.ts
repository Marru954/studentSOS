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
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "", [
      { year: 2, corso: "A38", anno2: ["BIM|2","SAN|2"] },
    ], false),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "", [
      { year: 1, corso: "V46", anno2: ["GEN|1"] },
      { year: 2, corso: "A46", anno2: ["GEN|2"] },
      { year: 3, corso: "A46", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "", [
      { year: 1, corso: "V49", anno2: ["GEN|1"] },
      { year: 2, corso: "B49", anno2: ["GEN|2"] },
      { year: 3, corso: "B49", anno2: ["GEN|3"] },
      { year: 4, corso: "B49", anno2: ["GEN|4"] },
      { year: 5, corso: "B49", anno2: ["GEN|5"] },
    ], false),
  },
  {
    programme: "Ingegneria Aerospaziale",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale", "DipartimentodiIngegneria", [
      { year: 1, corso: "V15", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "A15", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Ingegneria Aerospaziale, Meccanica, Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale-meccanica-energetica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V14", anno2: ["PDS0-2025|1","MAN_AVI1|1","MAN_MEC1|1"] },
      { year: 2, corso: "B14", anno2: ["133|2","A36|2","MAN_AVI|2","MAN_MEC|2","134|2"] },
      { year: 3, corso: "B14", anno2: ["133|3","A36|3","MAN_AVI|3","MAN_MEC|3","134|3"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V04", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "B04", anno2: ["GEN|2"] },
      { year: 3, corso: "B04", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "DipartimentodiIngegneria", [
      { year: 1, corso: "V99", anno2: ["A025|1","A024|1","A019|1","A018|1","A023|1"] },
      { year: 2, corso: "A99", anno2: ["A025|2","A024|2","A019|2","A018|2","A023|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile - Edile - Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-edile-ambientale", "DipartimentodiIngegneria", [
      { year: 1, corso: "V92", anno2: ["A12|1","130|1","135|1","A054|1"] },
      { year: 2, corso: "A92", anno2: ["A12|2","A032|2","130|2","135|2"] },
      { year: 3, corso: "A92", anno2: ["A12|3","A032|3","130|3","135|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "DipartimentodiIngegneria", [
      { year: 1, corso: "A17", anno2: ["A005|1","A006|1"] },
      { year: 2, corso: "A17", anno2: ["A005|2","A006|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica e Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-informatica", "DipartimentodiIngegneria", [
      { year: 1, corso: "V13", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "A13", anno2: ["132|2","131|2"] },
      { year: 3, corso: "A13", anno2: ["132|3","131|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "DipartimentodiIngegneria", [
      { year: 1, corso: "B02", anno2: ["GEN|1"] },
      { year: 2, corso: "B03", anno2: ["GEN|2"] },
      { year: 3, corso: "B03", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica", "DipartimentodiIngegneria", [
      { year: 1, corso: "A18", anno2: ["GEN|1"] },
      { year: 2, corso: "A18", anno2: ["A14|2","A13|2"] },
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
      { year: 1, corso: "V98", anno2: ["A35|1","A34|1"] },
      { year: 2, corso: "A98", anno2: ["A35|2","A34|2"] },
    ]),
  },
  {
    programme: "Molecular Biotechnology",
    sources: degreeSources(BASE, ANNO, "molecular-biotechnology", "", [
      { year: 1, corso: "V47", anno2: ["GEN|1"] },
      { year: 2, corso: "B47", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "", [
      { year: 2, corso: "A36", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Scienze degli Alimenti e della Nutrizione Umana",
    sources: degreeSources(BASE, ANNO, "scienze-degli-alimenti-e-della-nutrizione-umana", "", [
      { year: 2, corso: "A94", anno2: ["GEN|2"] },
    ], false),
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
