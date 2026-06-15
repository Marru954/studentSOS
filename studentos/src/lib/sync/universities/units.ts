/**
 * Preset: Università degli Studi di Trieste — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live against grid_call.php / test_call.php (real, non-empty
 * responses). Codes captured via GET, NEVER invented. Courses without
 * verifiable codes stay manual (ateneo-courses.ts). Per-course status is in
 * _units_coverage.md. Re-verify each September and bump ANNO.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://orari.units.it/agendaweb";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Architettura",
    sources: degreeSources(BASE, ANNO, "architettura", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "AR03A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "AR03", anno2: ["PDS-2024|2"] },
      { year: 3, corso: "AR03", anno2: ["PDS0-2018|3"] },
      { year: 4, corso: "AR03", anno2: ["PDS0-2018|4"] },
      { year: 5, corso: "AR03", anno2: ["PDS0-2018|5"] },
    ]),
  },
  {
    programme: "Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario)",
    sources: degreeSources(BASE, ANNO, "assistenza-sanitaria-abilitante-alla-professione-sanitaria-di-assistente-sanitario", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME19", anno2: ["PDS0-2021|1"] },
      { year: 2, corso: "ME19", anno2: ["PDS0-2021|2"] },
      { year: 3, corso: "ME19", anno2: ["PDS0-2021|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Mediche e Diagnostiche",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche-e-diagnostiche", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM70A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM70", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Chimica (triennale)",
    sources: degreeSources(BASE, ANNO, "chimica-triennale", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 1, corso: "SM10A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM10", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "SM10", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Chimica (magistrale)",
    sources: degreeSources(BASE, ANNO, "chimica-magistrale", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 1, corso: "SM13A", anno2: ["SM13A+4+|1", "SM13A+5+|1", "SM13A+6+|1"] },
      { year: 2, corso: "SM13", anno2: ["SM13+4+|2", "SM13+5+|2", "SM13+6+|2"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 1, corso: "FA04A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "FA04", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "FA04", anno2: ["PDS0-2023|3"] },
      { year: 5, corso: "FA04A", anno2: ["PDS0-2025|5"] },
    ]),
  },
  {
    programme: "Chimica e Tecnologia Farmaceutiche (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "chimica-e-tecnologia-farmaceutiche-ciclo-unico-2", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 4, corso: "FA02", anno2: ["PDS0-2019|4"] },
      { year: 5, corso: "FA02", anno2: ["PDS0-2019|5"] },
    ]),
  },
  {
    programme: "Computer Engineering",
    sources: degreeSources(BASE, ANNO, "computer-engineering", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN23", anno2: ["IN23+2+|1", "IN23+1+|1", "IN23+4+|1", "IN23+3+|1"] },
      { year: 2, corso: "IN23", anno2: ["IN23+2+|2", "IN23+1+|2", "IN23+4+|2", "IN23+3+|2"] },
    ]),
  },
  {
    programme: "Comunicazione Interlinguistica Applicata",
    sources: degreeSources(BASE, ANNO, "comunicazione-interlinguistica-applicata", "DipartimentodiScienzeGiuridiche-delLinguaggio-dellInterpretazioneedellaTraduzione", [
      { year: 1, corso: "SL01A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SL01", anno2: ["PDS0-2019|2"] },
      { year: 3, corso: "SL01", anno2: ["PDS0-2019|3"] },
    ]),
  },
  {
    programme: "Comunicazione Interlinguistica Applicata Alle Professioni Giuridiche",
    sources: degreeSources(BASE, ANNO, "comunicazione-interlinguistica-applicata-alle-professioni-giuridiche", "DipartimentodiScienzeGiuridiche-delLinguaggio-dellInterpretazioneedellaTraduzione", [
      { year: 1, corso: "SL02A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SL02", anno2: ["PDS0-2019|2"] },
      { year: 3, corso: "SL02", anno2: ["PDS0-2019|3"] },
    ]),
  },
  {
    programme: "Coordinamento e Gestione dei Servizi Educativi",
    sources: degreeSources(BASE, ANNO, "coordinamento-e-gestione-dei-servizi-educativi", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "SF06A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SF06", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Data Science and Artificial Intelligence",
    sources: degreeSources(BASE, ANNO, "data-science-and-artificial-intelligence", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM38", anno2: ["SM38+4+|1", "SM38+3+|1", "SM38+6+|1", "SM38+1+|1", "SM38+5+|1"] },
      { year: 2, corso: "SM38", anno2: ["SM38+4+|2", "SM38+3+|2", "SM38+2+|2", "SM38+1+|2"] },
    ]),
  },
  {
    programme: "Dietistica (abilitante alla Professione Sanitaria di Dietista)",
    sources: degreeSources(BASE, ANNO, "dietistica-abilitante-alla-professione-sanitaria-di-dietista", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME22", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "ME22", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Diplomazia e Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "diplomazia-e-cooperazione-internazionale", "DipartimentodiScienzePoliticheeSociali", [
      { year: 1, corso: "SP54A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SP54", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Discipline Letterarie e Latino",
    sources: degreeSources(BASE, ANNO, "discipline-letterarie-e-latino", "", [
      { year: 1, corso: "FI011", anno2: ["FI011+2+|1", "FI011+4+|1", "FI011+1+|1"] },
    ]),
  },
  {
    programme: "Discipline Letterarie Negli Istituti di Istruzione Secondaria di i e Ii Grado con Lingua di Insegnamento Slovena O Bilingui del Friuli V.g.",
    sources: degreeSources(BASE, ANNO, "discipline-letterarie-negli-istituti-di-istruzione-secondaria-di-i-e-ii-grado-con-lingua-di-insegnamento-slovena-o-bilingui-del-friuli-v-g", "", [
      { year: 1, corso: "FI071A", anno2: ["FI071A+2+|1", "FI071A+4+|1", "FI071A+1+|1"] },
    ]),
  },
  {
    programme: "Discipline Letterarie Nell'istruzione Secondaria di i e Ii Grado",
    sources: degreeSources(BASE, ANNO, "discipline-letterarie-nell-istruzione-secondaria-di-i-e-ii-grado", "", [
      { year: 1, corso: "FI012A", anno2: ["FI012A+2+|1", "FI012A+4+|1", "FI012A+1+|1"] },
    ]),
  },
  {
    programme: "Discipline Storiche e Filosofiche",
    sources: degreeSources(BASE, ANNO, "discipline-storiche-e-filosofiche", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE01A", anno2: ["LE01A+7+|1", "LE01A+8+|1"] },
      { year: 2, corso: "LE01", anno2: ["LE01+7+|2", "LE01+8+|2"] },
      { year: 3, corso: "LE01", anno2: ["LE01+7+|3", "LE01+8+|3"] },
    ]),
  },
  {
    programme: "Earth Sciences for Sustainable Development",
    sources: degreeSources(BASE, ANNO, "earth-sciences-for-sustainable-development", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM66A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Ecologia e Sostenibilità dei Cambiamenti Globali",
    sources: degreeSources(BASE, ANNO, "ecologia-e-sostenibilita-dei-cambiamenti-globali", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM58A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM58", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Economia e Gestione Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-e-gestione-aziendale", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC01A", anno2: ["EC01A+1+|1", "EC01A+5+|1", "EC01A+3+|1"] },
      { year: 2, corso: "EC01", anno2: ["EC01+1+|2", "EC01+5+|2", "EC01+3+|2"] },
      { year: 3, corso: "EC01", anno2: ["EC01+1+|3", "EC01+5+|3", "EC01+3+|3"] },
    ]),
  },
  {
    programme: "Economia Internazionale e Mercati Finanziari",
    sources: degreeSources(BASE, ANNO, "economia-internazionale-e-mercati-finanziari", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC12A", anno2: ["EC12A+2+|1", "EC12A+7+|1"] },
      { year: 2, corso: "EC12", anno2: ["EC12+2+|2", "EC12+7+|2"] },
      { year: 3, corso: "EC12", anno2: ["EC12+2+|3", "EC12+7+|3"] },
    ]),
  },
  {
    programme: "Economia, Ambiente e Sviluppo",
    sources: degreeSources(BASE, ANNO, "economia-ambiente-e-sviluppo", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC53A", anno2: ["EC53A+2+|1", "EC53A+1+|1"] },
      { year: 2, corso: "EC53", anno2: ["EC53+2+|2", "EC53+1+|2"] },
    ]),
  },
  {
    programme: "Engineering for the Energy Transition",
    sources: degreeSources(BASE, ANNO, "engineering-for-the-energy-transition", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN22", anno2: ["IN22+1+|1", "IN22+2+|1"] },
      { year: 2, corso: "IN22", anno2: ["IN22+1+|2", "IN22+2+|2"] },
    ]),
  },
  {
    programme: "European Policies for Digital, Ecological and Social Transitions",
    sources: degreeSources(BASE, ANNO, "european-policies-for-digital-ecological-and-social-transitions", "DipartimentodiScienzePoliticheeSociali", [
      { year: 1, corso: "SP55", anno2: ["PDS0-2024|1"] },
      { year: 2, corso: "SP55", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 1, corso: "FA03A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "FA03", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "FA03", anno2: ["PDS0-2023|3"] },
      { year: 5, corso: "FA03A", anno2: ["PDS0-2025|5"] },
    ]),
  },
  {
    programme: "Farmacia (ciclo unico)",
    sources: degreeSources(BASE, ANNO, "farmacia-ciclo-unico-2", "DipartimentodiScienzeChimicheeFarmaceutiche", [
      { year: 4, corso: "FA01", anno2: ["PDS0-2015|4"] },
      { year: 5, corso: "FA01", anno2: ["PDS0-2015|5"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE63A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "LE63", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Filosofia e Scienze Umane",
    sources: degreeSources(BASE, ANNO, "filosofia-e-scienze-umane", "", [
      { year: 1, corso: "FI018", anno2: ["FI018+2+|1", "FI018+4+|1", "FI018+1+|1"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "DipartimentodiFisica", [
      { year: 1, corso: "SM20A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM20", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "SM20", anno2: ["PDS0-2008|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "", [
      { year: 1, corso: "FI020", anno2: ["FI020+2+|1", "FI020+4+|1", "FI020+1+|1"] },
      { year: 2, corso: "SM23", anno2: ["SM23+7+|2", "SM23+12+|2", "SM23+4+|2", "SM23+5+|2", "SM23+1+|2", "SM23+11+|2"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale-2", "DipartimentodiFisica", [
      { year: 1, corso: "SM23A", anno2: ["SM23A+7+|1", "SM23A+12+|1", "SM23A+4+|1", "SM23A+5+|1", "SM23A+1+|1", "SM23A+11+|1"] },
    ]),
  },
  {
    programme: "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista)",
    sources: degreeSources(BASE, ANNO, "fisioterapia-abilitante-alla-professione-sanitaria-di-fisioterapista", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME12", anno2: ["PDS0-2024|1"] },
      { year: 2, corso: "ME12", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "ME12", anno2: ["PDS0-2013|3"] },
    ]),
  },
  {
    programme: "Genomica Funzionale",
    sources: degreeSources(BASE, ANNO, "genomica-funzionale", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM53A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM53", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Geografia",
    sources: degreeSources(BASE, ANNO, "geografia", "", [
      { year: 1, corso: "FI021", anno2: ["FI021+2+|1", "FI021+4+|1", "FI021+1+|1"] },
    ]),
  },
  {
    programme: "Geologia",
    sources: degreeSources(BASE, ANNO, "geologia", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM60A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM60", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "SM60", anno2: ["PDS0-2023|3"] },
    ]),
  },
  {
    programme: "Geophysics and Geodata",
    sources: degreeSources(BASE, ANNO, "geophysics-and-geodata", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM64A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM64", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Geoscienze",
    sources: degreeSources(BASE, ANNO, "geoscienze", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM62A", anno2: ["SM62A+5+|1", "SM62A+7+|1", "SM62A+6+|1"] },
      { year: 2, corso: "SM62", anno2: ["SM62+5+|2", "SM62+7+|2", "SM62+6+|2"] },
    ]),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "DipartimentodiScienzeGiuridiche-delLinguaggio-dellInterpretazioneedellaTraduzione", [
      { year: 1, corso: "GI01A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "GI01", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "GI01", anno2: ["PDS0-2017|3"] },
      { year: 4, corso: "GI01", anno2: ["PDS0-2017|4"] },
      { year: 5, corso: "GI01", anno2: ["PDS0-2017|5"] },
    ]),
  },
  {
    programme: "IGIENE DENTALE (ABILITANTE ALLA PROFESSIONE SANITARIA DI IGIENISTA DENTALE) Sede di Pordenone",
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale-sede-di-pordenone", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME25", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "IGIENE DENTALE (ABILITANTE ALLA PROFESSIONE SANITARIA DI IGIENISTA DENTALE) Sede di Trieste",
    sources: degreeSources(BASE, ANNO, "igiene-dentale-abilitante-alla-professione-sanitaria-di-igienista-dentale-sede-di-trieste", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME15", anno2: ["PDS0-2017|1"] },
      { year: 2, corso: "ME15", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "ME15", anno2: ["PDS0-2017|3"] },
    ]),
  },
  {
    programme: "Infermieristica (abilitante alla Professione Sanitaria di Infermiere)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME10", anno2: ["PDS0-2021|1"] },
      { year: 2, corso: "ME10", anno2: ["PDS0-2021|2"] },
      { year: 3, corso: "ME10", anno2: ["PDS0-2021|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN11A", anno2: ["IN11A+7+|1", "IN11A+8+|1"] },
      { year: 2, corso: "IN11", anno2: ["IN11+7+|2", "IN11+8+|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-e-ambientale", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN01A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "IN01", anno2: ["PDS0-2010|2"] },
      { year: 3, corso: "IN01", anno2: ["PDS0-2010|3"] },
    ]),
  },
  {
    programme: "Ingegneria Clinica",
    sources: degreeSources(BASE, ANNO, "ingegneria-clinica", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN10A", anno2: ["IN10A+2+|1", "IN10A+1+|1"] },
      { year: 2, corso: "IN10", anno2: ["IN10+2+|2", "IN10+1+|2"] },
    ]),
  },
  {
    programme: "Ingegneria Dell'energia Elettrica e dei Sistemi",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-energia-elettrica-e-dei-sistemi", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN19", anno2: ["IN19+4+|1", "IN19+3+|1"] },
      { year: 2, corso: "IN19", anno2: ["IN19+4+|2", "IN19+3+|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica e Informatica",
    sources: degreeSources(BASE, ANNO, "ingegneria-elettronica-e-informatica", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN05A", anno2: ["IN05A+5+|1", "IN05A+7+|1", "IN05A+6+|1"] },
      { year: 2, corso: "IN05", anno2: ["IN05+5+|2", "IN05+7+|2", "IN05+6+|2"] },
      { year: 3, corso: "IN05", anno2: ["IN05+5+|3", "IN05+7+|3", "IN05+6+|3"] },
    ]),
  },
  {
    programme: "Ingegneria Industriale",
    sources: degreeSources(BASE, ANNO, "ingegneria-industriale", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN03A", anno2: ["IN03A+1+|1", "IN03A+5+|1", "IN03A+2+|1", "IN03A+3+|1", "IN03A+4+|1"] },
      { year: 2, corso: "IN03", anno2: ["IN03+1+|2", "IN03+5+|2", "IN03+2+|2", "IN03+3+|2", "IN03+4+|2"] },
      { year: 3, corso: "IN03", anno2: ["IN03+1+|3", "IN03+5+|3", "IN03+2+|3", "IN03+3+|3", "IN03+4+|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN15", anno2: ["IN15+1+|1", "IN15+2+|1"] },
      { year: 2, corso: "IN15", anno2: ["IN15+1+|2", "IN15+2+|2"] },
    ]),
  },
  {
    programme: "Ingegneria Navale (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-triennale", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN04A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "IN04", anno2: ["PDS0-2020|2"] },
      { year: 3, corso: "IN04", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Ingegneria Navale (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-navale-magistrale", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN16", anno2: ["IN16+2+|1", "IN16+1+|1"] },
      { year: 2, corso: "IN16", anno2: ["IN16+2+|2", "IN16+1+|2"] },
    ]),
  },
  {
    programme: "Intelligenza Artificiale e Data Analytics",
    sources: degreeSources(BASE, ANNO, "intelligenza-artificiale-e-data-analytics", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM32A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM32", anno2: ["PDS0-2020|2"] },
      { year: 3, corso: "SM32", anno2: ["PDS0-2020|3"] },
    ]),
  },
  {
    programme: "Italiano Negli Istituti di Istruzione Secondaria di i e Ii Grado con Lingua di Insegnamento Slovena O Bilingui del Friuli-venezia Giulia",
    sources: degreeSources(BASE, ANNO, "italiano-negli-istituti-di-istruzione-secondaria-di-i-e-ii-grado-con-lingua-di-insegnamento-slovena-o-bilingui-del-friuli-venezia-giulia", "", [
      { year: 1, corso: "FI070A", anno2: ["FI070A+2+|1", "FI070A+4+|1", "FI070A+1+|1"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE08A", anno2: ["LE08A+3+|1", "LE08A+1+|1", "LE08A+2+|1"] },
      { year: 2, corso: "LE08", anno2: ["LE08+3+|2", "LE08+1+|2", "LE08+2+|2"] },
      { year: 3, corso: "LE08", anno2: ["LE08+3+|3", "LE08+1+|3", "LE08+2+|3"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere Nell'istruzione Secondaria di i e di Ii Grado (inglese)",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-di-ii-grado-inglese", "", [
      { year: 1, corso: "FIB22", anno2: ["FIB22+2+|1", "FIB22+4+|1", "FIB22+1+|1"] },
    ]),
  },
  {
    programme: "Lingue e Culture Straniere Nell'istruzione Secondaria di i e di Ii Grado (tedesco)",
    sources: degreeSources(BASE, ANNO, "lingue-e-culture-straniere-nell-istruzione-secondaria-di-i-e-di-ii-grado-tedesco", "", [
      { year: 1, corso: "FID22", anno2: ["FID22+2+|1", "FID22+4+|1", "FID22+1+|1"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-e-letterature-straniere", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE04A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "LE04", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "LE04", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Lingue, Letterature Straniere e Turismo Culturale",
    sources: degreeSources(BASE, ANNO, "lingue-letterature-straniere-e-turismo-culturale", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE68A", anno2: ["LE68A+1+|1", "LE68A+2+|1"] },
      { year: 2, corso: "LE68", anno2: ["LE68+1+|2", "LE68+2+|2"] },
    ]),
  },
  {
    programme: "Logopedia (abilitante alla Professione Sanitaria di Logopedista)",
    sources: degreeSources(BASE, ANNO, "logopedia-abilitante-alla-professione-sanitaria-di-logopedista", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME18", anno2: ["PDS0-2022|1"] },
      { year: 2, corso: "ME18", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "ME18", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Marketing e Management",
    sources: degreeSources(BASE, ANNO, "marketing-e-management", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC63A", anno2: ["EC63A+2+|1", "EC63A+1+|1"] },
      { year: 2, corso: "EC63", anno2: ["EC63+2+|2", "EC63+1+|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM30A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM30", anno2: ["PDS0-2017|2"] },
      { year: 3, corso: "SM30", anno2: ["SM30+2+|3", "SM30+3+|3"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "", [
      { year: 1, corso: "FI026", anno2: ["FI026+2+|1", "FI026+4+|1", "FI026+1+|1"] },
    ]),
  },
  {
    programme: "Matematica e Fisica",
    sources: degreeSources(BASE, ANNO, "matematica-e-fisica", "", [
      { year: 1, corso: "FI027", anno2: ["FI027+2+|1", "FI027+4+|1", "FI027+1+|1"] },
    ]),
  },
  {
    programme: "Matematica e Scienze",
    sources: degreeSources(BASE, ANNO, "matematica-e-scienze", "", [
      { year: 1, corso: "FI028", anno2: ["FI028+2+|1", "FI028+4+|1", "FI028+1+|1"] },
    ]),
  },
  {
    programme: "Materials and Chemical Engineering for Nano, Bio, and Sustainable Technologies",
    sources: degreeSources(BASE, ANNO, "materials-and-chemical-engineering-for-nano-bio-and-sustainable-technologies", "DipartimentodiIngegneriaeArchitettura", [
      { year: 1, corso: "IN21A", anno2: ["IN21A+1+|1", "IN21A+2+|1"] },
      { year: 2, corso: "IN21", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Mathematics",
    sources: degreeSources(BASE, ANNO, "mathematics", "DipartimentodiMatematicaeGeoscienze", [
      { year: 1, corso: "SM28A", anno2: ["SM28A+6+|1", "SM28A+7+|1", "SM28A+8+|1"] },
      { year: 2, corso: "SM28", anno2: ["SM28+6+|2", "SM28+7+|2", "SM28+8+|2"] },
    ]),
  },
  {
    programme: "MEDICINA e CHIRURGIA Anni 3°, 4°, 5° e 6°",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-anni-3-4-5-e-6", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 3, corso: "ME03_OSP", anno2: ["PDS0-2015|3"] },
      { year: 4, corso: "ME03_OSP", anno2: ["PDS0-2015|4"] },
      { year: 5, corso: "ME03_OSP", anno2: ["PDS0-2015|5"] },
      { year: 6, corso: "ME03_OSP", anno2: ["PDS0-2015|6"] },
    ]),
  },
  {
    programme: "MEDICINA e CHIRURGIA Anno 1°",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-anno-1", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME03A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "MEDICINA e CHIRURGIA Anno 2°",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia-anno-2", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 2, corso: "ME03", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Neuroscience",
    sources: degreeSources(BASE, ANNO, "neuroscience", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM75A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM75", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "ODONTOIATRIA e PROTESI DENTARIA Anni 3°, 4°, 5° e 6°",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-anni-3-4-5-e-6", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 3, corso: "ME04_OSP", anno2: ["PDS0-2023|3"] },
      { year: 4, corso: "ME04_OSP", anno2: ["PDS0-2017|4"] },
      { year: 5, corso: "ME04_OSP", anno2: ["PDS0-2017|5"] },
      { year: 6, corso: "ME04_OSP", anno2: ["PDS0-2017|6"] },
    ]),
  },
  {
    programme: "ODONTOIATRIA e PROTESI DENTARIA Anno 1°",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-anno-1", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME04A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "ODONTOIATRIA e PROTESI DENTARIA Anno 2°",
    sources: degreeSources(BASE, ANNO, "odontoiatria-e-protesi-dentaria-anno-2", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 2, corso: "ME04", anno2: ["PDS0-2023|2"] },
    ]),
  },
  {
    programme: "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)",
    sources: degreeSources(BASE, ANNO, "ostetricia-abilitante-alla-professione-sanitaria-di-ostetrica-o", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME11", anno2: ["PDS0-2025|1"] },
      { year: 3, corso: "ME11", anno2: ["PDS0-2015|3"] },
    ]),
  },
  {
    programme: "Political Science - Integration and Governance",
    sources: degreeSources(BASE, ANNO, "political-science-integration-and-governance", "", [
      { year: 1, corso: "SP56A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Psicologia",
    sources: degreeSources(BASE, ANNO, "psicologia", "DipartimentodiScienzedellaVita", [
      { year: 2, corso: "PS51", anno2: ["PS51+5+|2", "PS51+2+|2", "PS51+6+|2"] },
    ]),
  },
  {
    programme: "Psicologia Clinica, dello Sviluppo e Neuropsicologia",
    sources: degreeSources(BASE, ANNO, "psicologia-clinica-dello-sviluppo-e-neuropsicologia", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "PS51A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Psicologia Sociale e Cognitiva Applicata",
    sources: degreeSources(BASE, ANNO, "psicologia-sociale-e-cognitiva-applicata", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "PS52A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Scientific and Data-intensive Computing",
    sources: degreeSources(BASE, ANNO, "scientific-and-data-intensive-computing", "DipartimentodiMatematicaeGeoscienze", [
      { year: 2, corso: "SM36", anno2: ["SM36+1+|2", "SM36+2+|2", "SM36+3+|2"] },
    ]),
  },
  {
    programme: "Scienze del Governo e Politiche Pubbliche",
    sources: degreeSources(BASE, ANNO, "scienze-del-governo-e-politiche-pubbliche", "DipartimentodiScienzePoliticheeSociali", [
      { year: 1, corso: "SP51A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SP51", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Scienze Dell'educazione",
    sources: degreeSources(BASE, ANNO, "scienze-dell-educazione", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "SF01A", anno2: ["SF01A+1+|1", "SF01A+2+|1"] },
      { year: 2, corso: "SF01", anno2: ["SF01+1+|2", "SF01+2+|2"] },
      { year: 3, corso: "SF01", anno2: ["SF01+1+|3", "SF01+2+|3"] },
    ]),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "SF10", anno2: ["PDS0-2022|1"] },
      { year: 2, corso: "SF10", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "SF10", anno2: ["PDS0-2022|3"] },
      { year: 4, corso: "SF10", anno2: ["PDS0-2022|4"] },
    ]),
  },
  {
    programme: "Scienze della Geologia e della Mineralogia",
    sources: degreeSources(BASE, ANNO, "scienze-della-geologia-e-della-mineralogia", "", [
      { year: 1, corso: "FI032", anno2: ["FI032+2+|1", "FI032+4+|1", "FI032+1+|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-psicologiche", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "PS01A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "PS01", anno2: ["PDS0-2023|2"] },
      { year: 3, corso: "PS01", anno2: ["PDS0-2023|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-biologiche", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM51A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM51", anno2: ["PDS0-2021|2"] },
      { year: 3, corso: "SM51", anno2: ["PDS0-2021|3"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie Chimiche",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-chimiche", "", [
      { year: 1, corso: "FI034", anno2: ["FI034+2+|1", "FI034+4+|1", "FI034+1+|1"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per L'ambiente e la Natura",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-per-l-ambiente-e-la-natura", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM40A", anno2: ["SM40A+2+|1", "SM40A+1+|1", "SM40A+3+|1"] },
      { year: 2, corso: "SM40", anno2: ["SM40+2+|2", "SM40+1+|2", "SM40+3+|2"] },
      { year: 3, corso: "SM40", anno2: ["SM40+2+|3", "SM40+1+|3", "SM40+3+|3"] },
    ]),
  },
  {
    programme: "Scienze Economico-aziendali",
    sources: degreeSources(BASE, ANNO, "scienze-economico-aziendali", "", [
      { year: 1, corso: "FI045", anno2: ["FI045+2+|1", "FI045+4+|1", "FI045+1+|1"] },
    ]),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME05", anno2: ["PDS0-2021|1"] },
    ]),
  },
  {
    programme: "Scienze Internazionali e Diplomatiche",
    sources: degreeSources(BASE, ANNO, "scienze-internazionali-e-diplomatiche", "DipartimentodiScienzePoliticheeSociali", [
      { year: 1, corso: "SP01A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SP01", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "SP01", anno2: ["PDS0-2014|3"] },
    ]),
  },
  {
    programme: "Scienze Naturali, Chimiche e Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-naturali-chimiche-e-biologiche", "", [
      { year: 1, corso: "FI050", anno2: ["FI050+2+|1", "FI050+4+|1", "FI050+1+|1"] },
    ]),
  },
  {
    programme: "Scienze per L'ambiente Marino e Costiero",
    sources: degreeSources(BASE, ANNO, "scienze-per-l-ambiente-marino-e-costiero", "DipartimentodiScienzedellaVita", [
      { year: 1, corso: "SM44A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SM44", anno2: ["PDS0-2022|2"] },
    ]),
  },
  {
    programme: "Scienze Politiche e Dell'amministrazione",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-dell-amministrazione", "DipartimentodiScienzePoliticheeSociali", [
      { year: 1, corso: "SP02A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SP02", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "SP02", anno2: ["PDS0-2014|3"] },
    ]),
  },
  {
    programme: "Scienze Riabilitative delle Professioni Sanitarie",
    sources: degreeSources(BASE, ANNO, "scienze-riabilitative-delle-professioni-sanitarie", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME06", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Scienze Statistiche e Attuariali",
    sources: degreeSources(BASE, ANNO, "scienze-statistiche-e-attuariali", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC71A", anno2: ["EC71A+2+|1", "EC71A+3+|1"] },
      { year: 2, corso: "EC71", anno2: ["EC71+2+|2", "EC71+3+|2"] },
    ]),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "SF03A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SF03", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "SF03", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Servizio Sociale, Politiche Sociali, Programmazione e Gestione dei Servizi",
    sources: degreeSources(BASE, ANNO, "servizio-sociale-politiche-sociali-programmazione-e-gestione-dei-servizi", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "SF05A", anno2: ["PDS0-2025|1"] },
      { year: 2, corso: "SF05", anno2: ["PDS0-2021|2"] },
    ]),
  },
  {
    programme: "Statistica e Informatica per L'azienda, la Finanza e L'assicurazione",
    sources: degreeSources(BASE, ANNO, "statistica-e-informatica-per-l-azienda-la-finanza-e-l-assicurazione", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 2, corso: "EC21", anno2: ["PDS0-2016|2"] },
      { year: 3, corso: "EC21", anno2: ["PDS0-2016|3"] },
    ]),
  },
  {
    programme: "Statistica per L?assicurazione e Business Analytics",
    sources: degreeSources(BASE, ANNO, "statistica-per-l-assicurazione-e-business-analytics", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC21A", anno2: ["PDS0-2025|1"] },
    ]),
  },
  {
    programme: "Strategia, Consulenza e Logistica Aziendale",
    sources: degreeSources(BASE, ANNO, "strategia-consulenza-e-logistica-aziendale", "DipartimentodiScienzeEconomiche-Aziendali-MatematicheeStatistiche", [
      { year: 1, corso: "EC64A", anno2: ["EC64A+1+|1", "EC64A+2+|1"] },
      { year: 2, corso: "EC64", anno2: ["EC64+1+|2", "EC64+2+|2"] },
    ]),
  },
  {
    programme: "Studi Storici. Dall'antico al Contemporaneo",
    sources: degreeSources(BASE, ANNO, "studi-storici-dall-antico-al-contemporaneo", "DipartimentodiStudiUmanistici", [
      { year: 1, corso: "LE65A", anno2: ["LE65A+3+|1"] },
      { year: 2, corso: "LE65", anno2: ["LE65+4+|2"] },
    ]),
  },
  {
    programme: "Tecnica della Riabilitazione Psichiatrica (abilitante alla Professione Sanitaria di Tecnico della Riabilitazione Psichiatrica)",
    sources: degreeSources(BASE, ANNO, "tecnica-della-riabilitazione-psichiatrica-abilitante-alla-professione-sanitaria-di-tecnico-della-riabilitazione-psichiatrica", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME17", anno2: ["PDS0-2024|1"] },
      { year: 2, corso: "ME17", anno2: ["PDS0-2024|2"] },
      { year: 3, corso: "ME17", anno2: ["PDS0-2015|3"] },
    ]),
  },
  {
    programme: "Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro)",
    sources: degreeSources(BASE, ANNO, "tecniche-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro-abilitante-alla-professione-sanitaria-di-tecnico-della-prevenzione-nell-ambiente-e-nei-luoghi-di-lavoro", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 1, corso: "ME16", anno2: ["PDS0-2022|1"] },
      { year: 2, corso: "ME16", anno2: ["PDS0-2022|2"] },
      { year: 3, corso: "ME16", anno2: ["PDS0-2022|3"] },
    ]),
  },
  {
    programme: "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-laboratorio-biomedico-abilitante-alla-professione-sanitaria-di-tecnico-di-laboratorio-biomedico", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 2, corso: "ME13", anno2: ["PDS0-2015|2"] },
    ]),
  },
  {
    programme: "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)",
    sources: degreeSources(BASE, ANNO, "tecniche-di-radiologia-medica-per-immagini-e-radioterapia-abilitante-alla-professione-sanitaria-di-tecnico-di-radiologia-medica", "DipartimentoUniversitarioClinicodiScienzemediche-chirurgicheedellasalute", [
      { year: 2, corso: "ME14", anno2: ["PDS0-2024|2"] },
    ]),
  },
  {
    programme: "Tecnologie Elettriche ed Elettroniche",
    sources: degreeSources(BASE, ANNO, "tecnologie-elettriche-ed-elettroniche", "", [
      { year: 1, corso: "FI040", anno2: ["FI040+2+|1", "FI040+4+|1", "FI040+1+|1"] },
    ]),
  },
  {
    programme: "Traduzione Specialistica e Interpretazione di Conferenza",
    sources: degreeSources(BASE, ANNO, "traduzione-specialistica-e-interpretazione-di-conferenza", "DipartimentodiScienzeGiuridiche-delLinguaggio-dellInterpretazioneedellaTraduzione", [
      { year: 1, corso: "SL11A", anno2: ["SL11A+1+|1", "SL11A+3+|1"] },
      { year: 2, corso: "SL11", anno2: ["SL11+1+|2", "SL11+3+|2"] },
    ]),
  },
];

export const units: UniversityPreset = {
  id: "units-ingegneria-informatica",
  name: "Università degli Studi di Trieste",
  shortName: "Università di Trieste",
  city: "Trieste",
  programme: "Ingegneria Elettronica e Informatica",
  liveSources: true,
  sources: [],
  livePrograms,
};
