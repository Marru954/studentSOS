/**
 * Preset: Università degli Studi di Perugia — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unipg_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.unipg.it/agendaweb";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Amministrazione, Finanza e Controllo",
    sources: degreeSources(BASE, ANNO, "amministrazione-finanza-e-controllo", "DipartimentodiEconomia", [
      { year: 2, corso: "LM22", anno2: ["E01|2", "E03|2", "E04|2", "E02|2"] },
    ]),
  },
  {
    programme: "AMMINISTRAZIONE, FINANZA e CONTROLLO - Primo Anno",
    sources: degreeSources(BASE, ANNO, "amministrazione-finanza-e-controllo-primo-anno", "DipartimentodiEconomia", [
      { year: 1, corso: "M0205", anno2: ["E01|1", "E03|1", "E04|1", "E02|1"] },
    ]),
  },
  {
    programme: "Archeologia e Storia Dell'arte",
    sources: degreeSources(BASE, ANNO, "archeologia-e-storia-dell-arte", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "LM97", anno2: ["ARCH|2", "ST|2"] },
    ]),
  },
  {
    programme: "ARCHEOLOGIA e STORIA DELL'ARTE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "archeologia-e-storia-dell-arte-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "M0829", anno2: ["ARCH|1", "ST|1"] },
    ]),
  },
  {
    programme: "Beni Culturali",
    sources: degreeSources(BASE, ANNO, "beni-culturali", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "L038", anno2: ["510|2", "305|2", "308|2"] },
      { year: 3, corso: "L038", anno2: ["510|3", "305|3", "308|3"] },
    ]),
  },
  {
    programme: "BENI CULTURALI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "beni-culturali-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "L0819", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "LM60", anno2: ["E07|2", "E05|2", "E04|2", "E03|2"] },
    ]),
  },
  {
    programme: "BIOLOGIA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "biologia-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "M0101", anno2: ["E07|1", "E05|1", "E04|1", "E03|1"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "L102", anno2: ["GEN_CANA|2", "GEN_CANB|2"] },
      { year: 3, corso: "L102", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "BIOTECNOLOGIE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "biotecnologie-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "L0103", anno2: ["GEN_CANA|1", "GEN_CANB|1", "GEN_CANC|1"] },
    ]),
  },
  {
    programme: "Biotecnologie Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche", "DipartimentodiScienzeFarmaceutiche", [
      { year: 2, corso: "LM38", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "BIOTECNOLOGIE FARMACEUTICHE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche-primo-anno", "DipartimentodiScienzeFarmaceutiche", [
      { year: 1, corso: "M1339", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Biotecnologie Molecolari e Industriali",
    sources: degreeSources(BASE, ANNO, "biotecnologie-molecolari-e-industriali", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "LM46", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "BIOTECNOLOGIE MOLECOLARI e INDUSTRIALI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "biotecnologie-molecolari-e-industriali-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "M0102", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "L060", anno2: ["GEN|2"] },
      { year: 3, corso: "L060", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "CHIMICA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "chimica-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "L0101", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "DipartimentodiScienzeFarmaceutiche", [
      { year: 2, corso: "MA05", anno2: ["GEN|2"] },
      { year: 3, corso: "MA05", anno2: ["GEN|3"] },
      { year: 4, corso: "MA05", anno2: ["GEN|4"] },
      { year: 5, corso: "MA05", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (triennale)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-triennale", "DipartimentodiScienzeFarmaceutiche", [
      { year: 4, corso: "MU05", anno2: ["GEN|4"] },
    ]),
  },
  {
    programme: "CHIMICA e TECNOLOGIA FARMACEUTICHE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-primo-anno", "DipartimentodiScienzeFarmaceutiche", [
      { year: 1, corso: "U1308", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "COMUNICAZIONE DIGITALE e D'IMPRESA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "comunicazione-digitale-e-d-impresa-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "M1444", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Comunicazione Pubblica, Digitale e D'impresa",
    sources: degreeSources(BASE, ANNO, "comunicazione-pubblica-digitale-e-d-impresa", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "LM95", anno2: ["276|2", "791|2"] },
    ]),
  },
  {
    programme: "Consulenza Pedagogica e Coordinamento di Interventi Formativi",
    sources: degreeSources(BASE, ANNO, "consulenza-pedagogica-e-coordinamento-di-interventi-formativi", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "LM59", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "CONSULENZA PEDAGOGICA e COORDINAMENTO DI INTERVENTI FORMATIVI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "consulenza-pedagogica-e-coordinamento-di-interventi-formativi-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "M0309", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "CONTROLLO DI QUALITÀ DEI PRODOTTI PER LA SALUTE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "controllo-di-qualita-dei-prodotti-per-la-salute-primo-anno", "DipartimentodiScienzeFarmaceutiche", [
      { year: 1, corso: "L1328", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Economia e Management",
    sources: degreeSources(BASE, ANNO, "economia-e-management", "DipartimentodiEconomia", [
      { year: 2, corso: "LM02", anno2: ["E01|2", "E02|2"] },
    ]),
  },
  {
    programme: "ECONOMIA e MANAGEMENT - Primo Anno",
    sources: degreeSources(BASE, ANNO, "economia-e-management-primo-anno", "DipartimentodiEconomia", [
      { year: 1, corso: "M0206", anno2: ["E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "DipartimentodiEconomia", [
      { year: 3, corso: "L021", anno2: ["758|3", "759|3", "760|3"] },
    ]),
  },
  {
    programme: "ECONOMIA AZIENDALE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-primo-anno", "DipartimentodiEconomia", [
      { year: 1, corso: "L029", anno2: ["E01|1", "E04|1", "E03|1", "E02|1", "E05|1"] },
      { year: 2, corso: "L029", anno2: ["E01|2", "E04|2", "E03|2", "E02|2", "E05|2"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "DipartimentodiScienzeFarmaceutiche", [
      { year: 2, corso: "MA04", anno2: ["GEN|2"] },
      { year: 3, corso: "MA04", anno2: ["GEN|3"] },
      { year: 4, corso: "MU04", anno2: ["GEN|4"] },
      { year: 5, corso: "MA04", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "FARMACIA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "farmacia-primo-anno", "DipartimentodiScienzeFarmaceutiche", [
      { year: 1, corso: "U1307", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Filosofia e Scienze e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "filosofia-e-scienze-e-tecniche-psicologiche", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "L033", anno2: ["FIL-AE|2", "FIL-DTS|2", "FIL-FL|2", "FIL-MZ|2", "PSI-AE|2", "PSI-DTS|2", "PSI-FL|2", "PSI-MZ|2"] },
      { year: 3, corso: "L033", anno2: ["FIL-AE|3", "FIL-DTS|3", "FIL-FL|3", "FIL-MZ|3", "PSI-AE|3", "PSI-DTS|3", "PSI-FL|3", "PSI-MZ|3"] },
    ]),
  },
  {
    programme: "FILOSOFIA e SCIENZE e TECNICHE PSICOLOGICHE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "filosofia-e-scienze-e-tecniche-psicologiche-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "L0306", anno2: ["FIL-A|1", "FIL-B|1", "FIL-C|1", "FIL-DTS|1", "FIL-B|1", "FIL-C|1", "PSI-A|1", "PSI-B|1", "PSI-C|1", "PSI-DTS|1", "PSI-B|1", "PSI-C|1"] },
    ]),
  },
  {
    programme: "Filosofia ed Etica delle Relazioni",
    sources: degreeSources(BASE, ANNO, "filosofia-ed-etica-delle-relazioni", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "LM57", anno2: ["787|2", "788|2", "E01|2", "790|2", "786|2", "785|2", "789|2"] },
    ]),
  },
  {
    programme: "FILOSOFIA ED ETICA DELLE RELAZIONI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "filosofia-ed-etica-delle-relazioni-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "M0311", anno2: ["787|1", "788|1", "E01|1", "790|1", "786|1", "785|1", "789|1"] },
    ]),
  },
  {
    programme: "Finanza e Metodi Quantitativi per L'economia",
    sources: degreeSources(BASE, ANNO, "finanza-e-metodi-quantitativi-per-l-economia", "DipartimentodiEconomia", [
      { year: 2, corso: "LM90", anno2: ["822|2", "821|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "DipartimentodiFisicaeGeologia", [
      { year: 2, corso: "L061", anno2: ["GEN|2"] },
      { year: 3, corso: "L061", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "DipartimentodiFisicaeGeologia", [
      { year: 2, corso: "LM15", anno2: ["513|2", "050|2", "245|2", "514|2", "246|2"] },
    ]),
  },
  {
    programme: "FISICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-primo-anno-magistrale", "DipartimentodiFisicaeGeologia", [
      { year: 1, corso: "L0409", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "FISICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-primo-anno-magistrale-2", "DipartimentodiFisicaeGeologia", [
      { year: 1, corso: "M0413", anno2: ["513|1", "050|1", "245|1", "514|1", "246|1"] },
    ]),
  },
  {
    programme: "Geologia",
    sources: degreeSources(BASE, ANNO, "geologia", "DipartimentodiFisicaeGeologia", [
      { year: 3, corso: "L065", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Geology for Energy Resources",
    sources: degreeSources(BASE, ANNO, "geology-for-energy-resources", "DipartimentodiFisicaeGeologia", [
      { year: 2, corso: "LM10", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "GEOLOGY FOR ENERGY RESOURCES - Primo Anno",
    sources: degreeSources(BASE, ANNO, "geology-for-energy-resources-primo-anno", "DipartimentodiFisicaeGeologia", [
      { year: 1, corso: "M0415", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "DipartimentodiGiurisprudenza", [
      { year: 2, corso: "LM01", anno2: ["GEN|2"] },
      { year: 3, corso: "LM01", anno2: ["GEN|3"] },
      { year: 4, corso: "LM01", anno2: ["GEN|4"] },
      { year: 5, corso: "LM01", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "GIURISPRUDENZA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-primo-anno", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "U0501", anno2: ["GEN_A-L|1", "GEN_M-Z|1"] },
    ]),
  },
  {
    programme: "GOVERNO e AMMINISTRAZIONE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "governo-e-amministrazione-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "M1442", anno2: ["E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-magistrale", "DipartimentodiMatematicaeInformatica", [
      { year: 2, corso: "LM65", anno2: ["E01|2", "E02|2"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "DipartimentodiMatematicaeInformatica", [
      { year: 2, corso: "L062", anno2: ["GEN|2"] },
      { year: 3, corso: "L062", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "INFORMATICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-primo-anno-magistrale", "DipartimentodiMatematicaeInformatica", [
      { year: 1, corso: "L0921", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "INFORMATICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-primo-anno-magistrale-2", "DipartimentodiMatematicaeInformatica", [
      { year: 1, corso: "M0930", anno2: ["E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Integrazione Giuridica Europea e Diritti Umani",
    sources: degreeSources(BASE, ANNO, "integrazione-giuridica-europea-e-diritti-umani", "DipartimentodiGiurisprudenza", [
      { year: 2, corso: "LM53", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "INTEGRAZIONE GIURIDICA EUROPEA e DIRITTI UMANI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "integrazione-giuridica-europea-e-diritti-umani-primo-anno", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "M0516", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "L030", anno2: ["296|2", "077|2"] },
      { year: 3, corso: "L030", anno2: ["296|3", "077|3"] },
    ]),
  },
  {
    programme: "LETTERE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "lettere-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "L0818", anno2: ["296|1", "077|1"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "L032", anno2: ["GEN|2"] },
      { year: 3, corso: "L032", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "LINGUE e CULTURE STRANIERE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "L0820", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Lingue, Letterature Comparate e Traduzione Interculturale",
    sources: degreeSources(BASE, ANNO, "lingue-letterature-comparate-e-traduzione-interculturale", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "LM64", anno2: ["817|2", "818|2"] },
    ]),
  },
  {
    programme: "LINGUE, LETTERATURE COMPARATE e TRADUZIONE INTERCULTURALE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "lingue-letterature-comparate-e-traduzione-interculturale-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "M0828", anno2: ["817|1", "818|1"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "DipartimentodiMatematicaeInformatica", [
      { year: 2, corso: "L066", anno2: ["GEN|2"] },
      { year: 3, corso: "L066", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "DipartimentodiMatematicaeInformatica", [
      { year: 2, corso: "LM26", anno2: ["807|2", "808|2", "E01|2", "E02|2"] },
    ]),
  },
  {
    programme: "MATEMATICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-primo-anno-magistrale", "DipartimentodiMatematicaeInformatica", [
      { year: 1, corso: "L0922", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "MATEMATICA - Primo Anno (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-primo-anno-magistrale-2", "DipartimentodiMatematicaeInformatica", [
      { year: 1, corso: "M0931", anno2: ["E03|1", "E04|1", "E05|1", "E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Metodologie per Prodotto e Processo",
    sources: degreeSources(BASE, ANNO, "metodologie-per-prodotto-e-processo", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "L06A", anno2: ["E02|1", "E01|1"] },
      { year: 2, corso: "L06A", anno2: ["E02|2", "E01|2"] },
    ]),
  },
  {
    programme: "Politica, Amministrazione, Territorio",
    sources: degreeSources(BASE, ANNO, "politica-amministrazione-territorio", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "LM45", anno2: ["E04|2", "E05|2", "E06|2"] },
    ]),
  },
  {
    programme: "Politiche e Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "politiche-e-servizi-sociali", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "LM47", anno2: ["E02|2", "E01|2"] },
    ]),
  },
  {
    programme: "POLITICHE SOCIALI, SISTEMI DI WELFARE e TERZO SETTORE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "politiche-sociali-sistemi-di-welfare-e-terzo-settore-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "M1443", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Programmazione e Gestione di Sistemi Informatici",
    sources: degreeSources(BASE, ANNO, "programmazione-e-gestione-di-sistemi-informatici", "DipartimentodiMatematicaeInformatica", [
      { year: 1, corso: "L067", anno2: ["GEN|1"] },
      { year: 2, corso: "L067", anno2: ["GEN|2"] },
      { year: 3, corso: "L067", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "QUANTITATIVE FINANCE AND DATA SCIENCE FOR ECONOMICS - Primo Anno",
    sources: degreeSources(BASE, ANNO, "quantitative-finance-and-data-science-for-economics-primo-anno", "DipartimentodiEconomia", [
      { year: 1, corso: "M0208", anno2: ["E02|1", "E01|1"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "LM33", anno2: ["E01|2", "E02|2", "E03|2"] },
    ]),
  },
  {
    programme: "RELAZIONI INTERNAZIONALI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "M1441", anno2: ["E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "L063", anno2: ["959|2", "958|2"] },
      { year: 3, corso: "L063", anno2: ["959|3", "958|3"] },
    ]),
  },
  {
    programme: "SCIENZE BIOLOGICHE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "L0102", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "LM27", anno2: ["339|2", "957|2", "341|2", "E11|2", "956|2"] },
    ]),
  },
  {
    programme: "SCIENZE CHIMICHE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "M0103", anno2: ["339|1", "957|1", "341|1", "E11|1", "956|1"] },
    ]),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "DipartimentodiGiurisprudenza", [
      { year: 2, corso: "L115", anno2: ["726|2", "E01|2", "816|2"] },
      { year: 3, corso: "L115", anno2: ["726|3", "E01|3", "816|3"] },
    ]),
  },
  {
    programme: "SCIENZE DEI SERVIZI GIURIDICI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici-primo-anno", "DipartimentodiGiurisprudenza", [
      { year: 1, corso: "L0511", anno2: ["726|1", "E01|1", "816|1"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "L040", anno2: ["E07|2", "E08|2"] },
      { year: 3, corso: "L040", anno2: ["E07|3", "E08|3"] },
    ]),
  },
  {
    programme: "SCIENZE DELL'EDUCAZIONE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "L0307", anno2: ["E07|1", "E08|1"] },
    ]),
  },
  {
    programme: "Scienze della Alimentazione e della Nutrizione Umana",
    sources: degreeSources(BASE, ANNO, "scienze-della-alimentazione-e-della-nutrizione-umana", "DipartimentodiScienzeFarmaceutiche", [
      { year: 2, corso: "LM17", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "SCIENZE DELLA ALIMENTAZIONE e DELLA NUTRIZIONE UMANA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-della-alimentazione-e-della-nutrizione-umana-primo-anno", "DipartimentodiScienzeFarmaceutiche", [
      { year: 1, corso: "M1340", anno2: ["E01|1"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "L146", anno2: ["GEN|2"] },
      { year: 3, corso: "L146", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "SCIENZE DELLA COMUNICAZIONE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "L1431", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "MU08", anno2: ["GEN|1"] },
      { year: 2, corso: "MU08", anno2: ["GEN|2"] },
      { year: 3, corso: "MU08", anno2: ["GEN|3"] },
      { year: 4, corso: "MU08", anno2: ["GEN|4"] },
      { year: 5, corso: "MU08", anno2: ["GEN|5"] },
    ]),
  },
  {
    programme: "Scienze della Terra e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-della-terra-e-dell-ambiente", "DipartimentodiFisicaeGeologia", [
      { year: 1, corso: "L06B", anno2: ["GEN|1"] },
      { year: 2, corso: "L06B", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Scienze della Terra per la Gestione dei Rischi e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-della-terra-per-la-gestione-dei-rischi-e-dell-ambiente", "DipartimentodiFisicaeGeologia", [
      { year: 2, corso: "LM12", anno2: ["E01|2", "E02|2"] },
    ]),
  },
  {
    programme: "SCIENZE DELLA TERRA PER LA GESTIONE DEI RISCHI e DELL'AMBIENTE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-della-terra-per-la-gestione-dei-rischi-e-dell-ambiente-primo-anno", "DipartimentodiFisicaeGeologia", [
      { year: 1, corso: "M0414", anno2: ["E01|1", "E02|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Naturalistiche e Ambientali",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-naturalistiche-e-ambientali", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 2, corso: "LM48", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "SCIENZE e TECNOLOGIE NATURALISTICHE e AMBIENTALI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-naturalistiche-e-ambientali-primo-anno", "DipartimentodiChimica-BiologiaeBiotecnologie", [
      { year: 1, corso: "M0104", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Politiche e Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-relazioni-internazionali", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "L018", anno2: ["324|2", "326|2", "325|2"] },
      { year: 3, corso: "L018", anno2: ["324|3", "326|3", "325|3"] },
    ]),
  },
  {
    programme: "SCIENZE POLITICHE e RELAZIONI INTERNAZIONALI - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-relazioni-internazionali-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "L1429", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Scienze Socioantropologiche per L'integrazione e la Sicurezza Sociale",
    sources: degreeSources(BASE, ANNO, "scienze-socioantropologiche-per-l-integrazione-e-la-sicurezza-sociale", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "LM94", anno2: ["LM1|2", "LM88|2"] },
    ]),
  },
  {
    programme: "SCIENZE SOCIOANTROPOLOGICHE PER L'INTEGRAZIONE e LA SICUREZZA SOCIALE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "scienze-socioantropologiche-per-l-integrazione-e-la-sicurezza-sociale-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "M0310", anno2: ["LM1|1", "LM88|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "DipartimentodiScienzePolitiche", [
      { year: 2, corso: "L017", anno2: ["GEN|2"] },
      { year: 3, corso: "L017", anno2: ["GEN|3"] },
    ]),
  },
  {
    programme: "SERVIZIO SOCIALE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-primo-anno", "DipartimentodiScienzePolitiche", [
      { year: 1, corso: "L1430", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Studi Italiani, Classici e Storia Europea",
    sources: degreeSources(BASE, ANNO, "studi-italiani-classici-e-storia-europea", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 2, corso: "LM70", anno2: ["E02|2", "E01|2", "E03|2"] },
    ]),
  },
  {
    programme: "STUDI ITALIANI, CLASSICI e STORIA EUROPEA - Primo Anno",
    sources: degreeSources(BASE, ANNO, "studi-italiani-classici-e-storia-europea-primo-anno", "DipartimentodiLettere-Lingue-LetteratureeCiviltaAnticheeModerne", [
      { year: 1, corso: "M0827", anno2: ["E02|1", "E01|1", "E03|1"] },
    ]),
  },
  {
    programme: "Valutazione del Funzionamento Individuale in Psicologia Clinica e della Salute",
    sources: degreeSources(BASE, ANNO, "valutazione-del-funzionamento-individuale-in-psicologia-clinica-e-della-salute", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 2, corso: "LM93", anno2: ["E09|2", "E10|2"] },
    ]),
  },
  {
    programme: "VALUTAZIONE DEL FUNZIONAMENTO INDIVIDUALE IN PSICOLOGIA CLINICA e DELLA SALUTE - Primo Anno",
    sources: degreeSources(BASE, ANNO, "valutazione-del-funzionamento-individuale-in-psicologia-clinica-e-della-salute-primo-anno", "DipartimentodiFilosofia-ScienzeSociali-UmaneedellaFormazione", [
      { year: 1, corso: "M0312", anno2: ["E09|1", "E10|1"] },
    ]),
  },
];

export const unipg: UniversityPreset = {
  id: "unipg-informatica",
  name: "Università degli Studi di Perugia",
  shortName: "Università di Perugia",
  city: "Perugia",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
