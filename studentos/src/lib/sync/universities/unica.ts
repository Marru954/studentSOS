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
const ANNO = "2026";

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
      { year: 2, corso: "20/57", anno2: ["57/00|2"] },
    ]),
  },
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "80/75", anno2: ["75/20|1", "75/40|1", "75/50|1"] },
      { year: 2, corso: "80/75", anno2: ["75/20|2", "75/40|2", "75/50|2"] },
    ]),
  },
  {
    programme: "Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario)",
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria-abilitante-alla-professione-sanitaria-di-assistente-sanitario", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/50", anno2: ["50/00|1"] },
      { year: 2, corso: "40/50", anno2: ["45/00|2"] },
      { year: 3, corso: "40/50", anno2: ["45/00|3"] },
    ]),
  },
  {
    programme: "Attivita' Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "attivita-motorie-preventive-e-adattate", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/73", anno2: ["73/00|1"] },
    ]),
  },
  {
    programme: "Beni Culturali Archeologici, Storico-artistici e Archivistici",
    sources: degreeSources(BASE, ANNO, "beni-culturali-archeologici-storico-artistici-e-archivistici", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/64", anno2: ["64/10|1", "64/30|1", "64/20|1"] },
      { year: 2, corso: "20/64", anno2: ["64/10|2", "64/30|2", "64/20|2"] },
    ]),
  },
  {
    programme: "Beni Culturali e Spettacolo",
    sources: degreeSources(BASE, ANNO, "beni-culturali-e-spettacolo", "FacoltadiStudiUmanistici", [
      { year: 3, corso: "20/45", anno2: ["45/50|3", "45/46|3"] },
    ]),
  },
  {
    programme: "Bio-ecologia Marina",
    sources: degreeSources(BASE, ANNO, "bio-ecologia-marina", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/89", anno2: ["89/00|1"] },
      { year: 2, corso: "60/89", anno2: ["89/00|2"] },
    ]),
  },
  {
    programme: "Biologia",
    sources: degreeSources(BASE, ANNO, "biologia", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/81", anno2: ["81/10|1", "81/20|1"] },
      { year: 2, corso: "60/81", anno2: ["81/10|2", "81/20|2"] },
      { year: 3, corso: "60/57", anno2: ["57/10|3", "57/20|3"] },
    ]),
  },
  {
    programme: "Biologia Cellulare e Molecolare",
    sources: degreeSources(BASE, ANNO, "biologia-cellulare-e-molecolare", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/90", anno2: ["90/10|1", "90/20|1"] },
      { year: 2, corso: "60/90", anno2: ["90/10|2", "90/20|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "FacoltadiBiologiaeFarmacia", [
      { year: 3, corso: "60/76", anno2: ["76/20|3", "76/10|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-farmaceutiche", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/97", anno2: ["97/00|1"] },
      { year: 2, corso: "60/97", anno2: ["97/00|2"] },
    ]),
  },
  {
    programme: "Biotecnologie Marine e degli Ecosistemi Acquatici",
    sources: degreeSources(BASE, ANNO, "biotecnologie-marine-e-degli-ecosistemi-acquatici", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/98", anno2: ["98/00|1"] },
      { year: 2, corso: "60/98", anno2: ["98/00|2"] },
    ]),
  },
  {
    programme: "Chimica",
    sources: degreeSources(BASE, ANNO, "chimica", "FacoltadiScienze", [
      { year: 1, corso: "60/82", anno2: ["82/00|1"] },
      { year: 2, corso: "60/82", anno2: ["82/10|2", "82/20|2"] },
      { year: 3, corso: "60/58", anno2: ["58/10|3", "58/20|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/29", anno2: ["29/00|1"] },
      { year: 2, corso: "50/29", anno2: ["29/00|2"] },
      { year: 3, corso: "50/25", anno2: ["25/00|3"] },
      { year: 4, corso: "50/25", anno2: ["25/00|4"] },
      { year: 5, corso: "50/25", anno2: ["25/00|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico) (50/21)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico-50-21", "FacoltadiBiologiaeFarmacia", [
      { year: 5, corso: "50/21", anno2: ["21/00|5"] },
    ]),
  },
  {
    programme: "Cinema, Musiche, Teatro",
    sources: degreeSources(BASE, ANNO, "cinema-musiche-teatro", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/62", anno2: ["62/00|1"] },
      { year: 2, corso: "20/62", anno2: ["62/00|2"] },
    ]),
  },
  {
    programme: "Computer Engineering, Cybersecurity and Artificial Intelligence",
    sources: degreeSources(BASE, ANNO, "computer-engineering-cybersecurity-and-artificial-intelligence", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/10", anno2: ["10/00|1"] },
      { year: 2, corso: "71/10", anno2: ["10/00|2"] },
    ]),
  },
  {
    programme: "Conservazione e Gestione della Natura e Dell'ambiente",
    sources: degreeSources(BASE, ANNO, "conservazione-e-gestione-della-natura-e-dell-ambiente", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/95", anno2: ["95/20|1", "95/10|1"] },
      { year: 2, corso: "60/95", anno2: ["95/20|2", "95/10|2"] },
    ]),
  },
  {
    programme: "Conservazione e Restauro dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "conservazione-e-restauro-dei-beni-culturali", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/53", anno2: ["53/00|1"] },
      { year: 2, corso: "20/53", anno2: ["53/00|2"] },
      { year: 3, corso: "20/53", anno2: ["53/00|3"] },
    ]),
  },
  {
    programme: "Data Science, Business Analytics e Innovazione",
    sources: degreeSources(BASE, ANNO, "data-science-business-analytics-e-innovazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 2, corso: "11/92", anno2: ["92/00|2"] },
    ]),
  },
  {
    programme: "Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "economia-e-finanza", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/88", anno2: ["88/10|1", "88/20|1"] },
      { year: 2, corso: "11/88", anno2: ["77/10|2", "77/20|2"] },
      { year: 3, corso: "11/77", anno2: ["77/10|3", "77/20|3"] },
    ]),
  },
  {
    programme: "Economia e Gestione Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-e-gestione-aziendale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/87", anno2: ["87/15|1", "87/66|1", "87/67|1", "87/35|1"] },
      { year: 2, corso: "11/87", anno2: ["87/15|2", "87/66|2", "87/35|2"] },
      { year: 3, corso: "11/75", anno2: ["75/15|3", "75/26|3", "75/55|3", "75/67|3", "75/35|3", "75/46|3"] },
    ]),
  },
  {
    programme: "Economia Manageriale",
    sources: degreeSources(BASE, ANNO, "economia-manageriale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/90", anno2: ["90/15|1", "90/25|1", "90/40|1"] },
      { year: 2, corso: "11/90", anno2: ["80/15|2", "80/25|2", "80/40|2"] },
    ]),
  },
  {
    programme: "Economia, Finanza e Analisi dei Dati",
    sources: degreeSources(BASE, ANNO, "economia-finanza-e-analisi-dei-dati", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/89", anno2: ["89/20|1", "89/10|1"] },
      { year: 2, corso: "11/89", anno2: ["86/20|2", "86/10|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale)",
    sources: degreeSources(BASE, ANNO, "educazione-professionale-abilitante-alla-professione-sanitaria-di-educatore-professionale", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/56", anno2: ["40/56|2"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/30", anno2: ["30/00|1"] },
      { year: 2, corso: "50/30", anno2: ["30/00|2"] },
      { year: 3, corso: "50/26", anno2: ["26/00|3"] },
      { year: 4, corso: "50/26", anno2: ["26/00|4"] },
      { year: 5, corso: "50/26", anno2: ["26/00|5"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico) (50/22)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico-50-22", "FacoltadiBiologiaeFarmacia", [
      { year: 5, corso: "50/22", anno2: ["22/00|5"] },
    ]),
  },
  {
    programme: "Filologie e Letterature Classiche e Moderne",
    sources: degreeSources(BASE, ANNO, "filologie-e-letterature-classiche-e-moderne", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/63", anno2: ["63/10|1", "63/20|1"] },
      { year: 2, corso: "20/63", anno2: ["63/10|2", "63/20|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/54", anno2: ["54/00|1"] },
      { year: 2, corso: "20/54", anno2: ["54/00|2"] },
      { year: 3, corso: "20/39", anno2: ["39/00|3"] },
    ]),
  },
  {
    programme: "Filosofia e Forme del Sapere",
    sources: degreeSources(BASE, ANNO, "filosofia-e-forme-del-sapere", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/61", anno2: ["61/00|1"] },
      { year: 2, corso: "20/61", anno2: ["61/00|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "FacoltadiScienze", [
      { year: 3, corso: "60/60", anno2: ["60/00|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/83", anno2: ["83/00|1"] },
      { year: 2, corso: "60/83", anno2: ["83/00|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale) (60/92)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale-60-92", "FacoltadiScienze", [
      { year: 1, corso: "60/92", anno2: ["92/10|1", "92/20|1", "92/70|1", "92/30|1", "92/60|1", "92/80|1"] },
      { year: 2, corso: "60/92", anno2: ["92/10|2", "92/20|2", "92/30|2", "92/60|2", "92/40|2", "92/50|2"] },
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
    programme: "Geologia",
    sources: degreeSources(BASE, ANNO, "geologia", "FacoltadiScienze", [
      { year: 1, corso: "60/88", anno2: ["88/00|1"] },
      { year: 2, corso: "60/88", anno2: ["88/00|2"] },
      { year: 3, corso: "60/78", anno2: ["78/00|3"] },
    ]),
  },
  {
    programme: "Giornalismo e Informazione Web",
    sources: degreeSources(BASE, ANNO, "giornalismo-e-informazione-web", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/60", anno2: ["60/00|1"] },
      { year: 2, corso: "20/60", anno2: ["60/00|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 3, corso: "1/31", anno2: ["31/00|3"] },
      { year: 4, corso: "1/31", anno2: ["31/00|4"] },
      { year: 5, corso: "1/31", anno2: ["31/00|5"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (triennale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-triennale", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/77", anno2: ["77/00|1"] },
      { year: 2, corso: "40/77", anno2: ["77/00|2"] },
      { year: 3, corso: "40/42", anno2: ["42/00_CAGLIARI|3", "42/00_NUORO|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) (magistrale)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere-magistrale", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/78", anno2: ["78/00|1"] },
      { year: 2, corso: "40/78", anno2: ["78/00|2"] },
    ]),
  },
  {
    programme: "Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "informatica-triennale", "FacoltadiScienze", [
      { year: 1, corso: "60/84", anno2: ["84/00|1"] },
      { year: 2, corso: "60/84", anno2: ["84/00|2"] },
      { year: 3, corso: "60/61", anno2: ["61/00|3"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "informatica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/99", anno2: ["99/10|1", "99/20|1", "99/30|1"] },
      { year: 2, corso: "60/99", anno2: ["99/10|2", "99/20|2", "99/30|2"] },
    ]),
  },
  {
    programme: "Informatica Applicata e Data Analytics",
    sources: degreeSources(BASE, ANNO, "informatica-applicata-e-data-analytics", "FacoltadiScienze", [
      { year: 1, corso: "60/85", anno2: ["85/00|1"] },
      { year: 2, corso: "60/85", anno2: ["85/00|2"] },
      { year: 3, corso: "60/79", anno2: ["79/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Ambientale per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "ingegneria-ambientale-per-lo-sviluppo-sostenibile", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/16", anno2: ["16/20|1", "16/30|1", "16/10|1"] },
      { year: 2, corso: "71/16", anno2: ["16/20|2", "16/30|2", "16/10|2"] },
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
      { year: 2, corso: "71/05", anno2: ["05/00|2"] },
      { year: 3, corso: "70/75", anno2: ["75/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica e dei Processi Biotecnologici",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-e-dei-processi-biotecnologici", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/17", anno2: ["17/00|1"] },
      { year: 2, corso: "71/17", anno2: ["17/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica per L'innovazione e la Sostenibilità dei Processi",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-per-l-innovazione-e-la-sostenibilita-dei-processi", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/07", anno2: ["07/30|1", "07/20|1", "07/10|1"] },
      { year: 2, corso: "71/07", anno2: ["07/30|2", "07/20|2", "07/10|2"] },
      { year: 3, corso: "70/97", anno2: ["97/30|3", "97/20|3", "97/10|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-triennale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/02", anno2: ["02/00|1"] },
      { year: 2, corso: "71/02", anno2: ["02/00|2"] },
      { year: 3, corso: "70/72", anno2: ["72/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-magistrale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/09", anno2: ["09/10|1", "09/35|1", "09/30|1", "09/20|1"] },
      { year: 2, corso: "71/09", anno2: ["09/10|2", "09/35|2", "09/30|2", "09/20|2"] },
    ]),
  },
  {
    programme: "Ingegneria Dell' Energia Elettrica per lo Sviluppo Sostenibile",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-energia-elettrica-per-lo-sviluppo-sostenibile", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/06", anno2: ["06/00|1"] },
      { year: 2, corso: "71/06", anno2: ["06/00|2"] },
      { year: 3, corso: "70/92", anno2: ["92/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria delle Tecnologie per Internet",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-tecnologie-per-internet", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/11", anno2: ["11/00|1"] },
      { year: 2, corso: "71/11", anno2: ["11/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettrica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/12", anno2: ["12/00|1"] },
      { year: 2, corso: "71/12", anno2: ["12/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/13", anno2: ["13/00|1"] },
      { year: 2, corso: "71/13", anno2: ["13/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica, Informatica e delle Telecomunicazioni",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-informatica-e-delle-telecomunicazioni", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/04", anno2: ["04/10|1", "04/20|1", "04/30|1"] },
      { year: 2, corso: "71/04", anno2: ["04/10|2", "04/20|2", "04/30|2"] },
      { year: 3, corso: "70/94", anno2: ["94/10|3", "94/20|3", "94/30|3"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources(BASE, ANNO, "ingegneria-energetica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/14", anno2: ["14/00|1"] },
      { year: 2, corso: "71/14", anno2: ["14/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/15", anno2: ["15/00|1"] },
      { year: 2, corso: "71/15", anno2: ["15/00|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica e Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-e-gestionale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/08", anno2: ["08/20|1", "08/10|1"] },
      { year: 2, corso: "71/08", anno2: ["08/20|2", "08/10|2"] },
      { year: 3, corso: "70/98", anno2: ["98/20|3", "98/10|3"] },
    ]),
  },
  {
    programme: "Ingegneria Navale",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/01", anno2: ["01/00|1"] },
      { year: 2, corso: "71/01", anno2: ["01/00|2"] },
      { year: 3, corso: "71/01", anno2: ["01/00|3"] },
    ]),
  },
  {
    programme: "Ingegneria per L'ambiente e il Territorio",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-ambiente-e-il-territorio", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/03", anno2: ["03/00|1"] },
      { year: 2, corso: "71/03", anno2: ["03/00|2"] },
      { year: 3, corso: "70/73", anno2: ["73/00|3"] },
    ]),
  },
  {
    programme: "Innovazione Sociale e Comunicazione",
    sources: degreeSources(BASE, ANNO, "innovazione-sociale-e-comunicazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/74", anno2: ["74/00|1"] },
      { year: 2, corso: "2/74", anno2: ["74/00|2"] },
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
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/58", anno2: ["58/10|1", "58/20|1", "58/40|1"] },
      { year: 2, corso: "20/58", anno2: ["58/10|2", "58/20|2", "58/40|2"] },
      { year: 3, corso: "20/40", anno2: ["40/10|3", "40/20|3", "40/40|3"] },
    ]),
  },
  {
    programme: "Lingue e Comunicazione",
    sources: degreeSources(BASE, ANNO, "lingue-e-comunicazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/21", anno2: ["21/00|1"] },
      { year: 2, corso: "32/21", anno2: ["21/00|2"] },
      { year: 3, corso: "32/17", anno2: ["17/00|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture per la Mediazione Linguistica",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-per-la-mediazione-linguistica", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/24", anno2: ["24/20|1", "24/10|1"] },
      { year: 2, corso: "32/24", anno2: ["24/20|2", "24/10|2"] },
      { year: 3, corso: "32/19", anno2: ["24/20|3", "24/10|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne Europee e Americane",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne-europee-e-americane", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/22", anno2: ["22/30|1", "22/20|1", "22/10|1"] },
      { year: 2, corso: "32/22", anno2: ["22/20|2", "22/10|2"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/76", anno2: ["76/00|1"] },
      { year: 2, corso: "40/76", anno2: ["76/00|2"] },
    ]),
  },
  {
    programme: "Management del Turismo e della Sostenibilità",
    sources: degreeSources(BASE, ANNO, "management-del-turismo-e-della-sostenibilita", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/91", anno2: ["91/00|1"] },
      { year: 2, corso: "11/91", anno2: ["91/00|2"] },
    ]),
  },
  {
    programme: "Management delle Destinazioni e del Turismo Culturale",
    sources: degreeSources(BASE, ANNO, "management-delle-destinazioni-e-del-turismo-culturale", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/93", anno2: ["93/20|1", "93/10|1"] },
      { year: 2, corso: "11/93", anno2: ["93/20|2", "93/10|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "FacoltadiScienze", [
      { year: 3, corso: "60/64", anno2: ["64/00|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "FacoltadiScienze", [
      { year: 1, corso: "60/87", anno2: ["87/00|1"] },
      { year: 2, corso: "60/87", anno2: ["87/00|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale) (60/93)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale-60-93", "FacoltadiScienze", [
      { year: 1, corso: "60/93", anno2: ["93/60|1", "93/50|1", "93/40|1"] },
      { year: 2, corso: "60/93", anno2: ["93/60|2", "93/50|2", "93/40|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "FacoltadiMedicinaeChirurgia", [
      { year: 3, corso: "40/39", anno2: ["39/00|3", "39/00_DISPARI|3", "39/00_PARI|3"] },
      { year: 4, corso: "40/39", anno2: ["39/00|4", "39/00_DISPARI|4", "39/00_PARI|4"] },
      { year: 5, corso: "40/39", anno2: ["39/00|5", "39/00_DISPARI|5", "39/00_PARI|5"] },
      { year: 6, corso: "40/39", anno2: ["39/00|6", "39/00_DISPARI|6", "39/00_PARI|6"] },
    ]),
  },
  {
    programme: "Medicine and Surgery",
    sources: degreeSources(BASE, ANNO, "medicine-and-surgery", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/71", anno2: ["71/00|1"] },
      { year: 2, corso: "40/71", anno2: ["71/00|2"] },
      { year: 3, corso: "40/71", anno2: ["71/00|3"] },
    ]),
  },
  {
    programme: "Neuropsicobiologia",
    sources: degreeSources(BASE, ANNO, "neuropsicobiologia", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/91", anno2: ["91/00|1"] },
      { year: 2, corso: "60/91", anno2: ["91/00|2"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "FacoltadiMedicinaeChirurgia", [
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
      { year: 3, corso: "40/43", anno2: ["43/00|3"] },
    ]),
  },
  {
    programme: "Produzione Multimediale",
    sources: degreeSources(BASE, ANNO, "produzione-multimediale", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/55", anno2: ["55/00|1"] },
      { year: 2, corso: "20/55", anno2: ["55/00|2"] },
    ]),
  },
  {
    programme: "Psicologia Clinica, della Salute, Giuridica e Forense",
    sources: degreeSources(BASE, ANNO, "psicologia-clinica-della-salute-giuridica-e-forense", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/58", anno2: ["58/10|1", "58/40|1", "58/30|1"] },
      { year: 2, corso: "30/58", anno2: ["58/10|2", "58/20|2", "58/30|2"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/70", anno2: ["70/30|1", "70/10|1"] },
      { year: 2, corso: "2/70", anno2: ["70/30|2", "70/10|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali e Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-e-naturali", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "60/86", anno2: ["86/00|1"] },
      { year: 2, corso: "60/86", anno2: ["86/00|2"] },
      { year: 3, corso: "60/75", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "FacoltadiScienze", [
      { year: 1, corso: "60/94", anno2: ["94/00|1"] },
      { year: 2, corso: "60/94", anno2: ["94/00|2"] },
    ]),
  },
  {
    programme: "Scienze degli Alimenti e della Nutrizione",
    sources: degreeSources(BASE, ANNO, "scienze-degli-alimenti-e-della-nutrizione", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/28", anno2: ["28/10|1", "28/20|1"] },
      { year: 2, corso: "50/28", anno2: ["28/10|2", "28/20|2"] },
    ]),
  },
  {
    programme: "Scienze dei Servizi Giuridici",
    sources: degreeSources(BASE, ANNO, "scienze-dei-servizi-giuridici", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "1/34", anno2: ["34/20|1", "34/10|1", "34/30|1"] },
      { year: 2, corso: "1/34", anno2: ["34/20|2", "34/10|2", "34/30|2"] },
      { year: 3, corso: "1/32", anno2: ["32/20|3", "32/10|3", "32/30|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'amministrazione e Dell'organizzazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-amministrazione-e-dell-organizzazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/72", anno2: ["72/00|1"] },
      { year: 2, corso: "2/72", anno2: ["72/00|2"] },
      { year: 3, corso: "2/67", anno2: ["67/10|3", "67/26|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'architettura",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "80/74", anno2: ["74/00|1"] },
      { year: 2, corso: "80/74", anno2: ["74/00|2"] },
      { year: 3, corso: "80/71", anno2: ["71/00|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione e della Formazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-e-della-formazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/55", anno2: ["55/00|1"] },
      { year: 2, corso: "30/55", anno2: ["55/00|2"] },
      { year: 3, corso: "30/34", anno2: ["34/00|3"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/56", anno2: ["56/10|1", "56/20|1"] },
      { year: 2, corso: "30/56", anno2: ["56/10|2", "56/20|2"] },
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
      { year: 2, corso: "40/72", anno2: ["72/00|2"] },
      { year: 3, corso: "40/35", anno2: ["35/00|3"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie della Prevenzione",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-della-prevenzione", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/67", anno2: ["67/00|2"] },
    ]),
  },
  {
    programme: "Scienze delle Pubbliche Amministrazioni",
    sources: degreeSources(BASE, ANNO, "scienze-delle-pubbliche-amministrazioni", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/73", anno2: ["73/00|1"] },
      { year: 2, corso: "2/73", anno2: ["73/00|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/57", anno2: ["57/00|1"] },
      { year: 2, corso: "30/57", anno2: ["57/00|2"] },
      { year: 3, corso: "30/36", anno2: ["36/00|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Geologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-geologiche", "FacoltadiScienze", [
      { year: 1, corso: "60/96", anno2: ["96/30|1", "96/40|1"] },
      { year: 2, corso: "60/96", anno2: ["96/30|2", "96/40|2"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche e dei Processi Formativi",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche-e-dei-processi-formativi", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "30/59", anno2: ["59/20|1", "59/10|1"] },
      { year: 2, corso: "30/59", anno2: ["59/20|2", "59/10|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche",
    sources: degreeSources(BASE, ANNO, "scienze-politiche", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/71", anno2: ["71/10|1", "71/20|1"] },
      { year: 2, corso: "2/71", anno2: ["71/10|2", "71/20|2"] },
      { year: 3, corso: "2/59", anno2: ["59/10|3", "59/20|3"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "FacoltadiMedicinaeChirurgia", [
      { year: 2, corso: "40/66", anno2: ["66/00|2"] },
    ]),
  },
  {
    programme: "Scienze Tossicologiche e Controllo di Qualità",
    sources: degreeSources(BASE, ANNO, "scienze-tossicologiche-e-controllo-di-qualita", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/27", anno2: ["27/00|1"] },
      { year: 2, corso: "50/27", anno2: ["27/00|2"] },
      { year: 3, corso: "50/24", anno2: ["20/00|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "SFMC", anno2: ["SFMC/00_DISPARI|1", "SFMC/00_PARI|1"] },
    ]),
  },
  {
    programme: "Servizio Sociale e Innovazione",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-e-innovazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "2/75", anno2: ["75/00|1"] },
      { year: 2, corso: "2/75", anno2: ["75/00|2"] },
    ]),
  },
  {
    programme: "Storia Dell'arte (magistrale) (20/56)",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte-magistrale-20-56", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/56", anno2: ["56/00|1"] },
      { year: 2, corso: "20/56", anno2: ["56/00|2"] },
    ]),
  },
  {
    programme: "Storia e Società",
    sources: degreeSources(BASE, ANNO, "storia-e-societa", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "20/59", anno2: ["59/60|1", "59/70|1"] },
      { year: 2, corso: "20/59", anno2: ["59/60|2", "59/70|2"] },
    ]),
  },
  {
    programme: "Tecnica della Riabilitazione Psichiatrica (abilitante alla Professione Sanitaria di Tecnico della Riabilitazione Psichiatrica)",
    sources: degreeSources(BASE, ANNO, "tecnica-della-riabilitazione-psichiatrica-abilitante-alla-professione-sanitaria-di-tecnico-della-riabilitazione-psichiatrica", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/70", anno2: ["70/00|1"] },
      { year: 3, corso: "40/70", anno2: ["70/00|3"] },
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
      { year: 2, corso: "40/64", anno2: ["64/00|2"] },
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
    programme: "Tecnologie Industriali per la Transizione Energetica e Digitale",
    sources: degreeSources(BASE, ANNO, "tecnologie-industriali-per-la-transizione-energetica-e-digitale", "FacoltadiIngegneriaeArchitettura", [
      { year: 2, corso: "70/96", anno2: ["96/10|2", "96/20|2"] },
    ]),
  },
  {
    programme: "Traduzione Specialistica e Interpretazione di Conferenza",
    sources: degreeSources(BASE, ANNO, "traduzione-specialistica-e-interpretazione-di-conferenza", "FacoltadiStudiUmanistici", [
      { year: 1, corso: "32/23", anno2: ["23/20|1", "23/10|1"] },
      { year: 2, corso: "32/23", anno2: ["23/20|2", "23/10|2"] },
    ]),
  },
  {
    programme: "Data Science",
    sources: degreeSources(BASE, ANNO, "data-science", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/95", anno2: ["95/10|1", "95/20|1"] },
    ], false),
  },
  {
    programme: "Diritto dello Sviluppo Sostenibile e Dell'innovazione",
    sources: degreeSources(BASE, ANNO, "diritto-dello-sviluppo-sostenibile-e-dell-innovazione", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "1/35", anno2: ["35/20|1", "35/10|1"] },
    ], false),
  },
  {
    programme: "Economia Aziendale And Management",
    sources: degreeSources(BASE, ANNO, "economia-aziendale-and-management", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "11/94", anno2: ["94/00|1"] },
      { year: 2, corso: "11/94", anno2: ["94/00|2"] },
    ], false),
  },
  {
    programme: "Giurisprudenza - Primo e",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-primo-e", "FacoltadiScienzeEconomiche-GiuridicheePolitiche", [
      { year: 1, corso: "1/33", anno2: ["33/00|1"] },
      { year: 2, corso: "1/33", anno2: ["33/00|2"] },
    ], false),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/18", anno2: ["18/00|1"] },
    ], false),
  },
  {
    programme: "Medicina e Chirurgia - Primo e",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-primo-e", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/74", anno2: ["74/00|1", "74/00_DISPARI|1", "74/00_PARI|1"] },
      { year: 2, corso: "40/74", anno2: ["74/00|2", "74/00_DISPARI|2", "74/00_PARI|2"] },
    ], false),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria - Primo e",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-primo-e", "FacoltadiMedicinaeChirurgia", [
      { year: 1, corso: "40/75", anno2: ["75/00|1"] },
      { year: 2, corso: "40/75", anno2: ["75/00|2"] },
    ], false),
  },
  {
    programme: "Tecnologie Industriali Elettriche e Aeronautiche",
    sources: degreeSources(BASE, ANNO, "tecnologie-industriali-elettriche-e-aeronautiche", "FacoltadiIngegneriaeArchitettura", [
      { year: 1, corso: "71/19", anno2: ["19/20|1", "19/10|1"] },
    ], false),
  },
  {
    programme: "Tossicologia Ambientale e Forense",
    sources: degreeSources(BASE, ANNO, "tossicologia-ambientale-e-forense", "FacoltadiBiologiaeFarmacia", [
      { year: 1, corso: "50/31", anno2: ["31/00|1"] },
    ], false),
  },
];

export const unica: UniversityPreset = {
  id: "unica-informatica",
  name: "Università degli Studi di Cagliari",
  shortName: "Università di Cagliari",
  city: "Cagliari",
  programme: "Informatica",
  liveSources: true,
  portalUrl: "https://unica.esse3.cineca.it",
  sources: [],
  livePrograms,
};
