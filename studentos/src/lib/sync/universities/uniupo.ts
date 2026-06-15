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
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Amministrazione, Professione e Persone",
    sources: degreeSources(BASE, ANNO, "amministrazione-professione-e-persone", "Novara", [
      { year: 1, corso: "A123", anno2: ["A008|1", "A007|1", "A009|1"] },
      { year: 2, corso: "A078", anno2: ["A008|2", "A007|2", "A009|2"] },
    ]),
  },
  {
    programme: "Amministrazione, Servizi e Territorio",
    sources: degreeSources(BASE, ANNO, "amministrazione-servizi-e-territorio", "Alessandria", [
      { year: 1, corso: "A126", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Biologia - Alessandria",
    sources: degreeSources(BASE, ANNO, "biologia-alessandria", "Alessandria", [
      { year: 1, corso: "A120", anno2: ["A15|1", "A16|1", "A034|1"] },
      { year: 2, corso: "1981_ALESSANDRIA", anno2: ["A15|2", "A16|2", "A17|2"] },
    ]),
  },
  {
    programme: "Biologia - Vercelli",
    sources: degreeSources(BASE, ANNO, "biologia-vercelli", "Vercelli", [
      { year: 2, corso: "1981_VERCELLI", anno2: ["A15|2", "A16|2", "A17|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "Novara", [
      { year: 1, corso: "A130", anno2: ["A003|1", "A002|1", "A029|1"] },
      { year: 2, corso: "9415", anno2: ["A003|2", "A002|2"] },
      { year: 3, corso: "9415", anno2: ["A003|3", "A002|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche", "Novara", [
      { year: 1, corso: "A115", anno2: ["000|1"] },
      { year: 2, corso: "A057", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "Alessandria", [
      { year: 1, corso: "A135", anno2: ["000|1"] },
      { year: 2, corso: "1930", anno2: ["000|2"] },
      { year: 3, corso: "1930", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "Novara", [
      { year: 1, corso: "A125", anno2: ["000|1"] },
      { year: 2, corso: "A094", anno2: ["000|2"] },
      { year: 3, corso: "A094", anno2: ["000|3"] },
      { year: 4, corso: "A094", anno2: ["000|4"] },
      { year: 5, corso: "A094", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Chimica Verde",
    sources: degreeSources(BASE, ANNO, "chimica-verde", "Vercelli", [
      { year: 1, corso: "A112", anno2: ["A001|1"] },
      { year: 2, corso: "A066", anno2: ["A001|2"] },
      { year: 3, corso: "A066", anno2: ["A001|3"] },
    ]),
  },
  {
    programme: "Economia Aziendale - Alessandria (triennale)",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-alessandria-triennale", "Alessandria", [
      { year: 1, corso: "1420_ALESSANDRIA", anno2: ["000|1"] },
      { year: 2, corso: "1420_ALESSANDRIA", anno2: ["000|2"] },
      { year: 3, corso: "1420_ALESSANDRIA", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Economia Aziendale - Alessandria (magistrale)",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-alessandria-magistrale", "Alessandria", [
      { year: 1, corso: "A140", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Economia Aziendale - Novara",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-novara", "Novara", [
      { year: 1, corso: "A139", anno2: ["000_A-K|1", "000_L-Z|1"] },
      { year: 2, corso: "1420_NOVARA", anno2: ["000_A-K|2", "000_L-Z|2"] },
      { year: 3, corso: "1420_NOVARA", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "Alessandria", [
      { year: 1, corso: "A122", anno2: ["A28|1", "A30|1", "A29|1"] },
      { year: 2, corso: "A095", anno2: ["A28|2", "A30|2", "A29|2"] },
    ]),
  },
  {
    programme: "Economia, Management e Istituzioni",
    sources: degreeSources(BASE, ANNO, "economia-management-e-istituzioni", "Alessandria", [
      { year: 2, corso: "A005", anno2: ["426|2", "420|2"] },
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
    programme: "European Master of Science in Skin Health and Care",
    sources: degreeSources(BASE, ANNO, "european-master-of-science-in-skin-health-and-care", "", [
      { year: 1, corso: "A102", anno2: ["A24|1", "A25|1"] },
      { year: 2, corso: "A102", anno2: ["A24|2", "A25|2"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "Novara", [
      { year: 1, corso: "A124", anno2: ["000|1"] },
      { year: 2, corso: "A093", anno2: ["000|2"] },
      { year: 3, corso: "A093", anno2: ["000|3"] },
      { year: 4, corso: "A093", anno2: ["000|4"] },
      { year: 5, corso: "A093", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Filologia e Patrimonio Culturale",
    sources: degreeSources(BASE, ANNO, "filologia-e-patrimonio-culturale", "Vercelli", [
      { year: 1, corso: "A159", anno2: ["A032|1", "A031|1", "A033|1"] },
    ]),
  },
  {
    programme: "Filologia Moderna, Classica e Comparata - Vercelli",
    sources: degreeSources(BASE, ANNO, "filologia-moderna-classica-e-comparata-vercelli", "Vercelli", [
      { year: 2, corso: "1779_VERCELLI", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Filosofia e Comunicazione",
    sources: degreeSources(BASE, ANNO, "filosofia-e-comunicazione", "Vercelli", [
      { year: 1, corso: "A164", anno2: ["000|1"] },
      { year: 2, corso: "1724", anno2: ["000|2"] },
      { year: 3, corso: "1724", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Filosofia, Politica e Studi Culturali - Vercelli",
    sources: degreeSources(BASE, ANNO, "filosofia-politica-e-studi-culturali-vercelli", "Vercelli", [
      { year: 1, corso: "A163", anno2: ["000|1"] },
      { year: 2, corso: "A065_VERCELLI", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Fisica Applicata",
    sources: degreeSources(BASE, ANNO, "fisica-applicata", "Vercelli", [
      { year: 1, corso: "A113", anno2: ["000|1"] },
      { year: 2, corso: "A096", anno2: ["000|2"] },
      { year: 3, corso: "A096", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Alessandria",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-alessandria", "Alessandria", [
      { year: 1, corso: "A158", anno2: ["000|1"] },
      { year: 2, corso: "1846_ALESSANDRIA", anno2: ["PDS-AL|2"] },
      { year: 3, corso: "1846_ALESSANDRIA", anno2: ["PDS-AL|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Fossano",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-fossano", "Fossano", [
      { year: 1, corso: "A157", anno2: ["000|1"] },
      { year: 2, corso: "1846_FOSSANO", anno2: ["PDS-FO|2"] },
      { year: 3, corso: "1846_FOSSANO", anno2: ["PDS-FO|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Novara",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-novara", "Novara", [
      { year: 1, corso: "1846", anno2: ["000|1"] },
      { year: 2, corso: "1846_NOVARA", anno2: ["PDS-NO|2"] },
      { year: 3, corso: "1846_NOVARA", anno2: ["PDS-NO|3"] },
    ]),
  },
  {
    programme: "Food Health and Environment",
    sources: degreeSources(BASE, ANNO, "food-health-and-environment", "Vercelli", [
      { year: 1, corso: "A133", anno2: ["000|1"] },
      { year: 2, corso: "A041", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Gestione Ambientale e Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "gestione-ambientale-e-sviluppo-sostenibile", "Vercelli", [
      { year: 1, corso: "A114", anno2: ["A001|1"] },
      { year: 2, corso: "A064", anno2: ["A001|2"] },
      { year: 3, corso: "A064", anno2: ["A001|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza (triennale)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-triennale", "Novara", [
      { year: 1, corso: "A119", anno2: ["000|1"] },
      { year: 2, corso: "A076", anno2: ["000|2"] },
      { year: 3, corso: "A076", anno2: ["000|3"] },
      { year: 4, corso: "A076", anno2: ["000|4"] },
    ]),
  },
  {
    programme: "Giurisprudenza (triennale) (A165)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-triennale-a165", "Alessandria", [
      { year: 1, corso: "A165", anno2: ["A001|1"] },
      { year: 2, corso: "1602", anno2: ["A001|2"] },
      { year: 3, corso: "1602", anno2: ["A001|3"] },
      { year: 4, corso: "1602", anno2: ["A001|4"] },
    ]),
  },
  {
    programme: "Giurisprudenza - Alessandria",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-alessandria", "Alessandria", [
      { year: 5, corso: "1602_ALESSANDRIA", anno2: ["000|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza - Novara",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-novara", "Novara", [
      { year: 5, corso: "1602_NOVARA", anno2: ["000|5"] },
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
      { year: 2, corso: "1843_ALBA", anno2: ["PDS-ALBA|2"] },
      { year: 3, corso: "1843_ALBA", anno2: ["PDS-ALBA|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Alessandria",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-alessandria", "Alessandria", [
      { year: 1, corso: "A153", anno2: ["000|1"] },
      { year: 2, corso: "1843_ALESSANDRIA", anno2: ["PDS-AL|2"] },
      { year: 3, corso: "1843_ALESSANDRIA", anno2: ["PDS-AL|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Biella",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-biella", "Biella", [
      { year: 1, corso: "A154", anno2: ["000|1"] },
      { year: 2, corso: "1843_BIELLA", anno2: ["PDS-BI|2"] },
      { year: 3, corso: "1843_BIELLA", anno2: ["PDS-BI|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Novara",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-novara", "Novara", [
      { year: 1, corso: "1843", anno2: ["000|1"] },
      { year: 2, corso: "1843_NOVARA", anno2: ["PDS-NO|2"] },
      { year: 3, corso: "1843_NOVARA", anno2: ["PDS-NO|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Verbania",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-verbania", "Verbania", [
      { year: 1, corso: "A155", anno2: ["000|1"] },
      { year: 2, corso: "1843_VERBANIA", anno2: ["PDS-VB|2"] },
      { year: 3, corso: "1843_VERBANIA", anno2: ["PDS-VB|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Vercelli",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-vercelli", "Vercelli", [
      { year: 1, corso: "A156", anno2: ["000|1"] },
      { year: 2, corso: "1843_VERCELLI", anno2: ["PDS-VC|2"] },
      { year: 3, corso: "1843_VERCELLI", anno2: ["PDS-VC|3"] },
    ]),
  },
  {
    programme: "Informatica - Alessandria",
    sources: degreeSources(BASE, ANNO, "informatica-alessandria", "Alessandria", [
      { year: 1, corso: "A132", anno2: ["000|1"] },
      { year: 2, corso: "1932_ALESSANDRIA", anno2: ["000|2"] },
      { year: 3, corso: "1932_ALESSANDRIA", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Informatica - Vercelli",
    sources: degreeSources(BASE, ANNO, "informatica-vercelli", "Vercelli", [
      { year: 1, corso: "A149", anno2: ["000|1"] },
      { year: 2, corso: "1932_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1932_VERCELLI", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale e Innovazione Digitale - Alessandria",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-e-innovazione-digitale-alessandria", "Alessandria", [
      { year: 1, corso: "A116_ALESSANDRIA", anno2: ["A014|1", "A015|1", "A016|1", "A013|1"] },
      { year: 2, corso: "A071_ALESSANDRIA", anno2: ["A016|2", "A013|2"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale e Innovazione Digitale - Vercelli",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-e-innovazione-digitale-vercelli", "Vercelli", [
      { year: 1, corso: "A116_VERCELLI", anno2: ["A014|1", "A015|1", "A016|1", "A013|1"] },
      { year: 2, corso: "A071_VERCELLI", anno2: ["A014|2", "A015|2", "A016|2", "A013|2"] },
    ]),
  },
  {
    programme: "Lettere - Vercelli",
    sources: degreeSources(BASE, ANNO, "lettere-vercelli", "Vercelli", [
      { year: 1, corso: "A160", anno2: ["000|1"] },
      { year: 2, corso: "1722_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1722_VERCELLI", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Lingue Straniere Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-straniere-moderne", "Vercelli", [
      { year: 1, corso: "A161", anno2: ["000|1"] },
      { year: 2, corso: "1723", anno2: ["000|2"] },
      { year: 3, corso: "1723", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Lingue, Culture, Turismo",
    sources: degreeSources(BASE, ANNO, "lingue-culture-turismo", "Vercelli", [
      { year: 1, corso: "A162", anno2: ["000|1"] },
      { year: 2, corso: "A002", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Management e Finanza",
    sources: degreeSources(BASE, ANNO, "management-e-finanza", "Novara", [
      { year: 2, corso: "1407", anno2: ["A19|2", "A18|2"] },
    ]),
  },
  {
    programme: "Management, Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "management-economia-e-finanza", "Novara", [
      { year: 1, corso: "A150", anno2: ["A030|1", "A19|1", "A18|1"] },
    ]),
  },
  {
    programme: "Medical Biotechnology",
    sources: degreeSources(BASE, ANNO, "medical-biotechnology", "Novara", [
      { year: 1, corso: "A121", anno2: ["A010|1", "A028|1", "A006|1", "A005|1"] },
      { year: 2, corso: "A004", anno2: ["A010|2", "A006|2", "A005|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia - Alessandria",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-alessandria", "Alessandria", [
      { year: 1, corso: "A141", anno2: ["000|1"] },
      { year: 2, corso: "1804_ALESSANDRIA", anno2: ["000|2"] },
      { year: 3, corso: "1804_ALESSANDRIA", anno2: ["000|3"] },
      { year: 4, corso: "1804_ALESSANDRIA", anno2: ["000|4"] },
      { year: 5, corso: "1804_ALESSANDRIA", anno2: ["000|5"] },
      { year: 6, corso: "1804_ALESSANDRIA", anno2: ["000|6"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia - Novara",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-novara", "Novara", [
      { year: 1, corso: "A131", anno2: ["000|1"] },
      { year: 2, corso: "1804_NOVARA", anno2: ["000|2"] },
      { year: 3, corso: "1804_NOVARA", anno2: ["000|3"] },
      { year: 4, corso: "1804_NOVARA", anno2: ["000|4"] },
      { year: 5, corso: "1804_NOVARA", anno2: ["000|5"] },
      { year: 6, corso: "1804_NOVARA", anno2: ["000|6"] },
    ]),
  },
  {
    programme: "Progettazione e Management del Turismo",
    sources: degreeSources(BASE, ANNO, "progettazione-e-management-del-turismo", "Novara", [
      { year: 1, corso: "A151", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Promozione e Gestione del Turismo",
    sources: degreeSources(BASE, ANNO, "promozione-e-gestione-del-turismo", "Novara", [
      { year: 2, corso: "1422", anno2: ["000|2"] },
      { year: 3, corso: "1422", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche - Alessandria",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-alessandria", "Alessandria", [
      { year: 1, corso: "A111", anno2: ["000|1"] },
      { year: 2, corso: "1929_ALESSANDRIA", anno2: ["000|2"] },
      { year: 3, corso: "1929_ALESSANDRIA", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche - Vercelli",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-vercelli", "Vercelli", [
      { year: 1, corso: "A137", anno2: ["000|1"] },
      { year: 2, corso: "1929_VERCELLI", anno2: ["000|2"] },
      { year: 3, corso: "1929_VERCELLI", anno2: ["000|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "Alessandria", [
      { year: 1, corso: "A134", anno2: ["A025|1", "A024|1", "A023|1"] },
      { year: 2, corso: "1982", anno2: ["A025|2", "A024|2", "A023|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "Novara", [
      { year: 1, corso: "1806", anno2: ["000|1"] },
      { year: 2, corso: "1806", anno2: ["000|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche e Dell'amministrazione",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-dell-amministrazione", "Alessandria", [
      { year: 1, corso: "A117", anno2: ["A001|1"] },
      { year: 2, corso: "A079", anno2: ["A001|2"] },
      { year: 3, corso: "A079", anno2: ["A020|3", "A021|3", "A022|3"] },
    ]),
  },
  {
    programme: "Scienze Politiche, Economiche, Sociali e Dell'amministrazione",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-economiche-sociali-e-dell-amministrazione", "Alessandria", [
      { year: 3, corso: "2025", anno2: ["A09|3", "A10|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro Medicina e Chirurgia - Alessandria",
    sources: degreeSources(BASE, ANNO, "semestre-filtro-medicina-e-chirurgia-alessandria", "Alessandria", [
      { year: 1, corso: "A166_AL", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Semestre Filtro Medicina e Chirurgia - Novara",
    sources: degreeSources(BASE, ANNO, "semestre-filtro-medicina-e-chirurgia-novara", "Novara", [
      { year: 1, corso: "A166_NO", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "Asti", [
      { year: 1, corso: "A118_ASTI", anno2: ["000|1"] },
      { year: 2, corso: "2024_ASTI", anno2: ["000|2"] },
      { year: 3, corso: "2024_ASTI", anno2: ["000|3"] },
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
