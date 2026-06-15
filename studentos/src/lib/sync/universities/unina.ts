/**
 * Preset: Università degli Studi di Napoli Federico II — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unina_coverage.md. Re-verify each September and bump ANNO.
 *
 * Exams are kept in Esse3 here → timetable-only (no exam sources).
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.unina.it/agendastudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Architecture and Heritage",
    sources: degreeSources(BASE, ANNO, "architecture-and-heritage", "CollegiodiArchitettura", [
      { year: 1, corso: "DB2", anno2: ["GEN|1"] },
      { year: 2, corso: "P53", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "CollegiodiArchitettura", [
      { year: 1, corso: "DB7", anno2: ["GEN|1"] },
      { year: 2, corso: "D06", anno2: ["GEN|2"] },
      { year: 3, corso: "D06", anno2: ["GEN|3"] },
      { year: 4, corso: "N14", anno2: ["GEN|4"] },
      { year: 5, corso: "N14", anno2: ["GEN|5"] },
    ], false),
  },
  {
    programme: "Architettura per Comunità, Territori e Ambiente",
    sources: degreeSources(BASE, ANNO, "architettura-per-comunita-territori-e-ambiente", "CollegiodiArchitettura", [
      { year: 1, corso: "DB8", anno2: ["GEN|1"] },
      { year: 2, corso: "D07", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Autonomous Vehicle Engineering",
    sources: degreeSources(BASE, ANNO, "autonomous-vehicle-engineering", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D18", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_D18", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Bioingegneria Industriale",
    sources: degreeSources(BASE, ANNO, "bioingegneria-industriale", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "P16", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "CollegiodiScienze", [
      { year: 1, corso: "D52", anno2: ["BCC|1", "BDR|1", "BNU|1", "BFO|1", "BMC|1"] },
      { year: 2, corso: "P58", anno2: ["BCC|2", "BDR|2", "BNU|2", "BFO|2", "BMC|2"] },
    ], false),
  },
  {
    programme: "Biologia Lt",
    sources: degreeSources(BASE, ANNO, "biologia-lt", "CollegiodiScienze", [
      { year: 1, corso: "D50", anno2: ["GEN_MSA1_CFGUZTVW|1", "GEN_MSA2_BDEINPOQX|1", "GEN_MSA3_AHKLMRSJY|1"] },
      { year: 2, corso: "P30", anno2: ["GEN_MSA1_CFGUZTVW|2", "GEN_MSA2_BDEINPOQX|2", "GEN_MSA3_AHKLMRSJY|2"] },
      { year: 3, corso: "P30", anno2: ["GEN_Dispari|3", "GEN_Pari|3"] },
    ], false),
  },
  {
    programme: "Biotecnologie Molecolari e Industriali (magistrale)",
    sources: degreeSources(BASE, ANNO, "biotecnologie-molecolari-e-industriali-magistrale", "CollegiodiScienze", [
      { year: 1, corso: "D76", anno2: ["BRR|1", "PRB|1"] },
      { year: 2, corso: "N80", anno2: ["BRR|2", "PRB|2"] },
    ], false),
  },
  {
    programme: "Biotecnologie Molecolari e Industriali (magistrale) (DG5)",
    sources: degreeSources(BASE, ANNO, "biotecnologie-molecolari-e-industriali-magistrale-dg5", "CollegiodiScienze", [
      { year: 1, corso: "DG5", anno2: ["IDS|1", "MCR|1"] },
    ], false),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "CollegiodiScienze", [
      { year: 1, corso: "D74", anno2: ["GEN|1"] },
      { year: 2, corso: "D44", anno2: ["GEN|2"] },
      { year: 3, corso: "N83", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Chimica Industriale",
    sources: degreeSources(BASE, ANNO, "chimica-industriale", "CollegiodiScienze", [
      { year: 1, corso: "DG6", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Civil and Environmental Engineering",
    sources: degreeSources(BASE, ANNO, "civil-and-environmental-engineering", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D38", anno2: ["GEN|1"] },
      { year: 2, corso: "D38", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Comunicazione Pubblica, Sociale e Politica",
    sources: degreeSources(BASE, ANNO, "comunicazione-pubblica-sociale-e-politica", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "D84", anno2: ["GEN|1"] },
      { year: 2, corso: "D48", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Biotecnologie Biomolecolari e Industriali",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-biotecnologie-biomolecolari-e-industriali", "CollegiodiScienze", [
      { year: 2, corso: "N75", anno2: ["GEN|2"] },
      { year: 3, corso: "N75", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Chimica Industriale",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-chimica-industriale", "CollegiodiScienze", [
      { year: 2, corso: "N84", anno2: ["GEN|2"] },
      { year: 3, corso: "N84", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Ingegneria Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-ingegneria-chimica-triennale", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N37", anno2: ["GEN|2"] },
      { year: 3, corso: "N37", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Ingegneria Chimica (triennale) (SG_N37)",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-ingegneria-chimica-triennale-sg-n37", "Ingegneria-SanGiovanni", [
      { year: 2, corso: "SG_N37", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_N37", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Ingegneria Dell'automazione",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-ingegneria-dell-automazione", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N39", anno2: ["GEN_FG1A-BUL|2", "GEN_FG2BUM-DOT|2", "GEN_FG3DOU-MAM|2", "GEN_FG4MAN-RIC|2", "GEN_FG5RID-Z|2", "2SEM_FG1 - A-DIP|2", "2SEM_FG2 - DIQ-I|2", "2SEM_FG3 - J-NIS|2", "2SEM_FG4 - NIT-Z|2"] },
      { year: 3, corso: "N39", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea in Ingegneria Elettrica",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-in-ingegneria-elettrica", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N42", anno2: ["ENR|2", "EVS|2"] },
      { year: 3, corso: "N42", anno2: ["ENR|3", "EVS|3"] },
    ], false),
  },
  {
    programme: "Corso di Laurea Magistrale in Ingegneria Edile-architettura",
    sources: degreeSources(BASE, ANNO, "corso-di-laurea-magistrale-in-ingegneria-edile-architettura", "Ingegneria-Fuorigrotta", [
      { year: 5, corso: "N52", anno2: ["GEN|5"] },
    ], false),
  },
  {
    programme: "Culture Digitali e della Comunicazione",
    sources: degreeSources(BASE, ANNO, "culture-digitali-e-della-comunicazione", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "D83", anno2: ["GEN_CS|1", "GEN_SG|1"] },
      { year: 2, corso: "D27", anno2: ["GEN_CS|2", "GEN_SG|2"] },
      { year: 3, corso: "D27", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Data Science",
    sources: degreeSources(BASE, ANNO, "data-science", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D03", anno2: ["DAM|1", "FSC|1", "ITE|1", "ISY|1"] },
      { year: 2, corso: "D03", anno2: ["GEN_DS|2"] },
    ], false),
  },
  {
    programme: "Design for the Built Environment",
    sources: degreeSources(BASE, ANNO, "design-for-the-built-environment", "CollegiodiArchitettura", [
      { year: 1, corso: "DB1", anno2: ["CDD|1", "CED|1"] },
    ], false),
  },
  {
    programme: "Design per L'ambiente Costruito",
    sources: degreeSources(BASE, ANNO, "design-per-l-ambiente-costruito", "CollegiodiArchitettura", [
      { year: 2, corso: "P10", anno2: ["CDD|2", "CED|2"] },
    ], false),
  },
  {
    programme: "Design per la Comunita'",
    sources: degreeSources(BASE, ANNO, "design-per-la-comunita", "CollegiodiArchitettura", [
      { year: 1, corso: "DB0", anno2: ["GEN|1"] },
      { year: 2, corso: "P42", anno2: ["GEN|2"] },
      { year: 3, corso: "P42", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Digital Society, Social Innovation and Global Citizenship",
    sources: degreeSources(BASE, ANNO, "digital-society-social-innovation-and-global-citizenship", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "DA2", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Fisica Lt",
    sources: degreeSources(BASE, ANNO, "fisica-lt", "CollegiodiScienze", [
      { year: 1, corso: "DC6", anno2: ["GEN_A-G|1", "GEN_H-Z|1"] },
      { year: 2, corso: "N85", anno2: ["GEN_A-G|2", "GEN_H-Z|2"] },
      { year: 3, corso: "N85", anno2: ["GEN_A-G|3", "GEN_H-Z|3"] },
    ], false),
  },
  {
    programme: "Industrial Bioengineering",
    sources: degreeSources(BASE, ANNO, "industrial-bioengineering", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD3", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Industrial Chemistry for Circular and Bio Economy",
    sources: degreeSources(BASE, ANNO, "industrial-chemistry-for-circular-and-bio-economy", "CollegiodiScienze", [
      { year: 1, corso: "DG8", anno2: ["PAI|1", "PAL|1"] },
    ], false),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE5", anno2: ["GEN|1"] },
      { year: 2, corso: "N97", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "CollegiodiScienze", [
      { year: 1, corso: "DE1", anno2: ["C1_A-DE|1", "C2_DF-M|1", "C3_N-Z|1", "GEN|1"] },
      { year: 2, corso: "N86", anno2: ["C1_A-G|2", "C2_H-Z|2", "GEN|2"] },
      { year: 3, corso: "N86", anno2: ["GEN|3", "GEN_FGA-G|3", "GEN_FGH-Z|3", "MSA_H-Z|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Aerospaziale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF5", anno2: ["GEN|1"] },
      { year: 2, corso: "M53", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Aerospaziale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DF0", anno2: ["GEN_SG1A-DIL|1", "GEN_SG2DIM-NES|1", "GEN_SG3NET-Z|1"] },
      { year: 2, corso: "SG_N35", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_N35", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Aerospaziale (triennale) (DF0)",
    sources: degreeSources(BASE, ANNO, "ingegneria-aerospaziale-triennale-df0", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF0", anno2: ["GEN_FG1A-DAO|1", "GEN_FG2DAP-IER|1", "GEN_FG3IES-PIS|1", "GEN_FG4PIT-Z|1"] },
      { year: 2, corso: "N35", anno2: ["GEN_FG1A-I|2", "GEN_FG2J-Z|2"] },
      { year: 3, corso: "N35", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Biomedica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D92", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_P46", anno2: ["GEN_SG1A-FIL|2", "GEN_SG2FIM-Z|2"] },
      { year: 3, corso: "SG_P46", anno2: ["GEN|3", "GEN_SF_L8|3", "GEN_SF_L9|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Biomedica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D92", anno2: ["GEN_FG1 A-DOT|1", "GEN_FG2 DOU-Z|1"] },
      { year: 2, corso: "M54", anno2: ["GEN|2", "BIOROB_BIONICA|2", "ING_CLINICA|2", "SALUTE_DIG|2", "DISP_MEDICI|2", "ING_NEUROSCIENZE|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Biomedica (triennale) (D97)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-triennale-d97", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D97", anno2: ["GEN|1", "BIOROB_BIONICA|1", "ING_CLINICA|1", "SALUTE_DIG|1", "DISP_MEDICI|1", "ING_NEUROSCIENZE|1"] },
      { year: 2, corso: "P46", anno2: ["GEN|2", "GEN_FG1_A_ESP|2", "GEN_FG2_ESQ_I|2", "GEN_FG3_J_Z|2"] },
      { year: 3, corso: "P46", anno2: ["GEN|3", "GEN_FG1_L8|3", "GEN_FG1_L8 A-I|3", "GEN_FG1_L9|3", "GEN_FG2_L8_J-Z|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-magistrale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DD1", anno2: ["GEN|1"] },
      { year: 2, corso: "M55", anno2: ["PRO|2", "CPE|2", "CSE|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Chimica (magistrale) (DD1)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-magistrale-dd1", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD1", anno2: ["GEN_FG1A-I|1", "GEN_FG2J-Z|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Chimica (magistrale) (DD4)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-magistrale-dd4", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD4", anno2: ["PRO|1", "CPE|1", "CSE|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D62", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_D12", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_D12", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile D12",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-d12", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "D12", anno2: ["GEN|2"] },
      { year: 3, corso: "D12", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile D62",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-d62", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D62", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile per L'idraulica e i Trasporti D14",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-per-l-idraulica-e-i-trasporti-d14", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "D14", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile per L'idraulica e i Trasporti Dd6",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-per-l-idraulica-e-i-trasporti-dd6", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD6", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria dei Materiali",
    sources: degreeSources(BASE, ANNO, "ingegneria-dei-materiali", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D11", anno2: ["GEN|1"] },
      { year: 2, corso: "D11", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria dei Materiali e Biomateriali (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-dei-materiali-e-biomateriali-magistrale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DD2", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria dei Materiali e Biomateriali (magistrale) (DD2)",
    sources: degreeSources(BASE, ANNO, "ingegneria-dei-materiali-e-biomateriali-magistrale-dd2", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD2", anno2: ["GEN_FG1A-I|1", "GEN_FG2J-Z|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Dell'automazione e Robotica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-automazione-e-robotica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE6", anno2: ["GEN|1"] },
      { year: 2, corso: "P38", anno2: ["ADCONTR|2", "ADROB|2", "GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Dell'automazione e Robotica (magistrale) (SG_DE2)",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-automazione-e-robotica-magistrale-sg-de2", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DE2", anno2: ["GEN_SG1A-I|1", "GEN_SG2J-Z|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Dell'automazione e Robotica (magistrale) (DE2)",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-automazione-e-robotica-magistrale-de2", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE2", anno2: ["GEN_FG1A-DIL|1", "GEN_FG2DIM-NES|1", "GEN_FG3NET-Z|1"] },
    ], false),
  },
  {
    programme: "Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-telecomunicazioni-e-dei-media-digitali-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D65", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_P39", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria delle Telecomunicazioni e dei Media Digitali (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-telecomunicazioni-e-dei-media-digitali-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D65", anno2: ["GEN|1"] },
      { year: 2, corso: "P39", anno2: ["GEN|2"] },
      { year: 3, corso: "P39", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale) (DE7)",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-telecomunicazioni-e-dei-media-digitali-magistrale-de7", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE7", anno2: ["COM_NET_5G|1", "GEN|1", "MULTIMEDIA|1", "SEF_SEC|1"] },
      { year: 2, corso: "P49", anno2: ["COM_NET_5G|2", "GEN|2", "MULTIMEDIA|2", "SEF_SEC|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N51", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-triennale", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N41", anno2: ["GEN|2"] },
      { year: 3, corso: "N41", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile (triennale) (SG_N41)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-triennale-sg-n41", "Ingegneria-SanGiovanni", [
      { year: 2, corso: "SG_N41", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_N41", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile per la Sostenibilità (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-per-la-sostenibilita-magistrale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DD5", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile per la Sostenibilità (magistrale) (DD5)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-per-la-sostenibilita-magistrale-dd5", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD5", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile per la Sostenibilità (magistrale) (DD8)",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-per-la-sostenibilita-magistrale-dd8", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD8", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile-architettura De0",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura-de0", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE0", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile-architettura P71",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura-p71", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "P71", anno2: ["GEN|2"] },
      { year: 3, corso: "P71", anno2: ["GEN|3"] },
      { year: 4, corso: "P71", anno2: ["GEN|4"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettrica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D15", anno2: ["GEN|1"] },
      { year: 2, corso: "D15", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettrica (magistrale) (SG_DE4)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica-magistrale-sg-de4", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DE4", anno2: ["ENR|1", "EVS|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettrica (magistrale) (DE4)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica-magistrale-de4", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE4", anno2: ["ENR|1", "EVS|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D66", anno2: ["GEN|1"] },
      { year: 2, corso: "N43", anno2: ["GEN|2"] },
      { year: 3, corso: "N43", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica (triennale) (D66)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-triennale-d66", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D66", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_N43", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_N43", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE8", anno2: ["GEN|1", "EP|1", "SD|1", "SO-RF|1"] },
      { year: 2, corso: "M61", anno2: ["GEN|2", "EP|2", "SD|2", "SO-RF|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF6", anno2: ["GEN_FGA-I|1", "GEN_FGJ-Z|1"] },
      { year: 2, corso: "M62", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DF1", anno2: ["GEN_SG1A-I|1", "GEN_SG2J-Z|1"] },
      { year: 2, corso: "SG_D16", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_D16", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale (triennale) (DF1)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale-df1", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF1", anno2: ["GEN_FG1A-DAO|1", "GEN_FG2DAP-IER|1", "GEN_FG3IES-PIS|1", "GEN_FG4PIT-Z|1"] },
      { year: 2, corso: "D16", anno2: ["GEN_FG1A-I|2", "GEN_FG2J-Z|2"] },
      { year: 3, corso: "D16", anno2: ["GEN|3", "GEN_FG1A-I|3", "GEN_FG2J-Z|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale delle Costruzioni",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-delle-costruzioni", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D63", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_D13", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale delle Costruzioni D13",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-delle-costruzioni-d13", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "D13", anno2: ["GEN|2"] },
      { year: 3, corso: "D13", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale delle Costruzioni D63",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-delle-costruzioni-d63", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D63", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE9", anno2: ["GEN|1"] },
      { year: 2, corso: "M63", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DE3", anno2: ["GEN_SG1 A-I|1", "GEN_SG2 J-Z|1"] },
      { year: 2, corso: "SG_N46", anno2: ["GEN_SG1 A-FIL|2", "GEN_SG2 FIM-I|2", "GEN_SG3 J-Z|2"] },
      { year: 3, corso: "SG_N46", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Informatica (triennale) (DE3)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale-de3", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DE3", anno2: ["GEN_FG1A-DIL|1", "GEN_FG2DIM-NES|1", "GEN_FG3NET-Z|1"] },
      { year: 2, corso: "N46", anno2: ["GEN_FG1A-BUL|2", "GEN_FG2BUM-DOT|2", "GEN_FG3DOU-MAM|2", "GEN_FG4MAN-RIC|2", "GEN_FG5RID-Z|2", "2SEM_FG1_A-DIP|2", "2SEM_FG2_DIQ-I|2", "2SEM_FG4_NIT-Z|2", "2SEM_FG3_J-NIS|2"] },
      { year: 3, corso: "N46", anno2: ["GEN_FG1A-I|3", "GEN_FG2J-Z|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DF2", anno2: ["GEN_SG1A-DIL|1", "GEN_SG2DIM-NES|1", "GEN_SG3NET-Z|1"] },
      { year: 2, corso: "SG_P72", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_P72", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Meccanica (triennale) (DF2)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale-df2", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF2", anno2: ["GEN_FG1A-DAO|1", "GEN_FG2DAP-IER|1", "GEN_FG3IES-PIS|1", "GEN_FG4PIT-Z|1"] },
      { year: 2, corso: "P72", anno2: ["GEN_FG1A-I|2", "GEN_FG2J-Z|2"] },
      { year: 3, corso: "P72", anno2: ["GEN_FG1A-I|3", "GEN_FG2J-Z|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Meccanica per L'energia e L'ambiente",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-per-l-energia-e-l-ambiente", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D20", anno2: ["GEN_FGA-I|1", "GEN_FGJ-Z|1"] },
      { year: 2, corso: "D20", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Meccanica per la Progettazione e la Produzione",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-per-la-progettazione-e-la-produzione", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D19", anno2: ["GRL|1", "MCF|1", "SDE|1"] },
      { year: 2, corso: "D19", anno2: ["GRL|2", "MCF|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Navale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-triennale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DF3", anno2: ["GEN|1"] },
      { year: 2, corso: "D17", anno2: ["GEN|2"] },
      { year: 3, corso: "D17", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Navale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-magistrale", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_DF3", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Navale (magistrale) (D21)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-magistrale-d21", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D21", anno2: ["GEN|1"] },
      { year: 2, corso: "D21", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D64", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_P70", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_P70", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio D64",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio-d64", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D64", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio Dd9",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio-dd9", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD9", anno2: ["DIG|1", "ENA|1", "ENV|1", "AMB|1"] },
    ], false),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio M67",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio-m67", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "M67", anno2: ["DIG|2", "ENA|2", "AMB|2"] },
    ], false),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio P70",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio-p70", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "P70", anno2: ["GEN|2"] },
      { year: 3, corso: "P70", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ingegneria Strutturale e Geotecnica D28",
    sources: degreeSources(BASE, ANNO, "ingegneria-strutturale-e-geotecnica-d28", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "D28", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Strutturale e Geotecnica D86",
    sources: degreeSources(BASE, ANNO, "ingegneria-strutturale-e-geotecnica-d86", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D86", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Innovazione Sociale",
    sources: degreeSources(BASE, ANNO, "innovazione-sociale", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "DL5", anno2: ["GEN|1"] },
      { year: 2, corso: "P45", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Marine Biology and Aquaculture",
    sources: degreeSources(BASE, ANNO, "marine-biology-and-aquaculture", "CollegiodiScienze", [
      { year: 2, corso: "P59", anno2: ["AGM|2", "CMB|2"] },
    ], false),
  },
  {
    programme: "Matematica",
    sources: degreeSources(BASE, ANNO, "matematica", "CollegiodiScienze", [
      { year: 1, corso: "D70", anno2: ["MAP|1", "DID|1", "MGE|1"] },
      { year: 2, corso: "P62", anno2: ["MAP|2", "DID|2", "MGE|2"] },
    ], false),
  },
  {
    programme: "Matematica Lt",
    sources: degreeSources(BASE, ANNO, "matematica-lt", "CollegiodiScienze", [
      { year: 1, corso: "DF7", anno2: ["GEN_A-I|1", "GEN_J-Z|1"] },
      { year: 2, corso: "N87", anno2: ["GEN_A-I|2", "GEN_J-Z|2"] },
      { year: 3, corso: "N87", anno2: ["A31|3", "A32|3"] },
    ], false),
  },
  {
    programme: "Meccatronica",
    sources: degreeSources(BASE, ANNO, "meccatronica", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D36", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_D36", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_D36", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Ottica e Optometria",
    sources: degreeSources(BASE, ANNO, "ottica-e-optometria", "CollegiodiScienze", [
      { year: 1, corso: "DC7", anno2: ["GEN|1"] },
      { year: 2, corso: "M44", anno2: ["GEN|2"] },
      { year: 3, corso: "M44", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Pianificazione Territoriale, Urbanistica e Paesaggistico-ambientale",
    sources: degreeSources(BASE, ANNO, "pianificazione-territoriale-urbanistica-e-paesaggistico-ambientale", "CollegiodiArchitettura", [
      { year: 1, corso: "DB3", anno2: ["PNA|1", "PUA|1"] },
      { year: 2, corso: "N20", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Quantum Science and Engineering",
    sources: degreeSources(BASE, ANNO, "quantum-science-and-engineering", "CollegiodiScienze", [
      { year: 1, corso: "P65", anno2: ["GEN|1"] },
      { year: 2, corso: "P65", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Scienza e Ingegneria dei Materiali",
    sources: degreeSources(BASE, ANNO, "scienza-e-ingegneria-dei-materiali", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "N50", anno2: ["GEN|2"] },
      { year: 3, corso: "N50", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "CollegiodiScienze", [
      { year: 1, corso: "D55", anno2: ["BDN|1", "BIA|1"] },
      { year: 2, corso: "N99", anno2: ["BDN|2", "BIA|2", "BSC|2", "NEU|2"] },
    ], false),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "CollegiodiScienze", [
      { year: 1, corso: "DG7", anno2: ["CHS|1", "SCH|1"] },
    ], false),
  },
  {
    programme: "Scienze Dell'architettura",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura", "CollegiodiArchitettura", [
      { year: 1, corso: "DB6", anno2: ["GEN|1"] },
      { year: 2, corso: "D05", anno2: ["GEN|2"] },
      { year: 3, corso: "D05", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Scienze e Tecnologie della Chimica Industriale",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-della-chimica-industriale", "CollegiodiScienze", [
      { year: 1, corso: "D75", anno2: ["FIN|1", "PPT|1", "SCP|1"] },
      { year: 2, corso: "M04", anno2: ["FIN|2", "PPT|2", "SCP|2"] },
    ], false),
  },
  {
    programme: "Scienze Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-naturali", "CollegiodiScienze", [
      { year: 1, corso: "D56", anno2: ["CGC|1", "GPN|1"] },
      { year: 2, corso: "M05", anno2: ["CGC|2", "GPN|2"] },
    ], false),
  },
  {
    programme: "Scienze per la Natura e per L'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-per-la-natura-e-per-l-ambiente", "CollegiodiScienze", [
      { year: 1, corso: "D51", anno2: ["A-L|1", "M-Z|1"] },
      { year: 2, corso: "P29", anno2: ["GEA|2", "MDB|2"] },
      { year: 3, corso: "P29", anno2: ["GEA|3", "CSN|3"] },
    ], false),
  },
  {
    programme: "Sociologia",
    sources: degreeSources(BASE, ANNO, "sociologia", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "D98", anno2: ["GEN_AL|1", "GEN_MZ|1"] },
      { year: 2, corso: "M13", anno2: ["GEN|2"] },
      { year: 3, corso: "M13", anno2: ["CTI|3", "MTR|3"] },
    ], false),
  },
  {
    programme: "Sociologia Digitale e Analisi del Web",
    sources: degreeSources(BASE, ANNO, "sociologia-digitale-e-analisi-del-web", "DipartimentodiScienzeSociali", [
      { year: 1, corso: "D85", anno2: ["GEN|1"] },
      { year: 2, corso: "D49", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Sviluppo Sostenibile e Reti Territoriali",
    sources: degreeSources(BASE, ANNO, "sviluppo-sostenibile-e-reti-territoriali", "CollegiodiArchitettura", [
      { year: 2, corso: "P40", anno2: ["GEN|2"] },
      { year: 3, corso: "P40", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Tecnologie Digitali per le Costruzioni (triennale)",
    sources: degreeSources(BASE, ANNO, "tecnologie-digitali-per-le-costruzioni-triennale", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "D35", anno2: ["GEN|1"] },
      { year: 2, corso: "D35", anno2: ["GEN|2"] },
      { year: 3, corso: "D35", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Tecnologie Digitali per le Costruzioni (triennale) (SG_D35)",
    sources: degreeSources(BASE, ANNO, "tecnologie-digitali-per-le-costruzioni-triennale-sg-d35", "Ingegneria-SanGiovanni", [
      { year: 1, corso: "SG_D35", anno2: ["GEN|1"] },
      { year: 2, corso: "SG_D35", anno2: ["GEN|2"] },
      { year: 3, corso: "SG_D35", anno2: ["GEN|3"] },
    ], false),
  },
  {
    programme: "Transportation Engineering and Mobility D42",
    sources: degreeSources(BASE, ANNO, "transportation-engineering-and-mobility-d42", "Ingegneria-Fuorigrotta", [
      { year: 2, corso: "D42", anno2: ["GEN|2"] },
    ], false),
  },
  {
    programme: "Transportation Engineering and Mobility Dd7",
    sources: degreeSources(BASE, ANNO, "transportation-engineering-and-mobility-dd7", "Ingegneria-Fuorigrotta", [
      { year: 1, corso: "DD7", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Urbanistica Sostenibile",
    sources: degreeSources(BASE, ANNO, "urbanistica-sostenibile", "CollegiodiArchitettura", [
      { year: 1, corso: "DA9", anno2: ["GEN|1"] },
    ], false),
  },
];

export const unina: UniversityPreset = {
  id: "unina-informatica",
  name: "Università degli Studi di Napoli Federico II",
  shortName: "Federico II",
  city: "Napoli",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
