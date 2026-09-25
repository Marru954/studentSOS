/**
 * Preset: Università del Piemonte Orientale — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _uniupo_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://upoplanner.uniupo.it/timetable";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Amministrazione, Professione e Persone",
    sources: degreeSources(BASE, ANNO, "amministrazione-professione-e-persone", "Novara", [
      { year: 1, corso: "A123", anno2: ["A008|1", "A007|1", "A009|1"] },
      { year: 2, corso: "A123", anno2: ["A008|2", "A007|2", "A009|2"] },
    ]),
  },
  {
    programme: "Biologia - Vercelli",
    sources: degreeSources(BASE, ANNO, "biologia-vercelli", "Vercelli", [
      { year: 1, corso: "A120_VERCELLI", anno2: ["A15|1", "A16|1", "A034|1"] },
      { year: 2, corso: "A120_VERCELLI", anno2: ["A15|2", "A16|2", "A034|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "Novara", [
      { year: 1, corso: "A130", anno2: ["A003|1", "A002|1", "A029|1"] },
      { year: 2, corso: "A130", anno2: ["A003|2", "A002|2", "A029|2"] },
      { year: 3, corso: "9415", anno2: ["A003|3", "A002|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche", "Novara", [
      { year: 1, corso: "A115", anno2: ["000|1"] },
      { year: 2, corso: "A115", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "Alessandria", [
      { year: 1, corso: "A135", anno2: ["000|1"] },
      { year: 2, corso: "A135", anno2: ["000|2"] },
      { year: 3, corso: "1930", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "Novara", [
      { year: 3, corso: "A094", anno2: ["A3|3"] },
      { year: 4, corso: "A094", anno2: ["A4|4"] },
      { year: 5, corso: "1505", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Chimica Verde",
    sources: degreeSources(BASE, ANNO, "chimica-verde", "Vercelli", [
      { year: 1, corso: "A112", anno2: ["A001|1"] },
      { year: 2, corso: "A112", anno2: ["A001|2"] },
      { year: 3, corso: "A066", anno2: ["A001|3"] },
    ]),
  },
  {
    programme: "Economia Aziendale - Alessandria (magistrale)",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-alessandria-magistrale", "Alessandria", [
      { year: 1, corso: "A140", anno2: ["000|1"] },
      { year: 2, corso: "A140", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Economia Aziendale - Novara",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-novara", "Novara", [
      { year: 1, corso: "A139", anno2: ["000|1"] },
      { year: 2, corso: "A139", anno2: ["000|2"] },
      { year: 3, corso: "1420_1", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "Alessandria", [
      { year: 1, corso: "A122", anno2: ["A28|1", "A30|1", "A29|1"] },
      { year: 2, corso: "A122", anno2: ["A28|2", "A30|2", "A29|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale)",
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "Alessandria", [
      { year: 1, corso: "A077", anno2: ["A001|1"] },
      { year: 2, corso: "A077", anno2: ["A001|2"] },
      { year: 3, corso: "A077", anno2: ["A001|3"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "Novara", [
      { year: 3, corso: "A093", anno2: ["3A|3"] },
      { year: 4, corso: "A093", anno2: ["4A|4"] },
      { year: 5, corso: "1506", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Filologia e Patrimonio Culturale",
    sources: degreeSources(BASE, ANNO, "filologia-e-patrimonio-culturale", "Vercelli", [
      { year: 1, corso: "A159", anno2: ["A032|1", "A031|1", "A033|1"] },
      { year: 2, corso: "A159", anno2: ["A032|2", "A031|2", "A033|2"] },
    ]),
  },
  {
    programme: "Filosofia e Comunicazione",
    sources: degreeSources(BASE, ANNO, "filosofia-e-comunicazione", "Vercelli", [
      { year: 1, corso: "A164", anno2: ["000|1"] },
      { year: 2, corso: "A164", anno2: ["000|2"] },
      { year: 3, corso: "1724", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Filosofia, Politica e Studi Culturali - Vercelli",
    sources: degreeSources(BASE, ANNO, "filosofia-politica-e-studi-culturali-vercelli", "Vercelli", [
      { year: 1, corso: "A163_VERCELLI", anno2: ["000|1"] },
      { year: 2, corso: "A163_VERCELLI", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Fisica Applicata",
    sources: degreeSources(BASE, ANNO, "fisica-applicata", "Vercelli", [
      { year: 1, corso: "A113", anno2: ["000|1"] },
      { year: 2, corso: "A113", anno2: ["000|2"] },
      { year: 3, corso: "A096", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Alessandria",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-alessandria", "Alessandria", [
      { year: 1, corso: "A158", anno2: ["000|1"] },
      { year: 2, corso: "A158", anno2: ["000|2"] },
      { year: 3, corso: "1846_2", anno2: ["PDS-AL|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Novara",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-novara", "Novara", [
      { year: 1, corso: "1846_1", anno2: ["PDS-NO|1"] },
      { year: 2, corso: "1846_1", anno2: ["PDS-NO|2"] },
      { year: 3, corso: "1846_1", anno2: ["PDS-NO|3"] },
    ]),
  },
  {
    programme: "Food Health and Environment",
    sources: degreeSources(BASE, ANNO, "food-health-and-environment", "Vercelli", [
      { year: 1, corso: "A133", anno2: ["000|1"] },
      { year: 2, corso: "A133", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Gestione Ambientale e Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "gestione-ambientale-e-sviluppo-sostenibile", "Vercelli", [
      { year: 1, corso: "A114", anno2: ["A002|1", "A003|1"] },
      { year: 2, corso: "A114", anno2: ["A001|2"] },
      { year: 3, corso: "A064", anno2: ["A001|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza (triennale)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-triennale", "Novara", [
      { year: 3, corso: "A076", anno2: ["000|3"] },
      { year: 4, corso: "A076", anno2: ["000|4"] },
      { year: 5, corso: "A076", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza (triennale) (A165)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-triennale-a165", "Alessandria", [
      { year: 1, corso: "A165", anno2: ["A001|1"] },
      { year: 2, corso: "A165", anno2: ["A001|2"] },
      { year: 3, corso: "1602", anno2: ["A001|3"] },
      { year: 4, corso: "1602", anno2: ["A001|4"] },
      { year: 5, corso: "1602", anno2: ["A001|5"] },
    ]),
  },
  {
    programme: "Igiene Dentale (abilitante alla Professione Sanitaria di Igienista Dentale)",
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale", "Novara", [
      { year: 1, corso: "1847", anno2: ["000|1"] },
      { year: 2, corso: "1847", anno2: ["000|2"] },
      { year: 3, corso: "1847", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Alba",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-alba", "Alba", [
      { year: 1, corso: "A152", anno2: ["000|1"] },
      { year: 2, corso: "A152", anno2: ["000|2"] },
      { year: 3, corso: "1843_7", anno2: ["PDS-ALBA|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Alessandria",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-alessandria", "Alessandria", [
      { year: 1, corso: "A153", anno2: ["000|1"] },
      { year: 2, corso: "A153", anno2: ["000|2"] },
      { year: 3, corso: "1843_2", anno2: ["PDS-AL|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Biella",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-biella", "Biella", [
      { year: 1, corso: "A154", anno2: ["000|1"] },
      { year: 2, corso: "A154", anno2: ["000|2"] },
      { year: 3, corso: "1843_8", anno2: ["PDS-BI|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Novara",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-novara", "Novara", [
      { year: 1, corso: "1843_1", anno2: ["PDS-NO|1"] },
      { year: 2, corso: "1843_1", anno2: ["PDS-NO|2"] },
      { year: 3, corso: "1843_1", anno2: ["PDS-NO|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Verbania",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-verbania", "Verbania", [
      { year: 1, corso: "A155", anno2: ["000|1"] },
      { year: 2, corso: "A155", anno2: ["000|2"] },
      { year: 3, corso: "1843_6", anno2: ["PDS-VB|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Vercelli",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-vercelli", "Vercelli", [
      { year: 1, corso: "A156", anno2: ["000|1"] },
      { year: 2, corso: "A156", anno2: ["000|2"] },
      { year: 3, corso: "1843_3", anno2: ["PDS-VC|3"] },
    ]),
  },
  {
    programme: "Informatica - Alessandria",
    sources: degreeSources(BASE, ANNO, "informatica-alessandria", "Alessandria", [
      { year: 3, corso: "1932_2", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Informatica - Vercelli",
    sources: degreeSources(BASE, ANNO, "informatica-vercelli", "Vercelli", [
      { year: 1, corso: "A149_VERCELLI", anno2: ["000|1"] },
      { year: 2, corso: "A149_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1932_3", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale e Innovazione Digitale - Alessandria",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-e-innovazione-digitale-alessandria", "Alessandria", [
      { year: 1, corso: "A116_2", anno2: ["A014|1", "A015|1", "A016|1", "A013|1"] },
      { year: 2, corso: "A116_2", anno2: ["A016|2", "A013|2"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale e Innovazione Digitale - Vercelli",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-e-innovazione-digitale-vercelli", "Vercelli", [
      { year: 1, corso: "A116_3", anno2: ["A014|1", "A015|1", "A016|1", "A013|1"] },
      { year: 2, corso: "A116_3", anno2: ["A014|2", "A015|2"] },
    ]),
  },
  {
    programme: "Lettere - Vercelli",
    sources: degreeSources(BASE, ANNO, "lettere-vercelli", "Vercelli", [
      { year: 1, corso: "A160_VERCELLI", anno2: ["000|1"] },
      { year: 2, corso: "A160_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1722_VERCELLI", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Lingue Straniere Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-straniere-moderne", "Vercelli", [
      { year: 1, corso: "A161", anno2: ["000|1"] },
      { year: 2, corso: "A161", anno2: ["000|2"] },
      { year: 3, corso: "1723", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Lingue, Culture, Turismo",
    sources: degreeSources(BASE, ANNO, "lingue-culture-turismo", "Vercelli", [
      { year: 1, corso: "A162", anno2: ["000|1"] },
      { year: 2, corso: "A162", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Management, Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "management-economia-e-finanza", "Novara", [
      { year: 1, corso: "A150", anno2: ["A031|1", "A032|1", "A18|1"] },
      { year: 2, corso: "A150", anno2: ["A030|2", "A031|2", "A032|2", "A19|2", "A18|2"] },
    ]),
  },
  {
    programme: "Medical Biotechnology",
    sources: degreeSources(BASE, ANNO, "medical-biotechnology", "Novara", [
      { year: 1, corso: "A121", anno2: ["A010|1", "A028|1", "A006|1", "A005|1"] },
      { year: 2, corso: "A121", anno2: ["A010|2", "A028|2", "A006|2", "A005|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia - Alessandria",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-alessandria", "Alessandria", [
      { year: 3, corso: "1804_2", anno2: ["000|3"] },
      { year: 4, corso: "1804_2", anno2: ["000|4"] },
      { year: 5, corso: "1804_2", anno2: ["000|5"] },
      { year: 6, corso: "1804_2", anno2: ["000|6"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia - Novara",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-novara", "Novara", [
      { year: 3, corso: "1804_1", anno2: ["000|3"] },
      { year: 4, corso: "1804_1", anno2: ["000|4"] },
      { year: 5, corso: "1804_1", anno2: ["000|5"] },
      { year: 6, corso: "1804_1", anno2: ["000|6"] },
    ]),
  },
  {
    programme: "Progettazione e Management del Turismo",
    sources: degreeSources(BASE, ANNO, "progettazione-e-management-del-turismo", "Novara", [
      { year: 1, corso: "A151", anno2: ["000|1"] },
      { year: 2, corso: "A151", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Promozione e Gestione del Turismo",
    sources: degreeSources(BASE, ANNO, "promozione-e-gestione-del-turismo", "Novara", [
      { year: 3, corso: "1422", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche - Alessandria",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-alessandria", "Alessandria", [
      { year: 3, corso: "1929_2", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche - Vercelli",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-vercelli", "Vercelli", [
      { year: 1, corso: "A137_VERCELLI", anno2: ["000|1"] },
      { year: 2, corso: "A137_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1929_3", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "Alessandria", [
      { year: 1, corso: "A134", anno2: ["A025|1", "A024|1", "A023|1"] },
      { year: 2, corso: "A134", anno2: ["A025|2", "A024|2", "A023|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "Novara", [
      { year: 2, corso: "1806", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche e Dell'amministrazione",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-dell-amministrazione", "Alessandria", [
      { year: 1, corso: "A117", anno2: ["A001|1"] },
      { year: 2, corso: "A117", anno2: ["A001|2"] },
      { year: 3, corso: "A079", anno2: ["A020|3", "A021|3", "A022|3"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "Asti", [
      { year: 1, corso: "A118", anno2: ["000|1"] },
      { year: 2, corso: "A118", anno2: ["000|2"] },
      { year: 3, corso: "2024", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "Novara", [
      { year: 1, corso: "1849", anno2: ["000|1"] },
      { year: 2, corso: "1849", anno2: ["000|2"] },
      { year: 3, corso: "1849", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "Novara", [
      { year: 1, corso: "1848", anno2: ["000|1"] },
      { year: 2, corso: "1848", anno2: ["000|2"] },
      { year: 3, corso: "1848", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Amministrazione, Servizi e Territorio - Alessandria",
    sources: degreeSources(BASE, ANNO, "amministrazione-servizi-e-territorio-alessandria", "Alessandria", [
      { year: 1, corso: "A126_2", anno2: ["000|1"] },
      { year: 2, corso: "A126_2", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Amministrazione, Servizi e Territorio - Asti",
    sources: degreeSources(BASE, ANNO, "amministrazione-servizi-e-territorio-asti", "Asti", [
      { year: 2, corso: "A126_5", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "Alessandria", [
      { year: 1, corso: "A120", anno2: ["A15|1", "A16|1", "A034|1"] },
      { year: 2, corso: "A120", anno2: ["A15|2", "A16|2", "A034|2"] },
    ], false),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche - Primo e",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-primo-e", "Novara", [
      { year: 1, corso: "A125", anno2: ["000|1"] },
      { year: 2, corso: "A125", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Disaster And Health Crisis Management",
    sources: degreeSources(BASE, ANNO, "disaster-and-health-crisis-management", "Vercelli", [
      { year: 1, corso: "A103", anno2: ["000|1"] },
      { year: 2, corso: "A103", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Farmacia - Primo e",
    sources: degreeSources(BASE, ANNO, "farmacia-primo-e", "Novara", [
      { year: 1, corso: "A124", anno2: ["000|1"] },
      { year: 2, corso: "A124", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Giurisprudenza - 1 e",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-1-e", "Novara", [
      { year: 1, corso: "A119", anno2: ["000|1"] },
      { year: 2, corso: "A119", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "Alessandria", [
      { year: 1, corso: "A132", anno2: ["000|1"] },
      { year: 2, corso: "A132", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Management For Sustainability",
    sources: degreeSources(BASE, ANNO, "management-for-sustainability", "Vercelli", [
      { year: 1, corso: "A168", anno2: ["000|1"] },
    ], false),
  },
  {
    programme: "Medicina e Chirurgia - Alessandria - Primo e",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-alessandria-primo-e", "Alessandria", [
      { year: 1, corso: "A141", anno2: ["000|1"] },
      { year: 2, corso: "A141", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Medicina e Chirurgia - Novara - Primo e",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-novara-primo-e", "Novara", [
      { year: 1, corso: "A131", anno2: ["000|1"] },
      { year: 2, corso: "A131", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "Alessandria", [
      { year: 1, corso: "A111", anno2: ["000|1"] },
      { year: 2, corso: "A111", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche - Profilo Infermieristico",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche-profilo-infermieristico", "Novara", [
      { year: 1, corso: "A172", anno2: ["000|1"] },
    ], false),
  },
  {
    programme: "Scienze Infermieristiche Specialistiche Nelle Cure Intensive e Nell'emergenza",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-specialistiche-nelle-cure-intensive-e-nell-emergenza", "Novara", [
      { year: 1, corso: "A173", anno2: ["000|1"] },
    ], false),
  },
  {
    programme: "Scienze Infermieristiche Specialistiche Nelle Cure Primarie e Infermieristica di Famiglia e Comunità",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-specialistiche-nelle-cure-primarie-e-infermieristica-di-famiglia-e-comunita", "Novara", [
      { year: 1, corso: "A174", anno2: ["000|1"] },
    ], false),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "", [
      { year: 1, corso: "A166", anno2: ["000|1"] },
    ], false),
  },
];

export const uniupo: UniversityPreset = {
  id: "uniupo-informatica",
  name: "Università del Piemonte Orientale",
  shortName: "Piemonte Orientale",
  city: "Vercelli",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
