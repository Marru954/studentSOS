/**
 * Preset: Università degli Studi di Parma — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unipr_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://agendastudenti.unipr.it";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Advanced Molecular Sciences for Health Products",
    sources: degreeSources(BASE, ANNO, "advanced-molecular-sciences-for-health-products", "", [
      { year: 1, corso: "5101", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Amministrazione e Direzione Aziendale",
    sources: degreeSources(BASE, ANNO, "amministrazione-e-direzione-aziendale", "", [
      { year: 1, corso: "5128", anno2: ["GEN|1"] },
      { year: 2, corso: "5003", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Architettura e Citta' Sostenibili",
    sources: degreeSources(BASE, ANNO, "architettura-e-citta-sostenibili", "", [
      { year: 1, corso: "5111", anno2: ["GEN|1"] },
      { year: 2, corso: "5066", anno2: ["367|2", "368|2", "369|2"] },
    ]),
  },
  {
    programme: "Architettura Rigenerazione Sostenibilita'",
    sources: degreeSources(BASE, ANNO, "architettura-rigenerazione-sostenibilita", "", [
      { year: 1, corso: "3112", anno2: ["GEN|1"] },
      { year: 2, corso: "3054", anno2: ["GEN|2"] },
      { year: 3, corso: "3054", anno2: ["353|3", "352|3"] },
    ]),
  },
  {
    programme: "Beni Artistici, Librari e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "beni-artistici-librari-e-dello-spettacolo", "", [
      { year: 1, corso: "3060", anno2: ["GEN|1"] },
      { year: 2, corso: "3060", anno2: ["381|2", "379|2", "380|2"] },
      { year: 3, corso: "3060", anno2: ["381|3", "379|3", "380|3"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "", [
      { year: 1, corso: "3117", anno2: ["GEN|1"] },
      { year: 2, corso: "3023", anno2: ["GEN|2"] },
      { year: 3, corso: "3023", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "", [
      { year: 1, corso: "3118", anno2: ["GEN|1"] },
      { year: 2, corso: "3022", anno2: ["GEN|2"] },
      { year: 3, corso: "3022", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Genomiche, Molecolari e Industriali",
    sources: degreeSources(BASE, ANNO, "biotecnologie-genomiche-molecolari-e-industriali", "", [
      { year: 1, corso: "5114", anno2: ["GEN|1"] },
      { year: 2, corso: "5055", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Biotecnologie Mediche, Veterinarie e Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche-veterinarie-e-farmaceutiche", "", [
      { year: 1, corso: "5140", anno2: ["322|1", "420|1", "319|1"] },
      { year: 2, corso: "5045", anno2: ["322|2", "420|2", "319|2"] },
    ]),
  },
  {
    programme: "Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "chimica-magistrale", "", [
      { year: 1, corso: "3119", anno2: ["GEN|1"] },
      { year: 2, corso: "5039", anno2: ["328|2", "329|2"] },
    ]),
  },
  {
    programme: "Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "chimica-triennale", "", [
      { year: 1, corso: "5115", anno2: ["416|1", "417|1"] },
      { year: 2, corso: "3024", anno2: ["GEN|2"] },
      { year: 3, corso: "3024", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "", [
      { year: 1, corso: "5122", anno2: ["GEN|1"] },
      { year: 2, corso: "5080", anno2: ["GEN|2"] },
      { year: 3, corso: "5080", anno2: ["GEN|3"] },
      { year: 4, corso: "5009", anno2: ["GEN|4"] },
      { year: 5, corso: "5009", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Chimica Industriale",
    sources: degreeSources(BASE, ANNO, "chimica-industriale", "", [
      { year: 1, corso: "5116", anno2: ["GEN|1"] },
      { year: 2, corso: "5041", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Civiltà e Lingue Straniere Moderne",
    sources: degreeSources(BASE, ANNO, "civilta-e-lingue-straniere-moderne", "", [
      { year: 1, corso: "3101", anno2: ["GEN|1"] },
      { year: 2, corso: "3017", anno2: ["GEN|2"] },
      { year: 3, corso: "3017", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Communication Engineering",
    sources: degreeSources(BASE, ANNO, "communication-engineering", "", [
      { year: 1, corso: "5052", anno2: ["Gen|1"] },
      { year: 2, corso: "5052", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Comunicazione e Media Contemporanei per le Industrie Creative",
    sources: degreeSources(BASE, ANNO, "comunicazione-e-media-contemporanei-per-le-industrie-creative", "", [
      { year: 1, corso: "3102", anno2: ["GEN|1"] },
      { year: 2, corso: "3051", anno2: ["GEN|2"] },
      { year: 3, corso: "3051", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Costruzioni, Infrastrutture e Territorio",
    sources: degreeSources(BASE, ANNO, "costruzioni-infrastrutture-e-territorio", "", [
      { year: 1, corso: "3059", anno2: ["GEN|1"] },
      { year: 2, corso: "3059", anno2: ["GEN|2"] },
      { year: 3, corso: "3059", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Data Science for Management",
    sources: degreeSources(BASE, ANNO, "data-science-for-management", "", [
      { year: 1, corso: "5102", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Dental Hygiene",
    sources: degreeSources(BASE, ANNO, "dental-hygiene", "", [
      { year: 1, corso: "3063", anno2: ["GEN|1"] },
      { year: 2, corso: "3063", anno2: ["GEN|2"] },
      { year: 3, corso: "3063", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Design Sostenibile per il Sistema Alimentare",
    sources: degreeSources(BASE, ANNO, "design-sostenibile-per-il-sistema-alimentare", "", [
      { year: 1, corso: "3113", anno2: ["GEN|1"] },
      { year: 3, corso: "3057", anno2: ["376|3"] },
    ]),
  },
  {
    programme: "Ecologia ed Etologia per la Conservazione della Natura",
    sources: degreeSources(BASE, ANNO, "ecologia-ed-etologia-per-la-conservazione-della-natura", "", [
      { year: 1, corso: "5117", anno2: ["348|1", "349|1"] },
      { year: 2, corso: "5061", anno2: ["348|2", "349|2"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "", [
      { year: 1, corso: "3124", anno2: ["GEN|1"] },
      { year: 2, corso: "3004", anno2: ["226|2", "228|2", "229|2", "230|2", "336|2"] },
      { year: 3, corso: "3004", anno2: ["226|3", "228|3", "229|3", "230|3", "336|3"] },
    ]),
  },
  {
    programme: "Economia e Management dei Sistemi Alimentari Sostenibili",
    sources: degreeSources(BASE, ANNO, "economia-e-management-dei-sistemi-alimentari-sostenibili", "", [
      { year: 2, corso: "5077", anno2: ["395|2", "396|2"] },
    ]),
  },
  {
    programme: "Economia e Management delle Filiere Alimentari Sostenibili",
    sources: degreeSources(BASE, ANNO, "economia-e-management-delle-filiere-alimentari-sostenibili", "", [
      { year: 1, corso: "3125", anno2: ["GEN|1"] },
      { year: 2, corso: "3072", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Economics and Management of Sustainable Food System",
    sources: degreeSources(BASE, ANNO, "economics-and-management-of-sustainable-food-system", "", [
      { year: 1, corso: "5129", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale)",
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "", [
      { year: 1, corso: "3067", anno2: ["GEN|1"] },
      { year: 2, corso: "3067", anno2: ["GEN|2"] },
      { year: 3, corso: "3067", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Electronic Engineering for Intelligent Vehicles",
    sources: degreeSources(BASE, ANNO, "electronic-engineering-for-intelligent-vehicles", "", [
      { year: 1, corso: "5076", anno2: ["389|1", "390|1"] },
      { year: 2, corso: "5076", anno2: ["389|2", "390|2"] },
    ]),
  },
  {
    programme: "Engineering for the Food Industry",
    sources: degreeSources(BASE, ANNO, "engineering-for-the-food-industry", "", [
      { year: 1, corso: "5075", anno2: ["GEN|1"] },
      { year: 2, corso: "5075", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Environmental Engineering for Risk Mitigation",
    sources: degreeSources(BASE, ANNO, "environmental-engineering-for-risk-mitigation", "", [
      { year: 1, corso: "5113", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "", [
      { year: 1, corso: "5123", anno2: ["GEN|1"] },
      { year: 2, corso: "5079", anno2: ["GEN|2"] },
      { year: 3, corso: "5079", anno2: ["GEN|3"] },
      { year: 4, corso: "5008", anno2: ["GEN|4"] },
      { year: 5, corso: "5008", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "", [
      { year: 1, corso: "5104", anno2: ["GEN|1"] },
      { year: 2, corso: "5025", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Finanza e Risk Management",
    sources: degreeSources(BASE, ANNO, "finanza-e-risk-management", "", [
      { year: 1, corso: "5130", anno2: ["GEN|1"] },
      { year: 2, corso: "5005", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "", [
      { year: 1, corso: "3126", anno2: ["GEN|1"] },
      { year: 2, corso: "5036", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale) (5133)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale-5133", "", [
      { year: 1, corso: "5133", anno2: ["GEN|1"] },
      { year: 2, corso: "5133", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "", [
      { year: 2, corso: "3026", anno2: ["GEN|2"] },
      { year: 3, corso: "3026", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista", "", [
      { year: 1, corso: "3042", anno2: ["PR|1", "PC|1", "GEN|1"] },
      { year: 2, corso: "3042", anno2: ["PR|2", "PC|2", "GEN|2"] },
      { year: 3, corso: "3042", anno2: ["PR|3", "PC|3", "GEN|3"] },
    ]),
  },
  {
    programme: "Food Safety and Food Risk Management",
    sources: degreeSources(BASE, ANNO, "food-safety-and-food-risk-management", "", [
      { year: 1, corso: "5124", anno2: ["GEN|1"] },
      { year: 2, corso: "5064", anno2: ["354|2", "355|2", "356|2"] },
    ]),
  },
  {
    programme: "Food Sciences for Innovation and Authenticity",
    sources: degreeSources(BASE, ANNO, "food-sciences-for-innovation-and-authenticity", "", [
      { year: 2, corso: "5063", anno2: ["360|2"] },
    ]),
  },
  {
    programme: "Functional and Sustainable Materials",
    sources: degreeSources(BASE, ANNO, "functional-and-sustainable-materials", "", [
      { year: 1, corso: "5082", anno2: ["GEN|1"] },
      { year: 2, corso: "5082", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Giornalismo, Cultura Editoriale, Comunicazione Ambientale e Multimediale",
    sources: degreeSources(BASE, ANNO, "giornalismo-cultura-editoriale-comunicazione-ambientale-e-multimediale", "", [
      { year: 1, corso: "5105", anno2: ["388|1", "363|1", "364|1"] },
      { year: 2, corso: "5078", anno2: ["388|2", "363|2", "364|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "", [
      { year: 1, corso: "5108", anno2: ["GEN|1"] },
      { year: 2, corso: "0995", anno2: ["GEN|2"] },
      { year: 3, corso: "0995", anno2: ["GEN|3"] },
      { year: 4, corso: "0995", anno2: ["GEN|4"] },
      { year: 5, corso: "0995", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Global Food Law: Sustainability Challenges and Innovation",
    sources: degreeSources(BASE, ANNO, "global-food-law-sustainability-challenges-and-innovation", "", [
      { year: 1, corso: "5081", anno2: ["GEN|1"] },
      { year: 2, corso: "5081", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Global Politics e Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "global-politics-e-relazioni-internazionali", "", [
      { year: 1, corso: "5110", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Global Studies for Sustainable Local and International Development and Cooperation",
    sources: degreeSources(BASE, ANNO, "global-studies-for-sustainable-local-and-international-development-and-cooperation", "", [
      { year: 1, corso: "3100", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere", "", [
      { year: 1, corso: "3040", anno2: ["AOU_PR|1", "AUSL_PR|1", "AUSL_PC|1"] },
      { year: 2, corso: "3040", anno2: ["AOU_PR|2", "AUSL_PR|2", "AUSL_PC|2"] },
      { year: 3, corso: "3040", anno2: ["AOU_PR|3", "AUSL_PR|3", "AUSL_PC|3"] },
    ]),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "", [
      { year: 1, corso: "3127", anno2: ["GEN|1"] },
      { year: 2, corso: "3027", anno2: ["GEN|2"] },
      { year: 3, corso: "3027", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "", [
      { year: 1, corso: "5112", anno2: ["248|1", "146|1", "341|1", "342|1", "343|1"] },
      { year: 2, corso: "5011", anno2: ["248|2", "146|2", "341|2", "342|2", "343|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-ambientale", "", [
      { year: 1, corso: "3114", anno2: ["Gen|1"] },
      { year: 2, corso: "3007", anno2: ["GEN|2"] },
      { year: 3, corso: "3007", anno2: ["242|3", "241|3"] },
    ]),
  },
  {
    programme: "Ingegneria delle Tecnologie Informatiche",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-tecnologie-informatiche", "", [
      { year: 1, corso: "3115", anno2: ["GEN|1"] },
      { year: 2, corso: "3061", anno2: ["GEN|2"] },
      { year: 3, corso: "3061", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "", [
      { year: 1, corso: "5013", anno2: ["GEN|1"] },
      { year: 2, corso: "5013", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale", "", [
      { year: 1, corso: "3110", anno2: ["365|1", "391|1", "366|1", "262|1", "401|1"] },
      { year: 2, corso: "3010", anno2: ["365|2", "391|2", "366|2", "262|2", "401|2"] },
      { year: 3, corso: "3010", anno2: ["365|3", "366|3", "262|3", "401|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-magistrale", "", [
      { year: 1, corso: "5014", anno2: ["350|1", "413|1", "351|1", "347|1"] },
      { year: 2, corso: "5014", anno2: ["402|2", "351|2", "347|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica", "", [
      { year: 1, corso: "5015", anno2: ["333|1", "391|1", "392|1"] },
      { year: 2, corso: "5015", anno2: ["333|2", "391|2", "392|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica, Elettronica e delle Telecomunicazioni",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-elettronica-e-delle-telecomunicazioni", "", [
      { year: 1, corso: "3116", anno2: ["GEN|1"] },
      { year: 2, corso: "3050", anno2: ["GEN|2"] },
      { year: 3, corso: "3050", anno2: ["333|3", "243|3", "378|3", "384|3", "385|3", "386|3", "382|3", "383|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-triennale", "", [
      { year: 1, corso: "3111", anno2: ["GEN|1"] },
      { year: 2, corso: "3011", anno2: ["261|2", "398|2", "399|2"] },
      { year: 3, corso: "3011", anno2: ["261|3", "398|3", "399|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-magistrale", "", [
      { year: 1, corso: "5016", anno2: ["GEN|1"] },
      { year: 2, corso: "5016", anno2: ["370|2", "345|2", "400|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio", "", [
      { year: 2, corso: "5018", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Innovazione Organizzativa, Digitale e Amministrativa della P.a.",
    sources: degreeSources(BASE, ANNO, "innovazione-organizzativa-digitale-e-amministrativa-della-p-a", "", [
      { year: 1, corso: "5100", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "International Business and Development",
    sources: degreeSources(BASE, ANNO, "international-business-and-development", "", [
      { year: 1, corso: "5131", anno2: ["GEN|1"] },
      { year: 2, corso: "5047", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Interprete di Lingua dei Segni Italiana e di Lingua dei Segni Italiana Tattile",
    sources: degreeSources(BASE, ANNO, "interprete-di-lingua-dei-segni-italiana-e-di-lingua-dei-segni-italiana-tattile", "", [
      { year: 1, corso: "3107", anno2: ["GEN|1"] },
      { year: 2, corso: "3066", anno2: ["GEN|2"] },
      { year: 3, corso: "3066", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Language Sciences and Cultural Studies for Special Needs",
    sources: degreeSources(BASE, ANNO, "language-sciences-and-cultural-studies-for-special-needs", "", [
      { year: 1, corso: "5073", anno2: ["407|1", "406|1", "408|1"] },
      { year: 2, corso: "5073", anno2: ["375|2", "374|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "", [
      { year: 1, corso: "3103", anno2: ["332|1", "424|1", "040|1", "340|1"] },
      { year: 2, corso: "3014", anno2: ["332|2", "040|2", "340|2", "387|2"] },
      { year: 3, corso: "3014", anno2: ["332|3", "040|3", "340|3", "387|3"] },
    ]),
  },
  {
    programme: "Lettere Classiche e Moderne",
    sources: degreeSources(BASE, ANNO, "lettere-classiche-e-moderne", "", [
      { year: 1, corso: "5049", anno2: ["GEN|1"] },
      { year: 2, corso: "5049", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "", [
      { year: 1, corso: "3043", anno2: ["GEN|1"] },
      { year: 2, corso: "3043", anno2: ["GEN|2"] },
      { year: 3, corso: "3043", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "", [
      { year: 1, corso: "3128", anno2: ["GEN|1"] },
      { year: 2, corso: "5037", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "", [
      { year: 1, corso: "5134", anno2: ["GEN|1"] },
      { year: 2, corso: "3030", anno2: ["GEN|2"] },
      { year: 3, corso: "3030", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "", [
      { year: 1, corso: "5137", anno2: ["GEN|1"] },
      { year: 2, corso: "5026", anno2: ["GEN|2"] },
      { year: 3, corso: "5026", anno2: ["GEN|3"] },
      { year: 4, corso: "5026", anno2: ["GEN|4"] },
      { year: 5, corso: "5026", anno2: ["GEN|5"] },
      { year: 6, corso: "5026", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Medicina Veterinaria",
    sources: degreeSources(BASE, ANNO, "medicina-veterinaria", "", [
      { year: 1, corso: "5135", anno2: ["GEN|1"] },
      { year: 2, corso: "5029", anno2: ["GEN|2"] },
      { year: 3, corso: "5029", anno2: ["GEN|3"] },
      { year: 4, corso: "5029", anno2: ["GEN|4"] },
      { year: 5, corso: "5029", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Medicine and Surgery",
    sources: degreeSources(BASE, ANNO, "medicine-and-surgery", "", [
      { year: 1, corso: "5138", anno2: ["GEN|1"] },
      { year: 2, corso: "5074", anno2: ["GEN|2"] },
      { year: 3, corso: "5074", anno2: ["GEN|3"] },
      { year: 4, corso: "5074", anno2: ["GEN|4"] },
      { year: 5, corso: "5074", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "", [
      { year: 1, corso: "5139", anno2: ["GEN|1"] },
      { year: 2, corso: "5027", anno2: ["GEN|2"] },
      { year: 3, corso: "5027", anno2: ["GEN|3"] },
      { year: 4, corso: "5027", anno2: ["GEN|4"] },
      { year: 5, corso: "5027", anno2: ["GEN|5"] },
      { year: 6, corso: "5027", anno2: ["GEN|6"] },
    ]),
  },
  {
    programme: "Ortottica ed Assistenza Oftalmologica (abilitante alla Professione Sanitaria di Ortottista ed Assistente di Oftalmologia)",
    sources: degreeSources(BASE, ANNO, "ortottica-ed-assistenza-oftalmologica-abilitante-alla-professione-sanitaria-di-ortottista-ed-assistente-di-oftalmologia", "", [
      { year: 1, corso: "3044", anno2: ["GEN|1"] },
      { year: 2, corso: "3044", anno2: ["GEN|2"] },
      { year: 3, corso: "3044", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "", [
      { year: 1, corso: "3041", anno2: ["GEN|1"] },
      { year: 2, corso: "3041", anno2: ["GEN|2"] },
      { year: 3, corso: "3041", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Produzioni Animali Innovative e Sostenibili",
    sources: degreeSources(BASE, ANNO, "produzioni-animali-innovative-e-sostenibili", "", [
      { year: 1, corso: "5136", anno2: ["GEN|1"] },
      { year: 2, corso: "5065", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Progettazione e Coordinamento dei Servizi Educativi",
    sources: degreeSources(BASE, ANNO, "progettazione-e-coordinamento-dei-servizi-educativi", "", [
      { year: 1, corso: "5106", anno2: ["GEN|1"] },
      { year: 2, corso: "5046", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Programmazione e Gestione dei Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "programmazione-e-gestione-dei-servizi-sociali", "", [
      { year: 1, corso: "5109", anno2: ["GEN|1"] },
      { year: 2, corso: "5010", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Psicobiologia e Neuroscienze Cognitive",
    sources: degreeSources(BASE, ANNO, "psicobiologia-e-neuroscienze-cognitive", "", [
      { year: 1, corso: "5141", anno2: ["GEN|1"] },
      { year: 2, corso: "5053", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Psicologia Dell'intervento Clinico e Sociale",
    sources: degreeSources(BASE, ANNO, "psicologia-dell-intervento-clinico-e-sociale", "", [
      { year: 1, corso: "5107", anno2: ["GEN|1"] },
      { year: 2, corso: "5054", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Qualità e Approvvigionamento di Materie Prime per L'agro-alimentare",
    sources: degreeSources(BASE, ANNO, "qualita-e-approvvigionamento-di-materie-prime-per-l-agro-alimentare", "", [
      { year: 1, corso: "3064", anno2: ["GEN|1"] },
      { year: 2, corso: "3064", anno2: ["GEN|2"] },
      { year: 3, corso: "3064", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali ed Europee",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali-ed-europee", "", [
      { year: 2, corso: "5044", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources(BASE, ANNO, "scienza-dei-materiali", "", [
      { year: 1, corso: "3062", anno2: ["GEN|1"] },
      { year: 2, corso: "3062", anno2: ["GEN|2"] },
      { year: 3, corso: "3062", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Animali",
    sources: degreeSources(BASE, ANNO, "scienze-animali", "", [
      { year: 1, corso: "3129", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Biomediche Traslazionali",
    sources: degreeSources(BASE, ANNO, "scienze-biomediche-traslazionali", "", [
      { year: 1, corso: "5118", anno2: ["359|1", "357|1", "358|1"] },
      { year: 2, corso: "5071", anno2: ["359|2", "357|2", "358|2"] },
    ]),
  },
  {
    programme: "Scienze Biomolecolari, Genomiche e Cellulari",
    sources: degreeSources(BASE, ANNO, "scienze-biomolecolari-genomiche-e-cellulari", "", [
      { year: 1, corso: "5119", anno2: ["GEN|1"] },
      { year: 2, corso: "5062", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione e dei Processi Formativi",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-e-dei-processi-formativi", "", [
      { year: 1, corso: "3105", anno2: ["GEN|1"] },
      { year: 2, corso: "3038", anno2: ["361|2", "362|2"] },
      { year: 3, corso: "3038", anno2: ["361|3", "362|3"] },
    ]),
  },
  {
    programme: "Scienze della Natura e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-della-natura-e-dell-ambiente", "", [
      { year: 1, corso: "3120", anno2: ["GEN|1"] },
      { year: 2, corso: "3028", anno2: ["GEN|2"] },
      { year: 3, corso: "3028", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze della Nutrizione Umana",
    sources: degreeSources(BASE, ANNO, "scienze-della-nutrizione-umana", "", [
      { year: 1, corso: "5126", anno2: ["GEN|1"] },
      { year: 2, corso: "5068", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche delle Attivita' Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-delle-attivita-motorie-preventive-e-adattate", "", [
      { year: 2, corso: "5028", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche delle Attività Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-delle-attivita-motorie-preventive-e-adattate-2", "", [
      { year: 1, corso: "5142", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche per le Sfide Contemporanee",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche-per-le-sfide-contemporanee", "", [
      { year: 1, corso: "3070", anno2: ["GEN|1"] },
      { year: 2, corso: "3070", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Alimentari (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-alimentari-magistrale", "", [
      { year: 1, corso: "3122", anno2: ["GEN|1"] },
      { year: 2, corso: "5000", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Alimentari (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-alimentari-triennale", "", [
      { year: 1, corso: "5127", anno2: ["GEN|1"] },
      { year: 2, corso: "3000", anno2: ["GEN|2"] },
      { year: 3, corso: "3000", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per L'ambiente e le Risorse",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-per-l-ambiente-e-le-risorse", "", [
      { year: 1, corso: "5121", anno2: ["GEN|1"] },
      { year: 2, corso: "5043", anno2: ["372|2", "373|2"] },
    ]),
  },
  {
    programme: "Scienze Gastronomiche",
    sources: degreeSources(BASE, ANNO, "scienze-gastronomiche", "", [
      { year: 1, corso: "3123", anno2: ["GEN|1"] },
      { year: 2, corso: "3069", anno2: ["GEN|2"] },
      { year: 3, corso: "3069", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche", "", [
      { year: 1, corso: "3121", anno2: ["GEN|1"] },
      { year: 2, corso: "3029", anno2: ["GEN|2"] },
      { year: 3, corso: "3029", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche Applicate alla Sostenibilita' Ambientale",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-applicate-alla-sostenibilita-ambientale", "", [
      { year: 2, corso: "5072", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Geologiche Applicate alla Sostenibilità Ambientale",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-applicate-alla-sostenibilita-ambientale-2", "", [
      { year: 1, corso: "5120", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "", [
      { year: 1, corso: "5050", anno2: ["GEN|1"] },
      { year: 2, corso: "5050", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Informatiche",
    sources: degreeSources(BASE, ANNO, "scienze-informatiche", "", [
      { year: 1, corso: "5069", anno2: ["GEN|1"] },
      { year: 2, corso: "5069", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze Motorie, Sport e Salute",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-sport-e-salute", "", [
      { year: 1, corso: "3130", anno2: ["GEN|1"] },
      { year: 2, corso: "3019", anno2: ["GEN|2"] },
      { year: 3, corso: "3019", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Politiche e delle Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-delle-relazioni-internazionali", "", [
      { year: 1, corso: "3108", anno2: ["GEN|1"] },
      { year: 2, corso: "3032", anno2: ["GEN|2"] },
      { year: 3, corso: "3032", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Scienze Zootecniche e Tecnologie delle Produzioni Animali",
    sources: degreeSources(BASE, ANNO, "scienze-zootecniche-e-tecnologie-delle-produzioni-animali", "", [
      { year: 2, corso: "3020", anno2: ["GEN|2"] },
      { year: 3, corso: "3020", anno2: ["331|3", "263|3", "330|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "", [
      { year: 1, corso: "SFM", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "", [
      { year: 1, corso: "3109", anno2: ["GEN|1"] },
      { year: 2, corso: "3006", anno2: ["GEN|2"] },
      { year: 3, corso: "3006", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Sistema Alimentare: Sostenibilita', Management e Tecnologie",
    sources: degreeSources(BASE, ANNO, "sistema-alimentare-sostenibilita-management-e-tecnologie", "", [
      { year: 3, corso: "3052", anno2: ["393|3", "394|3"] },
    ]),
  },
  {
    programme: "Storia e Critica delle Arti e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "storia-e-critica-delle-arti-e-dello-spettacolo", "", [
      { year: 2, corso: "5048", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Storia, Critica e Linguaggi delle Arti e dello Spettacolo",
    sources: degreeSources(BASE, ANNO, "storia-critica-e-linguaggi-delle-arti-e-dello-spettacolo", "", [
      { year: 1, corso: "5103", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Studi Filosofici",
    sources: degreeSources(BASE, ANNO, "studi-filosofici", "", [
      { year: 1, corso: "3106", anno2: ["422|1", "423|1"] },
      { year: 2, corso: "3013", anno2: ["GEN|2"] },
      { year: 3, corso: "3013", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche Audioprotesiche (abilitante alla Professione Sanitaria di Audioprotesista)",
    sources: degreeSources(BASE, ANNO, "tecniche-audioprotesiche-abilitante-alla-professione-sanitaria-di-audioprotesista", "", [
      { year: 1, corso: "3046", anno2: ["GEN|1"] },
      { year: 2, corso: "3046", anno2: ["GEN|2"] },
      { year: 3, corso: "3046", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro)",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "", [
      { year: 1, corso: "3049", anno2: ["GEN|1"] },
      { year: 2, corso: "3049", anno2: ["GEN|2"] },
      { year: 3, corso: "3049", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "", [
      { year: 1, corso: "3047", anno2: ["GEN|1"] },
      { year: 2, corso: "3047", anno2: ["GEN|2"] },
      { year: 3, corso: "3047", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "", [
      { year: 1, corso: "3048", anno2: ["GEN|1"] },
      { year: 2, corso: "3048", anno2: ["GEN|2"] },
      { year: 3, corso: "3048", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Tecnologie e Gestione Dell'impresa Casearia",
    sources: degreeSources(BASE, ANNO, "tecnologie-e-gestione-dell-impresa-casearia", "", [
      { year: 1, corso: "3068", anno2: ["GEN|1"] },
      { year: 2, corso: "3068", anno2: ["GEN|2"] },
      { year: 3, corso: "3068", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Terapia della Neuro e Psicomotricità Dell'età Evolutiva (abilitante alla Professione Sanitaria di Terapista della Neuro e Psicomotricità Dell'età Evolutiva)",
    sources: degreeSources(BASE, ANNO, "terapia-della-neuro-e-psicomotricita-dell-eta-evolutiva-abilitante-alla-professione-sanitaria-di-terapista-della-neuro-e-psicomotricita-dell-eta-evolutiva", "", [
      { year: 1, corso: "3071", anno2: ["GEN|1"] },
      { year: 2, corso: "3071", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Trade e Consumer Marketing",
    sources: degreeSources(BASE, ANNO, "trade-e-consumer-marketing", "", [
      { year: 1, corso: "5132", anno2: ["GEN|1"] },
      { year: 2, corso: "5059", anno2: ["GEN|2"] },
    ]),
  },
];

export const unipr: UniversityPreset = {
  id: "unipr-informatica",
  name: "Università degli Studi di Parma",
  shortName: "Università di Parma",
  city: "Parma",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
