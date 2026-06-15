/**
 * Preset: Università per Stranieri di Siena — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unistrasi_coverage.md. Re-verify each September and bump ANNO.
 *
 * Exams are kept in Esse3 here → timetable-only (no exam sources).
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://gd.unistrasi.it/agendaweb";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Competenze Testuali per L'editoria, L'insegnamento e la Promozione Turistica",
    sources: degreeSources(BASE, ANNO, "competenze-testuali-per-l-editoria-l-insegnamento-e-la-promozione-turistica", "", [
      { year: 1, corso: "LM_CT", anno2: ["EDIT|1", "INSE|1", "PROM|1"] },
      { year: 2, corso: "LM_CT", anno2: ["EDIT|2", "INSE|2", "PROM|2"] },
    ], false),
  },
  {
    programme: "Corsi Facoltativi",
    sources: degreeSources(BASE, ANNO, "corsi-facoltativi", "", [
      { year: 1, corso: "CFA", anno2: ["CFA|1"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana in Contesti Globali",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana-in-contesti-globali", "", [
      { year: 2, corso: "L2_LG", anno2: ["INSE|2", "STOR|2"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana in Contesti Globali (l-10 R)",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana-in-contesti-globali-l-10-r", "", [
      { year: 1, corso: "L2_LN", anno2: ["INSE|1", "STOR|1"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana per L'insegnamento Agli Stranieri e per la Scuola",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana-per-l-insegnamento-agli-stranieri-e-per-la-scuola", "", [
      { year: 3, corso: "L2_LS", anno2: ["SCUO|3", "INSE|3"] },
    ], false),
  },
  {
    programme: "Linguaggi, Cooperazione e Diversità",
    sources: degreeSources(BASE, ANNO, "linguaggi-cooperazione-e-diversita", "", [
      { year: 1, corso: "LM_LI", anno2: ["COMI|1", "MEDC|1"] },
    ], false),
  },
  {
    programme: "Mediazione Linguistica e Culturale (l-12 R)",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale-l-12-r", "", [
      { year: 1, corso: "L2_MC", anno2: ["TURIM|1", "MIGR|1"] },
    ], false),
  },
  {
    programme: "Mediazione Linguistica e Culturale (l-12)",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale-l-12", "", [
      { year: 2, corso: "L2_ML", anno2: ["TURIM|2", "MIGR|2"] },
      { year: 3, corso: "L2_ML", anno2: ["MICS|3", "TRAD|3"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe A11",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-a11", "", [
      { year: 1, corso: "PF60A11", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe A12 (accorpa Ex A12 e Ex A22)",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-a12-accorpa-ex-a12-e-ex-a22", "", [
      { year: 1, corso: "PF60A012", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe A23",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-a23", "", [
      { year: 1, corso: "PF60A23", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe A54",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-a54", "", [
      { year: 1, corso: "PF60A54", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe Ab22 (accorpa Ex Classi Ab24 e Ab25)",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-ab22-accorpa-ex-classi-ab24-e-ab25", "", [
      { year: 1, corso: "PF60AB22", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe Ai22 (accorpa Ex Classi Ai24 e Ai25)",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-ai22-accorpa-ex-classi-ai24-e-ai25", "", [
      { year: 1, corso: "PF60AI22", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe Bb02",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-bb02", "", [
      { year: 1, corso: "PF60BB02", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Percorso di Formazione e Abilitazione per la Scuola Secondaria 60cfu - Classe Bi02",
    sources: degreeSources(BASE, ANNO, "percorso-di-formazione-e-abilitazione-per-la-scuola-secondaria-60cfu-classe-bi02", "", [
      { year: 1, corso: "PF60BI02", anno2: ["P30CFU|1", "P36CFU|1", "P60CFU|1"] },
    ], false),
  },
  {
    programme: "Plurilinguismo, Traduzione e Interpretazione",
    sources: degreeSources(BASE, ANNO, "plurilinguismo-traduzione-e-interpretazione", "", [
      { year: 1, corso: "L2_PT", anno2: ["SAGG|1", "SPEC|1"] },
      { year: 2, corso: "L2_PT", anno2: ["SAGG|2", "SPEC|2"] },
    ], false),
  },
  {
    programme: "Scienze Linguistiche e Comunicazione Interculturale",
    sources: degreeSources(BASE, ANNO, "scienze-linguistiche-e-comunicazione-interculturale", "", [
      { year: 1, corso: "LM_SL", anno2: ["DIDA|1", "ORIE|1", "LING|1"] },
      { year: 2, corso: "LM_SL", anno2: ["DIDA|2", "ORIE|2", "LING|2"] },
    ], false),
  },
];

export const unistrasi: UniversityPreset = {
  id: "unistrasi-mediazione",
  name: "Università per Stranieri di Siena",
  shortName: "Stranieri Siena",
  city: "Siena",
  programme: "Mediazione Linguistica e Culturale",
  liveSources: true,
  sources: [],
  livePrograms,
};
