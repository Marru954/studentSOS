/**
 * Preset: Università degli Studi di Cagliari — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unica_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://unica.easystaff.it/AgendaWeb";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Advanced Biotechnology",
    sources: degreeSources(BASE, ANNO, "advanced-biotechnology", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/80", anno2: ["80/00|1"] },
      { year: 2, corso: "60/80", anno2: ["80/00|2"] },
    ]),
  },
  {
    programme: "Archeologia",
    sources: degreeSources(BASE, ANNO, "archeologia", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/57", anno2: ["57/00|1"] },
      { year: 2, corso: "20/50", anno2: ["50/00|2"] },
    ]),
  },
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "80/75", anno2: ["75/20|1", "75/40|1", "75/50|1"] },
      { year: 2, corso: "80/72", anno2: ["72/20|2", "72/40|2", "72/50|2"] },
    ]),
  },
  {
    programme: "Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario)",
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria-abilitante-alla-professione-sanitaria-di-assistente-sanitario", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/50", anno2: ["45/00|1"] },
      { year: 2, corso: "40/50", anno2: ["45/00|2"] },
      { year: 3, corso: "40/50", anno2: ["45/00|3"] },
    ]),
  },
  {
    programme: "Attivita' Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "attivita-motorie-preventive-e-adattate", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/63", anno2: ["63/00|2"] },
    ]),
  },
  {
    programme: "Beni Architeonici e del Paesaggio",
    sources: degreeSources(BASE, ANNO, "beni-architeonici-e-del-paesaggio", "POSTLAUREAM", [
      { year: 1, corso: "125/1001", anno2: ["1001/00|1"] },
      { year: 2, corso: "125/1001", anno2: ["1001/00|2"] },
    ]),
  },
  {
    programme: "Beni Culturali Archeologici, Storico-artistici e Archivistici",
    sources: degreeSources(BASE, ANNO, "beni-culturali-archeologici-storico-artistici-e-archivistici", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/64", anno2: ["64/10|1", "64/30|1", "64/20|1"] },
    ]),
  },
  {
    programme: "Beni Culturali e Spettacolo",
    sources: degreeSources(BASE, ANNO, "beni-culturali-e-spettacolo", "FacoltadiStudiUmanistici", [
      { year: 2, corso: "20/45", anno2: ["45/50|2", "45/46|2"] },
      { year: 3, corso: "20/45", anno2: ["45/50|3", "45/46|3"] },
    ]),
  },
  {
    programme: "Bio-ecologia Marina",
    sources: degreeSources(BASE, ANNO, "bio-ecologia-marina", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/89", anno2: ["89/00|1"] },
      { year: 2, corso: "60/70", anno2: ["70/00|2"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/81", anno2: ["81/10|1", "81/20|1"] },
      { year: 2, corso: "60/57", anno2: ["57/10|2", "57/20|2"] },
      { year: 3, corso: "60/57", anno2: ["57/10|3", "57/20|3"] },
    ]),
  },
  {
    programme: "Biologia Cellulare e Molecolare",
    sources: degreeSources(BASE, ANNO, "biologia-cellulare-e-molecolare", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/90", anno2: ["90/10|1", "90/20|1"] },
      { year: 2, corso: "60/71", anno2: ["71/10|2", "71/20|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "FacoltadiBiologiaeFarmacia", [
      { year: 2, corso: "60/76", anno2: ["76/20|2", "76/10|2"] },
      { year: 3, corso: "60/76", anno2: ["76/20|3", "76/10|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/97", anno2: ["97/00|1"] },
    ]),
  },
  {
    programme: "Biotecnologie Marine e degli Ecosistemi Acquatici",
    sources: degreeSources(BASE, ANNO, "biotecnologie-marine-e-degli-ecosistemi-acquatici", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/98", anno2: ["98/00|1"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "FacoltadiScienze", [
      { year: 1, corso: "60/82", anno2: ["82/10|1", "82/20|1"] },
      { year: 2, corso: "60/58", anno2: ["58/10|2", "58/20|2"] },
      { year: 3, corso: "60/58", anno2: ["58/10|3", "58/20|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/29", anno2: ["29/00|1"] },
      { year: 2, corso: "50/25", anno2: ["25/00|2"] },
      { year: 3, corso: "50/25", anno2: ["25/00|3"] },
      { year: 4, corso: "50/25", anno2: ["25/00|4"] },
      { year: 5, corso: "50/25", anno2: ["25/00|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico) (50/21)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico-50-21", "FacoltadiBiologiaeFarmacia", [
      { year: 4, corso: "50/21", anno2: ["21/00|4"] },
      { year: 5, corso: "50/21", anno2: ["21/00|5"] },
    ]),
  },
  {
    programme: "Cinema, Musiche, Teatro",
    sources: degreeSources(BASE, ANNO, "cinema-musiche-teatro", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/62", anno2: ["62/00|1"] },
    ]),
  },
  {
    programme: "Computer Engineering, Cybersecurity and Artificial Intelligence",
    sources: degreeSources(BASE, ANNO, "computer-engineering-cybersecurity-and-artificial-intelligence", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/10", anno2: ["10/00|1"] },
      { year: 2, corso: "70/90", anno2: ["90/00|2"] },
    ]),
  },
  {
    programme: "Conservazione e Gestione della Natura e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "conservazione-e-gestione-della-natura-e-dell-ambiente", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/95", anno2: ["95/20|1", "95/10|1"] },
      { year: 2, corso: "60/77", anno2: ["77/25|2", "77/15|2"] },
    ]),
  },
  {
    programme: "Conservazione e Restauro dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "conservazione-e-restauro-dei-beni-culturali", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/53", anno2: ["53/00|1"] },
      { year: 2, corso: "20/53", anno2: ["53/00|2"] },
    ]),
  },
  {
    programme: "Conversazione in Lingua Straniera (francese)",
    sources: degreeSources(BASE, ANNO, "conversazione-in-lingua-straniera-francese", "UnicaFI", [
      { year: 1, corso: "PFAB/BA02", anno2: ["BA02-30|1", "BA02-36|1", "BA02-60|1"] },
    ]),
  },
  {
    programme: "Conversazione in Lingua Straniera (inglese)",
    sources: degreeSources(BASE, ANNO, "conversazione-in-lingua-straniera-inglese", "UnicaFI", [
      { year: 1, corso: "PFAB/BB02", anno2: ["BB02-30|1", "BB02-36|1", "BB02-60|1"] },
    ]),
  },
  {
    programme: "Conversazione in Lingua Straniera (spagnolo)",
    sources: degreeSources(BASE, ANNO, "conversazione-in-lingua-straniera-spagnolo", "UnicaFI", [
      { year: 1, corso: "PFAB/BC02", anno2: ["BC02-30|1", "BC02-36|1", "BC02-60|1"] },
    ]),
  },
  {
    programme: "Data Science, Business Analytics e Innovazione",
    sources: degreeSources(BASE, ANNO, "data-science-business-analytics-e-innovazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/92", anno2: ["92/00|1"] },
      { year: 2, corso: "11/82", anno2: ["82/00|2"] },
    ]),
  },
  {
    programme: "Discipline Letterarie e Latino",
    sources: degreeSources(BASE, ANNO, "discipline-letterarie-e-latino", "UnicaFI", [
      { year: 1, corso: "PFAB/A011", anno2: ["A011-30|1", "A011-36|1", "A011-60|1"] },
    ]),
  },
  {
    programme: "Discipline Letterarie, Latino e Greco",
    sources: degreeSources(BASE, ANNO, "discipline-letterarie-latino-e-greco", "UnicaFI", [
      { year: 1, corso: "PFAB/A013", anno2: ["A013-30|1", "A013-36|1", "A013-60|1"] },
    ]),
  },
  {
    programme: "Disegno e Storia Dell'arte Nell'istruzione Secondaria di i e Ii Grado",
    sources: degreeSources(BASE, ANNO, "disegno-e-storia-dell-arte-nell-istruzione-secondaria-di-i-e-ii-grado", "UnicaFI", [
      { year: 1, corso: "PFAB/A001", anno2: ["A001-30|1", "A001-36|1", "A001-60|1"] },
    ]),
  },
  {
    programme: "Dottorati-trasversali",
    sources: degreeSources(BASE, ANNO, "dottorati-trasversali", "", [
      { year: 1, corso: "D-corso-trasv-1", anno2: ["trasv-00|1"] },
      { year: 2, corso: "D-corso-trasv-1", anno2: ["trasv-00|2"] },
      { year: 3, corso: "D-corso-trasv-1", anno2: ["trasv-00|3"] },
    ]),
  },
  {
    programme: "Dottorato di Ricerca in Ricerca e Innovazione Sociale",
    sources: degreeSources(BASE, ANNO, "dottorato-di-ricerca-in-ricerca-e-innovazione-sociale", "POSTLAUREAM", [
      { year: 1, corso: "1171", anno2: ["00|1"] },
      { year: 2, corso: "1171", anno2: ["00|2"] },
    ]),
  },
  {
    programme: "Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "economia-e-finanza", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/88", anno2: ["77/10|1", "77/20|1"] },
      { year: 2, corso: "11/77", anno2: ["77/10|2", "77/20|2"] },
      { year: 3, corso: "11/77", anno2: ["77/00|3"] },
    ]),
  },
  {
    programme: "Economia e Gestione Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-e-gestione-aziendale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/87", anno2: ["87/15|1", "87/66|1", "87/67|1", "87/35|1"] },
      { year: 2, corso: "11/75", anno2: ["75/15|2", "75/26|2", "75/55|2", "75/66|2", "75/35|2", "75/46|2"] },
      { year: 3, corso: "11/75", anno2: ["75/15|3", "75/26|3", "75/55|3", "75/67|3", "75/35|3", "75/46|3"] },
    ]),
  },
  {
    programme: "Economia Manageriale",
    sources: degreeSources(BASE, ANNO, "economia-manageriale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/90", anno2: ["80/15|1", "80/25|1", "80/40|1"] },
      { year: 2, corso: "11/80", anno2: ["80/15|2", "80/25|2", "80/40|2"] },
    ]),
  },
  {
    programme: "Economia, Finanza e Analisi dei Dati",
    sources: degreeSources(BASE, ANNO, "economia-finanza-e-analisi-dei-dati", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/89", anno2: ["86/20|1", "86/10|1"] },
      { year: 2, corso: "11/86", anno2: ["86/20|2", "86/10|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale)",
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/56", anno2: ["40/56|1"] },
      { year: 3, corso: "40/56", anno2: ["40/56|3"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/30", anno2: ["30/00|1"] },
      { year: 2, corso: "50/26", anno2: ["26/00|2"] },
      { year: 3, corso: "50/26", anno2: ["26/00|3"] },
      { year: 4, corso: "50/26", anno2: ["26/00|4"] },
      { year: 5, corso: "50/26", anno2: ["26/00|5"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico) (50/22)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico-50-22", "FacoltadiBiologiaeFarmacia", [
      { year: 4, corso: "50/22", anno2: ["22/00|4"] },
      { year: 5, corso: "50/22", anno2: ["22/00|5"] },
    ]),
  },
  {
    programme: "Filologie e Letterature Classiche e Moderne",
    sources: degreeSources(BASE, ANNO, "filologie-e-letterature-classiche-e-moderne", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/63", anno2: ["63/10|1", "63/20|1"] },
      { year: 2, corso: "20/42", anno2: ["42/00|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/54", anno2: ["54/00|1"] },
      { year: 2, corso: "20/39", anno2: ["39/00|2"] },
      { year: 3, corso: "20/39", anno2: ["39/00|3"] },
    ]),
  },
  {
    programme: "Filosofia e Forme del Sapere",
    sources: degreeSources(BASE, ANNO, "filosofia-e-forme-del-sapere", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/61", anno2: ["61/00|1"] },
      { year: 2, corso: "20/52", anno2: ["52/00|2"] },
    ]),
  },
  {
    programme: "Filosofia e Scienze Umane",
    sources: degreeSources(BASE, ANNO, "filosofia-e-scienze-umane", "UnicaFI", [
      { year: 1, corso: "PFAB/A018", anno2: ["A018-30|1", "A018-36|1", "A018-60|1"] },
    ]),
  },
  {
    programme: "Filosofia e Storia",
    sources: degreeSources(BASE, ANNO, "filosofia-e-storia", "UnicaFI", [
      { year: 1, corso: "PFAB/A019", anno2: ["A019-30|1", "A019-36|1", "A019-60|1"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "UnicaFI", [
      { year: 1, corso: "PFAB/A020", anno2: ["A020-30|1", "A020-36|1", "A020-60|1"] },
      { year: 2, corso: "60/60", anno2: ["60/00|2"] },
      { year: 3, corso: "60/60", anno2: ["60/00|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/83", anno2: ["83/00|1"] },
      { year: 2, corso: "60/68", anno2: ["68/30|2", "68/40|2", "68/50|2", "68/80|2", "68/60|2", "68/70|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale) (60/92)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale-60-92", "FacoltadiScienze", [
      { year: 1, corso: "60/92", anno2: ["92/10|1", "92/20|1", "92/30|1", "92/60|1", "92/40|1", "92/50|1"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/44", anno2: ["44/00|1"] },
      { year: 2, corso: "40/44", anno2: ["44/00|2"] },
      { year: 3, corso: "40/44", anno2: ["44/00|3"] },
    ]),
  },
  {
    programme: "Geografia",
    sources: degreeSources(BASE, ANNO, "geografia", "UnicaFI", [
      { year: 1, corso: "PFAB/A021", anno2: ["A021-30|1", "A021-36|1", "A021-60|1"] },
    ]),
  },
  {
    programme: "Geologia",
    sources: degreeSources(BASE, ANNO, "geologia", "FacoltadiScienze", [
      { year: 1, corso: "60/88", anno2: ["88/00|1"] },
      { year: 2, corso: "60/78", anno2: ["78/00|2"] },
      { year: 3, corso: "60/78", anno2: ["78/00|3"] },
    ]),
  },
  {
    programme: "Giornalismo e Informazione Web",
    sources: degreeSources(BASE, ANNO, "giornalismo-e-informazione-web", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/60", anno2: ["60/00|1"] },
      { year: 2, corso: "20/51", anno2: ["51/00|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "1/33", anno2: ["33/00|1"] },
      { year: 2, corso: "1/31", anno2: ["31/00|2"] },
      { year: 3, corso: "1/31", anno2: ["31/00|3"] },
      { year: 4, corso: "1/31", anno2: ["31/00|4"] },
      { year: 5, corso: "1/31", anno2: ["31/00|5"] },
    ]),
  },
  {
    programme: "Igiene Dentale (abilitante alla Professione Sanitaria di Igienista Dentale)",
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale", "FacoltadiMedicinaeChirurgia", [
      { year: 3, corso: "40/58", anno2: ["58/00|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (triennale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-triennale", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/77", anno2: ["77/00|1"] },
      { year: 2, corso: "40/42", anno2: ["42/00|2", "42/00_CAGLIARI|2", "42/00_NUORO|2"] },
      { year: 3, corso: "40/42", anno2: ["42/00_CAGLIARI|3", "42/00_NUORO|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (magistrale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-magistrale", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/78", anno2: ["78/00|1"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "FacoltadiScienze", [
      { year: 1, corso: "60/84", anno2: ["84/00|1"] },
      { year: 2, corso: "60/61", anno2: ["61/00|2"] },
      { year: 3, corso: "60/61", anno2: ["61/00|3"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/99", anno2: ["99/10|1", "99/20|1", "99/30|1"] },
      { year: 2, corso: "60/73", anno2: ["73/10|2", "73/20|2", "73/30|2"] },
    ]),
  },
  {
    programme: "Informatica Applicata e Data Analytics",
    sources: degreeSources(BASE, ANNO, "informatica-applicata-e-data-analytics", "FacoltadiScienze", [
      { year: 1, corso: "60/85", anno2: ["85/00|1"] },
      { year: 2, corso: "60/79", anno2: ["79/00|2"] },
      { year: 3, corso: "60/79", anno2: ["79/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Ambientale per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "ingegneria-ambientale-per-lo-sviluppo-sostenibile", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/16", anno2: ["16/20|1", "16/30|1", "16/10|1"] },
      { year: 2, corso: "70/95", anno2: ["95/20|2", "95/30|2", "95/10|2"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-magistrale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "70/99", anno2: ["99/20|1", "99/10|1"] },
      { year: 2, corso: "70/99", anno2: ["99/20|2", "99/10|2"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-triennale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/05", anno2: ["05/00|1"] },
      { year: 2, corso: "70/75", anno2: ["75/00|2"] },
      { year: 3, corso: "70/75", anno2: ["75/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica e dei Processi Biotecnologici",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-e-dei-processi-biotecnologici", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/17", anno2: ["17/00|1"] },
      { year: 2, corso: "70/88", anno2: ["88/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica per L'innovazione e la Sostenibilità dei Processi",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-per-l-innovazione-e-la-sostenibilita-dei-processi", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/07", anno2: ["07/30|1", "07/20|1", "07/10|1"] },
      { year: 2, corso: "70/97", anno2: ["97/30|2", "97/20|2", "97/10|2"] },
      { year: 3, corso: "70/97", anno2: ["97/30|3", "97/20|3", "97/10|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-triennale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/02", anno2: ["02/00|1"] },
      { year: 2, corso: "70/72", anno2: ["72/00|2"] },
      { year: 3, corso: "70/72", anno2: ["72/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-magistrale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/09", anno2: ["09/10|1", "09/35|1", "09/30|1", "09/20|1"] },
      { year: 2, corso: "70/80", anno2: ["80/10|2", "80/35|2", "80/30|2", "80/20|2"] },
    ]),
  },
  {
    programme: "Ingegneria Dell' Energia Elettrica per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-energia-elettrica-per-lo-sviluppo-sostenibile", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/06", anno2: ["06/00|1"] },
      { year: 2, corso: "70/92", anno2: ["92/00|2"] },
      { year: 3, corso: "70/92", anno2: ["92/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria delle Tecnologie per Internet",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-tecnologie-per-internet", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/11", anno2: ["11/00|1"] },
      { year: 2, corso: "70/91", anno2: ["91/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettrica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/12", anno2: ["12/00|1"] },
      { year: 2, corso: "70/82", anno2: ["82/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/13", anno2: ["13/00|1"] },
      { year: 2, corso: "70/83", anno2: ["83/25|2", "83/15|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica, Informatica e delle Telecomunicazioni",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-informatica-e-delle-telecomunicazioni", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/04", anno2: ["04/10|1", "04/20|1", "04/30|1"] },
      { year: 2, corso: "70/94", anno2: ["94/10|2", "94/20|2", "94/30|2"] },
      { year: 3, corso: "70/94", anno2: ["94/10|3", "94/20|3", "94/30|3"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-energetica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/14", anno2: ["14/00|1"] },
      { year: 2, corso: "70/84", anno2: ["84/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/15", anno2: ["15/00|1"] },
      { year: 2, corso: "70/85", anno2: ["85/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica e Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-e-gestionale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/08", anno2: ["08/20|1", "08/10|1"] },
      { year: 2, corso: "70/98", anno2: ["98/20|2", "98/10|2"] },
      { year: 3, corso: "70/98", anno2: ["98/20|3", "98/10|3"] },
    ]),
  },
  {
    programme: "Ingegneria Navale",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/01", anno2: ["01/00|1"] },
      { year: 2, corso: "71/01", anno2: ["01/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/03", anno2: ["03/00|1"] },
      { year: 2, corso: "70/73", anno2: ["73/00|2"] },
      { year: 3, corso: "70/73", anno2: ["73/00|3"] },
    ]),
  },
  {
    programme: "Innovazione Sociale e Comunicazione",
    sources: degreeSources(BASE, ANNO, "innovazione-sociale-e-comunicazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/74", anno2: ["74/00|1"] },
      { year: 2, corso: "2/69", anno2: ["69/00|2"] },
    ]),
  },
  {
    programme: "International Management",
    sources: degreeSources(BASE, ANNO, "international-management", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/84", anno2: ["84/00|1"] },
      { year: 2, corso: "11/84", anno2: ["84/00|2"] },
    ]),
  },
  {
    programme: "Laboratori di Fisica",
    sources: degreeSources(BASE, ANNO, "laboratori-di-fisica", "UnicaFI", [
      { year: 1, corso: "PFAB/B003", anno2: ["B003-30|1", "B003-36|1", "B003-60|1"] },
    ]),
  },
  {
    programme: "Laboratori di Scienze e Tecnologie Chimiche e Microbiologiche",
    sources: degreeSources(BASE, ANNO, "laboratori-di-scienze-e-tecnologie-chimiche-e-microbiologiche", "UnicaFI", [
      { year: 1, corso: "PFAB/B012", anno2: ["B012-30|1", "B012-36|1", "B012-60|1"] },
    ]),
  },
  {
    programme: "Laboratori di Scienze e Tecnologie Elettriche ed Elettroniche",
    sources: degreeSources(BASE, ANNO, "laboratori-di-scienze-e-tecnologie-elettriche-ed-elettroniche", "UnicaFI", [
      { year: 1, corso: "PFAB/B015", anno2: ["B015-30|1", "B015-36|1", "B015-60|1"] },
    ]),
  },
  {
    programme: "Laboratori di Scienze e Tecnologie Informatiche",
    sources: degreeSources(BASE, ANNO, "laboratori-di-scienze-e-tecnologie-informatiche", "UnicaFI", [
      { year: 1, corso: "PFAB/B016", anno2: ["B016-30|1", "B016-36|1", "B016-60|1"] },
    ]),
  },
  {
    programme: "Laboratori di Scienze e Tecnologie Meccaniche",
    sources: degreeSources(BASE, ANNO, "laboratori-di-scienze-e-tecnologie-meccaniche", "UnicaFI", [
      { year: 1, corso: "PFAB/B017", anno2: ["B017-30|1", "B017-36|1", "B017-60|1"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/58", anno2: ["58/10|1", "58/20|1", "58/40|1"] },
      { year: 2, corso: "20/40", anno2: ["40/10|2", "40/20|2", "40/40|2"] },
      { year: 3, corso: "20/40", anno2: ["40/10|3", "40/20|3", "40/40|3"] },
    ]),
  },
  {
    programme: "Lingue e Comunicazione",
    sources: degreeSources(BASE, ANNO, "lingue-e-comunicazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/21", anno2: ["21/00|1"] },
      { year: 2, corso: "32/17", anno2: ["17/00|2"] },
      { year: 3, corso: "32/17", anno2: ["17/00|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture per la Mediazione Linguistica",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-per-la-mediazione-linguistica", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/24", anno2: ["24/20|1", "24/10|1"] },
      { year: 2, corso: "32/19", anno2: ["19/00_INTERCULTURALE|2", "19/00_LETTERARIO|2"] },
      { year: 3, corso: "32/19", anno2: ["19/00_INTERCULTURALE|3", "19/00_LETTERARIO|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere Nell'istruzione Secondaria di i e Ii Grado (francese)",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-ii-grado-francese", "UnicaFI", [
      { year: 1, corso: "PFAB/AA22", anno2: ["AA22-30|1", "AA22-36|1", "AA22-60|1"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere Nell'istruzione Secondaria di i e Ii Grado (inglese)",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-ii-grado-inglese", "UnicaFI", [
      { year: 1, corso: "PFAB/AB22", anno2: ["AB22-30|1", "AB22-36|1", "AB22-60|1"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere Nell'istruzione Secondaria di i e Ii Grado (spagnolo)",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-ii-grado-spagnolo", "UnicaFI", [
      { year: 1, corso: "PFAB/AC22", anno2: ["AC22-30|1", "AC22-36|1", "AC22-60|1"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne Europee e Americane",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne-europee-e-americane", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/22", anno2: ["22/20|1", "22/10|1"] },
      { year: 2, corso: "32/15", anno2: ["15/20|2", "15/10|2"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/76", anno2: ["76/00|1"] },
    ]),
  },
  {
    programme: "Management del Turismo e della Sostenibilità",
    sources: degreeSources(BASE, ANNO, "management-del-turismo-e-della-sostenibilita", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/91", anno2: ["91/00|1"] },
      { year: 2, corso: "11/85", anno2: ["85/00|2"] },
    ]),
  },
  {
    programme: "Management delle Destinazioni e del Turismo Culturale",
    sources: degreeSources(BASE, ANNO, "management-delle-destinazioni-e-del-turismo-culturale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/93", anno2: ["93/20|1", "93/10|1"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "UnicaFI", [
      { year: 1, corso: "PFAB/A026", anno2: ["A026-30|1", "A026-36|1", "A026-60|1"] },
      { year: 2, corso: "60/64", anno2: ["64/00|2"] },
      { year: 3, corso: "60/64", anno2: ["64/00|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/87", anno2: ["87/00|1"] },
      { year: 2, corso: "60/65", anno2: ["65/60|2", "65/50|2", "65/40|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale) (60/93)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale-60-93", "FacoltadiScienze", [
      { year: 1, corso: "60/93", anno2: ["93/60|1", "93/50|1", "93/40|1"] },
    ]),
  },
  {
    programme: "Matematica e Fisica",
    sources: degreeSources(BASE, ANNO, "matematica-e-fisica", "UnicaFI", [
      { year: 1, corso: "PFAB/A027", anno2: ["A027-30|1", "A027-36|1", "A027-60|1"] },
    ]),
  },
  {
    programme: "Matematica e Scienze",
    sources: degreeSources(BASE, ANNO, "matematica-e-scienze", "UnicaFI", [
      { year: 1, corso: "PFAB/A028", anno2: ["A028-30|1", "A028-36|1", "A028-60|1"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/74", anno2: ["74/00_DISPARI|1", "74/00_PARI|1"] },
      { year: 2, corso: "40/39", anno2: ["39/00_DISPARI|2", "39/00_PARI|2"] },
      { year: 3, corso: "40/39", anno2: ["39/00|3", "39/00_DISPARI|3", "39/00_PARI|3"] },
      { year: 4, corso: "40/39", anno2: ["39/00_DISPARI|4", "39/00_PARI|4"] },
      { year: 5, corso: "40/39", anno2: ["39/00_DISPARI|5", "39/00_PARI|5"] },
      { year: 6, corso: "40/39", anno2: ["39/00_DISPARI|6", "39/00_PARI|6"] },
    ]),
  },
  {
    programme: "Medicine and Surgery",
    sources: degreeSources(BASE, ANNO, "medicine-and-surgery", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/71", anno2: ["71/00|1"] },
      { year: 2, corso: "40/71", anno2: ["71/00|2"] },
    ]),
  },
  {
    programme: "Neuropsicobiologia",
    sources: degreeSources(BASE, ANNO, "neuropsicobiologia", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/91", anno2: ["91/00|1"] },
      { year: 2, corso: "60/72", anno2: ["60/72-00|2"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/75", anno2: ["75/00|1"] },
      { year: 2, corso: "40/40", anno2: ["40/00|2"] },
      { year: 3, corso: "40/40", anno2: ["40/00|3"] },
      { year: 4, corso: "40/40", anno2: ["40/00|4"] },
      { year: 5, corso: "40/40", anno2: ["40/00|5"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/43", anno2: ["43/00|1"] },
      { year: 2, corso: "40/43", anno2: ["43/00|2"] },
    ]),
  },
  {
    programme: "Produzione Multimediale",
    sources: degreeSources(BASE, ANNO, "produzione-multimediale", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/55", anno2: ["55/00|1"] },
      { year: 2, corso: "20/48", anno2: ["47/00|2"] },
    ]),
  },
  {
    programme: "Psicologia Clinica, della Salute, Giuridica e Forense",
    sources: degreeSources(BASE, ANNO, "psicologia-clinica-della-salute-giuridica-e-forense", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/58", anno2: ["58/10|1", "58/20|1", "58/30|1"] },
      { year: 2, corso: "30/49", anno2: ["49/10|2", "49/20|2", "49/30|2"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/70", anno2: ["70/30|1", "70/10|1"] },
      { year: 2, corso: "2/66", anno2: ["66/30|2", "66/10|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali e Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-e-naturali", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/86", anno2: ["86/00|1"] },
      { year: 2, corso: "60/75", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "60/75", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "FacoltadiScienze", [
      { year: 1, corso: "60/94", anno2: ["94/00|1"] },
      { year: 2, corso: "60/69", anno2: ["69/00|2"] },
    ]),
  },
  {
    programme: "Scienze degli Alimenti e della Nutrizione",
    sources: degreeSources(BASE, ANNO, "scienze-degli-alimenti-e-della-nutrizione", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/28", anno2: ["28/10|1", "28/20|1"] },
      { year: 2, corso: "50/23", anno2: ["23/10|2", "23/20|2"] },
    ]),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "1/34", anno2: ["34/20|1", "34/10|1", "34/30|1"] },
      { year: 2, corso: "1/32", anno2: ["32/20|2", "32/10|2", "32/30|2"] },
      { year: 3, corso: "1/32", anno2: ["32/20|3", "32/10|3", "32/30|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'amministrazione e Dell'organizzazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-amministrazione-e-dell-organizzazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/72", anno2: ["72/00|1"] },
      { year: 2, corso: "2/67", anno2: ["67/10|2", "67/26|2"] },
      { year: 3, corso: "2/67", anno2: ["67/10|3", "67/26|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'architettura",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "80/74", anno2: ["74/00|1"] },
      { year: 2, corso: "80/71", anno2: ["71/00|2"] },
      { year: 3, corso: "80/71", anno2: ["71/00|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione e della Formazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-e-della-formazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/55", anno2: ["55/00|1"] },
      { year: 2, corso: "30/34", anno2: ["34/00|2"] },
      { year: 3, corso: "30/34", anno2: ["34/00|3"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/56", anno2: ["56/10|1", "56/20|1"] },
      { year: 2, corso: "30/35", anno2: ["35/20|2", "35/10|2"] },
      { year: 3, corso: "30/35", anno2: ["35/20|3", "35/10|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/46", anno2: ["46/00|1"] },
      { year: 2, corso: "30/46", anno2: ["46/00|2"] },
      { year: 3, corso: "30/46", anno2: ["46/00|3"] },
      { year: 4, corso: "30/46", anno2: ["46/00|4"] },
      { year: 5, corso: "30/46", anno2: ["46/00|5"] },
    ]),
  },
  {
    programme: "Scienze delle Attivita' Motorie e Sportive",
    sources: degreeSources(BASE, ANNO, "scienze-delle-attivita-motorie-e-sportive", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/72", anno2: ["72/00|1"] },
      { year: 2, corso: "40/35", anno2: ["35/00|2"] },
      { year: 3, corso: "40/35", anno2: ["35/00|3"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie della Prevenzione",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-della-prevenzione", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/67", anno2: ["67/00|1"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie Tecniche Diagnostiche",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-tecniche-diagnostiche", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/68", anno2: ["68/00|2"] },
    ]),
  },
  {
    programme: "Scienze delle Pubbliche Amministrazioni",
    sources: degreeSources(BASE, ANNO, "scienze-delle-pubbliche-amministrazioni", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/73", anno2: ["73/00|1"] },
      { year: 2, corso: "2/68", anno2: ["68/00|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/57", anno2: ["57/00|1"] },
      { year: 2, corso: "30/36", anno2: ["36/00|2"] },
      { year: 3, corso: "30/36", anno2: ["36/00|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-chimiche", "UnicaFI", [
      { year: 1, corso: "PFAB/A034", anno2: ["A034-30|1", "A034-36|1", "A034-60|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie delle Costruzioni, Tecnologie e Tecniche di Rappresentazione Grafica",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-delle-costruzioni-tecnologie-e-tecniche-di-rappresentazione-grafica", "UnicaFI", [
      { year: 1, corso: "PFAB/A037", anno2: ["A037-30|1", "A037-36|1", "A037-60|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-geologiche", "FacoltadiScienze", [
      { year: 1, corso: "60/96", anno2: ["96/30|1", "96/40|1"] },
      { year: 2, corso: "60/67", anno2: ["67/20|2", "67/10|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Informatiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-informatiche", "UnicaFI", [
      { year: 1, corso: "PFAB/A041", anno2: ["A041-30|1", "A041-36|1", "A041-60|1"] },
    ]),
  },
  {
    programme: "Scienze Economico-aziendali",
    sources: degreeSources(BASE, ANNO, "scienze-economico-aziendali", "UnicaFI", [
      { year: 1, corso: "PFAB/A045", anno2: ["A045-30|1", "A045-36|1", "A045-60|1"] },
    ]),
  },
  {
    programme: "Scienze Giuridico-economiche",
    sources: degreeSources(BASE, ANNO, "scienze-giuridico-economiche", "UnicaFI", [
      { year: 1, corso: "PFAB/A046", anno2: ["A046-30|1", "A046-36|1", "A046-60|1"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/69", anno2: ["69/00|2"] },
    ]),
  },
  {
    programme: "Scienze Matematiche Applicate",
    sources: degreeSources(BASE, ANNO, "scienze-matematiche-applicate", "UnicaFI", [
      { year: 1, corso: "PFAB/A047", anno2: ["A047-30|1", "A047-36|1", "A047-60|1"] },
    ]),
  },
  {
    programme: "Scienze Motorie e Sportive Nell'istruzione Secondaria di i e Ii Grado",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-e-sportive-nell-istruzione-secondaria-di-i-e-ii-grado", "UnicaFI", [
      { year: 1, corso: "PFAB/A048", anno2: ["A048-30|1", "A048-36|1", "A048-60|1"] },
    ]),
  },
  {
    programme: "Scienze Naturali, Chimiche e Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-naturali-chimiche-e-biologiche", "UnicaFI", [
      { year: 1, corso: "PFAB/A050", anno2: ["A050-30|1", "A050-36|1", "A050-60|1"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche e dei Processi Formativi",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche-e-dei-processi-formativi", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/59", anno2: ["59/20|1", "59/10|1"] },
      { year: 2, corso: "30/54", anno2: ["54/20|2", "54/10|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche",
    sources: degreeSources(BASE, ANNO, "scienze-politiche", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/71", anno2: ["71/10|1", "71/20|1"] },
      { year: 2, corso: "2/59", anno2: ["59/10|2", "59/20|2"] },
      { year: 3, corso: "2/59", anno2: ["59/10|3", "59/20|3"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/66", anno2: ["66/00|1"] },
    ]),
  },
  {
    programme: "Scienze Tossicologiche e Controllo di Qualità",
    sources: degreeSources(BASE, ANNO, "scienze-tossicologiche-e-controllo-di-qualita", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/27", anno2: ["27/00|1"] },
      { year: 2, corso: "50/24", anno2: ["20/00|2"] },
      { year: 3, corso: "50/24", anno2: ["20/00|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "SFMC", anno2: ["SFMC/00_CORSO1|1", "SFMC/00_CORSO2|1", "SFMC/00_CORSO3|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale e Innovazione",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-e-innovazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/75", anno2: ["75/00|1"] },
    ]),
  },
  {
    programme: "Storia Dell'arte (magistrale)",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte-magistrale", "UnicaFI", [
      { year: 1, corso: "PFAB/A054", anno2: ["A054-30|1", "A054-36|1", "A054-60|1"] },
      { year: 2, corso: "20/49", anno2: ["49/00|2"] },
    ]),
  },
  {
    programme: "Storia Dell'arte (magistrale) (20/56)",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte-magistrale-20-56", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/56", anno2: ["56/00|1"] },
    ]),
  },
  {
    programme: "Storia e Società",
    sources: degreeSources(BASE, ANNO, "storia-e-societa", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/59", anno2: ["59/60|1", "59/70|1"] },
      { year: 2, corso: "20/44", anno2: ["44/00|2"] },
    ]),
  },
  {
    programme: "Tecnica della Riabilitazione Psichiatrica (abilitante alla Professione Sanitaria di Tecnico della Riabilitazione Psichiatrica)",
    sources: degreeSources(BASE, ANNO, "tecnica-della-riabilitazione-psichiatrica-abilitante-alla-professione-sanitaria-di-tecnico-della-riabilitazione-psichiatrica", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/70", anno2: ["70/00|2"] },
    ]),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro)",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/59", anno2: ["59/00|1"] },
      { year: 2, corso: "40/59", anno2: ["59/00|2"] },
      { year: 3, corso: "40/59", anno2: ["59/00|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/65", anno2: ["65/00|1"] },
      { year: 2, corso: "40/65", anno2: ["65/00|2"] },
      { year: 3, corso: "40/65", anno2: ["65/00|3"] },
    ]),
  },
  {
    programme: "Tecniche di Neurofisiopatologia (abilitante alla Professione Sanitaria di Tecnico di Neurofisiopatologia)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-neurofisiopatologia-abilitante-alla-professione-sanitaria-di-tecnico-di-neurofisiopatologia", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/64", anno2: ["64/00|1"] },
      { year: 3, corso: "40/64", anno2: ["64/00|3"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/49", anno2: ["49/00|1"] },
      { year: 2, corso: "40/49", anno2: ["49/00|2"] },
      { year: 3, corso: "40/49", anno2: ["49/00|3"] },
    ]),
  },
  {
    programme: "Tecniche per L?edilizia e il Territorio",
    sources: degreeSources(BASE, ANNO, "tecniche-per-l-edilizia-e-il-territorio", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "70/93", anno2: ["93/00|1"] },
      { year: 2, corso: "70/93", anno2: ["93/00|2"] },
      { year: 3, corso: "70/93", anno2: ["93/00|3"] },
    ]),
  },
  {
    programme: "Tecnologia nella Scuola Secondaria di i Grado",
    sources: degreeSources(BASE, ANNO, "tecnologia-nella-scuola-secondaria-di-i-grado", "UnicaFI", [
      { year: 1, corso: "PFAB/A060", anno2: ["A060-30|1", "A060-36|1", "A060-60|1"] },
    ]),
  },
  {
    programme: "Tecnologie Elettriche Elettroniche",
    sources: degreeSources(BASE, ANNO, "tecnologie-elettriche-elettroniche", "UnicaFI", [
      { year: 1, corso: "PFAB/A040", anno2: ["A040-30|1", "A040-36|1", "A040-60|1"] },
    ]),
  },
  {
    programme: "Tecnologie Industriali per la Transizione Energetica e Digitale",
    sources: degreeSources(BASE, ANNO, "tecnologie-industriali-per-la-transizione-energetica-e-digitale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "70/96", anno2: ["96/10|1", "96/20|1"] },
      { year: 2, corso: "70/96", anno2: ["96/10|2", "96/20|2"] },
      { year: 3, corso: "70/96", anno2: ["96/10|3", "96/20|3"] },
    ]),
  },
  {
    programme: "Traduzione Specialistica e Interpretazione di Conferenza",
    sources: degreeSources(BASE, ANNO, "traduzione-specialistica-e-interpretazione-di-conferenza", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/23", anno2: ["23/20|1", "23/10|1"] },
      { year: 2, corso: "32/20", anno2: ["20/20|2", "20/10|2"] },
    ]),
  },
];

export const unica: UniversityPreset = {
  id: "unica-informatica",
  name: "Università degli Studi di Cagliari",
  shortName: "Università di Cagliari",
  city: "Cagliari",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
