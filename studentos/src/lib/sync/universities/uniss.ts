/**
 * Preset: Università degli Studi di Sassari — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _uniss_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://orario.uniss.it/AgendaStudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Archeologia",
    sources: degreeSources(BASE, ANNO, "archeologia", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A228", anno2: ["A111|1", "A110|1"] },
      { year: 2, corso: "1230", anno2: ["A111|2", "A110|2"] },
    ]),
  },
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "DipartimentodiArchitettura-DesigneUrbanistica", [
      { year: 1, corso: "A185", anno2: ["100|1"] },
      { year: 2, corso: "1235", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "", [
      { year: 1, corso: "A200", anno2: ["302|1", "301|1"] },
      { year: 2, corso: "A137", anno2: ["302|2", "301|2"] },
    ]),
  },
  {
    programme: "Biotechnology for Human and Animal Health",
    sources: degreeSources(BASE, ANNO, "biotechnology-for-human-and-animal-health", "DipartimentodiMedicinaVeterinaria", [
      { year: 1, corso: "A192", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Biotecnologie e Analisi Bioinformatiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-e-analisi-bioinformatiche", "", [
      { year: 1, corso: "A194", anno2: ["100|1"] },
      { year: 2, corso: "A147", anno2: ["100|2"] },
      { year: 3, corso: "A147", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Sanitarie Mediche e Veterinarie",
    sources: degreeSources(BASE, ANNO, "biotecnologie-sanitarie-mediche-e-veterinarie", "DipartimentodiMedicinaVeterinaria", [
      { year: 2, corso: "1214", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "DipartimentodiScienzechimiche-fisiche-matematicheenaturali", [
      { year: 1, corso: "A206", anno2: ["100|1"] },
      { year: 2, corso: "1195", anno2: ["100|2"] },
      { year: 3, corso: "1195", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "", [
      { year: 1, corso: "A203", anno2: ["100|1"] },
      { year: 2, corso: "A158", anno2: ["100|2"] },
      { year: 3, corso: "A158", anno2: ["100|3"] },
      { year: 4, corso: "1199", anno2: ["100|4"] },
      { year: 5, corso: "1199", anno2: ["100|5"] },
    ]),
  },
  {
    programme: "Comunicazione Pubblica e Professioni Dell'informazione",
    sources: degreeSources(BASE, ANNO, "comunicazione-pubblica-e-professioni-dell-informazione", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A227", anno2: ["A124|1", "A123|1"] },
      { year: 2, corso: "A108", anno2: ["A124|2", "A123|2"] },
      { year: 3, corso: "A108", anno2: ["A124|3", "A123|3"] },
    ]),
  },
  {
    programme: "Corsi Annuali",
    sources: degreeSources(BASE, ANNO, "corsi-annuali", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "extraCurric", anno2: ["999|1"] },
    ]),
  },
  {
    programme: "Design",
    sources: degreeSources(BASE, ANNO, "design", "DipartimentodiArchitettura-DesigneUrbanistica", [
      { year: 1, corso: "A182", anno2: ["100|1"] },
      { year: 2, corso: "A144", anno2: ["100|2"] },
      { year: 3, corso: "A144", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Economia",
    sources: degreeSources(BASE, ANNO, "economia", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A213", anno2: ["A108|1", "A36|1"] },
      { year: 2, corso: "A039", anno2: ["A108|2", "A36|2"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A214", anno2: ["A38|1", "A39|1", "A127|1", "A105|1"] },
      { year: 2, corso: "A043", anno2: ["A38|2", "A39|2", "A105|2", "A106|2", "A40|2"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A211", anno2: ["129|1", "306|1"] },
      { year: 2, corso: "A097", anno2: ["129|2", "306|2"] },
      { year: 3, corso: "A097", anno2: ["129|3", "306|3"] },
    ]),
  },
  {
    programme: "Economia e Management del Turismo",
    sources: degreeSources(BASE, ANNO, "economia-e-management-del-turismo", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A210", anno2: ["100|1"] },
      { year: 2, corso: "1194", anno2: ["100|2"] },
      { year: 3, corso: "1194", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Economia, Impresa e Sostenibilità",
    sources: degreeSources(BASE, ANNO, "economia-impresa-e-sostenibilita", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A212", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Environmental Conservation, Restoration and Sustainability",
    sources: degreeSources(BASE, ANNO, "environmental-conservation-restoration-and-sustainability", "DipartimentodiScienzechimiche-fisiche-matematicheenaturali", [
      { year: 1, corso: "A209", anno2: ["A64-ENG|1", "A65|1"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "", [
      { year: 1, corso: "A202", anno2: ["100|1"] },
      { year: 2, corso: "A157", anno2: ["100|2"] },
      { year: 3, corso: "A157", anno2: ["100|3"] },
      { year: 4, corso: "1200", anno2: ["100|4"] },
      { year: 5, corso: "1200", anno2: ["100|5"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista", "", [
      { year: 1, corso: "1222", anno2: ["100|1"] },
      { year: 2, corso: "1222", anno2: ["100|2"] },
      { year: 3, corso: "1222", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Gestione Dell'ambiente e del Territorio",
    sources: degreeSources(BASE, ANNO, "gestione-dell-ambiente-e-del-territorio", "DipartimentodiScienzechimiche-fisiche-matematicheenaturali", [
      { year: 2, corso: "1207", anno2: ["A64|2", "A65|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "A187", anno2: ["100|1"] },
      { year: 2, corso: "1158", anno2: ["100|2"] },
      { year: 3, corso: "1158", anno2: ["100|3"] },
      { year: 4, corso: "1158", anno2: ["100|4"] },
      { year: 5, corso: "1158", anno2: ["100|5"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (triennale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-triennale", "", [
      { year: 1, corso: "1219", anno2: ["100|1"] },
      { year: 2, corso: "1219", anno2: ["1219 OLBIA|2", "1219 SS|2"] },
      { year: 3, corso: "1219", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (magistrale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-magistrale", "", [
      { year: 1, corso: "A232", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Ingegneria Industriale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-industriale-triennale", "", [
      { year: 1, corso: "A146", anno2: ["100|1"] },
      { year: 2, corso: "A146", anno2: ["100|2"] },
      { year: 3, corso: "A146", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Ingegneria Industriale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-industriale-magistrale", "", [
      { year: 1, corso: "A196", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "", [
      { year: 1, corso: "A106", anno2: ["100|1"] },
      { year: 2, corso: "A106", anno2: ["100|2"] },
      { year: 3, corso: "A106", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "", [
      { year: 1, corso: "A195", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Innovation Management for Sustainable Tourism",
    sources: degreeSources(BASE, ANNO, "innovation-management-for-sustainable-tourism", "DipartimentodiScienzeeconomicheeaziendali-DISEA", [
      { year: 1, corso: "A215", anno2: ["100|1"] },
      { year: 2, corso: "A138", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A225", anno2: ["A13|1", "A15|1", "A05|1", "A04|1"] },
      { year: 2, corso: "1218", anno2: ["A13|2", "A15|2", "A05|2", "A04|2"] },
      { year: 3, corso: "1218", anno2: ["A13|3", "A15|3", "A05|3", "A04|3"] },
    ]),
  },
  {
    programme: "Lettere, Filologia Moderna e Industria Culturale",
    sources: degreeSources(BASE, ANNO, "lettere-filologia-moderna-e-industria-culturale", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A221", anno2: ["A91|1", "A30|1", "A93|1", "A94|1"] },
      { year: 2, corso: "A041", anno2: ["A91|2", "A30|2", "A93|2", "A94|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Straniere per la Mediazione Culturale e la Valorizzazione del Territorio",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-straniere-per-la-mediazione-culturale-e-la-valorizzazione-del-territorio", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A222", anno2: ["A119|1", "A120|1"] },
      { year: 2, corso: "A042", anno2: ["A33|2", "A34|2"] },
    ]),
  },
  {
    programme: "Lingue, Culture e Tecniche per il Turismo",
    sources: degreeSources(BASE, ANNO, "lingue-culture-e-tecniche-per-il-turismo", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 2, corso: "A140", anno2: ["100|2"] },
      { year: 3, corso: "A140", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "", [
      { year: 1, corso: "A030", anno2: ["100|1"] },
      { year: 3, corso: "A030", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Mediazione Linguistica e Culturale",
    sources: degreeSources(BASE, ANNO, "mediazione-linguistica-e-culturale", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A217", anno2: ["291|1", "290|1"] },
      { year: 2, corso: "1192", anno2: ["291|2", "290|2"] },
      { year: 3, corso: "1192", anno2: ["A35|3", "A07|3", "291|3"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "", [
      { year: 1, corso: "A204", anno2: ["100|1"] },
      { year: 2, corso: "1215", anno2: ["100|2"] },
      { year: 3, corso: "1215", anno2: ["100|3"] },
      { year: 4, corso: "1215", anno2: ["100|4"] },
      { year: 5, corso: "1215", anno2: ["100|5"] },
      { year: 6, corso: "1215", anno2: ["100|6"] },
    ]),
  },
  {
    programme: "Medicina Veterinaria",
    sources: degreeSources(BASE, ANNO, "medicina-veterinaria", "DipartimentodiMedicinaVeterinaria", [
      { year: 1, corso: "A191", anno2: ["100|1"] },
      { year: 2, corso: "1216", anno2: ["100|2"] },
      { year: 3, corso: "1216", anno2: ["100|3"] },
      { year: 4, corso: "1216", anno2: ["100|4"] },
      { year: 5, corso: "1216", anno2: ["100|5"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "", [
      { year: 1, corso: "A201", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "1201", anno2: ["100|2"] },
      { year: 4, corso: "1201", anno2: ["100|4"] },
      { year: 5, corso: "1201", anno2: ["100|5"] },
      { year: 6, corso: "1201", anno2: ["100|6"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "", [
      { year: 2, corso: "1220", anno2: ["100|2"] },
      { year: 3, corso: "1220", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Pianificazione e Politiche per la Città, L'ambiente e il Paesaggio",
    sources: degreeSources(BASE, ANNO, "pianificazione-e-politiche-per-la-citta-l-ambiente-e-il-paesaggio", "DipartimentodiArchitettura-DesigneUrbanistica", [
      { year: 1, corso: "A186", anno2: ["100|1"] },
      { year: 2, corso: "1226", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Progettazione, Gestione e Promozione Turistica di Itinerari della Cultura e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "progettazione-gestione-e-promozione-turistica-di-itinerari-della-cultura-e-dell-ambiente", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A216", anno2: ["100|1"] },
      { year: 2, corso: "A116", anno2: ["100|2"] },
      { year: 3, corso: "A116", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Qualità e Sicurezza dei Prodotti Alimentari",
    sources: degreeSources(BASE, ANNO, "qualita-e-sicurezza-dei-prodotti-alimentari", "DipartimentodiAgraria", [
      { year: 1, corso: "A179", anno2: ["100|1"] },
      { year: 2, corso: "A103", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Scienze Agro-zootecniche",
    sources: degreeSources(BASE, ANNO, "scienze-agro-zootecniche", "DipartimentodiAgraria", [
      { year: 1, corso: "A177", anno2: ["100|1"] },
      { year: 2, corso: "1173", anno2: ["100|2"] },
      { year: 3, corso: "1173", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "", [
      { year: 1, corso: "A197", anno2: ["100|1"] },
      { year: 2, corso: "1193", anno2: ["100|2"] },
      { year: 3, corso: "1193", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "DipartimentodiScienzechimiche-fisiche-matematicheenaturali", [
      { year: 1, corso: "A208", anno2: ["100|1"] },
      { year: 2, corso: "1202", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Scienze dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "scienze-dei-beni-culturali", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A224", anno2: ["A24|1", "A25|1", "A63|1"] },
      { year: 2, corso: "1171", anno2: ["A24|2", "A25|2", "A63|2"] },
      { year: 3, corso: "1171", anno2: ["A24|3", "A25|3", "A63|3"] },
    ]),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "A188", anno2: ["A188-A|1", "A86|1"] },
      { year: 2, corso: "A040", anno2: ["A86|2", "A22|2"] },
      { year: 3, corso: "A040", anno2: ["A86|3", "A22|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'alimentazione, Salute e Benessere Dell'uomo",
    sources: degreeSources(BASE, ANNO, "scienze-dell-alimentazione-salute-e-benessere-dell-uomo", "", [
      { year: 2, corso: "A086", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'architettura e del Progetto",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura-e-del-progetto", "DipartimentodiArchitettura-DesigneUrbanistica", [
      { year: 1, corso: "A183", anno2: ["100|1"] },
      { year: 2, corso: "1212", anno2: ["100|2"] },
      { year: 3, corso: "1212", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A226", anno2: ["A125|1", "A126|1"] },
      { year: 2, corso: "A031", anno2: ["100|2"] },
      { year: 3, corso: "A031", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze delle Produzioni Zootecniche",
    sources: degreeSources(BASE, ANNO, "scienze-delle-produzioni-zootecniche", "DipartimentodiAgraria", [
      { year: 1, corso: "A181", anno2: ["100|1"] },
      { year: 2, corso: "1209", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche dei Processi Cognitivi",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche-dei-processi-cognitivi", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A219", anno2: ["100|1"] },
      { year: 2, corso: "A073", anno2: ["100|2"] },
      { year: 3, corso: "A073", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Agrarie",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-agrarie", "DipartimentodiAgraria", [
      { year: 1, corso: "A174", anno2: ["100|1"] },
      { year: 2, corso: "1174", anno2: ["100|2"] },
      { year: 3, corso: "1174", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Forestali e Ambientali",
    sources: degreeSources(BASE, ANNO, "scienze-forestali-e-ambientali", "DipartimentodiAgraria", [
      { year: 1, corso: "A175", anno2: ["100|1"] },
      { year: 2, corso: "1175", anno2: ["100|2"] },
      { year: 3, corso: "1175", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "", [
      { year: 1, corso: "A075", anno2: ["100|1"] },
      { year: 2, corso: "A075", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Scienze Motorie, Sportive e Benessere Dell'uomo",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-sportive-e-benessere-dell-uomo", "", [
      { year: 1, corso: "A198", anno2: ["100|1"] },
      { year: 2, corso: "A119", anno2: ["100|2"] },
      { year: 3, corso: "A119", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-naturali", "DipartimentodiScienzechimiche-fisiche-matematicheenaturali", [
      { year: 1, corso: "A207", anno2: ["100|1"] },
      { year: 2, corso: "1177", anno2: ["100|2"] },
      { year: 3, corso: "1177", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Scienze Politiche",
    sources: degreeSources(BASE, ANNO, "scienze-politiche", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "A189", anno2: ["100|1"] },
      { year: 2, corso: "A120", anno2: ["A98|2", "A99|2"] },
      { year: 3, corso: "A120", anno2: ["A98|3", "A99|3"] },
    ]),
  },
  {
    programme: "Scienze Politiche e Giuridiche per L Amministrazione",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-giuridiche-per-l-amministrazione", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "A190", anno2: ["A122-A|1", "A122-B|1"] },
      { year: 2, corso: "A122", anno2: ["A122-A|2", "A122-B|2"] },
    ]),
  },
  {
    programme: "Scienze Storiche e Filosofiche",
    sources: degreeSources(BASE, ANNO, "scienze-storiche-e-filosofiche", "DipartimentodiStoria-scienzedelluomoedellaformazione-DiSSUF", [
      { year: 1, corso: "A229", anno2: ["A59|1", "A60|1"] },
      { year: 2, corso: "A074", anno2: ["A59|2", "A60|2"] },
    ]),
  },
  {
    programme: "Scienze Strategiche e Giuridiche della Difesa e della Sicurezza",
    sources: degreeSources(BASE, ANNO, "scienze-strategiche-e-giuridiche-della-difesa-e-della-sicurezza", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "A156", anno2: ["100|1"] },
      { year: 2, corso: "A156", anno2: ["A156-A|2", "A156-B|2"] },
      { year: 3, corso: "A156", anno2: ["A156-A|3", "A156-B|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "", [
      { year: 1, corso: "SFM", anno2: ["comune|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A220", anno2: ["100|1"] },
      { year: 2, corso: "A079", anno2: ["100|2"] },
      { year: 3, corso: "A079", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Servizio Sociale e Politiche Sociali",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-e-politiche-sociali", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A223", anno2: ["100|1"] },
      { year: 2, corso: "1182", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Sistemi Agrari",
    sources: degreeSources(BASE, ANNO, "sistemi-agrari", "DipartimentodiAgraria", [
      { year: 1, corso: "A178", anno2: ["A82|1", "A88|1"] },
      { year: 2, corso: "1204", anno2: ["A82|2", "A88|2"] },
    ]),
  },
  {
    programme: "Sistemi Forestali e Ambientali",
    sources: degreeSources(BASE, ANNO, "sistemi-forestali-e-ambientali", "DipartimentodiAgraria", [
      { year: 2, corso: "1206", anno2: ["A85-B|2", "A84|2"] },
    ]),
  },
  {
    programme: "Sistemi Forestali Mediterranei",
    sources: degreeSources(BASE, ANNO, "sistemi-forestali-mediterranei", "DipartimentodiAgraria", [
      { year: 1, corso: "A180", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Sviluppo Turistico e Territori Digitali",
    sources: degreeSources(BASE, ANNO, "sviluppo-turistico-e-territori-digitali", "DipartimentodiScienzeumanisticheesociali-DUMAS", [
      { year: 1, corso: "A218", anno2: ["100|1"] },
    ]),
  },
  {
    programme: "Tecniche Audiometriche (abilitante alla Professione Sanitaria di Audiometrista)",
    sources: degreeSources(BASE, ANNO, "tecniche-audiometriche-abilitante-alla-professione-sanitaria-di-audiometrista", "", [
      { year: 2, corso: "A162", anno2: ["100|2"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "", [
      { year: 1, corso: "1224", anno2: ["100|1"] },
      { year: 2, corso: "1224", anno2: ["100|2"] },
      { year: 3, corso: "1224", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "", [
      { year: 1, corso: "A004", anno2: ["100|1"] },
      { year: 2, corso: "A004", anno2: ["100|2"] },
      { year: 3, corso: "A004", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Tecnologie Viticole, Enologiche, Alimentari",
    sources: degreeSources(BASE, ANNO, "tecnologie-viticole-enologiche-alimentari", "DipartimentodiAgraria", [
      { year: 1, corso: "A176", anno2: ["284|1", "285|1"] },
      { year: 2, corso: "1176", anno2: ["284|2", "285|2"] },
      { year: 3, corso: "1176", anno2: ["284|3", "285|3"] },
    ]),
  },
  {
    programme: "Urbanistica. Progetto Ambientale della Città e del Territorio",
    sources: degreeSources(BASE, ANNO, "urbanistica-progetto-ambientale-della-citta-e-del-territorio", "DipartimentodiArchitettura-DesigneUrbanistica", [
      { year: 1, corso: "A184", anno2: ["100|1"] },
      { year: 2, corso: "A145", anno2: ["100|2"] },
      { year: 3, corso: "A145", anno2: ["100|3"] },
    ]),
  },
  {
    programme: "Wildlife Management, Conservation, and Control",
    sources: degreeSources(BASE, ANNO, "wildlife-management-conservation-and-control", "DipartimentodiMedicinaVeterinaria", [
      { year: 1, corso: "A193", anno2: ["100|1"] },
      { year: 2, corso: "A104", anno2: ["100|2"] },
    ]),
  },
];

export const uniss: UniversityPreset = {
  id: "uniss-ingegneria-informatica",
  name: "Università degli Studi di Sassari",
  shortName: "Università di Sassari",
  city: "Sassari",
  programme: "Ingegneria Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
