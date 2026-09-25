/**
 * Preset: Università Ca' Foscari Venezia — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses) via the easyacademy adapter on 2026-06-17. Codes captured by GET,
 * NEVER invented. Courses without verifiable codes stay manual
 * (ateneo-courses.ts). Per-course status is in _unive-informatica_coverage.md.
 * Re-verify each September and bump ANNO.
 *
 * Base host: orari.unive.it/AgendaWebUnive (scuola is empty for every corso;
 * the 2025/26 ordinamento reform splits triennali across a year-1 "CTR/…R"
 * code and a year-2/3 "CT/…" base code — each year carries its own).
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://orari.unive.it/AgendaWebUnive";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Amministrazione, Finanza e Controllo",
    sources: degreeSources(BASE, ANNO, "amministrazione-finanza-e-controllo", "", [
      { year: 1, corso: "EMR4", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR4", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Antropologia Culturale, Etnologia, Etnolinguistica",
    sources: degreeSources(BASE, ANNO, "antropologia-culturale-etnologia-etnolinguistica", "", [
      { year: 2, corso: "FMR10", anno2: ["CULT|2", "ASIA|2", "ART|2"] },
    ]),
  },
  {
    programme: "Biotecnologie per L'ambiente e lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "biotecnologie-per-l-ambiente-e-lo-sviluppo-sostenibile", "", [
      { year: 1, corso: "CMR10", anno2: ["GGG|1"] },
      { year: 2, corso: "CMR10", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Business Administration and Management",
    sources: degreeSources(BASE, ANNO, "business-administration-and-management", "", [
      { year: 1, corso: "ETR8", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR8", anno2: ["GGG|2"] },
      { year: 3, corso: "ETR8", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologie Sostenibili",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologie-sostenibili", "", [
      { year: 1, corso: "CMR7", anno2: ["CM7B|1", "CM7C|1", "CM7I|1"] },
      { year: 2, corso: "CTR7", anno2: ["STC|2", "SBN|2"] },
      { year: 3, corso: "CT7", anno2: ["STC|3", "SBN|3"] },
    ]),
  },
  {
    programme: "Commercio Estero e Turismo",
    sources: degreeSources(BASE, ANNO, "commercio-estero-e-turismo", "", [
      { year: 1, corso: "ETR30", anno2: ["CE|1", "ET|1"] },
      { year: 2, corso: "ETR30", anno2: ["CE|2", "ET|2"] },
      { year: 3, corso: "ET30", anno2: ["CE|3", "ET|3"] },
    ]),
  },
  {
    programme: "Computer Science and Information Technology",
    sources: degreeSources(BASE, ANNO, "computer-science-and-information-technology", "", [
      { year: 1, corso: "CM90", anno2: ["AIDE|1", "CS|1", "SDE|1"] },
      { year: 2, corso: "CM90", anno2: ["AIDE|2", "CS|2", "SDE|2"] },
    ]),
  },
  {
    programme: "Conservation Science and Technology for Cultural Heritage",
    sources: degreeSources(BASE, ANNO, "conservation-science-and-technology-for-cultural-heritage", "", [
      { year: 1, corso: "CMR60", anno2: ["GGG|1"] },
      { year: 2, corso: "CMR60", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Conservazione e Gestione dei Beni e delle Attività Culturali",
    sources: degreeSources(BASE, ANNO, "conservazione-e-gestione-dei-beni-e-delle-attivita-culturali", "", [
      { year: 1, corso: "FT1", anno2: ["A00|1", "E00|1", "S00|1", "T00|1"] },
      { year: 2, corso: "FT1", anno2: ["A00|2", "E00|2", "S00|2", "T00|2"] },
      { year: 3, corso: "FT1", anno2: ["A00|3", "E00|3", "S00|3", "T00|3"] },
    ]),
  },
  {
    programme: "Data Analytics for Business and Society",
    sources: degreeSources(BASE, ANNO, "data-analytics-for-business-and-society", "", [
      { year: 1, corso: "EMR14", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR14", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Digital and Public Humanities",
    sources: degreeSources(BASE, ANNO, "digital-and-public-humanities", "", [
      { year: 1, corso: "FMR11", anno2: ["GGG|1"] },
      { year: 2, corso: "FMR11", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Digital Management",
    sources: degreeSources(BASE, ANNO, "digital-management", "", [
      { year: 1, corso: "ETR7", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR7", anno2: ["GGG|2"] },
      { year: 3, corso: "ET7", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Economia",
    sources: degreeSources(BASE, ANNO, "economia", "", [
      { year: 1, corso: "R304", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "", [
      { year: 1, corso: "ETR11", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR11", anno2: ["GGG|2"] },
      { year: 3, corso: "ET11", anno2: ["EM0|3", "EA0|3"] },
    ]),
  },
  {
    programme: "Economia e Commercio",
    sources: degreeSources(BASE, ANNO, "economia-e-commercio", "", [
      { year: 1, corso: "ETR4", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR4", anno2: ["GGG|2"] },
      { year: 3, corso: "ET4", anno2: ["C00|3", "M00|3"] },
    ]),
  },
  {
    programme: "Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "economia-e-finanza", "", [
      { year: 1, corso: "EMR20", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR20", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Economia e Gestione delle Arti e delle Attività Culturali",
    sources: degreeSources(BASE, ANNO, "economia-e-gestione-delle-arti-e-delle-attivita-culturali", "", [
      { year: 1, corso: "EMR3", anno2: ["E00|1", "I00|1"] },
      { year: 2, corso: "EMR3", anno2: ["E00|2", "I00|2"] },
    ]),
  },
  {
    programme: "Economia e Governance delle Organizzazioni Pubbliche",
    sources: degreeSources(BASE, ANNO, "economia-e-governance-delle-organizzazioni-pubbliche", "", [
      { year: 1, corso: "EMR11", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR11", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Economics and Business",
    sources: degreeSources(BASE, ANNO, "economics-and-business", "", [
      { year: 1, corso: "ETR9", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR9", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Economics, Finance and Sustainability",
    sources: degreeSources(BASE, ANNO, "economics-finance-and-sustainability", "", [
      { year: 1, corso: "EMR15", anno2: ["QEM|1", "QFR|1", "SFI|1"] },
      { year: 2, corso: "EMR15", anno2: ["QEM|2", "QFR|2", "SFI|2"] },
    ]),
  },
  {
    programme: "Engineering Physics",
    sources: degreeSources(BASE, ANNO, "engineering-physics", "", [
      { year: 1, corso: "CMR13", anno2: ["GGG|1"] },
      { year: 2, corso: "CMR13", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Environmental Humanities",
    sources: degreeSources(BASE, ANNO, "environmental-humanities", "", [
      { year: 1, corso: "LMR10", anno2: ["GGG|1"] },
      { year: 2, corso: "LMR10", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "", [
      { year: 1, corso: "FTR2", anno2: ["FIL|1", "FORM|1", "FILSTO|1"] },
      { year: 2, corso: "FTR2", anno2: ["FIL|2", "FORM|2", "FILSTO|2"] },
      { year: 3, corso: "FT2", anno2: ["FIL|3", "FORM|3", "FILSTO|3"] },
    ]),
  },
  {
    programme: "Foundation Year",
    sources: degreeSources(BASE, ANNO, "foundation-year", "", [
      { year: 1, corso: "FOY", anno2: ["EB|1", "HA|1", "SC|1", "SU|1"] },
    ]),
  },
  {
    programme: "Global Accounting and Finance",
    sources: degreeSources(BASE, ANNO, "global-accounting-and-finance", "", [
      { year: 1, corso: "EMR16", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR16", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Global Development and Entrepreneurship",
    sources: degreeSources(BASE, ANNO, "global-development-and-entrepreneurship", "", [
      { year: 1, corso: "EMR12", anno2: ["EN|1", "GM|1"] },
      { year: 2, corso: "EMR12", anno2: ["EN|2", "GM|2"] },
    ]),
  },
  {
    programme: "Hospitality Innovation and E-tourism",
    sources: degreeSources(BASE, ANNO, "hospitality-innovation-and-e-tourism", "", [
      { year: 1, corso: "CTR9", anno2: ["GGG|1"] },
      { year: 2, corso: "CTR9", anno2: ["GGG|2"] },
      { year: 3, corso: "CT9", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Impresa, Banche, Lavoro e Fisco",
    sources: degreeSources(BASE, ANNO, "impresa-banche-lavoro-e-fisco", "", [
      { year: 1, corso: "NM03", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "", [
      { year: 1, corso: "R320", anno2: ["GGG|1"] },
      { year: 2, corso: "CTR3", anno2: ["DS|2", "ECS|2", "TSI|2"] },
      { year: 3, corso: "CT3", anno2: ["DS|3", "TSI|3"] },
    ]),
  },
  {
    programme: "Ingegneria Ambientale per la Transizione Ecologica",
    sources: degreeSources(BASE, ANNO, "ingegneria-ambientale-per-la-transizione-ecologica", "", [
      { year: 1, corso: "CTR10", anno2: ["GGG|1"] },
      { year: 2, corso: "CTR10", anno2: ["GGG|2"] },
      { year: 3, corso: "CT10", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Ingegneria Fisica",
    sources: degreeSources(BASE, ANNO, "ingegneria-fisica", "", [
      { year: 1, corso: "CTR8", anno2: ["GGG|1"] },
      { year: 2, corso: "CTR8", anno2: ["GGG|2"] },
      { year: 3, corso: "CT8", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Innovation and Management for Culture and Creativity",
    sources: degreeSources(BASE, ANNO, "innovation-and-management-for-culture-and-creativity", "", [
      { year: 1, corso: "EMR17", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR17", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "International Management",
    sources: degreeSources(BASE, ANNO, "international-management", "", [
      { year: 1, corso: "EMR18", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR18", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Language and Management to China",
    sources: degreeSources(BASE, ANNO, "language-and-management-to-china", "", [
      { year: 1, corso: "LMR9", anno2: ["GGG|1"] },
      { year: 2, corso: "LMR9", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "", [
      { year: 1, corso: "FTR3", anno2: ["MOD|1", "ANT|1"] },
      { year: 2, corso: "FTR3", anno2: ["MOD|2", "ANT|2"] },
      { year: 3, corso: "FT3", anno2: ["MOD|3", "ANT|3"] },
    ]),
  },
  {
    programme: "Lingue Dell'asia e Dell'africa Mediterranea per L'impresa e la Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "lingue-dell-asia-e-dell-africa-mediterranea-per-l-impresa-e-la-cooperazione-internazionale", "", [
      { year: 1, corso: "LMR40", anno2: ["C|1", "G|1", "PA|1", "SEA|1"] },
      { year: 2, corso: "LMR40", anno2: ["C|2", "G|2", "PA|2", "SEA|2"] },
    ]),
  },
  {
    programme: "Lingue e Civiltà Dell'asia e Dell'africa Mediterranea",
    sources: degreeSources(BASE, ANNO, "lingue-e-civilta-dell-asia-e-dell-africa-mediterranea", "", [
      { year: 1, corso: "LMR20", anno2: ["C|1", "K|1", "G|1", "VMO|1"] },
      { year: 2, corso: "LMR20", anno2: ["C|2", "K|2", "G|2", "VMO|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Europee, Americane e Postcoloniali",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-europee-americane-e-postcoloniali", "", [
      { year: 1, corso: "LMR3", anno2: ["J00|1", "I00|1", "N00|1", "C|1", "F00|1"] },
      { year: 2, corso: "LMR3", anno2: ["J00|2", "I00|2", "N00|2", "C|2", "F00|2"] },
    ]),
  },
  {
    programme: "Lingue, Civiltà e Scienze del Linguaggio",
    sources: degreeSources(BASE, ANNO, "lingue-civilta-e-scienze-del-linguaggio", "", [
      { year: 1, corso: "LTR10", anno2: ["C|1", "L|1", "P|1"] },
      { year: 2, corso: "LTR10", anno2: ["C|2", "L|2", "P|2"] },
      { year: 3, corso: "LT10", anno2: ["C|3", "L|3", "P|3"] },
    ]),
  },
  {
    programme: "Lingue, Culture e Società Dell'asia e Dell'africa Mediterranea",
    sources: degreeSources(BASE, ANNO, "lingue-culture-e-societa-dell-asia-e-dell-africa-mediterranea", "", [
      { year: 1, corso: "LTR40", anno2: ["C|1", "K|1", "G|1", "ISEA|1", "MOREA|1", "MOAA|1"] },
      { year: 2, corso: "LTR40", anno2: ["C|2", "K|2", "EUR|2", "G|2", "ISEA|2", "MOA|2", "MOREA|2", "MOAA|2"] },
      { year: 3, corso: "LT40", anno2: ["C|3", "K|3", "EUR|3", "G|3", "ISEA|3", "MOA|3"] },
    ]),
  },
  {
    programme: "Management",
    sources: degreeSources(BASE, ANNO, "management", "", [
      { year: 1, corso: "R357", anno2: ["GGG|1"] },
      { year: 2, corso: "R357", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Management e Sostenibilità",
    sources: degreeSources(BASE, ANNO, "management-e-sostenibilita", "", [
      { year: 1, corso: "EMR60", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR60", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Marketing Management",
    sources: degreeSources(BASE, ANNO, "marketing-management", "", [
      { year: 1, corso: "EMR7", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR7", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Mediazione Linguistica e Culturale",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale", "", [
      { year: 1, corso: "LTR5", anno2: ["GGG|1"] },
      { year: 2, corso: "LTR5", anno2: ["GGG|2"] },
      { year: 3, corso: "LT5", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Philosophy, International and Economic Studies",
    sources: degreeSources(BASE, ANNO, "philosophy-international-and-economic-studies", "", [
      { year: 1, corso: "LTR6", anno2: ["GGG|1"] },
      { year: 2, corso: "LTR6", anno2: ["GGG|2"] },
      { year: 3, corso: "LT6", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali Comparate",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali-comparate", "", [
      { year: 1, corso: "LMR60", anno2: ["AM|1", "AO|1", "EUO|1", "EUS|1", "GS|1"] },
      { year: 2, corso: "LMR60", anno2: ["AM|2", "AO|2", "EUO|2", "EUS|2", "GS|2"] },
    ]),
  },
  {
    programme: "School for International Education",
    sources: degreeSources(BASE, ANNO, "school-for-international-education", "", [
      { year: 1, corso: "SIE", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Science and Technology of Bio and Nanomaterials",
    sources: degreeSources(BASE, ANNO, "science-and-technology-of-bio-and-nanomaterials", "", [
      { year: 1, corso: "CM14", anno2: ["GGG|1"] },
      { year: 2, corso: "CM14", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Scienza e Gestione dei Cambiamenti Climatici",
    sources: degreeSources(BASE, ANNO, "scienza-e-gestione-dei-cambiamenti-climatici", "", [
      { year: 1, corso: "R343", anno2: ["CE|1", "CM|1"] },
    ]),
  },
  {
    programme: "Scienze Ambientali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali", "", [
      { year: 1, corso: "CMR5", anno2: ["CAP|1", "GCS|1", "MON|1"] },
      { year: 2, corso: "CMR5", anno2: ["CAP|2", "GCS|2", "MON|2"] },
      { year: 3, corso: "CT5", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Scienze del Linguaggio",
    sources: degreeSources(BASE, ANNO, "scienze-del-linguaggio", "", [
      { year: 1, corso: "LM5", anno2: ["J|1", "L|1"] },
      { year: 2, corso: "LM5", anno2: ["J|2", "L|2"] },
    ]),
  },
  {
    programme: "Scienze della Società e del Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "scienze-della-societa-e-del-servizio-sociale", "", [
      { year: 1, corso: "FTR4", anno2: ["GGG|1"] },
      { year: 2, corso: "FTR4", anno2: ["GGG|2"] },
      { year: 3, corso: "FT4", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per i Beni Culturali",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-per-i-beni-culturali", "", [
      { year: 1, corso: "CTR60", anno2: ["GGG|1"] },
      { year: 2, corso: "CTR60", anno2: ["GGG|2"] },
      { year: 3, corso: "CT60", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Scienze Filosofiche",
    sources: degreeSources(BASE, ANNO, "scienze-filosofiche", "", [
      { year: 1, corso: "FMR61", anno2: ["FIL|1", "FORM|1"] },
      { year: 2, corso: "FMR61", anno2: ["FIL|2", "FORM|2"] },
    ]),
  },
  {
    programme: "Storia",
    sources: degreeSources(BASE, ANNO, "storia", "", [
      { year: 1, corso: "FTR5", anno2: ["ANT|1", "ARC|1", "STO|1", "MED|1"] },
      { year: 2, corso: "FTR5", anno2: ["ANT|2", "ARC|2", "STO|2", "MED|2"] },
      { year: 3, corso: "FT5", anno2: ["ANT|3", "ARC|3", "STO|3", "MED|3"] },
    ]),
  },
  {
    programme: "Storia delle Arti e Conservazione dei Beni Artistici",
    sources: degreeSources(BASE, ANNO, "storia-delle-arti-e-conservazione-dei-beni-artistici", "", [
      { year: 1, corso: "FMR9", anno2: ["CONT|1", "MED|1", "MOD|1"] },
      { year: 2, corso: "FMR9", anno2: ["CONT|2", "MED|2", "MOD|2"] },
    ]),
  },
  {
    programme: "Studi Transmediterranei: Migrazione, Cooperazione e Sviluppo",
    sources: degreeSources(BASE, ANNO, "studi-transmediterranei-migrazione-cooperazione-e-sviluppo", "", [
      { year: 1, corso: "LMR80", anno2: ["GGG|1"] },
      { year: 2, corso: "LMR80", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Tourism Management and Sustainability",
    sources: degreeSources(BASE, ANNO, "tourism-management-and-sustainability", "", [
      { year: 1, corso: "EMR9", anno2: ["GGG|1"] },
      { year: 2, corso: "EMR9", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Traduzione e Interpretazione",
    sources: degreeSources(BASE, ANNO, "traduzione-e-interpretazione", "", [
      { year: 1, corso: "LMR70", anno2: ["GGG|1"] },
      { year: 2, corso: "LMR70", anno2: ["GGG|2", "C|2", "S|2"] },
    ]),
  },
  {
    programme: "Welfare, Società e Lavoro Sociale",
    sources: degreeSources(BASE, ANNO, "welfare-societa-e-lavoro-sociale", "", [
      { year: 1, corso: "FMR8", anno2: ["WRS|1", "SSO|1"] },
      { year: 2, corso: "FMR8", anno2: ["WRS|2", "SSO|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "", [
      { year: 1, corso: "CTR70", anno2: ["GGG|1"] },
      { year: 3, corso: "CTR70", anno2: ["GGG|3"] },
    ], false),
  },
  {
    programme: "Environmental Engineering For The Green Transition",
    sources: degreeSources(BASE, ANNO, "environmental-engineering-for-the-green-transition", "", [
      { year: 1, corso: "CMR15", anno2: ["GGG|1"] },
    ], false),
  },
  {
    programme: "Filologia, Linguistica e Letteratura Italiana",
    sources: degreeSources(BASE, ANNO, "filologia-linguistica-e-letteratura-italiana", "", [
      { year: 1, corso: "FM40", anno2: ["EUR|1", "MED|1", "MOD|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Fisica e Materiali",
    sources: degreeSources(BASE, ANNO, "ingegneria-fisica-e-materiali", "", [
      { year: 1, corso: "R361", anno2: ["TBN|1", "TDI|1"] },
    ], false),
  },
  {
    programme: "Italian And Mediterranean Studies",
    sources: degreeSources(BASE, ANNO, "italian-and-mediterranean-studies", "", [
      { year: 1, corso: "FTR6", anno2: ["GGG|1"] },
    ], false),
  },
  {
    programme: "Scienze Dell'antichità: Archeologia, Letterature e Storia",
    sources: degreeSources(BASE, ANNO, "scienze-dell-antichita-archeologia-letterature-e-storia", "", [
      { year: 1, corso: "FMR2", anno2: ["A00|1", "S00|1"] },
      { year: 2, corso: "FMR2", anno2: ["A00|2", "S00|2"] },
    ], false),
  },
  {
    programme: "Studi Storici: Età Medievale, Moderna, Contemporanea",
    sources: degreeSources(BASE, ANNO, "studi-storici-eta-medievale-moderna-contemporanea", "", [
      { year: 2, corso: "FMR7", anno2: ["GGG|2"] },
    ], false),
  },
  {
    programme: "Traduzione Specialistica, Multimediale e per L?accessibilità",
    sources: degreeSources(BASE, ANNO, "traduzione-specialistica-multimediale-e-per-l-accessibilita", "", [
      { year: 1, corso: "LMR75", anno2: ["ILT|1", "TSA|1"] },
    ], false),
  },
];

export const unive: UniversityPreset = {
  id: "unive-informatica",
  name: "Università Ca' Foscari Venezia",
  shortName: "Ca' Foscari",
  city: "Venezia",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
