/**
 * Preset: Università degli Studi di Firenze — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unifi_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://kairos.unifi.it/agendaweb";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Accounting, Auditing e Controllo",
    sources: degreeSources(BASE, ANNO, "accounting-auditing-e-controllo", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B377", anno2: ["F033|1", "F074|1", "F032|1"] },
      { year: 2, corso: "B249", anno2: ["F033|2", "F074|2", "F032|2"] },
    ]),
  },
  {
    programme: "Advanced Molecular Sciences",
    sources: degreeSources(BASE, ANNO, "advanced-molecular-sciences", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B370", anno2: ["GEN|1"] },
      { year: 2, corso: "B234", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Archeologia",
    sources: degreeSources(BASE, ANNO, "archeologia", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B347", anno2: ["E32|1", "E33|1", "E31|1", "E30|1"] },
      { year: 2, corso: "B060", anno2: ["E32|2", "E33|2", "E31|2", "E30|2"] },
    ]),
  },
  {
    programme: "Architettura (magistrale)",
    sources: degreeSources(BASE, ANNO, "architettura-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B387", anno2: ["GEN|1"] },
      { year: 2, corso: "B076", anno2: ["D59|2", "C61|2"] },
    ]),
  },
  {
    programme: "Architettura (magistrale) (B348)",
    sources: degreeSources(BASE, ANNO, "architettura-magistrale-b348", "ScuoladiArchitettura", [
      { year: 1, corso: "B348", anno2: ["D59|1", "C61|1"] },
      { year: 2, corso: "B348", anno2: ["D59|2", "C61|2"] },
    ]),
  },
  {
    programme: "Architettura (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "architettura-ciclo-unico", "ScuoladiArchitettura", [
      { year: 2, corso: "B117", anno2: ["GEN|2"] },
      { year: 3, corso: "B117", anno2: ["GEN|3"] },
      { year: 4, corso: "B117", anno2: ["GEN|4"] },
      { year: 5, corso: "B117", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Architettura del Paesaggio (magistrale)",
    sources: degreeSources(BASE, ANNO, "architettura-del-paesaggio-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B409", anno2: ["GEN|1"] },
      { year: 2, corso: "B409", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Architettura del Paesaggio (magistrale) (B268)",
    sources: degreeSources(BASE, ANNO, "architettura-del-paesaggio-magistrale-b268", "ScuoladiArchitettura", [
      { year: 2, corso: "B268", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario)",
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria-abilitante-alla-professione-sanitaria-di-assistente-sanitario", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B178", anno2: ["GEN|1"] },
      { year: 2, corso: "B178", anno2: ["GEN|2"] },
      { year: 3, corso: "B178", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Biologia Dell'ambiente e del Comportamento (magistrale)",
    sources: degreeSources(BASE, ANNO, "biologia-dell-ambiente-e-del-comportamento-magistrale", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B350", anno2: ["E86|1", "E85|1"] },
      { year: 2, corso: "B350", anno2: ["E86|2"] },
    ]),
  },
  {
    programme: "Biologia Dell'ambiente e del Comportamento (magistrale) (B232)",
    sources: degreeSources(BASE, ANNO, "biologia-dell-ambiente-e-del-comportamento-magistrale-b232", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 2, corso: "B232", anno2: ["E86|2", "E85|2"] },
    ]),
  },
  {
    programme: "Biologia Molecolare e Applicata",
    sources: degreeSources(BASE, ANNO, "biologia-molecolare-e-applicata", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B351", anno2: ["E65|1", "E63|1", "E64|1"] },
      { year: 2, corso: "B230", anno2: ["E65|2", "E63|2", "E64|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B301", anno2: ["D72|1", "D70|1", "D71|1"] },
      { year: 2, corso: "B014", anno2: ["D72|2", "D70|2", "D71|2"] },
      { year: 3, corso: "B014", anno2: ["D72|3", "D70|3", "D71|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Mediche e Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche-e-farmaceutiche", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B353", anno2: ["GEN|1"] },
      { year: 2, corso: "B121", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Biotecnologie Molecolari",
    sources: degreeSources(BASE, ANNO, "biotecnologie-molecolari", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B352", anno2: ["GEN|1"] },
      { year: 2, corso: "B108", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b225]",
    sources: degreeSources(BASE, ANNO, "biotecnologie-per-la-gestione-ambientale-e-l-agricoltura-sostenibile-b225", "ScuoladiAgraria", [
      { year: 2, corso: "B225", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b422]",
    sources: degreeSources(BASE, ANNO, "biotecnologie-per-la-gestione-ambientale-e-l-agricoltura-sostenibile-b422", "ScuoladiAgraria", [
      { year: 1, corso: "B422", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B321", anno2: ["C78|1", "C79|1"] },
      { year: 2, corso: "B025", anno2: ["C78|2", "C79|2"] },
      { year: 3, corso: "B025", anno2: ["C78|3", "C79|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B356", anno2: ["GEN|1"] },
      { year: 2, corso: "B263", anno2: ["GEN|2"] },
      { year: 3, corso: "B263", anno2: ["GEN|3"] },
      { year: 4, corso: "B263", anno2: ["GEN|4"] },
      { year: 5, corso: "B263", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico) (B053)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico-b053", "ScuoladiScienzedellaSaluteUmana", [
      { year: 4, corso: "B053", anno2: ["GEN|4"] },
      { year: 5, corso: "B053", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Data Science, Calcolo Scientifico and Intelligenza Artificiale",
    sources: degreeSources(BASE, ANNO, "data-science-calcolo-scientifico-and-intelligenza-artificiale", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B343", anno2: ["GEN|1"] },
      { year: 2, corso: "B257", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design of Sustainable Tourism Systems",
    sources: degreeSources(BASE, ANNO, "design-of-sustainable-tourism-systems", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B415", anno2: ["GEN|1"] },
      { year: 2, corso: "B205", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design per L'innovazione Sostenibile (magistrale)",
    sources: degreeSources(BASE, ANNO, "design-per-l-innovazione-sostenibile-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B355", anno2: ["GEN|1"] },
      { year: 2, corso: "B355", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design per L'innovazione Sostenibile (magistrale) (B270)",
    sources: degreeSources(BASE, ANNO, "design-per-l-innovazione-sostenibile-magistrale-b270", "ScuoladiArchitettura", [
      { year: 2, corso: "B270", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design Sistema Moda",
    sources: degreeSources(BASE, ANNO, "design-sistema-moda", "ScuoladiArchitettura", [
      { year: 1, corso: "B354", anno2: ["GEN|1"] },
      { year: 2, corso: "B220", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design Tessile e Moda (magistrale)",
    sources: degreeSources(BASE, ANNO, "design-tessile-e-moda-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B404", anno2: ["GEN|1"] },
      { year: 2, corso: "B404", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Design Tessile e Moda (triennale)",
    sources: degreeSources(BASE, ANNO, "design-tessile-e-moda-triennale", "ScuoladiArchitettura", [
      { year: 2, corso: "B246", anno2: ["GEN|2"] },
      { year: 3, corso: "B246", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Diagnostica e Materiali per la Conservazione e il Restauro",
    sources: degreeSources(BASE, ANNO, "diagnostica-e-materiali-per-la-conservazione-e-il-restauro", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B405", anno2: ["GEN|1"] },
      { year: 2, corso: "B186", anno2: ["GEN|2"] },
      { year: 3, corso: "B186", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Dietistica (abilitante alla Professione Sanitaria di Dietista)",
    sources: degreeSources(BASE, ANNO, "dietistica-abilitante-alla-professione-sanitaria-di-dietista", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B170", anno2: ["GEN|1"] },
      { year: 2, corso: "B170", anno2: ["GEN|2"] },
      { year: 3, corso: "B170", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Dirigenza Scolastica e Pedagogia per L'inclusione",
    sources: degreeSources(BASE, ANNO, "dirigenza-scolastica-e-pedagogia-per-l-inclusione", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B367", anno2: ["GEN|1"] },
      { year: 2, corso: "B261", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Diritto per le Sostenibilita' e la Sicurezza",
    sources: degreeSources(BASE, ANNO, "diritto-per-le-sostenibilita-e-la-sicurezza", "ScuoladiGiurisprudenza", [
      { year: 1, corso: "B386", anno2: ["GEN|1"] },
      { year: 2, corso: "B256", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Discipline delle Arti, della Musica e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "discipline-delle-arti-della-musica-e-dello-spettacolo", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B401", anno2: ["GEN|1"] },
      { year: 2, corso: "B027", anno2: ["GEN|2"] },
      { year: 3, corso: "B027", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Disegno e Gestione degli Interventi Sociali",
    sources: degreeSources(BASE, ANNO, "disegno-e-gestione-degli-interventi-sociali", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B382", anno2: ["GEN|1"] },
      { year: 2, corso: "B382", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B395", anno2: ["GEN|1"] },
      { year: 2, corso: "B009", anno2: ["GEN|2"] },
      { year: 3, corso: "B009", anno2: ["E94|3", "E95|3"] },
    ]),
  },
  {
    programme: "Economia e Commercio",
    sources: degreeSources(BASE, ANNO, "economia-e-commercio", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B402", anno2: ["GEN|1"] },
      { year: 2, corso: "B034", anno2: ["F013|2", "F011|2", "F012|2", "F04|2"] },
      { year: 3, corso: "B034", anno2: ["F013|3", "F011|3", "F012|3", "F04|3"] },
    ]),
  },
  {
    programme: "Economia Istituzioni Sostenibilità / Economics Institutions Sustainability",
    sources: degreeSources(BASE, ANNO, "economia-istituzioni-sostenibilita-economics-institutions-sustainability", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B417", anno2: ["F083|1", "F082|1"] },
      { year: 2, corso: "B417", anno2: ["F083|2", "F082|2"] },
    ]),
  },
  {
    programme: "Economics and Development (magistrale)",
    sources: degreeSources(BASE, ANNO, "economics-and-development-magistrale", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B418", anno2: ["E20|1", "E19|1"] },
      { year: 2, corso: "B418", anno2: ["E19|2"] },
    ]),
  },
  {
    programme: "Economics and Development (magistrale) (B214)",
    sources: degreeSources(BASE, ANNO, "economics-and-development-magistrale-b214", "ScuoladiEconomiaeManagement", [
      { year: 2, corso: "B214", anno2: ["E20|2", "E19|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale)",
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B164", anno2: ["GEN|1"] },
      { year: 2, corso: "B164", anno2: ["GEN|2"] },
      { year: 3, corso: "B164", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B357", anno2: ["GEN|1"] },
      { year: 2, corso: "B264", anno2: ["GEN|2"] },
      { year: 3, corso: "B264", anno2: ["GEN|3"] },
      { year: 4, corso: "B264", anno2: ["GEN|4"] },
      { year: 5, corso: "B264", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico) (B054)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico-b054", "ScuoladiScienzedellaSaluteUmana", [
      { year: 4, corso: "B054", anno2: ["GEN|4"] },
      { year: 5, corso: "B054", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Filologia Moderna",
    sources: degreeSources(BASE, ANNO, "filologia-moderna", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B333", anno2: ["B90|1", "D48|1", "E38|1"] },
      { year: 2, corso: "B055", anno2: ["B90|2", "D48|2", "E38|2"] },
    ]),
  },
  {
    programme: "Filologia, Letteratura e Storia Dell'antichità",
    sources: degreeSources(BASE, ANNO, "filologia-letteratura-e-storia-dell-antichita", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B334", anno2: ["D92|1", "D93|1"] },
      { year: 2, corso: "B056", anno2: ["D92|2", "D93|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B304", anno2: ["GEN|1"] },
      { year: 2, corso: "B042", anno2: ["GEN|2"] },
      { year: 3, corso: "B042", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Finance and Risk Management",
    sources: degreeSources(BASE, ANNO, "finance-and-risk-management", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B358", anno2: ["GEN|1"] },
      { year: 2, corso: "B203", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Fisica e Astrofisica",
    sources: degreeSources(BASE, ANNO, "fisica-e-astrofisica", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B322", anno2: ["GEN|1"] },
      { year: 2, corso: "B030", anno2: ["GEN|2"] },
      { year: 3, corso: "B030", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Empoli",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-empoli", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B165_EMPOLI", anno2: ["GEN|1"] },
      { year: 2, corso: "B165_EMPOLI", anno2: ["GEN|2"] },
      { year: 3, corso: "B165_EMPOLI", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Firenze",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-firenze", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B165_FIRENZE", anno2: ["GEN|1"] },
      { year: 2, corso: "B165_FIRENZE", anno2: ["GEN|2"] },
      { year: 3, corso: "B165_FIRENZE", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Pistoia",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-pistoia", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B165_PISTOIA", anno2: ["GEN|1"] },
      { year: 2, corso: "B165_PISTOIA", anno2: ["GEN|2"] },
      { year: 3, corso: "B165_PISTOIA", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Food Design e Innovazione dei Prodotti Alimentari [b423]",
    sources: degreeSources(BASE, ANNO, "food-design-e-innovazione-dei-prodotti-alimentari-b423", "ScuoladiAgraria", [
      { year: 1, corso: "B423", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Geoengineering",
    sources: degreeSources(BASE, ANNO, "geoengineering", "ScuoladiIngegneria", [
      { year: 1, corso: "B361", anno2: ["GEN|1"] },
      { year: 2, corso: "B226", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Geography, Spatial Management, Heritage for International Cooperation",
    sources: degreeSources(BASE, ANNO, "geography-spatial-management-heritage-for-international-cooperation", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B427", anno2: ["GEN|1"] },
      { year: 2, corso: "B231", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-ciclo-unico", "ScuoladiGiurisprudenza", [
      { year: 1, corso: "B344", anno2: ["GEN_A-D|1", "GEN_E-N|1", "GEN_O-Z|1"] },
      { year: 5, corso: "B344", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza (ciclo unico) (1170)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-ciclo-unico-1170", "ScuoladiGiurisprudenza", [
      { year: 2, corso: "1170", anno2: ["GEN_A-G|2", "GEN_H-Z|2"] },
      { year: 3, corso: "1170", anno2: ["GEN_A-G|3", "GEN_H-Z|3"] },
      { year: 4, corso: "1170", anno2: ["GEN_A-G|4", "GEN_H-Z|4"] },
      { year: 5, corso: "1170", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza Italiana e Francese",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-italiana-e-francese", "ScuoladiGiurisprudenza", [
      { year: 1, corso: "B345", anno2: ["GEN|1"] },
      { year: 2, corso: "B250", anno2: ["GEN|2"] },
      { year: 3, corso: "B250", anno2: ["GEN|3"] },
      { year: 4, corso: "B250", anno2: ["GEN|4"] },
    ]),
  },
  {
    programme: "Giurisprudenza Italiana e Tedesca",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-italiana-e-tedesca", "ScuoladiGiurisprudenza", [
      { year: 1, corso: "B346", anno2: ["GEN|1"] },
      { year: 2, corso: "B218", anno2: ["GEN|2"] },
      { year: 3, corso: "B218", anno2: ["GEN|3"] },
      { year: 4, corso: "B218", anno2: ["GEN|4"] },
      { year: 5, corso: "B218", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Governo e Direzione D'impresa",
    sources: degreeSources(BASE, ANNO, "governo-e-direzione-d-impresa", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B426", anno2: ["B72|1", "B73|1"] },
      { year: 2, corso: "B105", anno2: ["B72|2", "B73|2"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Borgo San Lorenzo",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-borgo-san-lorenzo", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B162_BORGO SAN LORENZO", anno2: ["GEN|1"] },
      { year: 2, corso: "B162_BORGO SAN LORENZO", anno2: ["GEN|2"] },
      { year: 3, corso: "B162_BORGO SAN LORENZO", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Empoli",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-empoli", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B162_EMPOLI", anno2: ["GEN|1"] },
      { year: 2, corso: "B162_EMPOLI", anno2: ["GEN|2"] },
      { year: 3, corso: "B162_EMPOLI", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Firenze",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-firenze", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B162_FIRENZE", anno2: ["GEN|1"] },
      { year: 2, corso: "B162_FIRENZE", anno2: ["GEN|2"] },
      { year: 3, corso: "B162_FIRENZE", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Pistoia",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-pistoia", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B162_PISTOIA", anno2: ["GEN|1"] },
      { year: 2, corso: "B162_PISTOIA", anno2: ["GEN|2"] },
      { year: 3, corso: "B162_PISTOIA", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Prato",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-prato", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B162_PRATO", anno2: ["GEN|1"] },
      { year: 2, corso: "B162_PRATO", anno2: ["GEN|2"] },
      { year: 3, corso: "B162_PRATO", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B324", anno2: ["GEN|1"] },
      { year: 2, corso: "B032", anno2: ["GEN|2"] },
      { year: 3, corso: "B032", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-ambientale", "ScuoladiIngegneria", [
      { year: 1, corso: "B305", anno2: ["F046|1", "F048|1", "F047|1"] },
      { year: 2, corso: "B254", anno2: ["F046|2", "F048|2", "F047|2"] },
      { year: 3, corso: "B254", anno2: ["F046|3", "F048|3", "F047|3"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-triennale", "ScuoladiIngegneria", [
      { year: 1, corso: "B388", anno2: ["GEN|1"] },
      { year: 2, corso: "B237", anno2: ["GEN|2"] },
      { year: 3, corso: "B237", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-magistrale", "ScuoladiIngegneria", [
      { year: 1, corso: "B359", anno2: ["F057|1", "F058|1", "F059|1", "F060|1"] },
      { year: 2, corso: "B061", anno2: ["F057|2", "F058|2", "F059|2", "F060|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "ScuoladiIngegneria", [
      { year: 1, corso: "B360", anno2: ["E17|1", "E16|1", "E18|1"] },
      { year: 2, corso: "B062", anno2: ["E17|2", "E16|2", "E18|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Edile per la Sostenibilità",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-edile-per-la-sostenibilita", "ScuoladiIngegneria", [
      { year: 1, corso: "B306", anno2: ["F062|1", "F064|1", "F063|1"] },
      { year: 2, corso: "B259", anno2: ["F062|2", "F064|2", "F063|2"] },
      { year: 3, corso: "B259", anno2: ["F062|3", "F064|3", "F063|3"] },
    ]),
  },
  {
    programme: "Ingegneria dei Sistemi Elettronici",
    sources: degreeSources(BASE, ANNO, "ingegneria-dei-sistemi-elettronici", "ScuoladiIngegneria", [
      { year: 1, corso: "B337", anno2: ["F022|1", "F021|1", "F020|1", "F023|1"] },
      { year: 2, corso: "B245", anno2: ["F022|2", "F021|2", "F020|2", "F023|2"] },
    ]),
  },
  {
    programme: "Ingegneria Edile",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile", "ScuoladiIngegneria", [
      { year: 1, corso: "B408", anno2: ["GEN|1"] },
      { year: 2, corso: "B063", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "ScuoladiIngegneria", [
      { year: 1, corso: "B307", anno2: ["GEN|1"] },
      { year: 2, corso: "B244", anno2: ["F017|2", "F018|2", "F019|2"] },
      { year: 3, corso: "B244", anno2: ["F017|3", "F018|3", "F019|3"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-energetica", "ScuoladiIngegneria", [
      { year: 1, corso: "B410", anno2: ["E83|1", "E84|1"] },
      { year: 2, corso: "B068", anno2: ["E83|2", "E84|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "ScuoladiIngegneria", [
      { year: 1, corso: "B406", anno2: ["GEN_A-D|1", "GEN_E-N|1", "GEN_O-Z|1"] },
      { year: 2, corso: "B222", anno2: ["E62|2", "E62_A-L|2", "E62_M-Z|2", "F006|2", "F006_A-L|2", "F006_M-Z|2", "E45|2", "E45_A-L|2", "E45_M-Z|2"] },
      { year: 3, corso: "B222", anno2: ["E62|3", "F006|3", "E45|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "ScuoladiIngegneria", [
      { year: 1, corso: "B308", anno2: ["E70|1", "E69|1"] },
      { year: 2, corso: "B070", anno2: ["F027|2", "F026|2", "F025|2", "F024|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "ScuoladiIngegneria", [
      { year: 1, corso: "B339", anno2: ["F027|1", "F026|1", "F025|1", "F024|1"] },
      { year: 2, corso: "B047", anno2: ["E70|2", "E69|2"] },
      { year: 3, corso: "B047", anno2: ["E70|3", "E69|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-magistrale", "ScuoladiIngegneria", [
      { year: 1, corso: "B412", anno2: ["E05|1", "E61|1", "E90|1", "E06|1", "E42|1", "E41|1", "E72|1", "E73|1"] },
      { year: 2, corso: "B071", anno2: ["E05|2", "E61|2", "E90|2", "E06|2", "E42|2", "E41|2", "E72|2", "E73|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "ScuoladiIngegneria", [
      { year: 1, corso: "B309", anno2: ["F052_A-D|1", "F052_E-N|1", "F052_O-Z|1", "F051_A-D|1", "F051_E-N|1", "F051_O-Z|1", "F054_A-D|1", "F054_E-N|1", "F054_O-Z|1", "F053_A-D|1", "F053_E-N|1", "F053_O-Z|1", "F055_A-D|1", "F055_E-N|1", "F055_O-Z|1", "F077_A-D|1", "F077_E-N|1", "F077_O-Z|1", "F078_A-D|1", "F078_E-N|1", "F078_O-Z|1"] },
      { year: 2, corso: "B049", anno2: ["F052_A-L|2", "F052_M-Z|2", "F051_A-L|2", "F051_M-Z|2", "F054_A-L|2", "F054_M-Z|2", "F053_A-L|2", "F053_M-Z|2", "F055_A-L|2", "F055_M-Z|2", "F077_A-L|2", "F077_M-Z|2", "F078_A-L|2", "F078_M-Z|2"] },
      { year: 3, corso: "B049", anno2: ["F050_A-L|3", "F050_M-Z|3", "F049_A-L|3", "F049_M-Z|3", "F052_A-L|3", "F052_M-Z|3", "F051_A-L|3", "F051_M-Z|3", "F054_A-L|3", "F054_M-Z|3", "F053_A-L|3", "F053_M-Z|3", "F055_A-L|3", "F055_M-Z|3"] },
    ]),
  },
  {
    programme: "Ingegneria per la Tutela Dell'ambiente e del Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-la-tutela-dell-ambiente-e-del-territorio", "ScuoladiIngegneria", [
      { year: 1, corso: "B362", anno2: ["E75|1", "E74|1"] },
      { year: 2, corso: "B072", anno2: ["E75|2", "E74|2"] },
    ]),
  },
  {
    programme: "Innovazione Sostenibile in Viticoltura ed Enologia [b253]",
    sources: degreeSources(BASE, ANNO, "innovazione-sostenibile-in-viticoltura-ed-enologia-b253", "ScuoladiAgraria", [
      { year: 2, corso: "B253", anno2: ["F044|2", "F045|2"] },
    ]),
  },
  {
    programme: "Innovazione Sostenibile in Viticoltura ed Enologia [b424]",
    sources: degreeSources(BASE, ANNO, "innovazione-sostenibile-in-viticoltura-ed-enologia-b424", "ScuoladiAgraria", [
      { year: 1, corso: "B424", anno2: ["F093|1", "F094|1"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale", "ScuoladiIngegneria", [
      { year: 1, corso: "B340", anno2: ["GEN|1"] },
      { year: 2, corso: "B241", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Intermediazione Culturale e Religiosa",
    sources: degreeSources(BASE, ANNO, "intermediazione-culturale-e-religiosa", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B342", anno2: ["GEN|1"] },
      { year: 2, corso: "B242", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B393", anno2: ["D85|1", "D86|1"] },
      { year: 2, corso: "B200", anno2: ["D85|2", "D86|2"] },
      { year: 3, corso: "B200", anno2: ["D85|3", "D86|3"] },
    ]),
  },
  {
    programme: "Lingue e Civiltà Dell'asia e Dell'africa",
    sources: degreeSources(BASE, ANNO, "lingue-e-civilta-dell-asia-e-dell-africa", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B363", anno2: ["GEN|1"] },
      { year: 2, corso: "B262", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Europee e Americane",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-europee-e-americane", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B413", anno2: ["F03|1", "F01|1", "C35|1", "C81|1", "F02|1"] },
      { year: 2, corso: "B074", anno2: ["F03|2", "F01|2", "C35|2", "C81|2", "F02|2"] },
    ]),
  },
  {
    programme: "Lingue, Letterature e Studi Interculturali",
    sources: degreeSources(BASE, ANNO, "lingue-letterature-e-studi-interculturali", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B394", anno2: ["C09|1", "C80|1", "D42|1"] },
      { year: 2, corso: "B004", anno2: ["C09|2", "C80|2", "D42|2"] },
      { year: 3, corso: "B004", anno2: ["LET|3", "C09|3", "C80|3", "D42|3"] },
    ]),
  },
  {
    programme: "Logica, Filosofia delle Scienze e Metodi della Ricerca",
    sources: degreeSources(BASE, ANNO, "logica-filosofia-delle-scienze-e-metodi-della-ricerca", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B391", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Logica, Filosofia e Storia della Scienza",
    sources: degreeSources(BASE, ANNO, "logica-filosofia-e-storia-della-scienza", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 2, corso: "B107", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B166", anno2: ["GEN|1"] },
      { year: 2, corso: "B166", anno2: ["GEN|2"] },
      { year: 3, corso: "B166", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Management Engineering",
    sources: degreeSources(BASE, ANNO, "management-engineering", "ScuoladiIngegneria", [
      { year: 1, corso: "B338", anno2: ["F056|1", "F081|1", "F061|1"] },
      { year: 2, corso: "B271", anno2: ["F061|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B327", anno2: ["GEN|1"] },
      { year: 2, corso: "B077", anno2: ["C76|2", "E24|2", "C75|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B364", anno2: ["C76|1", "E24|1", "C75|1"] },
      { year: 2, corso: "B036", anno2: ["GEN|2"] },
      { year: 3, corso: "B036", anno2: ["C76|3", "C75|3"] },
    ]),
  },
  {
    programme: "Mechanical Engineering for Sustainability",
    sources: degreeSources(BASE, ANNO, "mechanical-engineering-for-sustainability", "ScuoladiIngegneria", [
      { year: 1, corso: "B341", anno2: ["F029|1", "F030|1", "F031|1"] },
      { year: 2, corso: "B248", anno2: ["F029|2", "F030|2", "F031|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B414", anno2: ["GEN|1"] },
      { year: 2, corso: "B240", anno2: ["GEN|2"] },
      { year: 3, corso: "B240", anno2: ["GEN|3"] },
      { year: 4, corso: "B240", anno2: ["GEN|4"] },
      { year: 5, corso: "B240", anno2: ["GEN|5"] },
      { year: 6, corso: "B120", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Natural Resources Management for Tropical Rural Development [b216]",
    sources: degreeSources(BASE, ANNO, "natural-resources-management-for-tropical-rural-development-b216", "ScuoladiAgraria", [
      { year: 2, corso: "B216", anno2: ["E28|2", "E29|2"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-ciclo-unico", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B365", anno2: ["GEN|1"] },
      { year: 2, corso: "B265", anno2: ["GEN|2"] },
      { year: 3, corso: "B265", anno2: ["GEN|3"] },
      { year: 4, corso: "B265", anno2: ["GEN|4"] },
      { year: 5, corso: "B265", anno2: ["GEN|5"] },
      { year: 6, corso: "B265", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria (ciclo unico) (B125)",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-ciclo-unico-b125", "ScuoladiScienzedellaSaluteUmana", [
      { year: 4, corso: "B125", anno2: ["GEN|4"] },
      { year: 5, corso: "B125", anno2: ["GEN|5"] },
      { year: 6, corso: "B125", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Osteopatia",
    sources: degreeSources(BASE, ANNO, "osteopatia", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B275", anno2: ["GEN|1"] },
      { year: 2, corso: "B275", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B163", anno2: ["GEN|1"] },
      { year: 2, corso: "B163", anno2: ["GEN|2"] },
      { year: 3, corso: "B163", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ottica e Optometria",
    sources: degreeSources(BASE, ANNO, "ottica-e-optometria", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B323", anno2: ["GEN|1"] },
      { year: 2, corso: "B031", anno2: ["GEN|2"] },
      { year: 3, corso: "B031", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Physical and Astrophysical Sciences",
    sources: degreeSources(BASE, ANNO, "physical-and-astrophysical-sciences", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B411", anno2: ["D31|1", "F066|1", "D33|1", "F067|1", "D34|1", "D32|1"] },
    ]),
  },
  {
    programme: "Pianificazione della Citta', del Territorio e del Paesaggio (magistrale)",
    sources: degreeSources(BASE, ANNO, "pianificazione-della-citta-del-territorio-e-del-paesaggio-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B317", anno2: ["GEN|1"] },
      { year: 2, corso: "B317", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Pianificazione della Citta', del Territorio e del Paesaggio (triennale)",
    sources: degreeSources(BASE, ANNO, "pianificazione-della-citta-del-territorio-e-del-paesaggio-triennale", "ScuoladiArchitettura", [
      { year: 2, corso: "B016", anno2: ["GEN|2"] },
      { year: 3, corso: "B016", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale)",
    sources: degreeSources(BASE, ANNO, "pianificazione-e-progettazione-per-la-sostenibilita-urbana-e-territoriale-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B366", anno2: ["F068|1", "F069|1"] },
      { year: 2, corso: "B366", anno2: ["F068|2", "F069|2"] },
    ]),
  },
  {
    programme: "Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) (B269)",
    sources: degreeSources(BASE, ANNO, "pianificazione-e-progettazione-per-la-sostenibilita-urbana-e-territoriale-magistrale-b269", "ScuoladiArchitettura", [
      { year: 2, corso: "B269", anno2: ["F068|2", "F069|2"] },
    ]),
  },
  {
    programme: "Politica, Istituzioni e Mercato",
    sources: degreeSources(BASE, ANNO, "politica-istituzioni-e-mercato", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B374", anno2: ["E52|1", "E51|1"] },
      { year: 2, corso: "B374", anno2: ["E52|2", "E51|2"] },
    ]),
  },
  {
    programme: "Pratiche, Linguaggi e Culture della Comunicazione",
    sources: degreeSources(BASE, ANNO, "pratiche-linguaggi-e-culture-della-comunicazione", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B385", anno2: ["GEN|1"] },
      { year: 2, corso: "B252", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Product, Interior, Communication and Eco-social Design (magistrale)",
    sources: degreeSources(BASE, ANNO, "product-interior-communication-and-eco-social-design-magistrale", "ScuoladiArchitettura", [
      { year: 1, corso: "B303", anno2: ["GEN|1"] },
      { year: 2, corso: "B303", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Product, Interior, Communication and Eco-social Design (triennale)",
    sources: degreeSources(BASE, ANNO, "product-interior-communication-and-eco-social-design-triennale", "ScuoladiArchitettura", [
      { year: 2, corso: "B251", anno2: ["GEN|2"] },
      { year: 3, corso: "B251", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Progettazione e Gestione di Eventi e Imprese Dell'arte e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "progettazione-e-gestione-di-eventi-e-imprese-dell-arte-e-dello-spettacolo", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B302", anno2: ["GEN|1"] },
      { year: 2, corso: "B028", anno2: ["GEN|2"] },
      { year: 3, corso: "B028", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Psicologia Clinica e della Salute e Neuropsicologia (magistrale)",
    sources: degreeSources(BASE, ANNO, "psicologia-clinica-e-della-salute-e-neuropsicologia-magistrale", "ScuoladiPsicologia", [
      { year: 1, corso: "B368", anno2: ["E21|1", "B38|1", "F070|1"] },
      { year: 2, corso: "B368", anno2: ["E21|2", "B38|2", "F070|2"] },
    ]),
  },
  {
    programme: "Psicologia Clinica e della Salute e Neuropsicologia (magistrale) (B267)",
    sources: degreeSources(BASE, ANNO, "psicologia-clinica-e-della-salute-e-neuropsicologia-magistrale-b267", "ScuoladiPsicologia", [
      { year: 2, corso: "B267", anno2: ["E21|2", "B38|2", "F070|2"] },
    ]),
  },
  {
    programme: "Psicologia del Ciclo di Vita e dei Contesti (magistrale)",
    sources: degreeSources(BASE, ANNO, "psicologia-del-ciclo-di-vita-e-dei-contesti-magistrale", "ScuoladiPsicologia", [
      { year: 1, corso: "B369", anno2: ["F073|1", "F071|1", "F072|1"] },
      { year: 2, corso: "B369", anno2: ["F073|2", "F071|2", "F072|2"] },
    ]),
  },
  {
    programme: "Psicologia del Ciclo di Vita e dei Contesti (magistrale) (B266)",
    sources: degreeSources(BASE, ANNO, "psicologia-del-ciclo-di-vita-e-dei-contesti-magistrale-b266", "ScuoladiPsicologia", [
      { year: 2, corso: "B266", anno2: ["F073|2", "F071|2", "F072|2"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali e Studi Europei",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali-e-studi-europei", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B416", anno2: ["GEN|1"] },
      { year: 2, corso: "B416", anno2: ["GEN|2", "LM 52|2", "LM 90|2"] },
    ]),
  },
  {
    programme: "Robotics, Automation and Electrical Engineering",
    sources: degreeSources(BASE, ANNO, "robotics-automation-and-electrical-engineering", "ScuoladiIngegneria", [
      { year: 1, corso: "B336", anno2: ["F080|1", "F079|1"] },
      { year: 2, corso: "B274", anno2: ["F080|2", "F079|2"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources(BASE, ANNO, "scienza-dei-materiali", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B300", anno2: ["GEN|1"] },
      { year: 2, corso: "B258", anno2: ["GEN|2"] },
      { year: 3, corso: "B258", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Agrarie [B020]",
    sources: degreeSources(BASE, ANNO, "scienze-agrarie-b020", "ScuoladiAgraria", [
      { year: 2, corso: "B020", anno2: ["GEN|2"] },
      { year: 3, corso: "B020", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Agrarie [b397]",
    sources: degreeSources(BASE, ANNO, "scienze-agrarie-b397", "ScuoladiAgraria", [
      { year: 1, corso: "B397", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Archivistiche e Biblioteconomiche",
    sources: degreeSources(BASE, ANNO, "scienze-archivistiche-e-biblioteconomiche", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B349", anno2: ["GEN|1"] },
      { year: 2, corso: "B084", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B310", anno2: ["GEN|1"] },
      { year: 2, corso: "B005", anno2: ["GEN|2"] },
      { year: 3, corso: "B005", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B371", anno2: ["D22|1", "D23|1", "D21|1", "D24|1", "D20|1"] },
      { year: 2, corso: "B088", anno2: ["D22|2", "D23|2", "D21|2", "D24|2", "D20|2"] },
    ]),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "ScuoladiGiurisprudenza", [
      { year: 1, corso: "B311", anno2: ["GEN|1"] },
      { year: 2, corso: "B006", anno2: ["GEN|2"] },
      { year: 3, corso: "B006", anno2: ["C22|3", "C20|3", "C23|3", "C21|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'alimentazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-alimentazione", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B373", anno2: ["GEN|1"] },
      { year: 2, corso: "B207", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'architettura",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura", "ScuoladiArchitettura", [
      { year: 1, corso: "B313", anno2: ["GEN|1"] },
      { year: 2, corso: "B008", anno2: ["GEN|2"] },
      { year: 3, corso: "B008", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'economia",
    sources: degreeSources(BASE, ANNO, "scienze-dell-economia", "ScuoladiEconomiaeManagement", [
      { year: 2, corso: "B089", anno2: ["D52|2", "E66|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione e della Formazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-e-della-formazione", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B315", anno2: ["GEN|1"] },
      { year: 2, corso: "B219", anno2: ["GEN|2"] },
      { year: 3, corso: "B219", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B198", anno2: ["GEN|1"] },
      { year: 2, corso: "B198", anno2: ["GEN|2"] },
      { year: 3, corso: "B198", anno2: ["GEN|3"] },
      { year: 4, corso: "B198", anno2: ["GEN|4"] },
      { year: 5, corso: "B198", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Scienze della Natura e Dell'uomo",
    sources: degreeSources(BASE, ANNO, "scienze-della-natura-e-dell-uomo", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B372", anno2: ["D28|1", "F034|1", "D51|1"] },
      { year: 2, corso: "B372", anno2: ["D28|2", "D51|2"] },
    ]),
  },
  {
    programme: "Scienze della Natura e dell'Uomo",
    sources: degreeSources(BASE, ANNO, "scienze-della-natura-e-dell-uomo-2", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 2, corso: "B093", anno2: ["D28|2", "F034|2", "D51|2"] },
    ]),
  },
  {
    programme: "Scienze dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "scienze-dello-spettacolo", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B420", anno2: ["D88|1", "D50|1", "B69|1"] },
      { year: 2, corso: "B097", anno2: ["D88|2", "D50|2", "B69|2"] },
    ]),
  },
  {
    programme: "Scienze e Gestione delle Risorse Faunistico-ambientali [B112]",
    sources: degreeSources(BASE, ANNO, "scienze-e-gestione-delle-risorse-faunistico-ambientali-b112", "ScuoladiAgraria", [
      { year: 2, corso: "B112", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Gestione delle Risorse Faunistico-ambientali [b381]",
    sources: degreeSources(BASE, ANNO, "scienze-e-gestione-delle-risorse-faunistico-ambientali-b381", "ScuoladiAgraria", [
      { year: 1, corso: "B381", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze e Materiali per la Conservazione e il Restauro",
    sources: degreeSources(BASE, ANNO, "scienze-e-materiali-per-la-conservazione-e-il-restauro", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B407", anno2: ["GEN|1"] },
      { year: 2, corso: "B194", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-dello-sport-e-delle-attivita-motorie-preventive-e-adattate", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B390", anno2: ["GEN|1"] },
      { year: 2, corso: "B185", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche-magistrale", "ScuoladiPsicologia", [
      { year: 1, corso: "B319", anno2: ["GEN|1"] },
      { year: 2, corso: "B319", anno2: ["B13|2", "D47|2", "B14|2", "D46|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche-triennale", "ScuoladiPsicologia", [
      { year: 2, corso: "B018", anno2: ["B13|2", "D47|2", "B14|2", "D46|2"] },
      { year: 3, corso: "B018", anno2: ["B13|3", "D47|3", "B14|3", "D46|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Agrarie [b098]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-agrarie-b098", "ScuoladiAgraria", [
      { year: 2, corso: "B098", anno2: ["E92|2", "E53|2", "F065|2", "C45|2", "C47|2", "E91|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Agrarie [b375]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-agrarie-b375", "ScuoladiAgraria", [
      { year: 1, corso: "B375", anno2: ["E92|1", "E53|1", "F065|1", "C45|1", "C47|1", "E91|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Alimentari [b188]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-alimentari-b188", "ScuoladiAgraria", [
      { year: 2, corso: "B188", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie dei Sistemi Forestali [b102]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-dei-sistemi-forestali-b102", "ScuoladiAgraria", [
      { year: 2, corso: "B102", anno2: ["E76|2", "E55|2", "E77|2", "F037|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie dei Sistemi Forestali [b425]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-dei-sistemi-forestali-b425", "ScuoladiAgraria", [
      { year: 1, corso: "B425", anno2: ["F090|1", "F091|1", "F092|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-geologiche", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B376", anno2: ["D25|1", "F001|1", "F002|1", "E48|1"] },
      { year: 2, corso: "B103", anno2: ["D25|2", "F001|2", "F002|2", "E48|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per la Gestione degli Spazi Verdi e del Paesaggio [b235]",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-per-la-gestione-degli-spazi-verdi-e-del-paesaggio-b235", "ScuoladiAgraria", [
      { year: 2, corso: "B235", anno2: ["E98|2", "E99|2"] },
      { year: 3, corso: "B235", anno2: ["E98|3", "E99|3"] },
    ]),
  },
  {
    programme: "Scienze Farmaceutiche Applicate-controllo Qualità",
    sources: degreeSources(BASE, ANNO, "scienze-farmaceutiche-applicate-controllo-qualita", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B400", anno2: ["GEN|1"] },
      { year: 2, corso: "B193", anno2: ["GEN|2"] },
      { year: 3, corso: "B193", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Faunistiche [B191]",
    sources: degreeSources(BASE, ANNO, "scienze-faunistiche-b191", "ScuoladiAgraria", [
      { year: 2, corso: "B191", anno2: ["GEN|2"] },
      { year: 3, corso: "B191", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Faunistiche [b329]",
    sources: degreeSources(BASE, ANNO, "scienze-faunistiche-b329", "ScuoladiAgraria", [
      { year: 1, corso: "B329", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Filosofiche",
    sources: degreeSources(BASE, ANNO, "scienze-filosofiche", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B378", anno2: ["F042|1", "F043|1", "F040|1", "F041|1"] },
      { year: 2, corso: "B106", anno2: ["F042|2", "F043|2", "F040|2", "F041|2"] },
    ]),
  },
  {
    programme: "Scienze Fisiche e Astrofisiche",
    sources: degreeSources(BASE, ANNO, "scienze-fisiche-e-astrofisiche", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 2, corso: "B058", anno2: ["D31|2", "F066|2", "F067|2", "D34|2", "D33|2", "D32|2"] },
    ]),
  },
  {
    programme: "Scienze Forestali e Ambientali [b019]",
    sources: degreeSources(BASE, ANNO, "scienze-forestali-e-ambientali-b019", "ScuoladiAgraria", [
      { year: 2, corso: "B019", anno2: ["GEN|2"] },
      { year: 3, corso: "B019", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Forestali e Ambientali [b396]",
    sources: degreeSources(BASE, ANNO, "scienze-forestali-e-ambientali-b396", "ScuoladiAgraria", [
      { year: 1, corso: "B396", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B326", anno2: ["GEN|1"] },
      { year: 2, corso: "B035", anno2: ["GEN|2"] },
      { year: 3, corso: "B035", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B180", anno2: ["GEN|1"] },
      { year: 2, corso: "B180", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Motorie, Sport e Salute",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-sport-e-salute", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B318", anno2: ["GEN|1"] },
      { year: 2, corso: "B122", anno2: ["GEN|2"] },
      { year: 3, corso: "B122", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-naturali", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B325", anno2: ["GEN|1"] },
      { year: 2, corso: "B033", anno2: ["GEN|2"] },
      { year: 3, corso: "B033", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche e Management della Formazione per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche-e-management-della-formazione-per-lo-sviluppo-sostenibile", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B389", anno2: ["GEN|1"] },
      { year: 2, corso: "B260", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-magistrale", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B403", anno2: ["D76|1", "F085|1", "D77|1", "D75|1", "D78|1"] },
      { year: 2, corso: "B403", anno2: ["D76|2", "F085|2", "D77|2", "D75|2", "D78|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-triennale", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 2, corso: "B037", anno2: ["D76|2", "D77|2", "D75|2", "D78|2"] },
      { year: 3, corso: "B037", anno2: ["D76|3", "D77|3", "D75|3", "D78|3"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B181", anno2: ["GEN|1"] },
      { year: 2, corso: "B181", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Storiche",
    sources: degreeSources(BASE, ANNO, "scienze-storiche", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B380", anno2: ["GEN|1"] },
      { year: 2, corso: "B111", anno2: ["F039|2", "F038|2"] },
    ]),
  },
  {
    programme: "Scienze Umanistiche per la Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-umanistiche-per-la-comunicazione", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B316", anno2: ["GEN|1"] },
      { year: 2, corso: "B195", anno2: ["GEN|2"] },
      { year: 3, corso: "B195", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Vivaistiche e Progettazione degli Spazi Verdi [b398]",
    sources: degreeSources(BASE, ANNO, "scienze-vivaistiche-e-progettazione-degli-spazi-verdi-b398", "ScuoladiAgraria", [
      { year: 1, corso: "B398", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "SFM", anno2: ["A|1", "B|1", "C|1", "D|1", "E|1", "F|1", "N|1", "O|1", "P|1", "Q|1", "U|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale (magistrale)",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-magistrale", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B330", anno2: ["GEN|1"] },
      { year: 2, corso: "B330", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Servizio Sociale (triennale)",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-triennale", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 2, corso: "B201", anno2: ["GEN|2"] },
      { year: 3, corso: "B201", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Sociologia e Sfide Globali",
    sources: degreeSources(BASE, ANNO, "sociologia-e-sfide-globali", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B383", anno2: ["GEN|1"] },
      { year: 2, corso: "B383", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Software: Science and Technology",
    sources: degreeSources(BASE, ANNO, "software-science-and-technology", "ScuoladiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "B335", anno2: ["GEN|1"] },
      { year: 2, corso: "B255", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Statistica",
    sources: degreeSources(BASE, ANNO, "statistica", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B331", anno2: ["GEN|1"] },
      { year: 2, corso: "B039", anno2: ["GEN|2"] },
      { year: 3, corso: "B039", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Statistica e Data Science",
    sources: degreeSources(BASE, ANNO, "statistica-e-data-science", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B379", anno2: ["F076|1", "F075|1"] },
      { year: 2, corso: "B236", anno2: ["F076|2", "F075|2"] },
    ]),
  },
  {
    programme: "Storia",
    sources: degreeSources(BASE, ANNO, "storia", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B332", anno2: ["GEN|1"] },
      { year: 2, corso: "B040", anno2: ["GEN|2"] },
      { year: 3, corso: "B040", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Storia Dell'arte",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B384", anno2: ["GEN|1"] },
      { year: 2, corso: "B115", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Storia e Tutela dei Beni Archeologici, Artistici, Archivistici e Librari",
    sources: degreeSources(BASE, ANNO, "storia-e-tutela-dei-beni-archeologici-artistici-archivistici-e-librari", "ScuoladiStudiUmanisticiedellaFormazione", [
      { year: 1, corso: "B392", anno2: ["B51|1", "B55|1", "B52|1"] },
      { year: 2, corso: "B001", anno2: ["B51|2", "B55|2", "B52|2"] },
      { year: 3, corso: "B001", anno2: ["B51|3", "B55|3", "B52|3"] },
    ]),
  },
  {
    programme: "Strategie di Comunicazione nella Società Digitale",
    sources: degreeSources(BASE, ANNO, "strategie-di-comunicazione-nella-societa-digitale", "ScuoladiScienzePoliticheCesareAlfieri", [
      { year: 1, corso: "B419", anno2: ["GEN|1"] },
      { year: 2, corso: "B419", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Sustainable Business for Societal Challenges",
    sources: degreeSources(BASE, ANNO, "sustainable-business-for-societal-challenges", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B314", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Sustainable Business for Societal Challenges.",
    sources: degreeSources(BASE, ANNO, "sustainable-business-for-societal-challenges-2", "ScuoladiEconomiaeManagement", [
      { year: 2, corso: "B247", anno2: ["GEN|2"] },
      { year: 3, corso: "B247", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti (magistrale)",
    sources: degreeSources(BASE, ANNO, "sviluppo-sostenibile-cooperazione-e-gestione-dei-conflitti-magistrale", "ScuoladiEconomiaeManagement", [
      { year: 1, corso: "B328", anno2: ["GEN|1"] },
      { year: 2, corso: "B328", anno2: ["F015|2", "F014|2", "F016|2"] },
    ]),
  },
  {
    programme: "Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti (triennale)",
    sources: degreeSources(BASE, ANNO, "sviluppo-sostenibile-cooperazione-e-gestione-dei-conflitti-triennale", "ScuoladiEconomiaeManagement", [
      { year: 2, corso: "B243", anno2: ["F015|2", "F014|2", "F016|2"] },
      { year: 3, corso: "B243", anno2: ["F015|3", "F014|3", "F016|3"] },
    ]),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro)",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B179", anno2: ["GEN|1"] },
      { year: 2, corso: "B179", anno2: ["GEN|2"] },
      { year: 3, corso: "B179", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B174", anno2: ["GEN|1"] },
      { year: 2, corso: "B174", anno2: ["GEN|2"] },
      { year: 3, corso: "B174", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Neurofisiopatologia (abilitante alla Professione Sanitaria di Tecnico di Neurofisiopatologia)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-neurofisiopatologia-abilitante-alla-professione-sanitaria-di-tecnico-di-neurofisiopatologia", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B202", anno2: ["GEN|1"] },
      { year: 2, corso: "B202", anno2: ["GEN|2"] },
      { year: 3, corso: "B202", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B176", anno2: ["GEN|1"] },
      { year: 2, corso: "B176", anno2: ["GEN|2"] },
      { year: 3, corso: "B176", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche e Tecnologie per le Costruzioni e il Territorio",
    sources: degreeSources(BASE, ANNO, "tecniche-e-tecnologie-per-le-costruzioni-e-il-territorio", "ScuoladiIngegneria", [
      { year: 1, corso: "B273", anno2: ["GEN|1"] },
      { year: 2, corso: "B273", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Tecniche Ortopediche (abilitante alla Professione Sanitaria di Tecnico Ortopedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-ortopediche-abilitante-alla-professione-sanitaria-di-tecnico-ortopedico", "ScuoladiScienzedellaSaluteUmana", [
      { year: 1, corso: "B177", anno2: ["GEN|1"] },
      { year: 2, corso: "B177", anno2: ["GEN|2"] },
      { year: 3, corso: "B177", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecnologie Alimentari [b024]",
    sources: degreeSources(BASE, ANNO, "tecnologie-alimentari-b024", "ScuoladiAgraria", [
      { year: 2, corso: "B024", anno2: ["GEN|2"] },
      { year: 3, corso: "B024", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecnologie Alimentari [b320]",
    sources: degreeSources(BASE, ANNO, "tecnologie-alimentari-b320", "ScuoladiAgraria", [
      { year: 1, corso: "B320", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Tecnologie e Trasformazioni Avanzate per il Settore Legno Arredo Edilizia [b272]",
    sources: degreeSources(BASE, ANNO, "tecnologie-e-trasformazioni-avanzate-per-il-settore-legno-arredo-edilizia-b272", "ScuoladiAgraria", [
      { year: 1, corso: "B272", anno2: ["GEN|1"] },
      { year: 2, corso: "B272", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Tropical and Subtropical Agriculture [b421]",
    sources: degreeSources(BASE, ANNO, "tropical-and-subtropical-agriculture-b421", "ScuoladiAgraria", [
      { year: 1, corso: "B421", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Viticoltura ed Enologia [b022]",
    sources: degreeSources(BASE, ANNO, "viticoltura-ed-enologia-b022", "ScuoladiAgraria", [
      { year: 2, corso: "B022", anno2: ["GEN|2"] },
      { year: 3, corso: "B022", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Viticoltura ed Enologia [b399]",
    sources: degreeSources(BASE, ANNO, "viticoltura-ed-enologia-b399", "ScuoladiAgraria", [
      { year: 1, corso: "B399", anno2: ["GEN|1"] },
    ]),
  },
];

export const unifi: UniversityPreset = {
  id: "unifi-informatica",
  name: "Università degli Studi di Firenze",
  shortName: "Università di Firenze",
  city: "Firenze",
  programme: "Informatica",
  liveSources: true,
  portalUrl: "https://sol.unifi.it",
  sources: [],
  livePrograms,
};
