/**
 * Preset: Università degli Studi di Genova — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _unige_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://easyacademy.unige.it/portalestudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Advanced Materials Science and Technology",
    sources: degreeSources(BASE, ANNO, "advanced-materials-science-and-technology", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11967", anno2: ["2|1", "1|1"] },
    ]),
  },
  {
    programme: "Amministrazione e Politiche Pubbliche",
    sources: degreeSources(BASE, ANNO, "amministrazione-e-politiche-pubbliche", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11903", anno2: ["unico|1"] },
      { year: 2, corso: "8772", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Amministrazione, Finanza e Controllo",
    sources: degreeSources(BASE, ANNO, "amministrazione-finanza-e-controllo", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11873", anno2: ["unico|1"] },
      { year: 2, corso: "8706", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Archeologie: Professione e Saperi (archeopes)",
    sources: degreeSources(BASE, ANNO, "archeologie-professione-e-saperi-archeopes", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11936", anno2: ["unico|1"] },
      { year: 2, corso: "11265", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Architectural Composition",
    sources: degreeSources(BASE, ANNO, "architectural-composition", "ScuolaPolitecnica", [
      { year: 1, corso: "11930", anno2: ["unico|1"] },
      { year: 2, corso: "11120", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "ScuolaPolitecnica", [
      { year: 1, corso: "11913", anno2: ["unico|1"] },
      { year: 2, corso: "9915", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Architettura del Paesaggio",
    sources: degreeSources(BASE, ANNO, "architettura-del-paesaggio", "ScuolaPolitecnica", [
      { year: 1, corso: "11904", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Assistenza Sanitaria",
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 2, corso: "11477", anno2: ["unico|2"] },
      { year: 3, corso: "11477", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Bioengineering",
    sources: degreeSources(BASE, ANNO, "bioengineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11933", anno2: ["4|1", "3|1", "1|1", "2|1"] },
      { year: 2, corso: "11159", anno2: ["7|2", "6|2", "4|2", "5|2"] },
    ]),
  },
  {
    programme: "Biologia Applicata e Sperimentale",
    sources: degreeSources(BASE, ANNO, "biologia-applicata-e-sperimentale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11932", anno2: ["2|1", "1|1", "3|1"] },
      { year: 2, corso: "11158", anno2: ["2|2", "1|2", "3|2"] },
    ]),
  },
  {
    programme: "Biologia ed Ecologia Marina",
    sources: degreeSources(BASE, ANNO, "biologia-ed-ecologia-marina", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11952", anno2: ["unico|1"] },
      { year: 2, corso: "11770", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11893", anno2: ["unico|1"] },
      { year: 2, corso: "8756", anno2: ["unico|2"] },
      { year: 3, corso: "8756", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11948", anno2: ["unico|1"] },
      { year: 2, corso: "11674", anno2: ["unico|2"] },
      { year: 3, corso: "11674", anno2: ["unico|3"] },
      { year: 4, corso: "8451", anno2: ["unico|4"] },
      { year: 5, corso: "8451", anno2: ["unico|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologie Chimiche",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologie-chimiche", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11894", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "8757", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "8757", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Computer Engineering",
    sources: degreeSources(BASE, ANNO, "computer-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11965", anno2: ["2|1", "1|1", "3|1"] },
      { year: 2, corso: "11160", anno2: ["2|2", "1|2", "6|2"] },
    ]),
  },
  {
    programme: "Computer Science",
    sources: degreeSources(BASE, ANNO, "computer-science", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11964", anno2: ["1|1", "4|1", "3|1", "2|1"] },
      { year: 2, corso: "10852", anno2: ["2|2", "9|2", "7|2", "6|2"] },
    ]),
  },
  {
    programme: "Conservazione dei Beni Culturali",
    sources: degreeSources(BASE, ANNO, "conservazione-dei-beni-culturali", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11954", anno2: ["1|1", "2|1", "3|1"] },
      { year: 2, corso: "8453", anno2: ["1|2", "2|2", "3|2"] },
      { year: 3, corso: "8453", anno2: ["1|3", "2|3", "3|3"] },
    ]),
  },
  {
    programme: "Design del Prodotto e della Comunicazione",
    sources: degreeSources(BASE, ANNO, "design-del-prodotto-e-della-comunicazione", "ScuolaPolitecnica", [
      { year: 1, corso: "11942", anno2: ["unico|1"] },
      { year: 2, corso: "11439", anno2: ["unico|2"] },
      { year: 3, corso: "11439", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Design del Prodotto Nautico",
    sources: degreeSources(BASE, ANNO, "design-del-prodotto-nautico", "ScuolaPolitecnica", [
      { year: 1, corso: "11940", anno2: ["unico|1"] },
      { year: 2, corso: "11431", anno2: ["unico|2"] },
      { year: 3, corso: "11431", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Design Navale e Nautico",
    sources: degreeSources(BASE, ANNO, "design-navale-e-nautico", "ScuolaPolitecnica", [
      { year: 1, corso: "11905", anno2: ["unico|1"] },
      { year: 2, corso: "9008", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Design Prodotto Evento",
    sources: degreeSources(BASE, ANNO, "design-prodotto-evento", "ScuolaPolitecnica", [
      { year: 1, corso: "11943", anno2: ["unico|1"] },
      { year: 2, corso: "11440", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Dietistica",
    sources: degreeSources(BASE, ANNO, "dietistica", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9288", anno2: ["unico|1"] },
      { year: 2, corso: "9288", anno2: ["unico|2"] },
      { year: 3, corso: "9288", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Digital Humanities - Interactive Systems and Digital Media",
    sources: degreeSources(BASE, ANNO, "digital-humanities-interactive-systems-and-digital-media", "ScuolaPolitecnica", [
      { year: 1, corso: "11945", anno2: ["path1|1", "path2|1", "1|1", "2|1"] },
      { year: 2, corso: "11661", anno2: ["2|2", "4|2", "1|2", "3|2"] },
    ]),
  },
  {
    programme: "Diritto ed Economia delle Imprese",
    sources: degreeSources(BASE, ANNO, "diritto-ed-economia-delle-imprese", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11931", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "11122", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "11122", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11871", anno2: ["unico|1"] },
      { year: 2, corso: "8697", anno2: ["unico|2"] },
      { year: 3, corso: "8697", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Economia delle Aziende Marittime, Logistica e Trasp.",
    sources: degreeSources(BASE, ANNO, "economia-delle-aziende-marittime-logistica-e-trasp", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11872", anno2: ["unico|1"] },
      { year: 2, corso: "8698", anno2: ["unico|2"] },
      { year: 3, corso: "8698", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Economia e Management Marittimo e Portuale",
    sources: degreeSources(BASE, ANNO, "economia-e-management-marittimo-e-portuale", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11875", anno2: ["unico|1"] },
      { year: 2, corso: "8708", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Economics and Data Science",
    sources: degreeSources(BASE, ANNO, "economics-and-data-science", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11937", anno2: ["unico|1"] },
      { year: 2, corso: "11267", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Educazione Professionale",
    sources: degreeSources(BASE, ANNO, "educazione-professionale", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9280", anno2: ["unico|1"] },
      { year: 2, corso: "9280", anno2: ["unico|2"] },
      { year: 3, corso: "9280", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Electrical Engineering for Energy Transition",
    sources: degreeSources(BASE, ANNO, "electrical-engineering-for-energy-transition", "ScuolaPolitecnica", [
      { year: 1, corso: "11955", anno2: ["2|1", "1|1"] },
    ]),
  },
  {
    programme: "Electronic Engineering",
    sources: degreeSources(BASE, ANNO, "electronic-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11970", anno2: ["unico|1"] },
      { year: 2, corso: "11780", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Energy Engineering",
    sources: degreeSources(BASE, ANNO, "energy-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11917", anno2: ["unico|1"] },
      { year: 2, corso: "10170", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Engineering for Natural Risk Management",
    sources: degreeSources(BASE, ANNO, "engineering-for-natural-risk-management", "ScuolaPolitecnica", [
      { year: 1, corso: "11921", anno2: ["unico|1"] },
      { year: 2, corso: "10553", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Engineering Technology for Strategy (and Security)",
    sources: degreeSources(BASE, ANNO, "engineering-technology-for-strategy-and-security", "ScuolaPolitecnica", [
      { year: 2, corso: "10728", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Engineering Technology for Strategy and Security",
    sources: degreeSources(BASE, ANNO, "engineering-technology-for-strategy-and-security-2", "ScuolaPolitecnica", [
      { year: 1, corso: "11994", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Environmental Engineering",
    sources: degreeSources(BASE, ANNO, "environmental-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11925", anno2: ["1|1", "3|1", "2|1", "4|1"] },
      { year: 2, corso: "10720", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Farmacia",
    sources: degreeSources(BASE, ANNO, "farmacia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11947", anno2: ["unico|1"] },
      { year: 2, corso: "11673", anno2: ["unico|2"] },
      { year: 3, corso: "11673", anno2: ["unico|3"] },
      { year: 4, corso: "8452", anno2: ["unico|4"] },
      { year: 5, corso: "8452", anno2: ["unico|5"] },
    ]),
  },
  {
    programme: "Filologia e Scienze Dell'antichitã",
    sources: degreeSources(BASE, ANNO, "filologia-e-scienze-dell-antichit", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11966", anno2: ["unico|1"] },
      { year: 2, corso: "11268", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11865", anno2: ["unico|1"] },
      { year: 2, corso: "8455", anno2: ["unico|2"] },
      { year: 3, corso: "8455", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11895", anno2: ["unico|1"] },
      { year: 2, corso: "8758", anno2: ["unico|2"] },
      { year: 3, corso: "8758", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11908", anno2: ["6|1", "4|1", "1|1", "2|1", "3|1", "5|1"] },
      { year: 2, corso: "9012", anno2: ["6|2", "4|2", "1|2", "2|2", "3|2", "5|2"] },
    ]),
  },
  {
    programme: "Fisioterapia",
    sources: degreeSources(BASE, ANNO, "fisioterapia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9281", anno2: ["unico|1"] },
      { year: 2, corso: "9281", anno2: ["unico|2"] },
      { year: 3, corso: "9281", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Giurisprudenza - Imperia",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-imperia", "ScuoladiScienzeSociali", [
      { year: 2, corso: "7996", anno2: ["unico|2"] },
      { year: 3, corso: "7996", anno2: ["unico|3"] },
      { year: 4, corso: "7996", anno2: ["unico|4"] },
      { year: 5, corso: "7996", anno2: ["unico|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza Genova",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-genova", "ScuoladiScienzeSociali", [
      { year: 2, corso: "7995", anno2: ["unico|2"] },
      { year: 3, corso: "7995", anno2: ["unico|3"] },
      { year: 4, corso: "7995", anno2: ["unico|4"] },
      { year: 5, corso: "7995", anno2: ["unico|5"] },
    ]),
  },
  {
    programme: "Giurisprudenza (magistrale)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-magistrale", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11864_GE", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Giurisprudenza (magistrale) (11864)",
    sources: degreeSources(BASE, ANNO, "giurisprudenza-magistrale-11864", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11864", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Global Change e Gestione Sostenibile della Natura",
    sources: degreeSources(BASE, ANNO, "global-change-e-gestione-sostenibile-della-natura", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11951", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "11769", anno2: ["2|2", "1|2"] },
    ]),
  },
  {
    programme: "Igiene Dentale",
    sources: degreeSources(BASE, ANNO, "igiene-dentale", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9289", anno2: ["unico|1"] },
      { year: 2, corso: "9289", anno2: ["unico|2"] },
      { year: 3, corso: "9289", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Infermieristica",
    sources: degreeSources(BASE, ANNO, "infermieristica", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9276", anno2: ["unico|1"] },
      { year: 2, corso: "9276", anno2: ["unico|2"] },
      { year: 3, corso: "9276", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Infermieristica Pediatrica",
    sources: degreeSources(BASE, ANNO, "infermieristica-pediatrica", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9277", anno2: ["unico|1"] },
      { year: 2, corso: "9277", anno2: ["unico|2"] },
      { year: 3, corso: "9277", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Informatica",
    sources: degreeSources(BASE, ANNO, "informatica", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11896", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "8759", anno2: ["4|2", "5|2"] },
      { year: 3, corso: "8759", anno2: ["4|3", "5|3"] },
    ]),
  },
  {
    programme: "Informazione ed Editoria",
    sources: degreeSources(BASE, ANNO, "informazione-ed-editoria", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11902", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "8769", anno2: ["1|2", "3|2"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica", "ScuolaPolitecnica", [
      { year: 1, corso: "11878", anno2: ["unico|1"] },
      { year: 2, corso: "8713", anno2: ["unico|2"] },
      { year: 3, corso: "8713", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica e di Processo (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-e-di-processo-magistrale", "ScuolaPolitecnica", [
      { year: 1, corso: "11919", anno2: ["unico|1"] },
      { year: 2, corso: "10376", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Ingegneria Chimica e di Processo (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-chimica-e-di-processo-triennale", "ScuolaPolitecnica", [
      { year: 1, corso: "11918", anno2: ["unico|1"] },
      { year: 2, corso: "10375", anno2: ["unico|2"] },
      { year: 3, corso: "10375", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "ScuolaPolitecnica", [
      { year: 1, corso: "11926", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "10799", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-ambientale", "ScuolaPolitecnica", [
      { year: 3, corso: "8715", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile, Edile e Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-edile-e-ambientale", "ScuolaPolitecnica", [
      { year: 1, corso: "11949", anno2: ["3|1", "1|1", "2|1"] },
      { year: 2, corso: "11765", anno2: ["3|2", "1|2", "2|2"] },
    ]),
  },
  {
    programme: "Ingegneria Dell'energia",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-energia", "ScuolaPolitecnica", [
      { year: 1, corso: "11941", anno2: ["unico|1"] },
      { year: 2, corso: "11438", anno2: ["unico|2"] },
      { year: 3, corso: "11438", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Edile",
    sources: degreeSources(BASE, ANNO, "ingegneria-edile", "ScuolaPolitecnica", [
      { year: 1, corso: "11969", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "11766", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettrica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica-magistrale", "ScuolaPolitecnica", [
      { year: 1, corso: "11879", anno2: ["unico|1"] },
      { year: 2, corso: "8731", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettrica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettrica-triennale", "ScuolaPolitecnica", [
      { year: 2, corso: "8716", anno2: ["unico|2"] },
      { year: 3, corso: "8716", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica e Tecnologie Dell'informazione",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-tecnologie-dell-informazione", "ScuolaPolitecnica", [
      { year: 1, corso: "11911", anno2: ["unico|1"] },
      { year: 2, corso: "9273", anno2: ["unico|2"] },
      { year: 3, corso: "9273", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-magistrale", "ScuolaPolitecnica", [
      { year: 1, corso: "11956", anno2: ["unico|1"] },
      { year: 2, corso: "8734", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale-triennale", "ScuolaPolitecnica", [
      { year: 1, corso: "11924", anno2: ["unico|1"] },
      { year: 2, corso: "10716", anno2: ["unico|2"] },
      { year: 3, corso: "10716", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica Genova",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-genova", "ScuolaPolitecnica", [
      { year: 1, corso: "11880_GE", anno2: ["unico|1"] },
      { year: 2, corso: "8719", anno2: ["unico|2"] },
      { year: 3, corso: "8719", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica Imperia",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-imperia", "ScuolaPolitecnica", [
      { year: 1, corso: "11880", anno2: ["unico|1"] },
      { year: 2, corso: "8719_IM", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica Ge",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-ge", "ScuolaPolitecnica", [
      { year: 2, corso: "8720", anno2: ["1|2"] },
      { year: 3, corso: "8720", anno2: ["1|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica Sp",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-sp", "ScuolaPolitecnica", [
      { year: 2, corso: "8784", anno2: ["2|2"] },
      { year: 3, corso: "8784", anno2: ["2|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica - Energia e Aeronautica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-energia-e-aeronautica", "ScuolaPolitecnica", [
      { year: 1, corso: "11960", anno2: ["1|1", "3|1", "2|1"] },
      { year: 2, corso: "9270", anno2: ["2|2", "4|2", "3|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "ScuolaPolitecnica", [
      { year: 1, corso: "11881", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica - Progettazione e Produzione",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-progettazione-e-produzione", "ScuolaPolitecnica", [
      { year: 1, corso: "11959", anno2: ["1_1|1", "1|1"] },
      { year: 2, corso: "9269", anno2: ["1|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica - Progettazione e Produzione - la Spezia",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-progettazione-e-produzione-la-spezia", "ScuolaPolitecnica", [
      { year: 2, corso: "9269_SP", anno2: ["4|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica per L'automazione",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica-per-l-automazione", "ScuolaPolitecnica", [
      { year: 1, corso: "11976", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Ingegneria Nautica",
    sources: degreeSources(BASE, ANNO, "ingegneria-nautica", "ScuolaPolitecnica", [
      { year: 1, corso: "11882", anno2: ["unico|1"] },
      { year: 2, corso: "8721", anno2: ["unico|2"] },
      { year: 3, corso: "8721", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ingegneria Navale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-magistrale", "ScuolaPolitecnica", [
      { year: 1, corso: "11883", anno2: ["unico|1"] },
      { year: 2, corso: "8738", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Ingegneria Navale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-triennale", "ScuolaPolitecnica", [
      { year: 1, corso: "11957", anno2: ["unico|1"] },
      { year: 2, corso: "8722", anno2: ["unico|2"] },
      { year: 3, corso: "8722", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Internet and Multimedia Engineering",
    sources: degreeSources(BASE, ANNO, "internet-and-multimedia-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11962", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "10378", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Letterature Moderne e Spettacolo",
    sources: degreeSources(BASE, ANNO, "letterature-moderne-e-spettacolo", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11961", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "9918", anno2: ["1|2", "2|2"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11866", anno2: ["1|1", "2|1", "3|1"] },
      { year: 2, corso: "8457", anno2: ["1|2", "3|2", "4|2"] },
      { year: 3, corso: "8457", anno2: ["1|3", "3|3", "4|3"] },
    ]),
  },
  {
    programme: "Lingue e Comunicazione Interculturale per le Istituzioni e le Imprese",
    sources: degreeSources(BASE, ANNO, "lingue-e-comunicazione-interculturale-per-le-istituzioni-e-le-imprese", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11974", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Lingue e Culture Moderne",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-moderne", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11884", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "8740", anno2: ["7|2", "6|2"] },
      { year: 3, corso: "8740", anno2: ["7|3", "6|3"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne per i Servizi Culturali",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne-per-i-servizi-culturali", "ScuoladiScienzeUmanistiche", [
      { year: 2, corso: "9265", anno2: ["1|2", "2|2", "3|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne per L'insegnamento, L'editoria e i Media Digitali",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-moderne-per-l-insegnamento-l-editoria-e-i-media-digitali", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11953", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Logopedia",
    sources: degreeSources(BASE, ANNO, "logopedia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9282", anno2: ["unico|1"] },
      { year: 2, corso: "9282", anno2: ["unico|2"] },
      { year: 3, corso: "9282", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Management",
    sources: degreeSources(BASE, ANNO, "management", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11874", anno2: ["unico|1"] },
      { year: 2, corso: "8707", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Management for Energy and Environmental Transition (meet)",
    sources: degreeSources(BASE, ANNO, "management-for-energy-and-environmental-transition-meet", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11939", anno2: ["unico|1"] },
      { year: 2, corso: "11427", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Maritime Science and Technology",
    sources: degreeSources(BASE, ANNO, "maritime-science-and-technology", "ScuolaPolitecnica", [
      { year: 1, corso: "11929", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "10948", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "10948", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11897", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "9011", anno2: ["4|2", "1|2", "3|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11907", anno2: ["3|1", "1|1", "2|1"] },
      { year: 2, corso: "8760", anno2: ["7|2", "6|2"] },
      { year: 3, corso: "8760", anno2: ["7|3", "6|3"] },
    ]),
  },
  {
    programme: "Media, Comunicazione e Societa'",
    sources: degreeSources(BASE, ANNO, "media-comunicazione-e-societa", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11938", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "11417", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "11417", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Medical-pharmaceutical Biotechnology",
    sources: degreeSources(BASE, ANNO, "medical-pharmaceutical-biotechnology", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11922", anno2: ["unico|1"] },
      { year: 2, corso: "10598", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11887", anno2: ["unico|1"] },
      { year: 2, corso: "8745", anno2: ["unico|2"] },
      { year: 3, corso: "8745", anno2: ["unico|3"] },
      { year: 4, corso: "8745", anno2: ["unico|4"] },
      { year: 5, corso: "8745", anno2: ["unico|5"] },
      { year: 6, corso: "8745", anno2: ["unico|6"] },
    ]),
  },
  {
    programme: "Metodologie Filosofiche",
    sources: degreeSources(BASE, ANNO, "metodologie-filosofiche", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11868", anno2: ["4|1", "3|1", "1|1", "2|1"] },
      { year: 2, corso: "8465", anno2: ["7|2", "6|2", "2|2", "5|2"] },
    ]),
  },
  {
    programme: "Metodologie per la Conserv. Restauro Beni Culturali",
    sources: degreeSources(BASE, ANNO, "metodologie-per-la-conserv-restauro-beni-culturali", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11906", anno2: ["unico|1"] },
      { year: 2, corso: "9009", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Odontoiatria e Protesi Dentaria",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11888", anno2: ["unico|1"] },
      { year: 2, corso: "8746", anno2: ["unico|2"] },
      { year: 3, corso: "8746", anno2: ["unico|3"] },
      { year: 4, corso: "8746", anno2: ["unico|4"] },
      { year: 5, corso: "8746", anno2: ["unico|5"] },
      { year: 6, corso: "8746", anno2: ["unico|6"] },
    ]),
  },
  {
    programme: "Ortottica ed Assistenza Oftalmologica",
    sources: degreeSources(BASE, ANNO, "ortottica-ed-assistenza-oftalmologica", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9283", anno2: ["unico|1"] },
      { year: 2, corso: "9283", anno2: ["unico|2"] },
      { year: 3, corso: "9283", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Ostetricia",
    sources: degreeSources(BASE, ANNO, "ostetricia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9278", anno2: ["unico|1"] },
      { year: 2, corso: "9278", anno2: ["unico|2"] },
      { year: 3, corso: "9278", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Pedagogia, Progettazione e Ricerca Educativa",
    sources: degreeSources(BASE, ANNO, "pedagogia-progettazione-e-ricerca-educativa", "ScuoladiScienzeSociali", [
      { year: 2, corso: "9922", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Podologia",
    sources: degreeSources(BASE, ANNO, "podologia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9284", anno2: ["unico|1"] },
      { year: 2, corso: "9284", anno2: ["unico|2"] },
      { year: 3, corso: "9284", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Politiche, Governance e Informazione dello Sport",
    sources: degreeSources(BASE, ANNO, "politiche-governance-e-informazione-dello-sport", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11944", anno2: ["unico|1"] },
      { year: 2, corso: "11633", anno2: ["unico|2"] },
      { year: 3, corso: "11633", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Progettazione delle Aree Verdi e del Paesaggio",
    sources: degreeSources(BASE, ANNO, "progettazione-delle-aree-verdi-e-del-paesaggio", "ScuolaPolitecnica", [
      { year: 2, corso: "9006", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Psicologia",
    sources: degreeSources(BASE, ANNO, "psicologia", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11892", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "8753", anno2: ["4|2", "3|2"] },
    ]),
  },
  {
    programme: "Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "relazioni-internazionali", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11935", anno2: ["2|1", "1|1", "3|1"] },
      { year: 2, corso: "11162", anno2: ["2|2", "1|2", "4|2"] },
    ]),
  },
  {
    programme: "Robotics Engineering",
    sources: degreeSources(BASE, ANNO, "robotics-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11963", anno2: ["unico|1"] },
      { year: 2, corso: "10635", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Safe Transport and Logistics Engineering",
    sources: degreeSources(BASE, ANNO, "safe-transport-and-logistics-engineering", "ScuolaPolitecnica", [
      { year: 1, corso: "11920", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Safety Engineering for Transport, Logistics and Production",
    sources: degreeSources(BASE, ANNO, "safety-engineering-for-transport-logistics-and-production", "ScuolaPolitecnica", [
      { year: 2, corso: "10377", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources(BASE, ANNO, "scienza-dei-materiali", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11968", anno2: ["unico|1"] },
      { year: 2, corso: "11634", anno2: ["unico|2"] },
      { year: 3, corso: "11634", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienza e Tecnologia dei Materiali",
    sources: degreeSources(BASE, ANNO, "scienza-e-tecnologia-dei-materiali", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 2, corso: "11430", anno2: ["2|2", "1|2"] },
    ]),
  },
  {
    programme: "Scienze Ambientali e Naturali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali-e-naturali", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11914", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "9916", anno2: ["2|2", "1|2"] },
      { year: 3, corso: "9916", anno2: ["2|3", "1|3"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11898", anno2: ["unico|1"] },
      { year: 2, corso: "8762", anno2: ["unico|2"] },
      { year: 3, corso: "8762", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-chimiche", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11909", anno2: ["3|1", "1|1", "2|1"] },
      { year: 2, corso: "9018", anno2: ["5|2", "2|2", "4|2"] },
    ]),
  },
  {
    programme: "Scienze del Turismo: Impresa, Cultura e Territorio",
    sources: degreeSources(BASE, ANNO, "scienze-del-turismo-impresa-cultura-e-territorio", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11912", anno2: ["unico|1"] },
      { year: 2, corso: "9912", anno2: ["unico|2"] },
      { year: 3, corso: "9912", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'amministrazione e della Politica",
    sources: degreeSources(BASE, ANNO, "scienze-dell-amministrazione-e-della-politica", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11934", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "11161", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "11161", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'architettura",
    sources: degreeSources(BASE, ANNO, "scienze-dell-architettura", "ScuolaPolitecnica", [
      { year: 1, corso: "11870", anno2: ["1|1", "2|1"] },
      { year: 2, corso: "8694", anno2: ["1|2", "5|2"] },
      { year: 3, corso: "8694", anno2: ["1|3", "5|3", "4|3"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione e della Formazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione-e-della-formazione", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11927", anno2: ["1|1", "2|1", "3|1"] },
      { year: 2, corso: "10841", anno2: ["3|2", "4|2", "5|2"] },
      { year: 3, corso: "10841", anno2: ["3|3", "1|3", "2|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "ScuoladiScienzeSociali", [
      { year: 1, corso: "9322", anno2: ["unico|1"] },
      { year: 2, corso: "9322", anno2: ["unico|2"] },
      { year: 3, corso: "9322", anno2: ["unico|3"] },
      { year: 4, corso: "9322", anno2: ["unico|4"] },
      { year: 5, corso: "9322", anno2: ["unico|5"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie della Prevenzione",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-della-prevenzione", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11975", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Scienze delle Professioni Sanitarie Tecniche Diagnostiche",
    sources: degreeSources(BASE, ANNO, "scienze-delle-professioni-sanitarie-tecniche-diagnostiche", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11266", anno2: ["unico|1"] },
      { year: 2, corso: "11266", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze e Culture Agroalimentari del Mediterraneo",
    sources: degreeSources(BASE, ANNO, "scienze-e-culture-agroalimentari-del-mediterraneo", "ScuolaPolitecnica", [
      { year: 1, corso: "11758", anno2: ["unico|1"] },
      { year: 2, corso: "11758", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecn. Attivita' Motoria Prev. e Adattata",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecn-attivita-motoria-prev-e-adattata", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11889", anno2: ["unico|1"] },
      { year: 2, corso: "8747", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche dello Sport",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-dello-sport", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11890", anno2: ["unico|1"] },
      { year: 2, corso: "8749", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11891", anno2: ["unico|1"] },
      { year: 2, corso: "8751", anno2: ["unico|2"] },
      { year: 3, corso: "8751", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Economiche e Finanziarie",
    sources: degreeSources(BASE, ANNO, "scienze-economiche-e-finanziarie", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11946", anno2: ["2|1", "1|1"] },
      { year: 2, corso: "11662", anno2: ["2|2", "1|2"] },
      { year: 3, corso: "11662", anno2: ["2|3", "1|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche (triennale)",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-triennale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11899", anno2: ["unico|1"] },
      { year: 2, corso: "8763", anno2: ["unico|2"] },
      { year: 3, corso: "8763", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Geologiche (magistrale)",
    sources: degreeSources(BASE, ANNO, "scienze-geologiche-magistrale", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11910", anno2: ["2|1", "3|1", "1|1"] },
      { year: 2, corso: "9022", anno2: ["4|2", "5|2", "3|2"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9279", anno2: ["unico|1"] },
      { year: 2, corso: "9279", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze Internazionali e Diplomatiche",
    sources: degreeSources(BASE, ANNO, "scienze-internazionali-e-diplomatiche", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11901", anno2: ["unico|1"] },
      { year: 2, corso: "8768", anno2: ["unico|2"] },
      { year: 3, corso: "8768", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Motorie, Sport e Salute",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-sport-e-salute", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11886", anno2: ["unico|1"] },
      { year: 2, corso: "8744", anno2: ["unico|2"] },
      { year: 3, corso: "8744", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche per la Progettazione, la Consulenza e il Coordinamento dei Percorsi Educativi",
    sources: degreeSources(BASE, ANNO, "scienze-pedagogiche-per-la-progettazione-la-consulenza-e-il-coordinamento-dei-percorsi-educativi", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11916", anno2: ["unico|1"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9285", anno2: ["unico|1"] },
      { year: 2, corso: "9285", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Scienze Storiche",
    sources: degreeSources(BASE, ANNO, "scienze-storiche", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11915", anno2: ["unico|1"] },
      { year: 2, corso: "9917", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Servizi Legali All'impresa e alla Pubblica Amministrazione",
    sources: degreeSources(BASE, ANNO, "servizi-legali-all-impresa-e-alla-pubblica-amministrazione", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11928", anno2: ["unico|1"] },
      { year: 2, corso: "10842", anno2: ["1|2", "2|2"] },
      { year: 3, corso: "10842", anno2: ["1|3", "2|3"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11876", anno2: ["unico|1"] },
      { year: 2, corso: "8710", anno2: ["unico|2"] },
      { year: 3, corso: "8710", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Servizio Sociale e Politiche Sociali",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-e-politiche-sociali", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11877", anno2: ["unico|1"] },
      { year: 2, corso: "8711", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Statistica Matem. e Trattam. Informatico dei Dati",
    sources: degreeSources(BASE, ANNO, "statistica-matem-e-trattam-informatico-dei-dati", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11900", anno2: ["1|1"] },
      { year: 2, corso: "8766", anno2: ["1|2"] },
      { year: 3, corso: "8766", anno2: ["1|3"] },
    ]),
  },
  {
    programme: "Storia",
    sources: degreeSources(BASE, ANNO, "storia", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11867", anno2: ["unico|1"] },
      { year: 2, corso: "8459", anno2: ["unico|2"] },
      { year: 3, corso: "8459", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Storia Dell'arte e Valorizzaz. Patrimonio Artistico",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte-e-valorizzaz-patrimonio-artistico", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11869", anno2: ["unico|1"] },
      { year: 2, corso: "8467", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Sustainable Polymer and Process Chemistry",
    sources: degreeSources(BASE, ANNO, "sustainable-polymer-and-process-chemistry", "ScuoladiScienzeMat-Fis-Nat", [
      { year: 1, corso: "11950", anno2: ["unico|1"] },
      { year: 2, corso: "11767", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Tecn.fisiopatol.cardiocircolat.e e Perfus.cardiovasc",
    sources: degreeSources(BASE, ANNO, "tecn-fisiopatol-cardiocircolat-e-e-perfus-cardiovasc", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9291", anno2: ["unico|1"] },
      { year: 2, corso: "9291", anno2: ["unico|2"] },
      { year: 3, corso: "9291", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Tecnica della Riabilitazione Psichiatrica",
    sources: degreeSources(BASE, ANNO, "tecnica-della-riabilitazione-psichiatrica", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9286", anno2: ["unico|1"] },
      { year: 2, corso: "9286", anno2: ["unico|2"] },
      { year: 3, corso: "9286", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e Nei Luogh",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luogh", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9298", anno2: ["unico|1"] },
      { year: 2, corso: "9298", anno2: ["unico|2"] },
      { year: 3, corso: "9298", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9293", anno2: ["unico|1"] },
      { year: 2, corso: "9293", anno2: ["unico|2"] },
      { year: 3, corso: "9293", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Tecniche di Neurofisiopatologia",
    sources: degreeSources(BASE, ANNO, "tecniche-di-neurofisiopatologia", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "11757", anno2: ["unico|1"] },
      { year: 2, corso: "11757", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radiot",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radiot", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9294", anno2: ["unico|1"] },
      { year: 2, corso: "9294", anno2: ["unico|2"] },
      { year: 3, corso: "9294", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Tecniche Ortopediche",
    sources: degreeSources(BASE, ANNO, "tecniche-ortopediche", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9297", anno2: ["unico|1"] },
      { year: 2, corso: "9297", anno2: ["unico|2"] },
      { year: 3, corso: "9297", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Teorie e Tecniche della Mediazione Interlinguistica",
    sources: degreeSources(BASE, ANNO, "teorie-e-tecniche-della-mediazione-interlinguistica", "ScuoladiScienzeUmanistiche", [
      { year: 1, corso: "11885", anno2: ["unico|1"] },
      { year: 2, corso: "8741", anno2: ["unico|2"] },
      { year: 3, corso: "8741", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Terapia della Neuro e Psicomotricita' Dell'eta' Evol",
    sources: degreeSources(BASE, ANNO, "terapia-della-neuro-e-psicomotricita-dell-eta-evol", "ScuoladiScienzeMedicheeFarmaceutiche", [
      { year: 1, corso: "9287", anno2: ["unico|1"] },
      { year: 2, corso: "9287", anno2: ["unico|2"] },
      { year: 3, corso: "9287", anno2: ["unico|3"] },
    ]),
  },
  {
    programme: "Traduzione e Interpretariato",
    sources: degreeSources(BASE, ANNO, "traduzione-e-interpretariato", "ScuoladiScienzeUmanistiche", [
      { year: 2, corso: "8743", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Valorizzazione dei Territori e Turismi Sostenibili",
    sources: degreeSources(BASE, ANNO, "valorizzazione-dei-territori-e-turismi-sostenibili", "ScuoladiScienzeSociali", [
      { year: 1, corso: "11923", anno2: ["unico|1"] },
      { year: 2, corso: "10715", anno2: ["unico|2"] },
    ]),
  },
  {
    programme: "Yacht Design",
    sources: degreeSources(BASE, ANNO, "yacht-design", "ScuolaPolitecnica", [
      { year: 1, corso: "11958", anno2: ["unico|1"] },
      { year: 2, corso: "9268", anno2: ["unico|2"] },
    ]),
  },
];

export const unige: UniversityPreset = {
  id: "unige-informatica",
  name: "Università degli Studi di Genova",
  shortName: "Università di Genova",
  city: "Genova",
  programme: "Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
