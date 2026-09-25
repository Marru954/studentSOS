/**
 * Preset: Università degli Studi di Salerno — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unisa_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easycourse.unisa.it/AgendaStudenti";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Archeologia e Culture Antiche",
    sources: degreeSources(BASE, ANNO, "archeologia-e-culture-antiche", "", [
      { year: 1, corso: "SP223", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP223", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "", [
      { year: 3, corso: "07604", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "07604", anno2: ["PDS0-2023|4"] },
      { year: 5, corso: "07604", anno2: ["PDS0-2023|5"] },
    ]),
  },
  {
    programme: "Consulenza e Management Aziendale",
    sources: degreeSources(BASE, ANNO, "consulenza-e-management-aziendale", "", [
      { year: 1, corso: "SA221", anno2: ["PDS0-2026|1", "SA221P0003|1", "SA221P0002|1", "SA221P0006|1", "SA221P0001|1"] },
      { year: 2, corso: "SA221", anno2: ["SA221P0003|2", "SA221P0006|2", "SA221P0001|2", "SA221P0004|2"] },
    ]),
  },
  {
    programme: "Corporate Communication, Marketing Innovation e Media Digitali",
    sources: degreeSources(BASE, ANNO, "corporate-communication-marketing-innovation-e-media-digitali", "", [
      { year: 1, corso: "SC231", anno2: ["PDS0-2026|1", "SC231P0003|1", "SC231P0004|1"] },
      { year: 2, corso: "SC231", anno2: ["PDS0-2025|2", "SC231P0003|2", "SC231P0004|2"] },
    ]),
  },
  {
    programme: "Data Science e Gestione Dell'innovazione",
    sources: degreeSources(BASE, ANNO, "data-science-e-gestione-dell-innovazione", "", [
      { year: 1, corso: "SA228", anno2: ["SA228P0002|1", "SA228P0003|1"] },
      { year: 2, corso: "SA228", anno2: ["PDS0-2025|2", "SA228P0002|2", "SA228P0003|2"] },
    ]),
  },
  {
    programme: "Digital Marketing",
    sources: degreeSources(BASE, ANNO, "digital-marketing", "", [
      { year: 1, corso: "SC232", anno2: ["PDS0-2026|1", "SC232P0001|1", "SC232P0002|1"] },
      { year: 2, corso: "SC232", anno2: ["PDS0-2024|2", "SC232P0001|2", "SC232P0002|2"] },
    ]),
  },
  {
    programme: "Discipline delle Arti Visive, della Musica e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "discipline-delle-arti-visive-della-musica-e-dello-spettacolo", "", [
      { year: 1, corso: "SP124", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP124", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "43124", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Economia",
    sources: degreeSources(BASE, ANNO, "economia", "", [
      { year: 1, corso: "SE222", anno2: ["SE222P0003|1", "SE222P0001|1", "SE222P0005|1", "SE222P0006|1", "PDS0-2026|1"] },
      { year: 2, corso: "SE222", anno2: ["SE222P0003|2", "SE222P0001|2", "SE222P0002|2", "SE222P0004|2"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "", [
      { year: 1, corso: "SA127", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SA127", anno2: ["SA127P0002|2", "PDS0-2025|2", "SA127P0009|2", "SA127P0005|2", "SA127P0010|2"] },
      { year: 3, corso: "02127", anno2: ["02127P0002|3", "02127P0009|3", "02127P0005|3", "02127P0010|3"] },
    ]),
  },
  {
    programme: "Electrical Engineering for Digital Energy",
    sources: degreeSources(BASE, ANNO, "electrical-engineering-for-digital-energy", "", [
      { year: 1, corso: "IE233", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IE233", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Farmaceutica e Nutraceutica Animale",
    sources: degreeSources(BASE, ANNO, "farmaceutica-e-nutraceutica-animale", "", [
      { year: 1, corso: "FR123", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR123", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "07123", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "", [
      { year: 3, corso: "07603", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "07603", anno2: ["PDS0-2023|4"] },
      { year: 5, corso: "07603", anno2: ["PDS0-2023|5"] },
    ]),
  },
  {
    programme: "Filologia Moderna",
    sources: degreeSources(BASE, ANNO, "filologia-moderna", "", [
      { year: 1, corso: "TU221", anno2: ["TU221P0001|1", "TU221P0002|1"] },
      { year: 2, corso: "TU221", anno2: ["TU221P0001|2", "TU221P0002|2"] },
    ]),
  },
  {
    programme: "Filologia, Letterature e Storia Dell'antichità",
    sources: degreeSources(BASE, ANNO, "filologia-letterature-e-storia-dell-antichita", "", [
      { year: 1, corso: "TU222", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TU222", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Filosofia (magistrale)",
    sources: degreeSources(BASE, ANNO, "filosofia-magistrale", "", [
      { year: 1, corso: "SP226", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP226", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Filosofia (triennale)",
    sources: degreeSources(BASE, ANNO, "filosofia-triennale", "", [
      { year: 1, corso: "SP125", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP125", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "03125", anno2: ["PDS0-2021|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "", [
      { year: 1, corso: "FS126", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FS126", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "", [
      { year: 1, corso: "FS226", anno2: ["PDS0-2026|1", "PDS0-2026_|1"] },
      { year: 2, corso: "FS226", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "05126", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Gestione e Valorizzazione degli Archivi e delle Biblioteche",
    sources: degreeSources(BASE, ANNO, "gestione-e-valorizzazione-degli-archivi-e-delle-biblioteche", "", [
      { year: 1, corso: "SP220", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP220", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette",
    sources: degreeSources(BASE, ANNO, "gestione-e-valorizzazione-delle-risorse-agrarie-e-delle-aree-protette", "", [
      { year: 1, corso: "FR122", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR122", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "07122", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "", [
      { year: 1, corso: "SG601", anno2: ["R0|1", "R1|1", "R2|1"] },
      { year: 2, corso: "SG601", anno2: ["R0|2", "R1|2", "R2|2"] },
      { year: 3, corso: "SG601", anno2: ["R0|3", "R1|3", "R2|3"] },
      { year: 4, corso: "SG601", anno2: ["R0|4", "R1|4", "R2|4"] },
      { year: 5, corso: "SG601", anno2: ["DISPARI|5", "PARI|5", "R0|5", "R1|5", "R2|5"] },
    ]),
  },
  {
    programme: "Giurista D'impresa e delle Nuove Tecnologie",
    sources: degreeSources(BASE, ANNO, "giurista-d-impresa-e-delle-nuove-tecnologie", "", [
      { year: 1, corso: "SG121", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SG121", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "01121", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "", [
      { year: 1, corso: "NF121", anno2: ["PDS0-2026-A-C|1", "PDS0-2026-D-G|1", "PDS0-2026-H-PET|1", "PDS0-2026-PEU-Z|1"] },
      { year: 2, corso: "NF121", anno2: ["PDS0-2025-Resto 0|2", "PDS0-2025-Resto 1|2", "PDS0-2025-Resto 2|2"] },
      { year: 3, corso: "05121", anno2: ["PDS0-2017-Resto 0|3", "PDS0-2017- Resto 1|3", "PDS0-2017- Resto 2|3"] },
    ]),
  },
  {
    programme: "Information Engineering for Digital Medicine",
    sources: degreeSources(BASE, ANNO, "information-engineering-for-digital-medicine", "", [
      { year: 1, corso: "IE232", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IE232", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria Alimentare",
    sources: degreeSources(BASE, ANNO, "ingegneria-alimentare", "", [
      { year: 1, corso: "II228", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II228", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-magistrale", "", [
      { year: 1, corso: "II122", anno2: ["II122P0002|1", "II122P0001|1"] },
      { year: 2, corso: "II122", anno2: ["PDS0-2025|2", "II122P0002|2", "II122P0001|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-triennale", "", [
      { year: 1, corso: "II222", anno2: ["II222P0001|1", "II222P0002|1"] },
      { year: 2, corso: "II222", anno2: ["PDS0-2025|2", "II222P0001|2", "II222P0002|2"] },
      { year: 3, corso: "06122", anno2: ["PDS0-2024|3", "06122P0002|3", "06122P0001|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-triennale", "", [
      { year: 1, corso: "IC121", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IC121", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "06121", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-magistrale", "", [
      { year: 1, corso: "IC221", anno2: ["PDS0-2026|1", "IC221P0005|1", "IC221P0006|1", "IC221P0004|1"] },
      { year: 2, corso: "IC221", anno2: ["PDS0-2025|2", "IC221P0005|2", "IC221P0006|2", "IC221P0004|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile per L'ambiente ed il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-per-l-ambiente-ed-il-territorio", "", [
      { year: 1, corso: "IC125", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IC125", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "06125", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Dell'informazione per la Medicina Digitale",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-informazione-per-la-medicina-digitale", "", [
      { year: 1, corso: "IE128", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IE128", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "06128", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Edile-architettura",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura", "", [
      { year: 3, corso: "06601", anno2: ["PDS0-2017|3"] },
      { year: 4, corso: "06601", anno2: ["PDS0-2017|4"] },
      { year: 5, corso: "06601", anno2: ["PDS0-2017|5"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-triennale", "", [
      { year: 1, corso: "II124", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II124", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "06124", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-magistrale", "", [
      { year: 1, corso: "II224", anno2: ["PDS0-2026|1", "II224P0002|1", "II224P0001|1"] },
      { year: 2, corso: "II224", anno2: ["PDS0-2025|2", "II224P0002|2", "II224P0001|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-magistrale", "", [
      { year: 1, corso: "II226", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II226", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale", "", [
      { year: 1, corso: "II126", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II126", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "06126", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "", [
      { year: 1, corso: "IE127", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IE127", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "", [
      { year: 1, corso: "IE227", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IE227", anno2: ["IE227P0016|2", "PDS0-2025|2", "IE227P0019|2", "IE227P0015|2", "IE227P0017|2"] },
      { year: 3, corso: "06127", anno2: ["PDS0-2022|3", "06127P0007|3", "06127P0005|3", "06127P0006|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "", [
      { year: 1, corso: "II223", anno2: ["II223P0002|1", "II223P0004|1", "II223P0003|1", "II223P0001|1"] },
      { year: 2, corso: "II223", anno2: ["PDS0-2025|2", "II223P0002|2", "II223P0004|2", "II223P0003|2", "II223P0001|2"] },
      { year: 3, corso: "06123", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-magistrale", "", [
      { year: 1, corso: "II123", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II123", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'ambiente ed il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-ed-il-territorio", "", [
      { year: 1, corso: "IC225", anno2: ["IC225P0004|1", "IC225P0003|1"] },
      { year: 2, corso: "IC225", anno2: ["PDS0-2025|2", "IC225P0004|2", "IC225P0003|2"] },
    ]),
  },
  {
    programme: "Innovazioni per le Produzioni Agrarie Mediterranee",
    sources: degreeSources(BASE, ANNO, "innovazioni-per-le-produzioni-agrarie-mediterranee", "", [
      { year: 1, corso: "FR222", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR222", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "", [
      { year: 1, corso: "TU126", anno2: ["TU126P0001|1", "TU126P0002|1"] },
      { year: 2, corso: "TU126", anno2: ["TU126P0001|2", "TU126P0002|2"] },
      { year: 3, corso: "03126", anno2: ["03126P001|3", "03126P002|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere", "", [
      { year: 1, corso: "TU122", anno2: ["TU122P0001|1", "TU122P0002|1"] },
      { year: 2, corso: "TU122", anno2: ["TU122P0001|2", "TU122P0002|2"] },
      { year: 3, corso: "43122", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne", "", [
      { year: 1, corso: "TU241", anno2: ["TU241P0001|1", "TU241P0004|1", "TU241P0005|1", "TU241P0003|1"] },
      { year: 2, corso: "TU241", anno2: ["TU241P0001|2", "TU241P0004|2", "TU241P0005|2", "TU241P0003|2"] },
    ]),
  },
  {
    programme: "Linguistica e Didattica Dell'italiano nel Contesto Internazionale",
    sources: degreeSources(BASE, ANNO, "linguistica-e-didattica-dell-italiano-nel-contesto-internazionale", "", [
      { year: 1, corso: "TU240", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TU240", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Management dei Sistemi Turistici per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "management-dei-sistemi-turistici-per-lo-sviluppo-sostenibile", "", [
      { year: 1, corso: "SC228", anno2: ["PDS0-2025|1", "PDS0-2026|1"] },
      { year: 2, corso: "SC228", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "", [
      { year: 1, corso: "MT123", anno2: ["DISPARI|1", "PARI|1"] },
      { year: 2, corso: "MT123", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "", [
      { year: 1, corso: "MT222", anno2: ["MT222P0002|1", "MT222P0001|1"] },
      { year: 2, corso: "MT222", anno2: ["MT222P0002|2", "MT222P0001|2"] },
      { year: 3, corso: "05123", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Nanotechnology and Physics for Sustainability",
    sources: degreeSources(BASE, ANNO, "nanotechnology-and-physics-for-sustainability", "", [
      { year: 1, corso: "FS227", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FS227", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Organizzazione, Valutazione e Supervisione dei Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "organizzazione-valutazione-e-supervisione-dei-servizi-sociali", "", [
      { year: 1, corso: "TP230", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TP230", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Politiche Territoriali e Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "politiche-territoriali-e-cooperazione-internazionale", "", [
      { year: 1, corso: "SC226", anno2: ["SC226P0001|1", "SC226P0002|1"] },
      { year: 2, corso: "SC226", anno2: ["PDS0-2025|2", "SC226P0001|2", "SC226P0002|2"] },
    ]),
  },
  {
    programme: "Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi",
    sources: degreeSources(BASE, ANNO, "psicologia-dell-intervento-nei-contesti-clinici-sportivi-e-formativi", "", [
      { year: 1, corso: "SU225", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SU225", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Scienze dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "scienze-dei-beni-culturali", "", [
      { year: 1, corso: "SP128", anno2: ["SP128P0001|1", "SP128P0002|1", "SP128P0004|1"] },
      { year: 2, corso: "SP128", anno2: ["SP128P0001|2", "SP128P0002|2", "SP128P0004|2"] },
      { year: 3, corso: "03128", anno2: ["03128P0001|3", "03128P0002|3", "03128P0004|3"] },
    ]),
  },
  {
    programme: "Scienze del Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "scienze-del-servizio-sociale", "", [
      { year: 1, corso: "TP129", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TP129", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "03129", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-triennale", "", [
      { year: 3, corso: "44124", anno2: ["44124P0004|3", "44124P0003|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-magistrale", "", [
      { year: 1, corso: "SU124", anno2: ["SU124P0004|1", "SU124P0003|1"] },
      { year: 2, corso: "SU124", anno2: ["SU124P0004|2", "SU124P0003|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione Permanente e della Formazione Continua",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-permanente-e-della-formazione-continua", "", [
      { year: 1, corso: "SU224", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SU224", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "", [
      { year: 1, corso: "SC122", anno2: ["PDS0-2026|1", "SC122P0011|1", "SC122P0009|1", "SC122P0001|1"] },
      { year: 2, corso: "SC122", anno2: ["PDS0-2025|2", "SC122P0011|2", "SC122P0009|2", "SC122P0001|2"] },
      { year: 3, corso: "03122", anno2: ["PDS0-2019|3", "03122P0011|3", "03122P0009|3", "03122P0010|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "", [
      { year: 1, corso: "44610", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "44610", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "44610", anno2: ["PDS0-2016|3"] },
      { year: 4, corso: "44610", anno2: ["PDS0-2016|4"] },
      { year: 5, corso: "44610", anno2: ["PDS0-2016|5"] },
    ]),
  },
  {
    programme: "Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili",
    sources: degreeSources(BASE, ANNO, "scienze-della-valutazione-motorio-sportiva-e-tecniche-di-analisi-e-progettazione-dello-sport-per-disabili", "", [
      { year: 1, corso: "SU222", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SU222", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-delle-attivita-motorie-sportive-e-dell-educazione-psicomotoria-triennale", "", [
      { year: 3, corso: "44125", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-delle-attivita-motorie-sportive-e-dell-educazione-psicomotoria-magistrale", "", [
      { year: 1, corso: "SU125", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SU125", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Scienze dello Spettacolo e della Produzione Multimediale",
    sources: degreeSources(BASE, ANNO, "scienze-dello-spettacolo-e-della-produzione-multimediale", "", [
      { year: 1, corso: "SP222", anno2: ["SP222P0001|1", "SP222P0002|1"] },
      { year: 2, corso: "SP222", anno2: ["SP222P0001|2", "SP222P0002|2"] },
    ]),
  },
  {
    programme: "Scienze e Nanotecnologie per la Sostenibilità",
    sources: degreeSources(BASE, ANNO, "scienze-e-nanotecnologie-per-la-sostenibilita", "", [
      { year: 1, corso: "FS129", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FS129", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "05129", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche", "", [
      { year: 1, corso: "SU221", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SU221", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche e delle Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-delle-relazioni-internazionali", "", [
      { year: 1, corso: "SC121", anno2: ["PDS0-2026|1", "SC121P0007|1", "SC121P0005|1", "SC121P0001|1"] },
      { year: 2, corso: "SC121", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "12121", anno2: ["PDS0-2019|3", "12121P007|3", "12121P005|3", "12121P001|3"] },
    ]),
  },
  {
    programme: "Sicurezza Informatica e Tecnologie Cloud",
    sources: degreeSources(BASE, ANNO, "sicurezza-informatica-e-tecnologie-cloud", "", [
      { year: 1, corso: "NF227", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "NF227", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Smart Industry Engineering",
    sources: degreeSources(BASE, ANNO, "smart-industry-engineering", "", [
      { year: 1, corso: "II230", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "II230", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Sociologia",
    sources: degreeSources(BASE, ANNO, "sociologia", "", [
      { year: 1, corso: "TP123", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TP123", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "03123", anno2: ["PDS0-2019|3", "03123P0004|3", "03123P0003|3"] },
    ]),
  },
  {
    programme: "Sociologia del Cambiamento Ambientale e Digitale",
    sources: degreeSources(BASE, ANNO, "sociologia-del-cambiamento-ambientale-e-digitale", "", [
      { year: 1, corso: "TP229", anno2: ["TP229P0006|1", "PDS0-2026|1", "TP229P0005|1"] },
      { year: 2, corso: "TP229", anno2: ["TP229P0006|2", "PDS0-2025|2", "TP229P0005|2"] },
    ]),
  },
  {
    programme: "Storia e Critica D'arte",
    sources: degreeSources(BASE, ANNO, "storia-e-critica-d-arte", "", [
      { year: 1, corso: "SP224", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "SP224", anno2: ["PDS0-2025|2"] },
    ]),
  },
  {
    programme: "Tecniche Erboristiche",
    sources: degreeSources(BASE, ANNO, "tecniche-erboristiche", "", [
      { year: 1, corso: "FR121", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR121", anno2: ["PDS0-2025|2"] },
      { year: 3, corso: "07121", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Tecniche per L'edilizia e il Territorio",
    sources: degreeSources(BASE, ANNO, "tecniche-per-l-edilizia-e-il-territorio", "", [
      { year: 1, corso: "06129", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "06129", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "06129", anno2: ["PDS0-2023|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche - Anni 1 e 2",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-anni-1-e-2", "", [
      { year: 1, corso: "FR604", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR604", anno2: ["PDS0-2025|2"] },
    ], false),
  },
  {
    programme: "Farmacia - Anni 1 e 2",
    sources: degreeSources(BASE, ANNO, "farmacia-anni-1-e-2", "", [
      { year: 1, corso: "FR603", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "FR603", anno2: ["PDS0-2025|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Edile-architettura - Anni 1 e 2",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura-anni-1-e-2", "", [
      { year: 1, corso: "IC601", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "IC601", anno2: ["PDS0-2025|2"] },
    ], false),
  },
  {
    programme: "Management delle Attività Sportive e Motorie per il Benessere Sociale",
    sources: degreeSources(BASE, ANNO, "management-delle-attivita-sportive-e-motorie-per-il-benessere-sociale", "", [
      { year: 1, corso: "TP227", anno2: ["PDS0-2026|1"] },
      { year: 2, corso: "TP227", anno2: ["PDS0-2025|2"] },
    ], false),
  },
  {
    programme: "Marketing e Digital Business",
    sources: degreeSources(BASE, ANNO, "marketing-e-digital-business", "", [
      { year: 1, corso: "SC123", anno2: ["PDS0-2026|1"] },
    ], false),
  },
  {
    programme: "Science, Management And Politics in Global Health",
    sources: degreeSources(BASE, ANNO, "science-management-and-politics-in-global-health", "", [
      { year: 1, corso: "TP124", anno2: ["PDS0-2026|1"] },
    ], false),
  },
];

export const unisa: UniversityPreset = {
  id: "unisa-informatica",
  name: "Università degli Studi di Salerno",
  shortName: "Università di Salerno",
  city: "Salerno",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
