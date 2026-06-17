/**
 * Preset: Università degli Studi di Bari Aldo Moro — the verifiable catalogue
 * (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live by driving the real easyacademy adapter end-to-end (grid_call /
 * test_call, non-empty `celle` / `Appelli`) on 2026-06-17. Codes captured by
 * GET, NEVER invented. Per-course status is in _uniba-giurisprudenza_coverage.md.
 * Re-verify each September and bump ANNO.
 *
 * Base host: easyacademy.ict.uniba.it/PortaleStudenti. This is a PARTIAL
 * EasyAcademy deployment: only the Dipartimento di Giurisprudenza and
 * Dipartimento di Scienze Politiche publish their grids here (12 degrees) — the
 * rest of UniBA's schools use other systems and stay in manual mode. There is no
 * 2025/26 reform split on this host (one `corso` code per degree, years via the
 * `anno2` suffix; some curricula carry literal spaces, e.g. "RISPI 1|1" — kept
 * exact).
 *
 * Exams are PER-DEGREE: the Giurisprudenza-area corsi expose easytest appelli
 * (exams: true); the Scienze Politiche corsi keep their exam calendar elsewhere
 * and ship timetable-only (the `false` 6th arg). Wrong data is worse than none.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.ict.uniba.it/PortaleStudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Consulente del Lavoro e Operatore D'impresa",
    sources: degreeSources(BASE, ANNO, "consulente-del-lavoro-e-operatore-d-impresa", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "7968", anno2: ["comune|1"] },
      { year: 2, corso: "7968", anno2: ["comune|2"] },
      { year: 3, corso: "7968", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "6001", anno2: ["comune|1"] },
      { year: 2, corso: "6001", anno2: ["comune|2"] },
      { year: 3, corso: "6001", anno2: ["comune|3"] },
      { year: 4, corso: "6001", anno2: ["comune|4"] },
      { year: 5, corso: "6001", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza D'impresa",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-d-impresa", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "6002", anno2: ["comune|1"] },
      { year: 2, corso: "6002", anno2: ["comune|2"] },
      { year: 3, corso: "6002", anno2: ["comune|3"] },
      { year: 4, corso: "6002", anno2: ["comune|4"] },
      { year: 5, corso: "6002", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Interclasse Magistrale RISPI",
    sources: degreeSources(BASE, ANNO, "interclasse-magistrale-rispi", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "8915", anno2: ["RISPI 1|1","RISPI 2|1"] },
      { year: 2, corso: "8915", anno2: ["RISPI 1|2","RISPI 2|2"] },
    ], false),
  },
  {
    programme: "L-16 Scienze Politiche, Economiche e Amministrative (SPEA)",
    sources: degreeSources(BASE, ANNO, "l-16-scienze-politiche-economiche-e-amministrative-spea", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "7975", anno2: ["unico|1"] },
      { year: 2, corso: "7975", anno2: ["unico|2"] },
      { year: 3, corso: "7975", anno2: ["unico|3"] },
    ], false),
  },
  {
    programme: "L-36 Scienze Politiche (SP)",
    sources: degreeSources(BASE, ANNO, "l-36-scienze-politiche-sp", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "7976", anno2: ["unico|1"] },
      { year: 2, corso: "7976", anno2: ["unico|2"] },
      { year: 3, corso: "7976", anno2: ["unico|3"] },
    ], false),
  },
  {
    programme: "L-39/L40 Interclasse Scienze del Servizio Sociale e Sociologia (SSSS) Percorso Sociologia",
    sources: degreeSources(BASE, ANNO, "l-39-l40-interclasse-scienze-del-servizio-sociale-e-sociologia-ssss-percorso-sociologia", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "7977", anno2: ["unico|1"] },
      { year: 2, corso: "7977", anno2: ["unico|2"] },
      { year: 3, corso: "7977", anno2: ["L39|3","L40|3"] },
    ], false),
  },
  {
    programme: "Laurea Magistrale in Diritto dello Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "laurea-magistrale-in-diritto-dello-sviluppo-sostenibile", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "8988", anno2: ["comune|1"] },
      { year: 2, corso: "8988", anno2: ["comune|2"] },
    ], false),
  },
  {
    programme: "LM-52 Relazioni Internazionali e Studi Europei (RISE)",
    sources: degreeSources(BASE, ANNO, "lm-52-relazioni-internazionali-e-studi-europei-rise", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "8985", anno2: ["unico|1"] },
      { year: 2, corso: "8985", anno2: ["unico|2"] },
    ], false),
  },
  {
    programme: "LM-63 Scienze delle Amministrazioni (SA)",
    sources: degreeSources(BASE, ANNO, "lm-63-scienze-delle-amministrazioni-sa", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "8990", anno2: ["unico|1"] },
      { year: 2, corso: "8990", anno2: ["unico|2"] },
    ], false),
  },
  {
    programme: "LM-87 Innovazione Sociale e Politiche di Inclusione (ISPI)",
    sources: degreeSources(BASE, ANNO, "lm-87-innovazione-sociale-e-politiche-di-inclusione-ispi", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "8986", anno2: ["unico|1"] },
      { year: 2, corso: "8986", anno2: ["unico|2"] },
    ], false),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "7222", anno2: ["comune|1"] },
      { year: 2, corso: "7222", anno2: ["comune|2"] },
      { year: 3, corso: "7222", anno2: ["comune|3"] },
    ]),
  },
];

export const uniba: UniversityPreset = {
  id: "uniba-giurisprudenza",
  name: "Università degli Studi di Bari Aldo Moro",
  shortName: "Università di Bari",
  city: "Bari",
  programme: "Giurisprudenza",
  liveSources: true,
  sources: [],
  livePrograms,
};
