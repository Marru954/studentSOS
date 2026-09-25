/**
 * Preset: Università degli Studi di Ferrara — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unife_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://aule.unife.it/AgendaStudenti";
const ANNO = "2026";
/** Percorsi abilitanti (classi a0xx/ab22/ac22): l'agendaweb li serve ancora sotto l'anno 2025 (verificato 2026-09-25; con 2026 = 0 celle). */
const ANNO_2025 = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "A012 - Discipline Letterarie Nell'istruzione di i e Ii Grado",
    sources: degreeSources(BASE, ANNO_2025, "a012-discipline-letterarie-nell-istruzione-di-i-e-ii-grado", "", [
      { year: 1, corso: "3298", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A018 - Filosofia e Scienze Umane",
    sources: degreeSources(BASE, ANNO_2025, "a018-filosofia-e-scienze-umane", "", [
      { year: 1, corso: "3226", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A020 - Fisica",
    sources: degreeSources(BASE, ANNO_2025, "a020-fisica", "", [
      { year: 1, corso: "3273", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A026 - Matematica",
    sources: degreeSources(BASE, ANNO_2025, "a026-matematica", "", [
      { year: 1, corso: "3228", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A027 - Matematica e Fisica",
    sources: degreeSources(BASE, ANNO_2025, "a027-matematica-e-fisica", "", [
      { year: 1, corso: "3229", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A028 - Matematica e Scienze",
    sources: degreeSources(BASE, ANNO_2025, "a028-matematica-e-scienze", "", [
      { year: 1, corso: "3230", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A034 - Scienze e Tecnologie Chimiche",
    sources: degreeSources(BASE, ANNO_2025, "a034-scienze-e-tecnologie-chimiche", "", [
      { year: 1, corso: "3294", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A041 - Scienze e Tecnologie Informatiche",
    sources: degreeSources(BASE, ANNO_2025, "a041-scienze-e-tecnologie-informatiche", "", [
      { year: 1, corso: "3295", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A047 - Scienze Matematiche Applicate",
    sources: degreeSources(BASE, ANNO_2025, "a047-scienze-matematiche-applicate", "", [
      { year: 1, corso: "3231", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A048 - Scienze Motorie e Sportive Nell'istruzione Secondaria di i e Ii Grado",
    sources: degreeSources(BASE, ANNO_2025, "a048-scienze-motorie-e-sportive-nell-istruzione-secondaria-di-i-e-ii-grado", "", [
      { year: 1, corso: "3302", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A050 - Scienze Nat, Chim e Biolog",
    sources: degreeSources(BASE, ANNO_2025, "a050-scienze-nat-chim-e-biolog", "", [
      { year: 1, corso: "3232", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "A060 - Tecnologia nella Scuola Secondaria di i Grado",
    sources: degreeSources(BASE, ANNO_2025, "a060-tecnologia-nella-scuola-secondaria-di-i-grado", "", [
      { year: 1, corso: "3297", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "Ab22 - Lingue e Culture Straniere Nell'istruzione Secondaria di i e Ii Grado (inglese)",
    sources: degreeSources(BASE, ANNO_2025, "ab22-lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-ii-grado-inglese", "", [
      { year: 1, corso: "3301", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "Ac22 - Lingue e Culture Straniere Nell'istruzione Secondaria i e Ii Grado (spagnolo)",
    sources: degreeSources(BASE, ANNO_2025, "ac22-lingue-e-culture-straniere-nell-istruzione-secondaria-i-e-ii-grado-spagnolo", "", [
      { year: 1, corso: "3303", anno2: ["PDS30B|1", "PDS36E|1", "PDS60A|1"] },
    ]),
  },
  {
    programme: "Biologia Molecolare Genomica e Biodiversità",
    sources: degreeSources(BASE, ANNO, "biologia-molecolare-genomica-e-biodiversita", "", [
      { year: 1, corso: "3180-25", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "3180-25", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "", [
      { year: 3, corso: "1164", anno2: ["2-2020|3", "1-2020|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Agrarie per la Filiera Agro-alimentare",
    sources: degreeSources(BASE, ANNO, "biotecnologie-agrarie-per-la-filiera-agro-alimentare", "", [
      { year: 1, corso: "3159-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3159-25", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Biotecnologie Industriali dei Biofarmaci, Cosmetici e Nutraceutici",
    sources: degreeSources(BASE, ANNO, "biotecnologie-industriali-dei-biofarmaci-cosmetici-e-nutraceutici", "", [
      { year: 1, corso: "3179-25", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "3179-25", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Biotecnologie Mediche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche", "", [
      { year: 3, corso: "3105", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Biotecnologie per la Medicina Traslazionale",
    sources: degreeSources(BASE, ANNO, "biotecnologie-per-la-medicina-traslazionale", "", [
      { year: 1, corso: "3160-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3160-25", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "", [
      { year: 1, corso: "1138-25", anno2: ["PDS 2010|1"] },
      { year: 2, corso: "1138-25", anno2: ["PDS 2010|2"] },
      { year: 3, corso: "1138", anno2: ["PDS 2010|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "", [
      { year: 1, corso: "3209-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3209-25", anno2: ["PDS0|2"] },
      { year: 3, corso: "3209", anno2: ["PDS0|3"] },
      { year: 4, corso: "3209", anno2: ["PDS0|4"] },
      { year: 5, corso: "3209", anno2: ["PDS0|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico) (1151)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico-1151", "", [
      { year: 5, corso: "1151", anno2: ["PDS0-2009|5"] },
    ]),
  },
  {
    programme: "Design del Prodotto Industriale",
    sources: degreeSources(BASE, ANNO, "design-del-prodotto-industriale", "DipartimentodiArchitettura", [
      { year: 3, corso: "1219", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Design di Prodotto e Servizio per la Cultura e la Salute",
    sources: degreeSources(BASE, ANNO, "design-di-prodotto-e-servizio-per-la-cultura-e-la-salute", "", [
      { year: 1, corso: "3263", anno2: ["COMUNE|1"] },
      { year: 2, corso: "3263", anno2: ["COMUNE|2"] },
    ]),
  },
  {
    programme: "DIETISTICA (abilitante alla Professione Sanitaria di Dietista)",
    sources: degreeSources(BASE, ANNO, "dietistica-abilitante-alla-professione-sanitaria-di-dietista", "", [
      { year: 1, corso: "1050", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1050", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "1050", anno2: ["PDS 2011|3"] },
    ]),
  },
  {
    programme: "Economia e Management per la Creazione di Valore",
    sources: degreeSources(BASE, ANNO, "economia-e-management-per-la-creazione-di-valore", "", [
      { year: 1, corso: "3275", anno2: ["3275-7|1", "3275-6|1"] },
      { year: 2, corso: "3275", anno2: ["3275-7|2", "3275-6|2"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico", "", [
      { year: 1, corso: "3208-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3208-25", anno2: ["PDS0|2"] },
      { year: 3, corso: "3208", anno2: ["PDS0|3"] },
      { year: 4, corso: "3208", anno2: ["PDS0|4"] },
      { year: 5, corso: "3208", anno2: ["PDS0|5"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico) (1150)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico-1150", "", [
      { year: 5, corso: "1150", anno2: ["PDS0-2009|5"] },
    ]),
  },
  {
    programme: "Filologie e Letterature Medievali e Moderne",
    sources: degreeSources(BASE, ANNO, "filologie-e-letterature-medievali-e-moderne", "", [
      { year: 1, corso: "3205", anno2: ["PDS0|1"] },
      { year: 2, corso: "3205", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Filosofia e Società Contemporanea",
    sources: degreeSources(BASE, ANNO, "filosofia-e-societa-contemporanea", "", [
      { year: 1, corso: "3258", anno2: ["PDS0|1"] },
      { year: 2, corso: "3258", anno2: ["PDS0|2"] },
      { year: 3, corso: "3188", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Fisica",
    sources: degreeSources(BASE, ANNO, "fisica", "", [
      { year: 3, corso: "1139", anno2: ["PDS 2010|3"] },
    ]),
  },
  {
    programme: "FISIOTERAPIA (abilitante alla Professione Sanitaria di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista", "", [
      { year: 1, corso: "1052", anno2: ["PDS0-2011|1"] },
      { year: 2, corso: "1052", anno2: ["PDS0-2011|2"] },
      { year: 3, corso: "1052", anno2: ["PDS0-2011|3"] },
    ]),
  },
  {
    programme: "Formazione, Comunicazione e Cittadinanza Digitale",
    sources: degreeSources(BASE, ANNO, "formazione-comunicazione-e-cittadinanza-digitale", "", [
      { year: 1, corso: "3270", anno2: ["PDS0|1"] },
      { year: 2, corso: "3270", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Green Economy and Sustainable Transitions",
    sources: degreeSources(BASE, ANNO, "green-economy-and-sustainable-transitions", "", [
      { year: 1, corso: "3276", anno2: ["PDS0|1"] },
      { year: 2, corso: "3276", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "IGIENE DENTALE (abilitante alla Professione Sanitaria di Igienista Dentale)",
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale", "", [
      { year: 1, corso: "1054", anno2: ["PDS0|1"] },
      { year: 2, corso: "1054", anno2: ["PDS0|2"] },
      { year: 3, corso: "1054", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "INFERMIERISTICA (abilitante alla Professione Sanitaria di Infermiere)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere", "", [
      { year: 1, corso: "1055", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1055", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "1055", anno2: ["PDS 2011|3"] },
    ]),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "", [
      { year: 3, corso: "1233", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "", [
      { year: 1, corso: "3257", anno2: ["PDS2|1", "PDS1|1", "PDS3|1", "P. 2|1", "PDS4|1", "P. 3|1", "P. 1|1"] },
      { year: 2, corso: "3257", anno2: ["PDS2|2", "PDS1|2", "PDS3|2", "P. 1|2", "PDS4|2", "P. 3|2", "P. 2|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-ambientale", "", [
      { year: 3, corso: "1029", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica e Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-informatica", "", [
      { year: 3, corso: "1328", anno2: ["PDS6|3", "PDS3|3", "PDS7|3", "PDS8|3", "PDS9|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica per L'ict",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-per-l-ict", "", [
      { year: 1, corso: "3046", anno2: ["PDS1|1", "PDS3|1", "PDS2|1"] },
      { year: 2, corso: "3046", anno2: ["PDS1|2", "PDS3|2", "PDS2|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica e dell Automazione",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-e-dell-automazione", "", [
      { year: 1, corso: "1229", anno2: ["PDS4|1", "PDS5|1", "PDS2|1", "PDS1|1", "PDS0|1", "PDS3|1"] },
      { year: 2, corso: "1229", anno2: ["PDS4|2", "PDS2|2", "PDS1|2", "PDS0|2", "PDS3|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-magistrale", "", [
      { year: 1, corso: "1230", anno2: ["PDS0|1"] },
      { year: 2, corso: "1230", anno2: ["PDS1|2", "PDS4|2", "PDS3|2", "PDS2|2", "PDS0|2", "PDS5|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "", [
      { year: 3, corso: "1028", anno2: ["PDS 2010|3"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale, Data Science e Big Data",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-data-science-e-big-data", "", [
      { year: 1, corso: "3207", anno2: ["BD1|1", "BD2|1", "DS|1"] },
      { year: 2, corso: "3207", anno2: ["BD1|2", "BD2|2", "DS|2"] },
    ]),
  },
  {
    programme: "Lettere, Arti e Archeologia",
    sources: degreeSources(BASE, ANNO, "lettere-arti-e-archeologia", "", [
      { year: 1, corso: "3260", anno2: ["PDS0|1"] },
      { year: 2, corso: "3260", anno2: ["2|2", "1|2"] },
      { year: 3, corso: "1167", anno2: ["2|3", "1|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne", "", [
      { year: 1, corso: "3272", anno2: ["PDS0|1"] },
      { year: 2, corso: "3272", anno2: ["PDS0|2"] },
      { year: 3, corso: "1168", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-straniere", "", [
      { year: 1, corso: "3262", anno2: ["DIDATTICA|1", "TRADUZIONE|1"] },
      { year: 2, corso: "3262", anno2: ["DIDATTICA|2", "TRADUZIONE|2"] },
    ]),
  },
  {
    programme: "LOGOPEDIA (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "", [
      { year: 1, corso: "1058", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1058", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "1058", anno2: ["PDS 2011|3"] },
    ]),
  },
  {
    programme: "Manager degli Itinerari Culturali",
    sources: degreeSources(BASE, ANNO, "manager-degli-itinerari-culturali", "", [
      { year: 1, corso: "3271", anno2: ["PDS0|1"] },
      { year: 2, corso: "3271", anno2: ["PDS0|2"] },
      { year: 3, corso: "3041", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "", [
      { year: 3, corso: "1141", anno2: ["APP|3", "DID|3", "GEN|3", "TEO|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "", [
      { year: 1, corso: "3269", anno2: ["APP|1", "DID|1", "GEN|1"] },
      { year: 2, corso: "3269", anno2: ["APP|2", "DID|2", "GEN|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "", [
      { year: 3, corso: "1023", anno2: ["PDS0-2009|3"] },
      { year: 4, corso: "1023", anno2: ["PDS0-2009|4"] },
      { year: 5, corso: "1023", anno2: ["PDS0-2009|5"] },
      { year: 6, corso: "1023", anno2: ["PDS0-2009|6"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "", [
      { year: 3, corso: "1024", anno2: ["PDS0|3"] },
      { year: 4, corso: "1024", anno2: ["PDS0|4"] },
      { year: 5, corso: "1024", anno2: ["PDS0-2009|5"] },
      { year: 6, corso: "1024", anno2: ["PDS0-2009|6"] },
    ]),
  },
  {
    programme: "ORTOTTICA ED ASSISTENZA OFTALMOLOGICA (abilitante alla Professione Sanitaria di Ortottista ed Assistente di Oftalmologia)",
    sources: degreeSources(BASE, ANNO, "ortottica-ed-assistenza-oftalmologica-abilitante-alla-professione-sanitaria-di-ortottista-ed-assistente-di-oftalmologia", "", [
      { year: 1, corso: "1059", anno2: ["PDS0|1"] },
      { year: 2, corso: "1059", anno2: ["PDS0|2"] },
      { year: 3, corso: "1059", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "OSTETRICIA (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "", [
      { year: 1, corso: "1060", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1060", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "1060", anno2: ["PDS 2011|3"] },
    ]),
  },
  {
    programme: "Physics",
    sources: degreeSources(BASE, ANNO, "physics", "", [
      { year: 1, corso: "3254", anno2: ["PDS1|1"] },
    ]),
  },
  {
    programme: "Quaternario, Preistoria e Archeologia",
    sources: degreeSources(BASE, ANNO, "quaternario-preistoria-e-archeologia", "", [
      { year: 1, corso: "3264", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "3264", anno2: ["2|2", "1|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione", "", [
      { year: 1, corso: "3259", anno2: ["PDS0|1"] },
      { year: 2, corso: "3259", anno2: ["INF|2", "SOC|2"] },
      { year: 3, corso: "3170", anno2: ["INF|3", "SOC|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "", [
      { year: 3, corso: "1137", anno2: ["PDS0-2009|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "", [
      { year: 1, corso: "1148-25", anno2: ["CAT|1", "CME|1"] },
      { year: 2, corso: "1148-25", anno2: ["CAT|2", "CME|2"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie Tecniche Diagnostiche",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-tecniche-diagnostiche", "", [
      { year: 1, corso: "1072", anno2: ["PDS0|1"] },
      { year: 2, corso: "1072", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Scienze e Politiche per L'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-e-politiche-per-l-ambiente", "", [
      { year: 1, corso: "3237", anno2: ["PDS0|1"] },
      { year: 2, corso: "3237", anno2: ["PDS0|2"] },
      { year: 3, corso: "3237", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Dell'attività Motoria Preventiva e Adattata",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-dell-attivita-motoria-preventiva-e-adattata", "", [
      { year: 1, corso: "1026-25", anno2: ["COMUNE|1"] },
      { year: 2, corso: "1026-25", anno2: ["COMUNE|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-della-comunicazione", "", [
      { year: 1, corso: "3261", anno2: ["COPU2|1", "COPU1|1"] },
      { year: 2, corso: "3261", anno2: ["COPU2|2", "COPU1|2"] },
      { year: 3, corso: "1226", anno2: ["COPU2|3", "COPU1|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche", "", [
      { year: 3, corso: "1140", anno2: ["PDS0-2009|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche, Georisorse e Territorio",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-georisorse-e-territorio", "", [
      { year: 1, corso: "3268", anno2: ["PDS3|1", "PDS4|1", "PDS1|1", "PDS2|1"] },
      { year: 2, corso: "3268", anno2: ["PDS3|2", "PDS4|2", "PDS1|2", "PDS2|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "", [
      { year: 2, corso: "1070", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "Scienze Motorie",
    sources: degreeSources(BASE, ANNO, "scienze-motorie", "", [
      { year: 3, corso: "1025", anno2: ["PREVENTIVO|3", "TECN-SPORT|3"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "", [
      { year: 1, corso: "1071", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1071", anno2: ["PDS 2011|2"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "", [
      { year: 1, corso: "SFMC", anno2: ["PDS0|1"] },
    ]),
  },
  {
    programme: "Small Business Management in International Markets",
    sources: degreeSources(BASE, ANNO, "small-business-management-in-international-markets", "", [
      { year: 1, corso: "3238", anno2: ["PDS0|1"] },
      { year: 2, corso: "3238", anno2: ["PDS0|2"] },
    ]),
  },
  {
    programme: "TECNICA DELLA RIABILITAZIONE PSICHIATRICA (abilitante alla Professione Sanitaria di Tecnico della Riabilitazione Psichiatrica)",
    sources: degreeSources(BASE, ANNO, "tecnica-della-riabilitazione-psichiatrica-abilitante-alla-professione-sanitaria-di-tecnico-della-riabilitazione-psichiatrica", "", [
      { year: 1, corso: "1061", anno2: ["PDS0|1"] },
      { year: 2, corso: "1061", anno2: ["PDS0|2"] },
      { year: 3, corso: "1061", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "TECNICHE DI LABORATORIO BIOMEDICO (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "", [
      { year: 1, corso: "1062", anno2: ["PDS0|1"] },
      { year: 2, corso: "1062", anno2: ["PDS0|2"] },
      { year: 3, corso: "1062", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "TECNICHE DI RADIOLOGIA MEDICA, PER IMMAGINI e RADIOTERAPIA (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "", [
      { year: 1, corso: "1063", anno2: ["PDS0|1"] },
      { year: 2, corso: "1063", anno2: ["PDS0|2"] },
      { year: 3, corso: "1063", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Tecnologie Agrarie e Gestione Sostenibile degli Agroecosistemi",
    sources: degreeSources(BASE, ANNO, "tecnologie-agrarie-e-gestione-sostenibile-degli-agroecosistemi", "", [
      { year: 1, corso: "3225-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3225-25", anno2: ["PDS0|2"] },
      { year: 3, corso: "3225", anno2: ["PDS0|3"] },
    ]),
  },
  {
    programme: "Tecnologie per L'industria Digitale",
    sources: degreeSources(BASE, ANNO, "tecnologie-per-l-industria-digitale", "", [
      { year: 2, corso: "3183", anno2: ["INF|2", "MEC|2"] },
      { year: 3, corso: "3183", anno2: ["INF|3", "MEC|3"] },
    ]),
  },
  {
    programme: "Architettura  Terzo, Quarto e",
    sources: degreeSources(BASE, ANNO, "architettura-terzo-quarto-e", "DipartimentodiArchitettura", [
      { year: 3, corso: "1020", anno2: ["PDS0-2008|3"] },
      { year: 4, corso: "1020", anno2: ["PDS0-2008|4"] },
      { year: 5, corso: "1020", anno2: ["PDS0-2008|5"] },
    ], false),
  },
  {
    programme: "Architettura-primo e",
    sources: degreeSources(BASE, ANNO, "architettura-primo-e", "DipartimentodiArchitettura", [
      { year: 1, corso: "3278", anno2: ["PDS0-2008|1"] },
      { year: 2, corso: "3278", anno2: ["PDS0-2008|2"] },
    ], false),
  },
  {
    programme: "Biotecnologie - Primo e",
    sources: degreeSources(BASE, ANNO, "biotecnologie-primo-e", "", [
      { year: 1, corso: "1164-25", anno2: ["1164-25|1"] },
      { year: 2, corso: "1164-25", anno2: ["2-2020|2", "1-2020|2"] },
    ], false),
  },
  {
    programme: "Biotecnologie Mediche - Primo e",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche-primo-e", "", [
      { year: 1, corso: "3105-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "3105-25", anno2: ["PDS0|2"] },
    ], false),
  },
  {
    programme: "Comunicazione Digitale",
    sources: degreeSources(BASE, ANNO, "comunicazione-digitale", "", [
      { year: 1, corso: "3304", anno2: ["PDS0|1"] },
    ], false),
  },
  {
    programme: "Design del Prodotto Industriale - e",
    sources: degreeSources(BASE, ANNO, "design-del-prodotto-industriale-e", "DipartimentodiArchitettura", [
      { year: 1, corso: "3279", anno2: ["PDS0|1"] },
      { year: 2, corso: "3279", anno2: ["PDS0-2008|2"] },
    ], false),
  },
  {
    programme: "Economia - Primo e",
    sources: degreeSources(BASE, ANNO, "economia-primo-e", "", [
      { year: 1, corso: "3277", anno2: ["PDS0-2008_Gruppo A|1", "PDS0-2008_Gruppo B|1", "PDS0-2008_Gruppo C|1"] },
      { year: 2, corso: "3277", anno2: ["PDS0-2008_Gruppo A|2", "PDS0-2008_Gruppo B|2", "PDS0-2008_Gruppo C|2"] },
    ], false),
  },
  {
    programme: "Economia - Terzo Anno",
    sources: degreeSources(BASE, ANNO, "economia-terzo-anno", "", [
      { year: 3, corso: "1022", anno2: ["PDS0-2008|3"] },
    ], false),
  },
  {
    programme: "Fisica - Primo e",
    sources: degreeSources(BASE, ANNO, "fisica-primo-e", "", [
      { year: 1, corso: "3253", anno2: ["PDS 2010|1"] },
      { year: 2, corso: "3253", anno2: ["PDS 2010|2"] },
    ], false),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Sede Bolzano",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista-sede-bolzano", "", [
      { year: 1, corso: "1053", anno2: ["PDS0-2011|1"] },
      { year: 2, corso: "1053", anno2: ["PDS0-2011|2"] },
      { year: 3, corso: "1053", anno2: ["PDS0-2011|3"] },
    ], false),
  },
  {
    programme: "Food Safety And Food Risk Management",
    sources: degreeSources(BASE, ANNO, "food-safety-and-food-risk-management", "", [
      { year: 1, corso: "3305", anno2: ["PDS0|1"] },
    ], false),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Sede di Adria",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-di-adria", "", [
      { year: 1, corso: "3125", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "3125", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "3125", anno2: ["PDS 2011|3"] },
    ], false),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Sede di Pieve di Cento",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-sede-di-pieve-di-cento", "", [
      { year: 1, corso: "1057", anno2: ["PDS 2011|1"] },
      { year: 2, corso: "1057", anno2: ["PDS 2011|2"] },
      { year: 3, corso: "1057", anno2: ["PDS 2011|3"] },
    ], false),
  },
  {
    programme: "Informatica - Primo e",
    sources: degreeSources(BASE, ANNO, "informatica-primo-e", "", [
      { year: 1, corso: "3252", anno2: ["PDS0|1"] },
      { year: 2, corso: "3252", anno2: ["PDS0|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Civile e Ambientale - Primo e",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-ambientale-primo-e", "", [
      { year: 1, corso: "3256", anno2: ["PDS_RIG|1", "PDS_CIV|1", "PDS_AMB|1"] },
      { year: 2, corso: "3256", anno2: ["PDS_RIG|2", "PDS_CIV|2", "PDS_AMB|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Elettronica e Informatica - Primo e",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-informatica-primo-e", "", [
      { year: 1, corso: "3249", anno2: ["PDS0|1"] },
      { year: 2, corso: "3249", anno2: ["PDS0|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "", [
      { year: 1, corso: "3293", anno2: ["PDS2|1", "PDS1|1"] },
    ], false),
  },
  {
    programme: "Ingegneria Meccanica - Primo e",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-primo-e", "", [
      { year: 1, corso: "3255", anno2: ["PDS 2010|1"] },
      { year: 2, corso: "3255", anno2: ["PDS 2010|2"] },
    ], false),
  },
  {
    programme: "Matematica - Primo e",
    sources: degreeSources(BASE, ANNO, "matematica-primo-e", "", [
      { year: 1, corso: "3251", anno2: ["PDS0|1"] },
      { year: 2, corso: "3251", anno2: ["APP|2", "DID|2", "GEN|2", "TEO|2"] },
    ], false),
  },
  {
    programme: "Medicina e Chirurgia - Primo e",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-primo-e", "", [
      { year: 1, corso: "1023-25", anno2: ["PDS0-2009|1"] },
      { year: 2, corso: "1023-25", anno2: ["PDS0-2009|2"] },
    ], false),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria - Primo e",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-primo-e", "", [
      { year: 1, corso: "1024-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "1024-25", anno2: ["PDS0|2"] },
    ], false),
  },
  {
    programme: "Scienze Biologiche - Primo e",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-primo-e", "", [
      { year: 1, corso: "1137-25", anno2: ["PDS0-2009|1"] },
      { year: 2, corso: "1137-25", anno2: ["PDS0-2009|2"] },
    ], false),
  },
  {
    programme: "Scienze Geologiche - Primo e",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-primo-e", "", [
      { year: 1, corso: "3250", anno2: ["PDS0-2009|1"] },
      { year: 2, corso: "3250", anno2: ["PDS0-2009|2"] },
    ], false),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche - Profilo Infermieristico",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche-profilo-infermieristico", "", [
      { year: 1, corso: "1070-26", anno2: ["0|1"] },
    ], false),
  },
  {
    programme: "Scienze Motorie - Primo e",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-primo-e", "", [
      { year: 1, corso: "1025-25", anno2: ["PDS0|1"] },
      { year: 2, corso: "1025-25", anno2: ["PREVENTIVO|2", "TECN-SPORT|2"] },
    ], false),
  },
  {
    programme: "Sicurezza degli Alimenti e Gestione del Rischio Alimentare",
    sources: degreeSources(BASE, ANNO, "sicurezza-degli-alimenti-e-gestione-del-rischio-alimentare", "", [
      { year: 2, corso: "3191", anno2: ["PDS0|2"] },
    ], false),
  },
];

export const unife: UniversityPreset = {
  id: "unife-informatica",
  name: "Università degli Studi di Ferrara",
  shortName: "Università di Ferrara",
  city: "Ferrara",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
