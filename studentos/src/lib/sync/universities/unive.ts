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
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Altre Opportunita' Formative",
    sources: degreeSources(BASE, ANNO, "altre-opportunita-formative", "", [
      { year: 1, corso: "AOF", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Amministrazione, Finanza e Controllo",
    sources: degreeSources(BASE, ANNO, "amministrazione-finanza-e-controllo", "", [
      { year: 1, corso: "EMR4", anno2: ["GGG|1"] },
      { year: 2, corso: "EM4", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Antropologia Culturale, Etnologia, Etnolinguistica",
    sources: degreeSources(BASE, ANNO, "antropologia-culturale-etnologia-etnolinguistica", "", [
      { year: 1, corso: "FMR10", anno2: ["CULT|1","ASIA|1","ART|1"] },
    ]),
  },
  {
    programme: "Biotecnologie per L'ambiente e lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "biotecnologie-per-l-ambiente-e-lo-sviluppo-sostenibile", "", [
      { year: 1, corso: "CMR10", anno2: ["GGG|1"] },
      { year: 2, corso: "CM10", anno2: ["GGG|2"] },
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
      { year: 1, corso: "CMR7", anno2: ["CM7B|1","CM7C|1","CM7I|1"] },
      { year: 2, corso: "CM7", anno2: ["CM7B|2","CM7C|2","CM7I|2"] },
      { year: 3, corso: "CT7", anno2: ["STC|3","SBN|3"] },
    ]),
  },
  {
    programme: "Commercio Estero e Turismo",
    sources: degreeSources(BASE, ANNO, "commercio-estero-e-turismo", "", [
      { year: 1, corso: "ETR30", anno2: ["CE|1","ET|1"] },
      { year: 2, corso: "ET30", anno2: ["CE|2","ET|2"] },
      { year: 3, corso: "ET30", anno2: ["CE|3","ET|3"] },
    ]),
  },
  {
    programme: "Computer Science and Information Technology",
    sources: degreeSources(BASE, ANNO, "computer-science-and-information-technology", "", [
      { year: 1, corso: "CM90", anno2: ["AIDE|1","CS|1","SDE|1"] },
      { year: 2, corso: "CM90", anno2: ["AIDE|2","CS|2","SDE|2"] },
    ]),
  },
  {
    programme: "Conservation Science and Technology for Cultural Heritage",
    sources: degreeSources(BASE, ANNO, "conservation-science-and-technology-for-cultural-heritage", "", [
      { year: 1, corso: "CMR60", anno2: ["GGG|1"] },
      { year: 2, corso: "CM60", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Conservazione e Gestione dei Beni e delle Attività Culturali",
    sources: degreeSources(BASE, ANNO, "conservazione-e-gestione-dei-beni-e-delle-attivita-culturali", "", [
      { year: 1, corso: "FT1", anno2: ["A00|1","E00|1","S00|1","T00|1"] },
      { year: 2, corso: "FT1", anno2: ["A00|2","E00|2","S00|2","T00|2"] },
      { year: 3, corso: "FT1", anno2: ["A00|3","E00|3","S00|3","T00|3"] },
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
      { year: 2, corso: "FM11", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Digital Management",
    sources: degreeSources(BASE, ANNO, "digital-management", "", [
      { year: 1, corso: "ETR7", anno2: ["GGG|1"] },
      { year: 2, corso: "ET7", anno2: ["GGG|2"] },
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
      { year: 2, corso: "ET11", anno2: ["EM0|2","EA0|2"] },
      { year: 3, corso: "ET11", anno2: ["EM0|3","EA0|3"] },
    ]),
  },
  {
    programme: "Economia e Commercio",
    sources: degreeSources(BASE, ANNO, "economia-e-commercio", "", [
      { year: 1, corso: "ETR4", anno2: ["GGG|1"] },
      { year: 2, corso: "ET4", anno2: ["C00|2","M00|2"] },
      { year: 3, corso: "ETR4", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "economia-e-finanza", "", [
      { year: 1, corso: "EMR20", anno2: ["GGG|1"] },
      { year: 2, corso: "EM20", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Economia e Gestione delle Arti e delle Attività Culturali",
    sources: degreeSources(BASE, ANNO, "economia-e-gestione-delle-arti-e-delle-attivita-culturali", "", [
      { year: 1, corso: "EMR3", anno2: ["E00|1","I00|1"] },
      { year: 2, corso: "EMR3", anno2: ["E00|2","I00|2"] },
    ]),
  },
  {
    programme: "Economia e Governance delle Organizzazioni Pubbliche",
    sources: degreeSources(BASE, ANNO, "economia-e-governance-delle-organizzazioni-pubbliche", "", [
      { year: 1, corso: "EMR11", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Economics and Business",
    sources: degreeSources(BASE, ANNO, "economics-and-business", "", [
      { year: 1, corso: "ETR9", anno2: ["GGG|1"] },
      { year: 2, corso: "ETR9", anno2: ["GGG|2"] },
      { year: 3, corso: "ETR9", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Economics, Finance and Sustainability",
    sources: degreeSources(BASE, ANNO, "economics-finance-and-sustainability", "", [
      { year: 1, corso: "EMR15", anno2: ["QEM|1","QFR|1","SFI|1"] },
      { year: 2, corso: "EM15", anno2: ["QEM|2","QFR|2","SFI|2"] },
    ]),
  },
  {
    programme: "Energy, Climate Change and Environmental Risks",
    sources: degreeSources(BASE, ANNO, "energy-climate-change-and-environmental-risks", "", [
      { year: 1, corso: "NS02", anno2: ["GGG|1"] },
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
      { year: 2, corso: "LM10", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "", [
      { year: 1, corso: "FTR2", anno2: ["FIL|1","FORM|1","FILSTO|1"] },
      { year: 2, corso: "FT2", anno2: ["FIL|2","FORM|2","FILSTO|2"] },
      { year: 3, corso: "FTR2", anno2: ["FIL|3","FORM|3","FILSTO|3"] },
    ]),
  },
  {
    programme: "Foundation Year",
    sources: degreeSources(BASE, ANNO, "foundation-year", "", [
      { year: 1, corso: "FOY", anno2: ["EB|1","HA|1","SC|1"] },
    ]),
  },
  {
    programme: "Gender Studies. Rights, Identities and Social Relations",
    sources: degreeSources(BASE, ANNO, "gender-studies-rights-identities-and-social-relations", "", [
      { year: 1, corso: "NE04", anno2: ["GGG|1"] },
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
      { year: 1, corso: "EMR12", anno2: ["EN|1","GM|1"] },
      { year: 2, corso: "EMR12", anno2: ["EN|2","GM|2"] },
    ]),
  },
  {
    programme: "Governance delle Organizzazioni Pubbliche",
    sources: degreeSources(BASE, ANNO, "governance-delle-organizzazioni-pubbliche", "", [
      { year: 2, corso: "EM11", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Hospitality Innovation and E-tourism",
    sources: degreeSources(BASE, ANNO, "hospitality-innovation-and-e-tourism", "", [
      { year: 1, corso: "CTR9", anno2: ["GGG|1"] },
      { year: 2, corso: "CT9", anno2: ["GGG|2"] },
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
      { year: 1, corso: "CTR3", anno2: ["DS|1","ECS|1","TSI|1"] },
      { year: 2, corso: "CT3", anno2: ["DS|2","ECS|2","TSI|2"] },
      { year: 3, corso: "CT3", anno2: ["DS|3","TSI|3"] },
    ]),
  },
  {
    programme: "Ingegneria Ambientale per la Transizione Ecologica",
    sources: degreeSources(BASE, ANNO, "ingegneria-ambientale-per-la-transizione-ecologica", "", [
      { year: 1, corso: "CTR10", anno2: ["GGG|1"] },
      { year: 2, corso: "CT10", anno2: ["GGG|2"] },
      { year: 3, corso: "CT10", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Ingegneria Fisica",
    sources: degreeSources(BASE, ANNO, "ingegneria-fisica", "", [
      { year: 1, corso: "CTR8", anno2: ["GGG|1"] },
      { year: 2, corso: "CT8", anno2: ["GGG|2"] },
      { year: 3, corso: "CT8", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Innovation and Management for Culture and Creativity",
    sources: degreeSources(BASE, ANNO, "innovation-and-management-for-culture-and-creativity", "", [
      { year: 1, corso: "EMR17", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Innovation and Marketing",
    sources: degreeSources(BASE, ANNO, "innovation-and-marketing", "", [
      { year: 2, corso: "EM17", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "International Management",
    sources: degreeSources(BASE, ANNO, "international-management", "", [
      { year: 1, corso: "EMR18", anno2: ["GGG|1"] },
      { year: 2, corso: "EM18", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Language and Management to China",
    sources: degreeSources(BASE, ANNO, "language-and-management-to-china", "", [
      { year: 1, corso: "LMR9", anno2: ["GGG|1"] },
      { year: 2, corso: "LM9", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Lavoro, Cittadinanza Sociale, Interculturalità",
    sources: degreeSources(BASE, ANNO, "lavoro-cittadinanza-sociale-interculturalita", "", [
      { year: 2, corso: "FM8", anno2: ["WRS|2","SSO|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "", [
      { year: 1, corso: "FTR3", anno2: ["MOD|1","ANT|1"] },
      { year: 2, corso: "FT3", anno2: ["MOD|2","ANT|2"] },
      { year: 3, corso: "FT3", anno2: ["MOD|3","ANT|3"] },
    ]),
  },
  {
    programme: "Lingue Dell'asia e Dell'africa Mediterranea per L'impresa e la Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "lingue-dell-asia-e-dell-africa-mediterranea-per-l-impresa-e-la-cooperazione-internazionale", "", [
      { year: 1, corso: "LMR40", anno2: ["C|1","G|1","PA|1","SEA|1"] },
      { year: 2, corso: "LMR40", anno2: ["C|2","G|2","PA|2","SEA|2"] },
    ]),
  },
  {
    programme: "Lingue e Civiltà Dell'asia e Dell'africa Mediterranea",
    sources: degreeSources(BASE, ANNO, "lingue-e-civilta-dell-asia-e-dell-africa-mediterranea", "", [
      { year: 1, corso: "LMR20", anno2: ["C|1","K|1","G|1","VMO|1"] },
      { year: 2, corso: "LM20", anno2: ["C|2","K|2","G|2","SA|2","VMO|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Europee, Americane e Postcoloniali",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-europee-americane-e-postcoloniali", "", [
      { year: 1, corso: "LMR3", anno2: ["J00|1","I00|1","N00|1","C|1","F00|1"] },
      { year: 2, corso: "LM3", anno2: ["J00|2","I00|2","C|2","F00|2"] },
    ]),
  },
  {
    programme: "Lingue, Civiltà e Scienze del Linguaggio",
    sources: degreeSources(BASE, ANNO, "lingue-civilta-e-scienze-del-linguaggio", "", [
      { year: 1, corso: "LTR10", anno2: ["C|1","L|1","P|1"] },
      { year: 2, corso: "LT10", anno2: ["C|2","L|2","P|2"] },
      { year: 3, corso: "LT10", anno2: ["C|3","L|3","P|3"] },
    ]),
  },
  {
    programme: "Lingue, Culture e Società Dell'asia e Dell'africa Mediterranea",
    sources: degreeSources(BASE, ANNO, "lingue-culture-e-societa-dell-asia-e-dell-africa-mediterranea", "", [
      { year: 1, corso: "LTR40", anno2: ["C|1","K|1","EUR|1","G|1","ISEA|1","MOA|1"] },
      { year: 2, corso: "LT40", anno2: ["C|2","K|2","EUR|2","G|2","ISEA|2","MOA|2"] },
      { year: 3, corso: "LT40", anno2: ["C|3","K|3","EUR|3","G|3","ISEA|3","MOA|3"] },
    ]),
  },
  {
    programme: "Lingue, Economie e Istituzioni Dell'asia e Dell'africa Mediterranea",
    sources: degreeSources(BASE, ANNO, "lingue-economie-e-istituzioni-dell-asia-e-dell-africa-mediterranea", "", [
      { year: 2, corso: "LM40", anno2: ["C|2","G|2","PA|2"] },
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
      { year: 2, corso: "EM60", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Marketing e Comunicazione",
    sources: degreeSources(BASE, ANNO, "marketing-e-comunicazione", "", [
      { year: 2, corso: "EM7", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Marketing Management",
    sources: degreeSources(BASE, ANNO, "marketing-management", "", [
      { year: 1, corso: "EMR7", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Mediazione Linguistica e Culturale",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale", "", [
      { year: 1, corso: "LTR5", anno2: ["GGG|1"] },
      { year: 2, corso: "LT5", anno2: ["GGG|2"] },
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
      { year: 1, corso: "LMR60", anno2: ["AM|1","AO|1","EUO|1","EUS|1","GS|1"] },
      { year: 2, corso: "LMR60", anno2: ["AM|2","AO|2","EUO|2","EUS|2","GS|2"] },
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
      { year: 1, corso: "R343", anno2: ["CE|1","CM|1"] },
    ]),
  },
  {
    programme: "Scienze Ambientali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali", "", [
      { year: 1, corso: "CMR5", anno2: ["CAP|1","GCS|1","MON|1"] },
      { year: 2, corso: "CM5", anno2: ["CAP|2","GCS|2","MON|2"] },
      { year: 3, corso: "CT5", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Scienze del Linguaggio",
    sources: degreeSources(BASE, ANNO, "scienze-del-linguaggio", "", [
      { year: 1, corso: "LM5", anno2: ["J|1","L|1"] },
      { year: 2, corso: "LM5", anno2: ["J|2","L|2"] },
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
      { year: 2, corso: "CT60", anno2: ["GGG|2"] },
      { year: 3, corso: "CT60", anno2: ["GGG|3"] },
    ]),
  },
  {
    programme: "Scienze Filosofiche",
    sources: degreeSources(BASE, ANNO, "scienze-filosofiche", "", [
      { year: 1, corso: "FMR61", anno2: ["FIL|1","FORM|1"] },
      { year: 2, corso: "FM61", anno2: ["FIL|2","FORM|2"] },
    ]),
  },
  {
    programme: "Storia",
    sources: degreeSources(BASE, ANNO, "storia", "", [
      { year: 1, corso: "FTR5", anno2: ["ANT|1","ARC|1","STO|1","MED|1"] },
      { year: 2, corso: "FT5", anno2: ["ANT|2","ARC|2","STO|2","MED|2"] },
      { year: 3, corso: "FT5", anno2: ["ANT|3","ARC|3","STO|3","MED|3"] },
    ]),
  },
  {
    programme: "Storia delle Arti e Conservazione dei Beni Artistici",
    sources: degreeSources(BASE, ANNO, "storia-delle-arti-e-conservazione-dei-beni-artistici", "", [
      { year: 1, corso: "FMR9", anno2: ["CONT|1","MED|1","MOD|1"] },
      { year: 2, corso: "FM9", anno2: ["CONT|2","MED|2","MOD|2"] },
    ]),
  },
  {
    programme: "Studi Transmediterranei: Migrazione, Cooperazione e Sviluppo",
    sources: degreeSources(BASE, ANNO, "studi-transmediterranei-migrazione-cooperazione-e-sviluppo", "", [
      { year: 1, corso: "LMR80", anno2: ["GGG|1"] },
      { year: 2, corso: "LM80", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Sviluppo Interculturale dei Sistemi Turistici",
    sources: degreeSources(BASE, ANNO, "sviluppo-interculturale-dei-sistemi-turistici", "", [
      { year: 2, corso: "EM9", anno2: ["GGG|2"] },
    ]),
  },
  {
    programme: "Tourism Management and Sustainability",
    sources: degreeSources(BASE, ANNO, "tourism-management-and-sustainability", "", [
      { year: 1, corso: "EMR9", anno2: ["GGG|1"] },
    ]),
  },
  {
    programme: "Traduzione e Interpretazione",
    sources: degreeSources(BASE, ANNO, "traduzione-e-interpretazione", "", [
      { year: 1, corso: "LMR70", anno2: ["C|1","S|1"] },
      { year: 2, corso: "LM70", anno2: ["C|2","S|2"] },
    ]),
  },
  {
    programme: "Welfare, Società e Lavoro Sociale",
    sources: degreeSources(BASE, ANNO, "welfare-societa-e-lavoro-sociale", "", [
      { year: 1, corso: "FMR8", anno2: ["WRS|1","SSO|1"] },
      { year: 2, corso: "FMR8", anno2: ["WRS|2","SSO|2"] },
    ]),
  },];

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
