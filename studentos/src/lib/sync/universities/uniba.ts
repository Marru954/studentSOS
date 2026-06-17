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
 * Exams: UniBA keeps almost all exam calendars OUTSIDE EasyAcademy. Re-verified
 * 2026-06-17 over the full academic year (Mar 2026 → Feb 2027): of the 12 live
 * degrees only ONE source returns real appelli — Giurisprudenza anno-1 (corso
 * 6001, 2 appelli, e.g. "Istituzioni di diritto romano A-L"). Every other corso
 * (incl. Giurisprudenza anni 2-5, Giurisprudenza D'impresa, Consulente del
 * Lavoro, Scienze dei Servizi Giuridici) returns empty `Insegnamenti` →
 * timetable-only (`false` 6th arg). Giurisprudenza carries its single live exam
 * source hand-wired on anno-1. Wrong/empty data is worse than none.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.ict.uniba.it/PortaleStudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Consulente del Lavoro e Operatore D'impresa",
    // Esami: test_call.php non espone appelli per questo corso (verificato
    // 2026-06-17, finestra intero anno accademico → 0 appelli) → solo orario.
    sources: degreeSources(BASE, ANNO, "consulente-del-lavoro-e-operatore-d-impresa", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "7968", anno2: ["comune|1"] },
      { year: 2, corso: "7968", anno2: ["comune|2"] },
      { year: 3, corso: "7968", anno2: ["comune|3"] },
    ], false),
  },
  {
    programme: "Giurisprudenza",
    // Orario live su tutti i 5 anni. Esami: test_call.php espone appelli SOLO
    // per l'anno-1 (2 appelli reali, es. "Istituzioni di diritto romano A-L",
    // verificato 2026-06-17); anni 2-5 tornano vuoti → solo l'anno-1 ha
    // capability "exams", il resto è timetable-only (dato vuoto è peggio di
    // nessun dato). Per-anno: degreeSources è all-or-nothing sugli esami, quindi
    // l'unica source esami è cablata a mano.
    sources: [
      ...degreeSources(BASE, ANNO, "giurisprudenza", "DipartimentodiGiurisprudenza", [
        { year: 1, corso: "6001", anno2: ["comune|1"] },
        { year: 2, corso: "6001", anno2: ["comune|2"] },
        { year: 3, corso: "6001", anno2: ["comune|3"] },
        { year: 4, corso: "6001", anno2: ["comune|4"] },
        { year: 5, corso: "6001", anno2: ["comune|5"] },
      ], false),
      {
        id: "giurisprudenza-esami-anno-1",
        label: "Appelli d'esame — 1° anno",
        capability: "exams" as const,
        providerId: "easyacademy",
        params: { kind: "exams", baseUrl: BASE, scuola: "DipartimentodiGiurisprudenza", cdl: "6001", anno2: ["1"] },
      },
    ],
  },
  {
    programme: "Giurisprudenza D'impresa",
    // Esami: test_call.php non espone appelli (verificato 2026-06-17, intero
    // anno accademico → 0 appelli su tutti i 5 anni) → solo orario.
    sources: degreeSources(BASE, ANNO, "giurisprudenza-d-impresa", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "6002", anno2: ["comune|1"] },
      { year: 2, corso: "6002", anno2: ["comune|2"] },
      { year: 3, corso: "6002", anno2: ["comune|3"] },
      { year: 4, corso: "6002", anno2: ["comune|4"] },
      { year: 5, corso: "6002", anno2: ["comune|5"] },
    ], false),
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
    // Esami: test_call.php espone 1 solo appello (anno-2) sull'intero anno
    // accademico (verificato 2026-06-17); troppo sparso per giustificare le
    // source esami vuote degli altri anni → solo orario.
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "7222", anno2: ["comune|1"] },
      { year: 2, corso: "7222", anno2: ["comune|2"] },
      { year: 3, corso: "7222", anno2: ["comune|3"] },
    ], false),
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
