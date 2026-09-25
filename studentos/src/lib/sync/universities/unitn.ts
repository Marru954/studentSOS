/**
 * Preset: Università degli Studi di Trento — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unitn_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.unitn.it/AgendaStudentiUnitn";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Artificial Intelligence Systems",
    sources: degreeSources(BASE, ANNO, "artificial-intelligence-systems", "", [
      { year: 1, corso: "0536H", anno2: ["P0503|1", "P0005|1"] },
      { year: 2, corso: "0536H", anno2: ["P0303|2", "P0103.1|2", "P0103.4|2", "P0103.3|2", "P0103.2|2", "P0403|2", "P0203|2"] },
    ]),
  },
  {
    programme: "Beni Culturali",
    sources: degreeSources(BASE, ANNO, "beni-culturali", "", [
      { year: 1, corso: "L1", anno2: ["Carriera ARCHEOLOGIA|1", "Carriera ARCHIVISTICA|1", "Carriera MUSICA E SPETTACOLO|1", "Carriera STORIA DELLARTE|1"] },
      { year: 2, corso: "L1", anno2: ["Carriera ARCHEOLOGIA|2", "Carriera ARCHIVISTICA E BIBLIOTECONOMIA|2", "Carriera MUSICA E SPETTACOLO|2", "Carriera STORIA DELLARTE|2"] },
      { year: 3, corso: "L1", anno2: ["Carriera ARCHEOLOGIA|3", "Carriera ARCHIVISTICA E BIBLIOTECONOMIA|3", "Carriera MUSICA E SPETTACOLO|3", "Carriera STORIA DELLARTE|3"] },
    ]),
  },
  {
    programme: "Bioengineering for Personalized Medicine",
    sources: degreeSources(BASE, ANNO, "bioengineering-for-personalized-medicine", "", [
      { year: 1, corso: "0347H", anno2: ["P0003|1"] },
      { year: 2, corso: "0347H", anno2: ["P0103|2", "P0203|2"] },
    ]),
  },
  {
    programme: "Cellular and Molecular Biotechnology",
    sources: degreeSources(BASE, ANNO, "cellular-and-molecular-biotechnology", "", [
      { year: 1, corso: "0524H", anno2: ["P0005|1"] },
      { year: 2, corso: "0524H", anno2: ["P0205D3|2", "P0405D3|2", "P0105D3|2"] },
    ]),
  },
  {
    programme: "Centro Linguistico d'Ateneo",
    sources: degreeSources(BASE, ANNO, "centro-linguistico-d-ateneo", "", [
      { year: 1, corso: "CLA", anno2: ["PDS0-2014|1"] },
    ]),
  },
  {
    programme: "Cognitive Science - Scienze Cognitive 0716H",
    sources: degreeSources(BASE, ANNO, "cognitive-science-scienze-cognitive-0716h", "", [
      { year: 1, corso: "0716H", anno2: ["P0107|1", "P0407|1", "P0307|1"] },
      { year: 2, corso: "0716H", anno2: ["P0107|2", "P0407|2", "P0307|2"] },
    ]),
  },
  {
    programme: "Comparative, European and International Legal Studies",
    sources: degreeSources(BASE, ANNO, "comparative-european-and-international-legal-studies", "", [
      { year: 1, corso: "0206G", anno2: ["P0002|1"] },
      { year: 2, corso: "0206G", anno2: ["P0002|2"] },
      { year: 3, corso: "0206G", anno2: ["P0002|3"] },
    ]),
  },
  {
    programme: "Computer Science",
    sources: degreeSources(BASE, ANNO, "computer-science", "", [
      { year: 1, corso: "0534H", anno2: ["P0205.2|1", "P0205.5|1", "P0205.6|1", "P0105.4|1", "P0105.5|1", "P0105.6|1", "P0105.1|1", "P0105.7|1", "P0105.2|1", "P0105.3|1"] },
      { year: 2, corso: "0534H", anno2: ["P0205.7|2", "P0205.2|2", "P0205.5|2", "P0205.6|2", "P0205.4|2", "P0105.4|2", "P0105.5|2", "P0105.6|2", "P0105.1|2", "P0105.7|2", "P0105.2|2", "P0105.3|2"] },
    ]),
  },
  {
    programme: "Culture e Beni Musicali",
    sources: degreeSources(BASE, ANNO, "culture-e-beni-musicali", "", [
      { year: 1, corso: "LM45", anno2: ["1|1"] },
      { year: 2, corso: "LM45", anno2: ["1|2"] },
    ]),
  },
  {
    programme: "Data Science",
    sources: degreeSources(BASE, ANNO, "data-science", "", [
      { year: 1, corso: "0625H", anno2: ["P0105|1", "P0205|1"] },
      { year: 2, corso: "0625H", anno2: ["P0105|2", "P0205|2", "P0305|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale",
    sources: degreeSources(BASE, ANNO, "educazione-professionale", "", [
      { year: 1, corso: "0710G", anno2: ["P0007|1"] },
      { year: 2, corso: "0710G", anno2: ["P0007|2"] },
      { year: 3, corso: "0710G", anno2: ["P0007|3"] },
    ]),
  },
  {
    programme: "Environmental Meteorology and Climate Physics",
    sources: degreeSources(BASE, ANNO, "environmental-meteorology-and-climate-physics", "", [
      { year: 1, corso: "0348H", anno2: ["P0003|1"] },
    ]),
  },
  {
    programme: "European and International Studies - Studi Europei e Internazionali",
    sources: degreeSources(BASE, ANNO, "european-and-international-studies-studi-europei-e-internazionali", "", [
      { year: 1, corso: "0806H", anno2: ["P0408|1"] },
      { year: 2, corso: "0806H", anno2: ["P0408|2"] },
    ]),
  },
  {
    programme: "Filologia e Critica Letteraria",
    sources: degreeSources(BASE, ANNO, "filologia-e-critica-letteraria", "", [
      { year: 1, corso: "LM14", anno2: ["Curriculum Italianistica e critica letteraria|1", "Curriculum Storia della tradizione classica e medievale|1"] },
      { year: 2, corso: "LM14", anno2: ["Curriculum Italianistica e critica letteraria|2", "Curriculum Storia della tradizione classica e medievale|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "", [
      { year: 1, corso: "L5", anno2: ["Carriera - ETICA POLITICA E SCIENZE DELLE RELIGIONI|1", "Carriera - LOGICA E FILOSOFIA DELLE SCIENZE|1", "Carriera - STORIA DELLA FILOSOFIA SCIENZE STORICHE E SCIENZE UMANE|1"] },
      { year: 2, corso: "L5", anno2: ["Carriera - ETICA POLITICA E SCIENZE DELLE RELIGIONI|2", "Carriera - LOGICA TEORIA DEL LINGUAGGIO E MATEMATICA|2", "Carriera - STORIA DELLA FILOSOFIA SCIENZE STORICHE E SCIENZE UMANE|2"] },
      { year: 3, corso: "L5", anno2: ["Carriera - ETICA POLITICA E SCIENZE DELLE RELIGIONI|3", "Carriera - LOGICA TEORIA DEL LINGUAGGIO E MATEMATICA|3", "Carriera - STORIA DELLA FILOSOFIA SCIENZE STORICHE E SCIENZE UMANE|3"] },
    ]),
  },
  {
    programme: "Filosofia e Linguaggi della Modernità",
    sources: degreeSources(BASE, ANNO, "filosofia-e-linguaggi-della-modernita", "", [
      { year: 1, corso: "LM78", anno2: ["Carriera -ETICA POLITICA E SCENZE DELLE RELIGIONI|1", "Carriera - LOGICA E FILOSOFIA DELLE SCIENZE|1", "Carriera - STORIA DELLA FILOSOFIA SCIENZE STORICHE E SCIENZE UMANE|1"] },
      { year: 2, corso: "LM78", anno2: ["Carriera - ETICA POLITICA E SCIENZE DELLE RELIGIONI|2", "Carriera - LOGICA TEORIA DEI LINGUAGGI E MATEMATICA|2", "Carriera - STORIA DELLA FILOSOFIA SCIENZE STORICHE E SCIENZE UMANE|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "", [
      { year: 1, corso: "0526G", anno2: ["P0005|1"] },
      { year: 2, corso: "0526G", anno2: ["P0005|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "", [
      { year: 3, corso: "0513G", anno2: ["P0005|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "", [
      { year: 1, corso: "0205F", anno2: ["P0002|1"] },
      { year: 2, corso: "0205F", anno2: ["P0002|2"] },
      { year: 3, corso: "0205F", anno2: ["P0002|3"] },
      { year: 4, corso: "0205F", anno2: ["P0002|4"] },
      { year: 5, corso: "0205F", anno2: ["P0002|5"] },
    ]),
  },
  {
    programme: "Global Affairs: Geopolitics and Sustainability",
    sources: degreeSources(BASE, ANNO, "global-affairs-geopolitics-and-sustainability", "", [
      { year: 1, corso: "0631H", anno2: ["P0006|1"] },
      { year: 2, corso: "0631H", anno2: ["P0006|2"] },
    ]),
  },
  {
    programme: "Global Law Making",
    sources: degreeSources(BASE, ANNO, "global-law-making", "", [
      { year: 1, corso: "0207H", anno2: ["P0002|1"] },
      { year: 2, corso: "0207H", anno2: ["P0002|2"] },
    ]),
  },
  {
    programme: "Human Computer Interaction 0715H",
    sources: degreeSources(BASE, ANNO, "human-computer-interaction-0715h", "", [
      { year: 1, corso: "0715H", anno2: ["P0007|1"] },
      { year: 2, corso: "0715H", anno2: ["P0007|2"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "", [
      { year: 1, corso: "0532G", anno2: ["P0705|1", "P0405|1"] },
      { year: 2, corso: "0532G", anno2: ["P0705|2", "P0405|2"] },
      { year: 3, corso: "0514G", anno2: ["P0705|3", "P0405|3"] },
    ]),
  },
  {
    programme: "Information Engineering",
    sources: degreeSources(BASE, ANNO, "information-engineering", "", [
      { year: 1, corso: "0535H", anno2: ["P0503|1", "P0603|1", "P0003|1"] },
      { year: 2, corso: "0535H", anno2: ["P0403|2", "P0203|2", "P0103|2", "P0303|2"] },
    ]),
  },
  {
    programme: "Ingegneria Edile-architettura",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile-architettura", "", [
      { year: 1, corso: "0354F (1- 2)", anno2: ["P0003|1"] },
      { year: 2, corso: "0354F (1- 2)", anno2: ["P0003|2"] },
      { year: 3, corso: "0336F (3-5)", anno2: ["P0003|3"] },
      { year: 4, corso: "0336F (3-5)", anno2: ["P0003|4"] },
      { year: 5, corso: "0336F (3-5)", anno2: ["P0003|5"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-energetica", "", [
      { year: 1, corso: "0351H", anno2: ["P0003|1"] },
      { year: 2, corso: "0351H", anno2: ["P0203|2", "P0103|2"] },
    ]),
  },
  {
    programme: "Ingegneria Industriale",
    sources: degreeSources(BASE, ANNO, "ingegneria-industriale", "", [
      { year: 1, corso: "0528G", anno2: ["P0003|1"] },
      { year: 2, corso: "0528G", anno2: ["P0003|2"] },
      { year: 3, corso: "0327G", anno2: ["P0303|3", "P0503|3", "P0403|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica, delle Comunicazioni ed Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-delle-comunicazioni-ed-elettronica", "", [
      { year: 1, corso: "0533G", anno2: ["P0403|1", "P0003|1"] },
      { year: 2, corso: "0533G", anno2: ["P0403|2", "P0003|2"] },
      { year: 3, corso: "0339G", anno2: ["P0403|3", "P0103|3", "P0203|3", "P0303|3"] },
    ]),
  },
  {
    programme: "Innovation Management - Management Dell'innovazione",
    sources: degreeSources(BASE, ANNO, "innovation-management-management-dell-innovazione", "", [
      { year: 1, corso: "0136H", anno2: ["P0001|1"] },
    ]),
  },
  {
    programme: "Interfacce e Tecnologie della Comunicazione 0704G",
    sources: degreeSources(BASE, ANNO, "interfacce-e-tecnologie-della-comunicazione-0704g", "", [
      { year: 3, corso: "0704G", anno2: ["P0007|3"] },
    ]),
  },
  {
    programme: "Interfacce e Tecnologie della Comunicazione 0713G",
    sources: degreeSources(BASE, ANNO, "interfacce-e-tecnologie-della-comunicazione-0713g", "", [
      { year: 1, corso: "0713G", anno2: ["P0007|1"] },
      { year: 2, corso: "0713G", anno2: ["P0007|2"] },
    ]),
  },
  {
    programme: "International Security Studies",
    sources: degreeSources(BASE, ANNO, "international-security-studies", "", [
      { year: 1, corso: "0807H", anno2: ["P0408|1"] },
    ]),
  },
  {
    programme: "Letterature Euroamericane, Traduzione e Critica Letteraria",
    sources: degreeSources(BASE, ANNO, "letterature-euroamericane-traduzione-e-critica-letteraria", "", [
      { year: 1, corso: "LM37", anno2: ["Standard|1"] },
      { year: 2, corso: "LM37", anno2: ["Standard|2"] },
    ]),
  },
  {
    programme: "Lettere e Storia",
    sources: degreeSources(BASE, ANNO, "lettere-e-storia", "", [
      { year: 1, corso: "L10", anno2: ["Carriera LETTERE CLASSICHE|1", "Carriera LETTERE MODERNE|1", "Carriera STORIA|1"] },
      { year: 2, corso: "L10", anno2: ["Carriera LETTERE CLASSICHE|2", "Carriera LETTERE MODERNE|2", "Carriera STORIA|2"] },
    ]),
  },
  {
    programme: "Lingue Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-moderne", "", [
      { year: 1, corso: "L11", anno2: ["Percorso LETTERATURE LINGUE E TRADUZIONE|1", "Percorso LINGUE PER LINTERMEDIAZIONE TURISTICA E DIMPRESA|1"] },
      { year: 2, corso: "L11", anno2: ["Percorso LETTERATURE LINGUE E TRADUZIONE|2", "Percorso LINGUE PER LINTERMEDIAZIONE TURISTICA E DIMPRESA|2"] },
      { year: 3, corso: "L11", anno2: ["Percorso LETTERATURE LINGUE E TRADUZIONE|3", "Percorso LINGUE PER LINTERMEDIAZIONE TURISTICA E DIMPRESA|3"] },
    ]),
  },
  {
    programme: "Lingue Moderne nel Turismo e nella Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "lingue-moderne-nel-turismo-e-nella-cooperazione-internazionale", "", [
      { year: 1, corso: "LM38", anno2: ["Standard|1"] },
      { year: 2, corso: "LM38", anno2: ["Standard|2"] },
    ]),
  },
  {
    programme: "Management - EMBS",
    sources: degreeSources(BASE, ANNO, "management-embs", "", [
      { year: 1, corso: "0138H", anno2: ["P0001|1"] },
    ]),
  },
  {
    programme: "Management and Industrial Systems Engineering",
    sources: degreeSources(BASE, ANNO, "management-and-industrial-systems-engineering", "", [
      { year: 1, corso: "0529H", anno2: ["P0003|1"] },
      { year: 2, corso: "0529H", anno2: ["P0103|2", "P0203|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "", [
      { year: 1, corso: "0537G", anno2: ["P0305|1"] },
      { year: 2, corso: "0537G", anno2: ["P0305|2"] },
      { year: 3, corso: "0515G", anno2: ["P0305|3"] },
    ]),
  },
  {
    programme: "Materials Engineering",
    sources: degreeSources(BASE, ANNO, "materials-engineering", "", [
      { year: 1, corso: "0531H", anno2: ["P0003D2|1"] },
      { year: 2, corso: "0531H", anno2: ["EIT SM EX|2", "P0203D2|2", "P0103D2|2"] },
    ]),
  },
  {
    programme: "Mathematics",
    sources: degreeSources(BASE, ANNO, "mathematics", "", [
      { year: 1, corso: "0538H", anno2: ["P0305|1", "P0605|1", "P0205|1", "P0805|1"] },
      { year: 2, corso: "0538H", anno2: ["P0305|2", "P0605|2", "P0805|2"] },
    ]),
  },
  {
    programme: "Mechatronics Engineering",
    sources: degreeSources(BASE, ANNO, "mechatronics-engineering", "", [
      { year: 2, corso: "0530H", anno2: ["EIT|2", "P0203|2", "P0303|2", "P0103|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "", [
      { year: 2, corso: "1003S", anno2: ["PDS0001|2"] },
      { year: 3, corso: "1001S", anno2: ["PDS0-2020|3"] },
      { year: 4, corso: "1001S", anno2: ["PDS0-2020|4"] },
      { year: 5, corso: "1001S", anno2: ["PDS0-2020|5"] },
      { year: 6, corso: "1001S", anno2: ["PDS0-2020|6"] },
    ]),
  },
  {
    programme: "Metodologia, Organizzazione e Valutazione dei Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "metodologia-organizzazione-e-valutazione-dei-servizi-sociali", "", [
      { year: 1, corso: "0619H", anno2: ["P0006|1"] },
      { year: 2, corso: "0619H", anno2: ["P0006|2"] },
    ]),
  },
  {
    programme: "Organizzazione,società e Tecnologia",
    sources: degreeSources(BASE, ANNO, "organizzazione-societa-e-tecnologia", "", [
      { year: 1, corso: "0624H", anno2: ["P0006D1|1"] },
      { year: 2, corso: "0624H", anno2: ["P0006D1|2"] },
    ]),
  },
  {
    programme: "Physics",
    sources: degreeSources(BASE, ANNO, "physics", "", [
      { year: 1, corso: "0527H", anno2: ["P0005|1"] },
      { year: 2, corso: "0527H", anno2: ["P0005|2"] },
    ]),
  },
  {
    programme: "Psicologia 0714H",
    sources: degreeSources(BASE, ANNO, "psicologia-0714h", "", [
      { year: 1, corso: "0714H", anno2: ["P0207|1", "P0307|1", "P0107|1"] },
      { year: 2, corso: "0714H", anno2: ["P0207|2", "P0307|2", "P0107|2"] },
    ]),
  },
  {
    programme: "Quantitative and Computational Biology",
    sources: degreeSources(BASE, ANNO, "quantitative-and-computational-biology", "", [
      { year: 1, corso: "0525H", anno2: ["P0205|1", "P0505|1"] },
      { year: 2, corso: "0525H", anno2: ["P0005|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche di Psicologia Cognitiva 0705G",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-di-psicologia-cognitiva-0705g", "", [
      { year: 3, corso: "0705G", anno2: ["P0007|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche di Psicologia Cognitiva 0712G",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-di-psicologia-cognitiva-0712g", "", [
      { year: 1, corso: "0712G", anno2: ["P0007|1"] },
      { year: 2, corso: "0712G", anno2: ["P0007|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Biomolecolari",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-biomolecolari", "", [
      { year: 1, corso: "0523G", anno2: ["P0005|1"] },
      { year: 2, corso: "0523G", anno2: ["P0005|2"] },
      { year: 3, corso: "0516G", anno2: ["P0005|3"] },
    ]),
  },
  {
    programme: "Scienze Motorie, Sport e Benessere",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-sport-e-benessere", "", [
      { year: 1, corso: "0711G", anno2: ["P0007|1"] },
      { year: 2, corso: "0711G", anno2: ["P0007|2"] },
      { year: 3, corso: "0711G", anno2: ["P0007|3"] },
    ]),
  },
  {
    programme: "Scienze Storiche",
    sources: degreeSources(BASE, ANNO, "scienze-storiche", "", [
      { year: 1, corso: "LM84", anno2: ["Percorso - Antichita e Medioevo|1", "Percorso - Societa e culture dal Medioevo allEta contemporanea|1", "Percorso - Societa e Istituzioni nellEta moderna e contemporanea|1", "Percorso - Storia pubblica e forme della  memoria|1"] },
      { year: 2, corso: "LM84", anno2: ["Percorso - Antichita e Medioevo|2", "Percorso - Societa e culture dal Medioevo allEta contemporanea|2", "Percorso - Societa e Istituzioni nellEta moderna e contemporanea|2", "Percorso - Storia pubblica e forme della memoria|2"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "", [
      { year: 1, corso: "0622G/0628G", anno2: ["P0006D1|1"] },
      { year: 2, corso: "0622G/0628G", anno2: ["P0006D1|2"] },
      { year: 3, corso: "0622G/0628G", anno2: ["P0006D1|3"] },
    ]),
  },
  {
    programme: "Sociologia",
    sources: degreeSources(BASE, ANNO, "sociologia", "", [
      { year: 1, corso: "0611G/0626G", anno2: ["P0006|1"] },
      { year: 2, corso: "0611G/0626G", anno2: ["P0006|2"] },
      { year: 3, corso: "0611G/0626G", anno2: ["P0706D1|3", "P0606D1|3", "P0506D1|3", "P0406D1|3"] },
    ]),
  },
  {
    programme: "Sociology and Social Research - Sociologia e Ricerca Sociale",
    sources: degreeSources(BASE, ANNO, "sociology-and-social-research-sociologia-e-ricerca-sociale", "", [
      { year: 1, corso: "0621H", anno2: ["P0006|1"] },
      { year: 2, corso: "0621H", anno2: ["P0006|2"] },
    ]),
  },
  {
    programme: "Storia Dell'arte e Studi Museali",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte-e-studi-museali", "", [
      { year: 1, corso: "LM89", anno2: ["Standard|1"] },
      { year: 2, corso: "LM89", anno2: ["Standard|2"] },
    ]),
  },
  {
    programme: "Studi Internazionali",
    sources: degreeSources(BASE, ANNO, "studi-internazionali", "", [
      { year: 1, corso: "0620G/0627G", anno2: ["P0006|1"] },
      { year: 2, corso: "0620G/0627G", anno2: ["P0006D1|2"] },
      { year: 3, corso: "0620G/0627G", anno2: ["P0206|3", "P0106|3"] },
    ]),
  },
  {
    programme: "Studi Storici e Filologico-letterari",
    sources: degreeSources(BASE, ANNO, "studi-storici-e-filologico-letterari", "", [
      { year: 3, corso: "L10-", anno2: ["Carriera - LETTERE CLASSICHE|3", "Carriera - LETTERE MODERNE|3", "Carriera - STORIA|3"] },
    ]),
  },
  {
    programme: "Agrifood Innovation Management (a.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "agrifood-innovation-management-a-a-2026-27", "", [
      { year: 1, corso: "0914H", anno2: ["P0109|1"] },
      { year: 2, corso: "0914H", anno2: ["P0109|2"] },
    ], false),
  },
  {
    programme: "Amministrazione Aziendale e Diritto - (1° e - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "amministrazione-aziendale-e-diritto-1-e-a-a-2026-27", "", [
      { year: 1, corso: "0128G", anno2: ["P0201|1", "P0101|1"] },
      { year: 2, corso: "0128G", anno2: ["P0301|2", "P0101|2"] },
    ], false),
  },
  {
    programme: "Amministrazione Aziendale e Diritto - ( - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "amministrazione-aziendale-e-diritto-a-a-2026-27", "", [
      { year: 3, corso: "0115G", anno2: ["P0301|3", "P0101|3"] },
    ], false),
  },
  {
    programme: "Economia e Management - (1° e - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "economia-e-management-1-e-a-a-2026-27", "", [
      { year: 1, corso: "0130G", anno2: ["P0201|1", "P0101|1"] },
      { year: 2, corso: "0130G", anno2: ["P0201|2", "P0101|2"] },
    ], false),
  },
  {
    programme: "Economia e Management - ( - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "economia-e-management-a-a-2026-27", "", [
      { year: 3, corso: "0117G", anno2: ["P0201|3", "P0101|3"] },
    ], false),
  },
  {
    programme: "Gestione Aziendale - (1° e - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "gestione-aziendale-1-e-a-a-2026-27", "", [
      { year: 1, corso: "0129G", anno2: ["P0101|1", "P0201|1"] },
      { year: 2, corso: "0129G", anno2: ["P0101|2", "P0201|2"] },
    ], false),
  },
  {
    programme: "Gestione Aziendale - ( - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "gestione-aziendale-a-a-2026-27", "", [
      { year: 3, corso: "0116G", anno2: ["P0001|3"] },
    ], false),
  },
  {
    programme: "Gestione Aziendale Part-time - (3° e A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "gestione-aziendale-part-time-3-e-a-a-2026-27", "", [
      { year: 3, corso: "0116GPT", anno2: ["P0002|3"] },
      { year: 4, corso: "0116GPT", anno2: ["P0002|4"] },
    ], false),
  },
  {
    programme: "Intelligent Mechatronics Engineering",
    sources: degreeSources(BASE, ANNO, "intelligent-mechatronics-engineering", "", [
      { year: 1, corso: "0539H", anno2: ["EIT SPE EN|1", "P0003|1"] },
    ], false),
  },
  {
    programme: "Semestre Filtro Medicina",
    sources: degreeSources(BASE, ANNO, "semestre-filtro-medicina", "", [
      { year: 1, corso: "SFM", anno2: ["SFMC0001|1"] },
    ], false),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e nei Luoghi di Lavoro)",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "", [
      { year: 1, corso: "1013G", anno2: ["PDS0001|1"] },
    ], false),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "", [
      { year: 1, corso: "1012G", anno2: ["PDS0001|1"] },
    ], false),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "", [
      { year: 1, corso: "1011G", anno2: ["PDS0001|1"] },
    ], false),
  },
  {
    programme: "Viticoltura ed Enologia (1° e - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "viticoltura-ed-enologia-1-e-a-a-2026-27", "", [
      { year: 1, corso: "0913G", anno2: ["P0009|1"] },
      { year: 2, corso: "0913G", anno2: ["P0009|2"] },
    ], false),
  },
  {
    programme: "Viticoltura ed Enologia ( - A.a. 2026/27)",
    sources: degreeSources(BASE, ANNO, "viticoltura-ed-enologia-a-a-2026-27", "", [
      { year: 3, corso: "0911G", anno2: ["P0009|3"] },
    ], false),
  },
];

export const unitn: UniversityPreset = {
  id: "unitn-informatica",
  name: "Università degli Studi di Trento",
  shortName: "Università di Trento",
  city: "Trento",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
