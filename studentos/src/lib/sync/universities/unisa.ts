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
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Archeologia e Culture Antiche",
    sources: degreeSources(BASE, ANNO, "archeologia-e-culture-antiche", "300398", [
      { year: 1, corso: "SP223", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03223", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "300389", [
      { year: 1, corso: "CB221", anno2: ["CB221P0001|1", "CB221P0002|1"] },
      { year: 2, corso: "05221", anno2: ["05221P0001|2", "05221P0002|2"] },
    ]),
  },
  {
    programme: "Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "chimica-magistrale", "300389", [
      { year: -1, corso: "CB124", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "CB124", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05223", anno2: ["05223P0001|2", "05223P0002|2"] },
    ]),
  },
  {
    programme: "Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "chimica-triennale", "300389", [
      { year: 1, corso: "CB223", anno2: ["CB223P0001|1", "CB223P0002|1"] },
      { year: 2, corso: "05124", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "05124", anno2: ["PDS0-2023|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "300390", [
      { year: 1, corso: "FR604", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07604", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "07604", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "07604", anno2: ["PDS0-2023|4"] },
      { year: 5, corso: "07604", anno2: ["PDS0-2023|5"] },
    ]),
  },
  {
    programme: "Consulenza e Management Aziendale",
    sources: degreeSources(BASE, ANNO, "consulenza-e-management-aziendale", "300639", [
      { year: 1, corso: "SA221", anno2: ["PDS0-2025|1", "SA221P0003|1", "SA221P0006|1", "SA221P0001|1", "SA221P0004|1"] },
      { year: 2, corso: "02221", anno2: ["02221P0003|2", "02221P0006|2", "02221P0001|2", "02221P0004|2"] },
    ]),
  },
  {
    programme: "Corporate Communication e Media",
    sources: degreeSources(BASE, ANNO, "corporate-communication-e-media", "300401", [
      { year: 2, corso: "03231", anno2: ["PDS0-2017|2", "03231P0002|2", "03231P0001|2"] },
    ]),
  },
  {
    programme: "Corporate Communication, Marketing Innovation e Media Digitali",
    sources: degreeSources(BASE, ANNO, "corporate-communication-marketing-innovation-e-media-digitali", "300401", [
      { year: 1, corso: "SC231", anno2: ["PDS0-2025|1", "SC231P0003|1", "SC231P0004|1"] },
    ]),
  },
  {
    programme: "Corso di Formazione per Infermieri di Famiglia O di Comunita'",
    sources: degreeSources(BASE, ANNO, "corso-di-formazione-per-infermieri-di-famiglia-o-di-comunita", "", [
      { year: 1, corso: "10P08", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Data Science e Gestione Dell'innovazione",
    sources: degreeSources(BASE, ANNO, "data-science-e-gestione-dell-innovazione", "300639", [
      { year: 1, corso: "SA228", anno2: ["SA228P0002|1", "SA228P0003|1"] },
      { year: 2, corso: "02228", anno2: ["PDS0-2022|2", "02228P0002|2", "02228P0003|2"] },
    ]),
  },
  {
    programme: "Digital Marketing",
    sources: degreeSources(BASE, ANNO, "digital-marketing", "300401", [
      { year: 1, corso: "SC232", anno2: ["PDS0-2024|1", "SC232P0001|1", "SC232P0002|1"] },
      { year: 2, corso: "03232", anno2: ["PDS0-2024|2", "03232P0001|2", "03232P0002|2"] },
    ]),
  },
  {
    programme: "Discipline delle Arti Visive, della Musica e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "discipline-delle-arti-visive-della-musica-e-dello-spettacolo", "300398", [
      { year: -1, corso: "SP124", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SP124", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "43124", anno2: ["PDS0-2020|2"] },
      { year: 3, corso: "43124", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Economia",
    sources: degreeSources(BASE, ANNO, "economia", "300399", [
      { year: 1, corso: "SE222", anno2: ["SE222P0003|1", "SE222P0001|1", "SE222P0002|1", "SE222P0004|1"] },
      { year: 2, corso: "02222", anno2: ["02222P0003|2", "02222P0001|2", "02222P0002|2", "02222P0004|2", "02222P0000|2"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "300399", [
      { year: 1, corso: "SE121", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "02121", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "02121", anno2: ["02121P0002|3", "02121P0003|3", "02121P0004|3"] },
    ]),
  },
  {
    programme: "Economia e Commercio",
    sources: degreeSources(BASE, ANNO, "economia-e-commercio", "300399", [
      { year: 1, corso: "SE124", anno2: ["SE124P0004|1", "SE124P0003|1"] },
      { year: 2, corso: "02124", anno2: ["02124P0004|2", "02124P0003|2", "02124Libera|2"] },
      { year: 3, corso: "02124", anno2: ["02124P0004|3", "02124P0003|3"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "300639", [
      { year: -1, corso: "SA127", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SA127", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "02127", anno2: ["02127P0002|2", "PDS0-2023|2", "02127P0009|2", "02127P0005|2", "02127P0010|2"] },
      { year: 3, corso: "02127", anno2: ["02127P0002|3", "02127P0009|3", "02127P0005|3", "02127P0010|3"] },
    ]),
  },
  {
    programme: "Economia Governo e Amministrazione",
    sources: degreeSources(BASE, ANNO, "economia-governo-e-amministrazione", "300399", [
      { year: 1, corso: "SE231", anno2: ["SE231P0001|1", "SE231P0002|1"] },
      { year: 2, corso: "02231", anno2: ["02231P0001|2", "02231P0002|2"] },
    ]),
  },
  {
    programme: "Electrical Engineering for Digital Energy",
    sources: degreeSources(BASE, ANNO, "electrical-engineering-for-digital-energy", "300638", [
      { year: 1, corso: "IE233", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06233", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Farmaceutica e Nutraceutica Animale",
    sources: degreeSources(BASE, ANNO, "farmaceutica-e-nutraceutica-animale", "300390", [
      { year: 1, corso: "FR123", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07123", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "07123", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "300390", [
      { year: 1, corso: "FR603", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07603", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "07603", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "07603", anno2: ["PDS0-2023|4"] },
      { year: 5, corso: "07603", anno2: ["PDS0-2023|5"] },
    ]),
  },
  {
    programme: "Filologia Moderna",
    sources: degreeSources(BASE, ANNO, "filologia-moderna", "300404", [
      { year: -1, corso: "03221", anno2: ["03221P0001|-1", "03221P0002|-1"] },
      { year: 1, corso: "TU221", anno2: ["TU221P0001|1", "TU221P0002|1"] },
      { year: 2, corso: "03221", anno2: ["PDS0-2019|2", "03221P0001|2", "03221P0002|2"] },
    ]),
  },
  {
    programme: "Filologia, Letterature e Storia Dell'antichità",
    sources: degreeSources(BASE, ANNO, "filologia-letterature-e-storia-dell-antichita", "300404", [
      { year: 1, corso: "TU222", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03222", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Filosofia (magistrale)",
    sources: degreeSources(BASE, ANNO, "filosofia-magistrale", "300398", [
      { year: -1, corso: "03226", anno2: ["PDS0-2021|-1"] },
      { year: 1, corso: "SP226", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03226", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Filosofia (triennale)",
    sources: degreeSources(BASE, ANNO, "filosofia-triennale", "300398", [
      { year: -1, corso: "SP125", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SP125", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03125", anno2: ["PDS0-2021|2"] },
      { year: 3, corso: "03125", anno2: ["PDS0-2021|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "300391", [
      { year: -1, corso: "FS126", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "FS126", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05226", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "300391", [
      { year: 1, corso: "FS226", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05126", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "05126", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-prof-sanit-di-fisioterapista", "300397", [
      { year: -1, corso: "10122", anno2: ["PDS0-2013|-1"] },
      { year: 1, corso: "10122", anno2: ["PDS0-2013|1"] },
      { year: 2, corso: "10122", anno2: ["PDS0-2013|2"] },
      { year: 3, corso: "10122", anno2: ["PDS0-2013|3"] },
    ]),
  },
  {
    programme: "Gestione e Valorizzazione degli Archivi e delle Biblioteche",
    sources: degreeSources(BASE, ANNO, "gestione-e-valorizzazione-degli-archivi-e-delle-biblioteche", "300398", [
      { year: -1, corso: "03220", anno2: ["PDS0-2020|-1"] },
      { year: 1, corso: "SP220", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03220", anno2: ["PDS0-2020|2"] },
    ]),
  },
  {
    programme: "Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette",
    sources: degreeSources(BASE, ANNO, "gestione-e-valorizzazione-delle-risorse-agrarie-e-delle-aree-protette", "300390", [
      { year: 1, corso: "FR122", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07122", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "07122", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "300400", [
      { year: 1, corso: "SG601", anno2: ["R0|1", "R1|1", "R2|1"] },
      { year: 2, corso: "SG601", anno2: ["R0|2", "R1|2", "R2|2"] },
      { year: 3, corso: "SG601", anno2: ["R0|3", "R1|3", "R2|3"] },
      { year: 4, corso: "SG601", anno2: ["R0|4", "R1|4", "R2|4"] },
      { year: 5, corso: "SG601", anno2: ["DISPARI|5", "PARI|5", "R0|5", "R1|5", "R2|5"] },
    ]),
  },
  {
    programme: "Giurista D'impresa e delle Nuove Tecnologie",
    sources: degreeSources(BASE, ANNO, "giurista-d-impresa-e-delle-nuove-tecnologie", "300400", [
      { year: 1, corso: "SG121", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "01121", anno2: ["PDS0-2020|2"] },
      { year: 3, corso: "01121", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Global Studies and Eu",
    sources: degreeSources(BASE, ANNO, "global-studies-and-eu", "300639", [
      { year: 1, corso: "SA225", anno2: ["SA225P0003|1", "SA225P0004|1"] },
      { year: 2, corso: "12225", anno2: ["PDS0-2018|2", "12225P0003|2", "12225P0004|2"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Prof. Sanit. di Infermiere)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-prof-sanit-di-infermiere", "300397", [
      { year: -1, corso: "10121", anno2: ["PDS0-2013|-1"] },
      { year: 1, corso: "10121", anno2: ["PDS0-2013|1"] },
      { year: 2, corso: "10121", anno2: ["PDS0-2013|2"] },
      { year: 3, corso: "10121", anno2: ["PDS0-2013|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Prof. Sanit. di Infermiere) - Replica - A.o.u. S.giovanni di Dio e Ruggi D'aragona - Salerno",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-prof-sanit-di-infermiere-replica-a-o-u-s-giovanni-di-dio-e-ruggi-d-aragona-salerno", "300397", [
      { year: -1, corso: "10127", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "10127", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-magistrale", "300392", [
      { year: 1, corso: "88601", anno2: ["PDS0-2023|1"] },
      { year: 2, corso: "88601", anno2: ["88601-01|2", "88601-02|2"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "300392", [
      { year: 1, corso: "NF121", anno2: ["PDS0-2025-A-C|1", "PDS0-2025-D-G|1", "PDS0-2025-H-PET|1", "PDS0-2025-PEU-Z|1"] },
      { year: 2, corso: "05121", anno2: ["PDS0-2017- 0|2", "PDS0-2017- 1|2", "PDS0-2017- 2|2"] },
      { year: 3, corso: "05121", anno2: ["PDS0-2017- 0|3", "PDS0-2017- 1|3", "PDS0-2017- 2|3"] },
    ]),
  },
  {
    programme: "Informatica - 05225",
    sources: degreeSources(BASE, ANNO, "informatica-05225", "300392", [
      { year: 2, corso: "05225", anno2: ["05225P0007|2", "05225P0010|2", "05225P0009|2", "05225P0006|2", "05225P0011|2"] },
    ]),
  },
  {
    programme: "Informatica - Nf225",
    sources: degreeSources(BASE, ANNO, "informatica-nf225", "300392", [
      { year: 1, corso: "NF225", anno2: ["NF225P0007|1", "NF225P0010|1", "NF225P0009|1", "NF225P0006|1", "NF225P0011|1"] },
    ]),
  },
  {
    programme: "Information Engineering for Digital Medicine",
    sources: degreeSources(BASE, ANNO, "information-engineering-for-digital-medicine", "300638", [
      { year: 1, corso: "IE232", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06232", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Ingegneria Alimentare",
    sources: degreeSources(BASE, ANNO, "ingegneria-alimentare", "300395", [
      { year: 1, corso: "II228", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06228", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-magistrale", "300395", [
      { year: 1, corso: "II122", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06222", anno2: ["PDS0-2024|2", "06222P0001|2", "06222P0002|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-triennale", "300395", [
      { year: 1, corso: "II222", anno2: ["PDS0-2025|1", "II222P0001|1", "II222P0002|1"] },
      { year: 2, corso: "06122", anno2: ["PDS0-2016|2", "06122P0002|2", "06122P0001|2"] },
      { year: 3, corso: "06122", anno2: ["PDS0-2016|3", "06122P0002|3", "06122P0001|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-triennale", "300393", [
      { year: -1, corso: "IC121", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "IC121", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06121", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "06121", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-magistrale", "300393", [
      { year: 1, corso: "IC221", anno2: ["IC221P0005|1", "IC221P0006|1", "IC221P0004|1"] },
      { year: 2, corso: "06221", anno2: ["PDS0-2022|2", "06221P0005|2", "06221P0006|2", "06221P0004|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile per L'ambiente ed il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-per-l-ambiente-ed-il-territorio", "300393", [
      { year: -1, corso: "IC125", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "IC125", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06125", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "06125", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Dell'informazione per la Medicina Digitale",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-informazione-per-la-medicina-digitale", "300638", [
      { year: 1, corso: "IE128", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06128", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "06128", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Ingegneria Edile-architettura",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura", "300393", [
      { year: -1, corso: "IC601", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "IC601", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06601", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "06601", anno2: ["PDS0-2017|3"] },
      { year: 4, corso: "06601", anno2: ["PDS0-2017|4"] },
      { year: 5, corso: "06601", anno2: ["PDS0-2017|5"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-triennale", "300395", [
      { year: 1, corso: "II124", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06124", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "06124", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-magistrale", "300395", [
      { year: 1, corso: "II224", anno2: ["II224P0002|1", "II224P0001|1"] },
      { year: 2, corso: "06224", anno2: ["06224P0002|2", "06224P0001|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-magistrale", "300395", [
      { year: 1, corso: "II226", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06226", anno2: ["PDS0-2018|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale", "300395", [
      { year: 1, corso: "II126", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06126", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "06126", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "300638", [
      { year: -1, corso: "IE127", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "IE127", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06227", anno2: ["06227P0016|2", "PDS0-2022|2", "06227P0019|2", "06227P0015|2", "06227P0017|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "300638", [
      { year: 1, corso: "IE227", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06127", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "06127", anno2: ["PDS0-2022|3", "06127P0007|3", "06127P0005|3", "06127P0006|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "300395", [
      { year: 1, corso: "II223", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06123", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "06123", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-magistrale", "300395", [
      { year: 1, corso: "II123", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06223", anno2: ["PDS0-2018|2", "06223P0002|2", "06223P0004|2", "06223P0003|2", "06223P0001|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'ambiente ed il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-ed-il-territorio", "300393", [
      { year: 1, corso: "IC225", anno2: ["IC225P0004|1", "IC225P0003|1"] },
      { year: 2, corso: "06225", anno2: ["PDS0-2022|2", "06225P0004|2", "06225P0003|2"] },
    ]),
  },
  {
    programme: "Innovazioni per le Produzioni Agrarie Mediterranee",
    sources: degreeSources(BASE, ANNO, "innovazioni-per-le-produzioni-agrarie-mediterranee", "300390", [
      { year: 1, corso: "FR222", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07222", anno2: ["PDS0-2019|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "300404", [
      { year: 1, corso: "TU126", anno2: ["TU126P0001|1", "TU126P0002|1"] },
      { year: 2, corso: "03126", anno2: ["03126P001|2", "03126P002|2"] },
      { year: 3, corso: "03126", anno2: ["PDS0-2023|3", "03126P001|3", "03126P002|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere", "300404", [
      { year: -1, corso: "43122", anno2: ["PDS0-2016|-1"] },
      { year: 1, corso: "TU122", anno2: ["TU122P0001|1", "TU122P0002|1"] },
      { year: 2, corso: "43122", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "43122", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne", "300404", [
      { year: -1, corso: "43221", anno2: ["PDS0-2018|-1", "43221P0004|-1", "43221P0005|-1", "43221P0003|-1"] },
      { year: 1, corso: "TU241", anno2: ["TU241P0001|1", "TU241P0004|1", "TU241P0005|1", "TU241P0003|1"] },
      { year: 2, corso: "43221", anno2: ["PDS0-2018|2", "43221P0004|2", "43221P0005|2", "43221P0003|2"] },
    ]),
  },
  {
    programme: "Linguistica e Didattica Dell'italiano nel Contesto Internazionale",
    sources: degreeSources(BASE, ANNO, "linguistica-e-didattica-dell-italiano-nel-contesto-internazionale", "300404", [
      { year: 1, corso: "TU240", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Management dei Sistemi Turistici per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "management-dei-sistemi-turistici-per-lo-sviluppo-sostenibile", "300401", [
      { year: 1, corso: "SC228", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "12228", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Management delle Attivita' Sportive e Motorie per il Benessere Sociale",
    sources: degreeSources(BASE, ANNO, "management-delle-attivita-sportive-e-motorie-per-il-benessere-sociale", "300663", [
      { year: 1, corso: "TP227", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "12227", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "300396", [
      { year: -1, corso: "MT123", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "MT123", anno2: ["DISPARI|1", "PARI|1"] },
      { year: 2, corso: "05222", anno2: ["05222P0002|2", "05222P0001|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "300396", [
      { year: 1, corso: "MT222", anno2: ["MT222P0002|1", "MT222P0001|1"] },
      { year: 2, corso: "05123", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "05123", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "300397", [
      { year: 1, corso: "ME601", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "10601", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "10601", anno2: ["PDS0-2016|3"] },
      { year: 4, corso: "10601", anno2: ["PDS0-2016|4"] },
      { year: 5, corso: "10601", anno2: ["PDS0-2016|5"] },
      { year: 6, corso: "10601", anno2: ["PDS0-2016|6"] },
    ]),
  },
  {
    programme: "Nanotechnology and Physics for Sustainability",
    sources: degreeSources(BASE, ANNO, "nanotechnology-and-physics-for-sustainability", "300391", [
      { year: 1, corso: "FS227", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "300397", [
      { year: 1, corso: "ME602", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "10602", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "10602", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "10602", anno2: ["PDS0-2023|4"] },
      { year: 5, corso: "10602", anno2: ["PDS0-2023|5"] },
      { year: 6, corso: "10602", anno2: ["PDS0-2023|6"] },
    ]),
  },
  {
    programme: "Organizzazione, Valutazione e Supervisione dei Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "organizzazione-valutazione-e-supervisione-dei-servizi-sociali", "300663", [
      { year: 1, corso: "TP230", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-prof-sanit-di-ostetrica-o", "300397", [
      { year: -1, corso: "10124", anno2: ["PDS0-2013|-1"] },
      { year: 1, corso: "10124", anno2: ["PDS0-2013|1"] },
      { year: 2, corso: "10124", anno2: ["PDS0-2013|2"] },
      { year: 3, corso: "10124", anno2: ["PDS0-2013|3"] },
    ]),
  },
  {
    programme: "Percorso 60 Cfu",
    sources: degreeSources(BASE, ANNO, "percorso-60-cfu", "", [
      { year: 1, corso: "60CFU", anno2: ["60|1"] },
    ]),
  },
  {
    programme: "Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Primaria",
    sources: degreeSources(BASE, ANNO, "percorso-di-specializzazione-per-le-attivita-di-sostegno-nella-scuola-primaria", "", [
      { year: 1, corso: "SOS_PR", anno2: ["PDS0-2016|1"] },
    ]),
  },
  {
    programme: "Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Secondo Grado",
    sources: degreeSources(BASE, ANNO, "percorso-di-specializzazione-per-le-attivita-di-sostegno-nella-scuola-secondaria-di-secondo-grado", "", [
      { year: 1, corso: "SOS_SUP", anno2: ["PDS0-2016|1"] },
    ]),
  },
  {
    programme: "Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Dell'infanzia",
    sources: degreeSources(BASE, ANNO, "percorso-di-specializzazione-per-le-attivita-di-sostegno-nella-scuola-dell-infanzia", "", [
      { year: 1, corso: "SOS_INF", anno2: ["PDS0-2016|1"] },
    ]),
  },
  {
    programme: "Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Primo Grado",
    sources: degreeSources(BASE, ANNO, "percorso-di-specializzazione-per-le-attivita-di-sostegno-nella-scuola-secondaria-di-primo-grado", "", [
      { year: 1, corso: "SOS_MED", anno2: ["PDS0-2016|1"] },
    ]),
  },
  {
    programme: "Politiche Territoriali e Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "politiche-territoriali-e-cooperazione-internazionale", "300401", [
      { year: 1, corso: "SC226", anno2: ["SC226P0001|1", "SC226P0002|1"] },
      { year: 2, corso: "12226", anno2: ["PDS0-2019|2", "12226P0001|2", "12226P0002|2"] },
    ]),
  },
  {
    programme: "Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi",
    sources: degreeSources(BASE, ANNO, "psicologia-dell-intervento-nei-contesti-clinici-sportivi-e-formativi", "300402", [
      { year: 1, corso: "SU225", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Psicologia di Comunita' per i Contesti Formativi, per il Benessere e per lo Sport",
    sources: degreeSources(BASE, ANNO, "psicologia-di-comunita-per-i-contesti-formativi-per-il-benessere-e-per-lo-sport", "300402", [
      { year: 2, corso: "44225", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-magistrale", "300389", [
      { year: -1, corso: "CB127", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "CB127", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05224", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-triennale", "300389", [
      { year: 1, corso: "CB224", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05127", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "05127", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "300389", [
      { year: -1, corso: "CB128", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "CB128", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05128", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "05128", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Scienze dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "scienze-dei-beni-culturali", "300398", [
      { year: -1, corso: "SP128", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SP128", anno2: ["SP128P0001|1", "SP128P0002|1", "SP128P0004|1"] },
      { year: 2, corso: "03128", anno2: ["03128P0001|2", "03128P0002|2", "03128P0004|2"] },
      { year: 3, corso: "03128", anno2: ["03128P0001|3", "03128P0002|3", "03128P0004|3"] },
    ]),
  },
  {
    programme: "Scienze del Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "scienze-del-servizio-sociale", "300663", [
      { year: -1, corso: "TP129", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "TP129", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03129", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "03129", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze del Turismo",
    sources: degreeSources(BASE, ANNO, "scienze-del-turismo", "300399", [
      { year: 1, corso: "SE129", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "02129", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "02129", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'amministrazione e Dell'organizzazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-amministrazione-e-dell-organizzazione", "300399", [
      { year: 1, corso: "SE122", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "12122", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "12122", anno2: ["PDS0-2018|3", "12122Libera|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-triennale", "300402", [
      { year: -1, corso: "44124", anno2: ["44124P0003|-1"] },
      { year: 2, corso: "44124", anno2: ["44124P0004|2", "44124P0003|2"] },
      { year: 3, corso: "44124", anno2: ["44124P0004|3", "44124P0003|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-magistrale", "300402", [
      { year: -1, corso: "SU124", anno2: ["SU124P0004|-1", "SU124P0003|-1"] },
      { year: 1, corso: "SU124", anno2: ["SU124P0004|1", "SU124P0003|1"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione Permanente e della Formazione Continua",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-permanente-e-della-formazione-continua", "300402", [
      { year: 1, corso: "SU224", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "44224", anno2: ["PDS0-2019|2"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "300401", [
      { year: -1, corso: "SC122", anno2: ["PDS0-2025|-1", "SC122P0011|-1", "SC122P0009|-1", "SC122P0001|-1"] },
      { year: 1, corso: "SC122", anno2: ["PDS0-2025|1", "SC122P0011|1", "SC122P0009|1", "SC122P0001|1"] },
      { year: 2, corso: "03122", anno2: ["PDS0-2019|2", "03122P0007|2", "03122P0011|2", "03122P0008|2", "03122P0009|2", "03122P0010|2"] },
      { year: 3, corso: "03122", anno2: ["PDS0-2019|3", "03122P0007|3", "03122P0011|3", "03122P0008|3", "03122P0009|3", "03122P0010|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "300402", [
      { year: -1, corso: "44610", anno2: ["PDS0-2016|-1"] },
      { year: 1, corso: "44610", anno2: ["PDS0-2016|1"] },
      { year: 2, corso: "44610", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "44610", anno2: ["PDS0-2016|3"] },
      { year: 4, corso: "44610", anno2: ["PDS0-2016|4"] },
      { year: 5, corso: "44610", anno2: ["PDS0-2016|5"] },
    ]),
  },
  {
    programme: "Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili",
    sources: degreeSources(BASE, ANNO, "scienze-della-valutazione-motorio-sportiva-e-tecniche-di-analisi-e-progettazione-dello-sport-per-disabili", "300402", [
      { year: -1, corso: "44222", anno2: ["PDS0-2018|-1"] },
      { year: 1, corso: "SU222", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "44222", anno2: ["PDS0-2018|2"] },
    ]),
  },
  {
    programme: "Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-delle-attivita-motorie-sportive-e-dell-educazione-psicomotoria-triennale", "300402", [
      { year: -1, corso: "44125", anno2: ["PDS0-2017|-1"] },
      { year: 2, corso: "44125", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "44125", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-delle-attivita-motorie-sportive-e-dell-educazione-psicomotoria-magistrale", "300402", [
      { year: -1, corso: "SU125", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SU125", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Scienze dello Spettacolo e della Produzione Multimediale",
    sources: degreeSources(BASE, ANNO, "scienze-dello-spettacolo-e-della-produzione-multimediale", "300398", [
      { year: 1, corso: "SP222", anno2: ["SP222P0001|1", "SP222P0002|1"] },
      { year: 2, corso: "43222", anno2: ["PDS0-2020|2"] },
    ]),
  },
  {
    programme: "Scienze e Nanotecnologie per la Sostenibilità",
    sources: degreeSources(BASE, ANNO, "scienze-e-nanotecnologie-per-la-sostenibilita", "300391", [
      { year: -1, corso: "FS129", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "FS129", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05129", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "05129", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "300397", [
      { year: 1, corso: "10221", anno2: ["PDS0-2022|1"] },
      { year: 2, corso: "10221", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche", "300402", [
      { year: -1, corso: "44221", anno2: ["PDS0-2019|-1"] },
      { year: 1, corso: "SU221", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "44221", anno2: ["PDS0-2019|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche e delle Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-delle-relazioni-internazionali", "300401", [
      { year: -1, corso: "SC121", anno2: ["PDS0-2025|-1", "SC121P0007|-1", "SC121P0005|-1", "SC121P0001|-1"] },
      { year: 1, corso: "SC121", anno2: ["PDS0-2025|1", "SC121P0007|1", "SC121P0005|1", "SC121P0001|1"] },
      { year: 2, corso: "12121", anno2: ["PDS0-2019|2", "12121P002|2", "12121P007|2", "12121P005|2", "12121P006|2", "12121P001|2"] },
      { year: 3, corso: "12121", anno2: ["PDS0-2019|3", "12121P002|3", "12121P007|3", "12121P005|3", "12121P006|3", "12121P001|3"] },
    ]),
  },
  {
    programme: "Scienze Statistiche per la Finanza",
    sources: degreeSources(BASE, ANNO, "scienze-statistiche-per-la-finanza", "300399", [
      { year: 1, corso: "SE224", anno2: ["SE224P0002|1", "SE224P0001|1"] },
      { year: 2, corso: "02224", anno2: ["02224P0002|2", "02224P0001|2"] },
    ]),
  },
  {
    programme: "Sicurezza Informatica e Tecnologie Cloud",
    sources: degreeSources(BASE, ANNO, "sicurezza-informatica-e-tecnologie-cloud", "300392", [
      { year: 1, corso: "NF227", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "05227", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Smart Industry Engineering",
    sources: degreeSources(BASE, ANNO, "smart-industry-engineering", "300395", [
      { year: 1, corso: "II230", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "06230", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Sociologia",
    sources: degreeSources(BASE, ANNO, "sociologia", "300663", [
      { year: -1, corso: "TP123", anno2: ["PDS0-2025|-1", "TP123P0004|-1", "TP123P0003|-1"] },
      { year: 1, corso: "TP123", anno2: ["PDS0-2025|1", "TP123P0004|1", "TP123P0003|1"] },
      { year: 2, corso: "03123", anno2: ["PDS0-2019|2", "03123P0002|2", "03123P0004|2", "03123P0001|2", "03123P0003|2"] },
      { year: 3, corso: "03123", anno2: ["PDS0-2019|3", "03123P0002|3", "03123P0004|3", "03123P0001|3", "03123P0003|3"] },
    ]),
  },
  {
    programme: "Sociologia del Cambiamento Ambientale e Digitale",
    sources: degreeSources(BASE, ANNO, "sociologia-del-cambiamento-ambientale-e-digitale", "300663", [
      { year: 1, corso: "TP229", anno2: ["TP229P0006|1", "PDS0-2025|1", "TP229P0005|1"] },
    ]),
  },
  {
    programme: "Sociologia e Politiche per il Territorio",
    sources: degreeSources(BASE, ANNO, "sociologia-e-politiche-per-il-territorio", "300663", [
      { year: 2, corso: "03229", anno2: ["03229P0006|2", "PDS0-2011|2", "03229P0005|2", "03229P0004|2", "03229P0001|2", "03229P0002|2", "03229P0003|2"] },
    ]),
  },
  {
    programme: "Statistica per i Big Data",
    sources: degreeSources(BASE, ANNO, "statistica-per-i-big-data", "300399", [
      { year: 1, corso: "SE128", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "02128", anno2: ["PDS0-2018|2"] },
      { year: 3, corso: "02128", anno2: ["PDS0-2018|3"] },
    ]),
  },
  {
    programme: "Storia e Critica D'arte",
    sources: degreeSources(BASE, ANNO, "storia-e-critica-d-arte", "", [
      { year: 1, corso: "SP224", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "03224", anno2: ["PDS0-2016|2"] },
    ]),
  },
  {
    programme: "Studi Diplomatici, Internazionali e sulla Sicurezza Globale",
    sources: degreeSources(BASE, ANNO, "studi-diplomatici-internazionali-e-sulla-sicurezza-globale", "300639", [
      { year: -1, corso: "SA125", anno2: ["PDS0-2025|-1"] },
      { year: 1, corso: "SA125", anno2: ["SA125P0002|1", "SA125P0001|1"] },
      { year: 2, corso: "12125", anno2: ["PDS0-2019|2", "12125P0002|2", "12125P0001|2"] },
      { year: 3, corso: "12125", anno2: ["PDS0-2019|3", "12125P0002|3", "12125P0001|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "300397", [
      { year: -1, corso: "10126", anno2: ["PDS0-2024|-1"] },
      { year: 1, corso: "10126", anno2: ["PDS0-2024|1"] },
      { year: 2, corso: "10126", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "300397", [
      { year: -1, corso: "10125", anno2: ["PDS0-2017|-1"] },
      { year: 1, corso: "10125", anno2: ["PDS0-2017|1"] },
      { year: 2, corso: "10125", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "10125", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Tecniche Erboristiche",
    sources: degreeSources(BASE, ANNO, "tecniche-erboristiche", "300390", [
      { year: 1, corso: "FR121", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "07121", anno2: ["PDS0-2020|2"] },
      { year: 3, corso: "07121", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Tecniche per L'edilizia e il Territorio",
    sources: degreeSources(BASE, ANNO, "tecniche-per-l-edilizia-e-il-territorio", "300393", [
      { year: -1, corso: "06129", anno2: ["PDS0-2023|-1"] },
      { year: 1, corso: "06129", anno2: ["PDS0-2023|1"] },
      { year: 2, corso: "06129", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "06129", anno2: ["PDS0-2023|3"] },
    ]),
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
