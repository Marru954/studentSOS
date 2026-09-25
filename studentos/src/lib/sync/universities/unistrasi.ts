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
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Competenze Testuali per L'editoria, L'insegnamento e la Promozione Turistica",
    sources: degreeSources(BASE, ANNO, "competenze-testuali-per-l-editoria-l-insegnamento-e-la-promozione-turistica", "", [
      { year: 2, corso: "LM_CT", anno2: ["EDIT|2", "INSE|2", "PROM|2"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana in Contesti Globali",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana-in-contesti-globali", "", [
      { year: 3, corso: "L2_LG", anno2: ["INSE|3", "STOR|3"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana in Contesti Globali (l-10 R)",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana-in-contesti-globali-l-10-r", "", [
      { year: 2, corso: "L2_LN", anno2: ["INSE|2", "STOR|2"] },
    ], false),
  },
  {
    programme: "Linguaggi, Cooperazione e Diversità",
    sources: degreeSources(BASE, ANNO, "linguaggi-cooperazione-e-diversita", "", [
      { year: 1, corso: "LM_LI", anno2: ["COMI|1", "MEDC|1"] },
      { year: 2, corso: "LM_LI", anno2: ["COMI|2", "MEDC|2"] },
    ], false),
  },
  {
    programme: "Mediazione Linguistica e Culturale (l-12 R)",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale-l-12-r", "", [
      { year: 1, corso: "L2_MC", anno2: ["TURIM|1", "MIGR|1"] },
      { year: 2, corso: "L2_MC", anno2: ["TURIM|2", "MIGR|2"] },
    ], false),
  },
  {
    programme: "Mediazione Linguistica e Culturale (l-12)",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale-l-12", "", [
      { year: 3, corso: "L2_ML", anno2: ["TURIM|3", "MIGR|3"] },
    ], false),
  },
  {
    programme: "Plurilinguismo, Traduzione e Interpretazione",
    sources: degreeSources(BASE, ANNO, "plurilinguismo-traduzione-e-interpretazione", "", [
      { year: 1, corso: "L2_PT", anno2: ["SAGG|1", "SPEC|1"] },
      { year: 2, corso: "L2_PT", anno2: ["SAGG|2", "SPEC|2"] },
      { year: 3, corso: "L2_PT", anno2: ["SAGG|3", "SPEC|3"] },
    ], false),
  },
  {
    programme: "Scienze Linguistiche e Comunicazione Interculturale",
    sources: degreeSources(BASE, ANNO, "scienze-linguistiche-e-comunicazione-interculturale", "", [
      { year: 1, corso: "LM_SL", anno2: ["DIDA|1", "ORIE|1", "LING|1"] },
      { year: 2, corso: "LM_SL", anno2: ["DIDA|2", "ORIE|2"] },
    ], false),
  },
  {
    programme: "Archeologie e Storie Dell'arte",
    sources: degreeSources(BASE, ANNO, "archeologie-e-storie-dell-arte", "", [
      { year: 1, corso: "LM_AS", anno2: ["ARCH|1", "STOR|1"] },
    ], false),
  },
  {
    programme: "Lettere, Didattica, Editoria",
    sources: degreeSources(BASE, ANNO, "lettere-didattica-editoria", "", [
      { year: 1, corso: "LM_DE", anno2: ["DIDA|1", "EDIT|1"] },
    ], false),
  },
  {
    programme: "Lingua e Cultura Italiana",
    sources: degreeSources(BASE, ANNO, "lingua-e-cultura-italiana", "", [
      { year: 1, corso: "L2_LT", anno2: ["ITAS|1", "STUD|1"] },
    ], false),
  },
  {
    programme: "Patrimoni Culturali: Archeologia e Storia Dell'arte del Mondo",
    sources: degreeSources(BASE, ANNO, "patrimoni-culturali-archeologia-e-storia-dell-arte-del-mondo", "", [
      { year: 1, corso: "L2_AA", anno2: ["ARCH|1", "STAR|1"] },
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
