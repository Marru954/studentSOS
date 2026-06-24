/**
 * Preset: Università Politecnica delle Marche (Ancona) — the WHOLE verifiable
 * ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live by driving the real easyacademy adapter end-to-end (grid_call /
 * test_call, non-empty `celle` / `Appelli`) on 2026-06-22. Codes captured by
 * GET, NEVER invented. Courses without verifiable timetable data stay manual.
 * Per-course status is in _univpm-economia_coverage.md. Re-verify each September
 * and bump ANNO.
 *
 * Base host: aule.univpm.it/agendastudenti. `scuola` is the faculty name
 * (Economia / Scienze / Medicina / Agraria). The 2025/26 ordinamento reform
 * splits most trienni across a year-1 "<code> - primo anno" corso and a year-2+
 * base corso, each with its own curriculum-coded anno2 — merged here into one
 * LiveProgram with per-year `corso`. The Ingegneria faculty (41 corsi) does NOT
 * publish its grid on this host (grid_call → 0 celle on every Ingegneria corso,
 * probed 2026-06-22) → it stays manual. Wrong/empty data is worse than none.
 *
 * Exams are PER-YEAR: a year carries an exam source only where test_call.php
 * returned real appelli for that (corso, anno) on 2026-06-22 — so degrees with
 * mixed availability split into an `exams:true` block and a timetable-only
 * (`false`) block. Economics/Data-Science corsi keep exams outside EasyAcademy
 * → timetable-only.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://aule.univpm.it/agendastudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Assistenza Sanitaria (Abilitante alla Professione Sanitaria di Assistente Sanitario)",
    // Medicina — esami anni 2,3
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria-abilitante-alla-professione-sanitaria-di-assistente-sanitario", "Medicina", [
      { year: 2, corso: "MT13", anno2: ["GEN|2"] },
      { year: 3, corso: "MT13", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Biologia Marina",
    // Scienze — esami anni 2
    sources: degreeSources(BASE, ANNO, "biologia-marina", "Scienze", [
      { year: 2, corso: "SM02", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Biologia Molecolare e Applicata",
    // Scienze — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "biologia-molecolare-e-applicata", "Scienze", [
      { year: 1, corso: "SM24", anno2: ["BMA2|1","BMA1|1"] },
      { year: 2, corso: "SM04", anno2: ["BMA2-2022|2","BMA1-2022|2"] },
    ]),
  },
  {
    programme: "Data Science for Economics, Business and Finance",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "data-science-for-economics-business-and-finance", "Economia", [
      { year: 1, corso: "EM31", anno2: ["650|1","651|1"] },
    ], false),
  },
  {
    programme: "Data Science per L'economia e le Imprese",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "data-science-per-l-economia-e-le-imprese", "Economia", [
      { year: 2, corso: "EM11", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Dietistica (Abilitante alla Professione Sanitaria di Dietista)",
    // Medicina — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "dietistica-abilitante-alla-professione-sanitaria-di-dietista", "Medicina", [
      { year: 1, corso: "MT12", anno2: ["GEN|1"] },
      { year: 2, corso: "MT12", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Digital Economics and Business",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "digital-economics-and-business", "Economia", [
      { year: 1, corso: "ET27", anno2: ["GEN|1"] },
      { year: 2, corso: "ET07", anno2: ["GEN|2"] },
      { year: 3, corso: "ET07", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Economia Aziendale",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "Economia", [
      { year: 1, corso: "ET25", anno2: ["642|1","643|1"] },
      { year: 2, corso: "ET05", anno2: ["642|2","643|2"] },
      { year: 3, corso: "ET05", anno2: ["642|3","643|3"] },
    ], false),
  },
  {
    programme: "Economia e Commercio",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "economia-e-commercio", "Economia", [
      { year: 1, corso: "ET26", anno2: ["GEN|1"] },
      { year: 2, corso: "ET06", anno2: ["GEN|2"] },
      { year: 3, corso: "ET06", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Economia e Management",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "economia-e-management", "Economia", [
      { year: 1, corso: "EM23", anno2: ["645|1","647|1","646|1"] },
      { year: 2, corso: "EM03", anno2: ["645|2","647|2","646|2"] },
    ], false),
  },
  {
    programme: "Educazione Professionale (Abilitante alla Professione Sanitaria di Educatore Professionale)",
    // Medicina — esami anni 2
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "Medicina", [
      { year: 2, corso: "MT08", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Environmental Hazard and Disaster Risk Management",
    // Scienze — esami anni 1
    sources: degreeSources(BASE, ANNO, "environmental-hazard-and-disaster-risk-management", "Scienze", [
      { year: 1, corso: "SM25", anno2: ["PDS0-2016|1"] },
    ]),
  },
  {
    programme: "Environmental Sciences and Civil Protection",
    // Scienze — esami anni 1
    sources: degreeSources(BASE, ANNO, "environmental-sciences-and-civil-protection", "Scienze", [
      { year: 1, corso: "ST23", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Fisioterapia (Abilitante alla Professione Sanitaria di Fisioterapista) - Sede Ancona",
    // Medicina — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-sede-ancona", "Medicina", [
      { year: 1, corso: "MT01", anno2: ["GEN|1"] },
      { year: 2, corso: "MT01", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Fisioterapia (Abilitante alla Professione Sanitaria di Fisioterapista) - Sede Ascoli Piceno",
    // Medicina — esami anni 1
    sources: [
      ...degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-sede-ascoli-piceno", "Medicina", [
      { year: 1, corso: "MT01A", anno2: ["GEN|1"] },
      ]),
      ...degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-sede-ascoli-piceno", "Medicina", [
      { year: 3, corso: "MT01A", anno2: ["GEN|3"] },
      ], false),
    ],
  },
  {
    programme: "Food and Beverage Innovation and Management",
    // Agraria — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "food-and-beverage-innovation-and-management", "Agraria", [
      { year: 1, corso: "AM24", anno2: ["GEN|1"] },
      { year: 2, corso: "AM04", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Igiene Dentale (Abilitante alla Professione Sanitaria di Igienista Dentale)",
    // Medicina — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale", "Medicina", [
      { year: 1, corso: "MT10", anno2: ["GEN|1"] },
      { year: 2, corso: "MT10", anno2: ["GEN|2"] },
      { year: 3, corso: "MT10", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) - Sede Ancona",
    // Medicina — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-ancona", "Medicina", [
      { year: 1, corso: "MT02", anno2: ["GEN|1"] },
      { year: 2, corso: "MT02", anno2: ["GEN|2"] },
      { year: 3, corso: "MT02", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) - Sede Ascoli Piceno",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-ascoli-piceno", "Medicina", [
      { year: 1, corso: "MT02A", anno2: ["GEN|1"] },
      { year: 2, corso: "MT02A", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) - Sede Fermo",
    // Medicina — esami anni 1
    sources: [
      ...degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-fermo", "Medicina", [
      { year: 1, corso: "MT02F", anno2: ["GEN|1"] },
      ]),
      ...degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-fermo", "Medicina", [
      { year: 2, corso: "MT02F", anno2: ["GEN|2"] },
      ], false),
    ],
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) - Sede Macerata",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-macerata", "Medicina", [
      { year: 1, corso: "MT02M", anno2: ["GEN|1"] },
      { year: 2, corso: "MT02M", anno2: ["GEN|2"] },
      { year: 3, corso: "MT02M", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) - Sede Pesaro",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-pesaro", "Medicina", [
      { year: 1, corso: "MT02P", anno2: ["GEN|1"] },
      { year: 3, corso: "MT02P", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "International Economics and Commerce",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "international-economics-and-commerce", "Economia", [
      { year: 1, corso: "EM27", anno2: ["636|1","649|1","648|1"] },
      { year: 2, corso: "EM07", anno2: ["636|2","631|2"] },
    ], false),
  },
  {
    programme: "Logopedia (Abilitante alla Professione Sanitaria di Logopedista) - Sede Ancona",
    // Medicina — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista-sede-ancona", "Medicina", [
      { year: 1, corso: "MT11", anno2: ["GEN|1"] },
      { year: 2, corso: "MT11", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Logopedia (Abilitante alla Professione Sanitaria di Logopedista) - Sede Fermo",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista-sede-fermo", "Medicina", [
      { year: 1, corso: "MT11F", anno2: ["GEN|1"] },
      { year: 2, corso: "MT11F", anno2: ["GEN|2"] },
      { year: 3, corso: "MT11F", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Management della Sostenibilita' ed Economia Circolare",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "management-della-sostenibilita-ed-economia-circolare", "Economia", [
      { year: 2, corso: "EM12", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Management per la Valorizzazione Sostenibile delle Aziende e delle Risorse Ittiche",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "management-per-la-valorizzazione-sostenibile-delle-aziende-e-delle-risorse-ittiche", "Economia", [
      { year: 1, corso: "ET08", anno2: ["GEN|1"] },
      { year: 2, corso: "ET08", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Management Pubblico e dei Sistemi Socio-sanitari",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "management-pubblico-e-dei-sistemi-socio-sanitari", "Economia", [
      { year: 1, corso: "EM29", anno2: ["GEN|1"] },
      { year: 2, corso: "EM09", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Marine Biology",
    // Scienze — esami anni 1
    sources: degreeSources(BASE, ANNO, "marine-biology", "Scienze", [
      { year: 1, corso: "SM22", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    // Medicina — esami anni 2,3,4,5,6
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "Medicina", [
      { year: 2, corso: "MU01", anno2: ["GEN|2"] },
      { year: 3, corso: "MU01", anno2: ["GEN|3"] },
      { year: 4, corso: "MU01", anno2: ["GEN|4"] },
      { year: 5, corso: "MU01", anno2: ["GEN|5"] },
      { year: 6, corso: "MU01", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Medicine and Surgery",
    // Medicina — esami anni 1,2,3,4
    sources: degreeSources(BASE, ANNO, "medicine-and-surgery", "Medicina", [
      { year: 1, corso: "MU23", anno2: ["GEN|1"] },
      { year: 2, corso: "MU03", anno2: ["GEN|2"] },
      { year: 3, corso: "MU03", anno2: ["GEN|3"] },
      { year: 4, corso: "MU03", anno2: ["GEN|4"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    // Medicina — esami anni 2,3,4,5
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "Medicina", [
      { year: 2, corso: "MU02", anno2: ["GEN|2"] },
      { year: 3, corso: "MU02", anno2: ["GEN|3"] },
      { year: 4, corso: "MU02", anno2: ["GEN|4"] },
      { year: 5, corso: "MU02", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Ostetricia (Abilitante alla Professione Sanitaria di Ostetrica/o)",
    // Medicina — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "Medicina", [
      { year: 1, corso: "MT04", anno2: ["GEN|1"] },
      { year: 2, corso: "MT04", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Rischio Ambientale e Protezione Civile",
    // Scienze — esami anni 2
    sources: degreeSources(BASE, ANNO, "rischio-ambientale-e-protezione-civile", "Scienze", [
      { year: 2, corso: "SM05", anno2: ["PDS0-2016|2"] },
    ]),
  },
  {
    programme: "Scienze Agrarie e del Territorio",
    // Agraria — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "scienze-agrarie-e-del-territorio", "Agraria", [
      { year: 1, corso: "AM21", anno2: ["410|1","412|1","411|1"] },
      { year: 2, corso: "AM01", anno2: ["410|2","412|2","411|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali e Protezione Civile",
    // Scienze — esami anni 2,3
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-e-protezione-civile", "Scienze", [
      { year: 2, corso: "ST03", anno2: ["GEN|2"] },
      { year: 3, corso: "ST03", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    // Scienze — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "Scienze", [
      { year: 1, corso: "ST21", anno2: ["SB01|1","SB02|1"] },
      { year: 2, corso: "ST01", anno2: ["SB01|2","SB02|2"] },
      { year: 3, corso: "ST01", anno2: ["SB01|3","SB02|3"] },
    ]),
  },
  {
    programme: "Scienze della Nutrizione e Dell'alimentazione",
    // Scienze — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "scienze-della-nutrizione-e-dell-alimentazione", "Scienze", [
      { year: 1, corso: "SM26", anno2: ["GEN|1"] },
      { year: 2, corso: "SM06", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie Tecniche Diagnostiche",
    // Medicina — esami anni 2
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-tecniche-diagnostiche", "Medicina", [
      { year: 2, corso: "MM08", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Agrarie",
    // Agraria — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-agrarie", "Agraria", [
      { year: 1, corso: "AT21", anno2: ["408|1","409|1"] },
      { year: 2, corso: "AT01", anno2: ["408|2","409|2"] },
      { year: 3, corso: "AT01", anno2: ["408|3","409|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Alimentari",
    // Agraria — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-alimentari", "Agraria", [
      { year: 1, corso: "AT23", anno2: ["GEN|1"] },
      { year: 2, corso: "AT03", anno2: ["GEN|2"] },
      { year: 3, corso: "AT03", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Forestali e Ambientali",
    // Agraria — esami anni 1
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-forestali-e-ambientali", "Agraria", [
      { year: 1, corso: "AM23", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Economiche e Finanziarie",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "scienze-economiche-e-finanziarie", "Economia", [
      { year: 1, corso: "EM21", anno2: ["640|1","644|1"] },
      { year: 2, corso: "EM01", anno2: ["640|2","644|2"] },
    ], false),
  },
  {
    programme: "Scienze Forestali e Ambientali",
    // Agraria — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "scienze-forestali-e-ambientali", "Agraria", [
      { year: 1, corso: "AT22", anno2: ["GEN|1"] },
      { year: 2, corso: "AT02", anno2: ["GEN|2"] },
      { year: 3, corso: "AT02", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Forestali, dei Suoli e del Paesaggio",
    // Agraria — esami anni 2
    sources: degreeSources(BASE, ANNO, "scienze-forestali-dei-suoli-e-del-paesaggio", "Agraria", [
      { year: 2, corso: "AM03", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche - Sede Ancona",
    // Medicina — esami anni 2
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche-sede-ancona", "Medicina", [
      { year: 2, corso: "MM03", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche - Sede Fermo",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche-sede-fermo", "Medicina", [
      { year: 2, corso: "MM03F", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Sistemi Agricoli Innovativi",
    // Agraria — solo orario
    sources: degreeSources(BASE, ANNO, "sistemi-agricoli-innovativi", "Agraria", [
      { year: 1, corso: "AT24", anno2: ["GEN|1"] },
      { year: 2, corso: "AT04", anno2: ["GEN|2"] },
      { year: 3, corso: "AT04", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Sustainability Management and Circular Economy",
    // Economia — solo orario
    sources: degreeSources(BASE, ANNO, "sustainability-management-and-circular-economy", "Economia", [
      { year: 1, corso: "EM32", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e nei Luoghi di Lavoro (Abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e nei Luoghi di Lavoro)",
    // Medicina — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "Medicina", [
      { year: 1, corso: "MT09", anno2: ["GEN|1"] },
      { year: 2, corso: "MT09", anno2: ["GEN|2"] },
      { year: 3, corso: "MT09", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Fisiopatologia Cardiocircolatoria e Perfusione Cardiovascolare (Abilitante alla Professione Sanitaria di Tecnico di Fisiopatologia Cardiocircolatoria e Perfusione Cardiovascolare)",
    // Medicina — esami anni 1,2
    sources: degreeSources(BASE, ANNO, "tecniche-di-fisiopatologia-cardiocircolatoria-e-perfusione-cardiovascolare-abilitante-alla-professione-sanitaria-di-tecnico-di-fisiopatologia-cardiocircolatoria-e-perfusione-cardiovascolare", "Medicina", [
      { year: 1, corso: "MT16", anno2: ["GEN|1"] },
      { year: 2, corso: "MT16", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (Abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    // Medicina — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "Medicina", [
      { year: 1, corso: "MT05", anno2: ["GEN|1"] },
      { year: 2, corso: "MT05", anno2: ["GEN|2"] },
      { year: 3, corso: "MT05", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (Abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) - Sede Ancona",
    // Medicina — esami anni 1,2,3
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica-sede-ancona", "Medicina", [
      { year: 1, corso: "MT07", anno2: ["GEN|1"] },
      { year: 2, corso: "MT07", anno2: ["GEN|2"] },
      { year: 3, corso: "MT07", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (Abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) - Sede Ascoli Piceno",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica-sede-ascoli-piceno", "Medicina", [
      { year: 1, corso: "MT07A", anno2: ["GEN|1"] },
      { year: 2, corso: "MT07A", anno2: ["GEN|2"] },
      { year: 3, corso: "MT07A", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Terapia della Neuro e Psicomotricità Dell'età Evolutiva (Abilitante alla Professione Sanitaria di Terapista della Neuro e Psicomotricità Dell'età Evolutiva)",
    // Medicina — solo orario
    sources: degreeSources(BASE, ANNO, "terapia-della-neuro-e-psicomotricita-dell-eta-evolutiva-abilitante-alla-professione-sanitaria-di-terapista-della-neuro-e-psicomotricita-dell-eta-evolutiva", "Medicina", [
      { year: 2, corso: "MT14", anno2: ["GEN|2"] },
      { year: 3, corso: "MT14", anno2: ["GEN|3"] },
    ], false),
  },
];

export const univpm: UniversityPreset = {
  id: "univpm-economia",
  name: "Università Politecnica delle Marche",
  shortName: "UnivPM",
  city: "Ancona",
  programme: "Economia e Management",
  liveSources: true,
  sources: [],
  livePrograms,
};
