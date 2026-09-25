/**
 * Preset: Università di Roma "Tor Vergata" — the WHOLE ateneo.
 *
 * Tor Vergata is the first "complete" ateneo and the replicable model for the
 * others: every degree whose EasyAcademy codes were verified live (real
 * grid_call.php / test_call.php requests returning non-empty data) is wired in
 * `livePrograms`, each with its own per-programme namespaced sources so caches
 * never collide across courses. Courses without verifiable codes stay manual —
 * they still appear in the onboarding catalogue (ateneo-courses.ts) and the
 * student enters data by hand.
 *
 * Codes are captured from the public combo.php cascade, NEVER invented. The full
 * per-course verification status is in `_uniroma2_coverage.md`. Re-verify each
 * September (universities renumber corso/anno2 per cohort) and bump ANNO.
 */
import type { LiveProgram, SyncSource, UniversityPreset } from "../provider";

const EASY_BASE = "https://easyutv.uniroma2.it/agendaweb";
/** Academic-year start (2026/27). Bump each September after re-verifying codes. */
const ANNO = "2026";

/** Per-year timetable + exams sources for one degree. Ids are namespaced by
 *  `slug` so two courses of the same ateneo never share a cache key. Exams take
 *  the plain year number as `anno2` and the year's `corso` as `cdl` (easytest);
 *  the 2025/26 ordinamento reform can split a triennale across two `corso`
 *  codes, so every year carries its own. */
function degreeSources(
  slug: string,
  scuola: string,
  years: { year: number; corso: string; anno2: string[] }[],
): SyncSource[] {
  const out: SyncSource[] = [];
  for (const y of years) {
    out.push({
      id: `${slug}-orario-anno-${y.year}`,
      label: `Orario lezioni — ${y.year}° anno`,
      capability: "timetable",
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: EASY_BASE,
        anno: ANNO,
        scuola,
        corso: y.corso,
        anno2: y.anno2,
      },
    });
    out.push({
      id: `${slug}-esami-anno-${y.year}`,
      label: `Appelli d'esame — ${y.year}° anno`,
      capability: "exams",
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: EASY_BASE,
        scuola,
        cdl: y.corso,
        anno2: [String(y.year)],
      },
    });
  }
  return out;
}

// ── Informatica (triennale, H02) — the original wiring, verified 2026-06-12.
//    Kept with BARE source ids (orario-anno-N / esami-anno-N) exactly as first
//    shipped so existing setups keep working byte-for-byte. Plain "comune|N"
//    common track; carries the department WordPress news feed (other degrees
//    have no department site wired).
const informatica: LiveProgram = {
  programme: "Informatica (triennale)",
  sources: [
    ...[1, 2, 3].map((year) => ({
      id: `orario-anno-${year}`,
      label: `Orario lezioni — ${year}° anno`,
      capability: "timetable" as const,
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: EASY_BASE,
        anno: ANNO,
        scuola: "FacoltadiScienzeMatematiche-FisicheeNaturali",
        corso: "H02",
        anno2: [`comune|${year}`],
      },
    })),
    ...[1, 2, 3].map((year) => ({
      id: `esami-anno-${year}`,
      label: `Appelli d'esame — ${year}° anno`,
      capability: "exams" as const,
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: EASY_BASE,
        scuola: "FacoltadiScienzeMatematiche-FisicheeNaturali",
        cdl: "H02",
        anno2: [String(year)],
      },
    })),
    {
      id: "avvisi-dipartimento",
      label: "Avvisi del corso di laurea",
      capability: "news" as const,
      providerId: "wordpress-news",
      params: { baseUrl: "https://informatica.uniroma2.it" },
    },
  ],
};

/** Every verified-live degree at Tor Vergata. Informatica first (original);
 *  the rest are appended from live probing — see _uniroma2_coverage.md. Use
 *  `degreeSources(slug, scuola, years)` for each. */
const livePrograms: LiveProgram[] = [
  informatica,
  {
    programme: "Astrophysics and Space Science",
    sources: degreeSources("astrophysics-and-space-science", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA3", anno2: ["comune|1"] },
      { year: 2, corso: "AA3", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Bioinformatica",
    sources: degreeSources("bioinformatica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J61", anno2: ["biomedico|1", "informatico|1"] },
      { year: 2, corso: "J61", anno2: ["biomedico|2", "informatico|2"] },
    ]),
  },
  {
    programme: "Biologia Cellulare, Molecolare e Ricerca Biomedica",
    sources: degreeSources("biologia-cellulare-molecolare-e-ricerca-biomedica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB7", anno2: ["comune|1"] },
      { year: 2, corso: "AB7", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Biotechnology for Industry and Health",
    sources: degreeSources("biotechnology-for-industry-and-health", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB6", anno2: ["clinicalresearch|1", "experimentalbiotechnology|1"] },
      { year: 2, corso: "AB6", anno2: ["clinicalresearch|2", "experimentalbiotechnology|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources("biotecnologie", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H04", anno2: ["comune|1"] },
      { year: 2, corso: "H04", anno2: ["comune|2"] },
      { year: 3, corso: "H04", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Agrarie",
    sources: degreeSources("biotecnologie-agrarie", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB3", anno2: ["comune|1"] },
      { year: 2, corso: "AB3", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Chemical Nano-Engineering",
    sources: degreeSources("chemical-nano-engineering", "FacoltadiIngegneria", [
      { year: 1, corso: "W46", anno2: ["comune|1"] },
      { year: 2, corso: "W46", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Chimica (magistrale)",
    sources: degreeSources("chimica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J63", anno2: ["chimicadeisistemicomplessiediinteressebiologico|1", "chimicaperlambiente-lenergiaelasostenibilita|1"] },
      { year: 2, corso: "J63", anno2: ["chimicadeisistemicomplessiediinteressebiologico|2", "chimicaperlambiente-lenergiaelasostenibilita|2"] },
    ]),
  },
  {
    programme: "Chimica (triennale)",
    sources: degreeSources("chimica-triennale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H05", anno2: ["comune|1", "comune_canaleA-L|1", "comune_canaleM-Z|1"] },
      { year: 2, corso: "H05", anno2: ["comune|2"] },
      { year: 3, corso: "H05", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Chimica Applicata",
    sources: degreeSources("chimica-applicata", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H06", anno2: ["comune|1"] },
      { year: 2, corso: "H06", anno2: ["comune|2"] },
      { year: 3, corso: "H06", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Engineering Sciences",
    sources: degreeSources("engineering-sciences", "FacoltadiIngegneria", [
      { year: 1, corso: "K73", anno2: ["comune|1"] },
      { year: 2, corso: "K73", anno2: ["comune|2"] },
      { year: 3, corso: "K73", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources("fisica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J64", anno2: ["astrophysicsandspacescience|1", "fisicabiofisicaefisicamedica|1", "fisicadellaatmosferaedelclimaemeteorologia|1", "fisicaelettronicaecibernetica|1", "fisicafisicateorica|1", "fisicastrutturadellamateria|1", "physicsofcomplexsystemsandbigdata|1", "physicsoffundamentalinteractionsandexperimentaltechniques|1"] },
      { year: 2, corso: "J64", anno2: ["astrophysicsandspacescience|2", "fisicadellaatmosferaedelclimaemeteorologia|2", "fisicaelettronicaecibernetica|2", "fisicafisicadeibiosistemi|2", "fisicafisicateorica|2", "fisicastrutturadellamateria|2", "physicsofcomplexsystemsandbigdata|2", "physicsoffundamentalinteractionsandexperimentaltechniques|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources("fisica-triennale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H08", anno2: ["fisica|1", "fisicadellatmosferaedelclimaemeteorologia|1"] },
      { year: 2, corso: "H08", anno2: ["fisica|2", "fisicadellatmosferaedelclimaemeteorologia|2"] },
      { year: 3, corso: "H08", anno2: ["fisica|3", "fisicadellatmosferaedelclimaemeteorologia|3"] },
    ]),
  },
  {
    programme: "ICT and Internet Engineering - Ingegneria di Internet e delle Tecnologie per l'Informazione e la Comunicazione",
    sources: degreeSources("ict-and-internet-engineering-ingegneria-di-internet-e-delle-tecnologie-per-l-informazione-e-la-comunicazione", "FacoltadiIngegneria", [
      { year: 1, corso: "Q66", anno2: ["comune|1"] },
      { year: 2, corso: "Q66", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources("informatica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J65", anno2: ["comune|1"] },
      { year: 2, corso: "J65", anno2: ["comune|2"] },
      { year: 3, corso: "H02", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources("ingegneria-civile", "FacoltadiIngegneria", [
      { year: 1, corso: "H30", anno2: ["infrastruttureesistemiditrasporto|1", "struttureegeotecnica|1"] },
      { year: 2, corso: "H30", anno2: ["infrastruttureesistemiditrasporto|2", "struttureegeotecnica|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources("ingegneria-civile-e-ambientale", "FacoltadiIngegneria", [
      { year: 1, corso: "K72", anno2: ["comune|1"] },
      { year: 2, corso: "K72", anno2: ["comune|2"] },
      { year: 3, corso: "K72", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria dell'Automazione",
    sources: degreeSources("ingegneria-dell-automazione", "FacoltadiIngegneria", [
      { year: 1, corso: "H31", anno2: ["comune|1"] },
      { year: 2, corso: "H31", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria dell'Edilizia",
    sources: degreeSources("ingegneria-dell-edilizia", "FacoltadiIngegneria", [
      { year: 1, corso: "H20", anno2: ["comune|1"] },
      { year: 2, corso: "H20", anno2: ["comune|2"] },
      { year: 3, corso: "H20", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria di Internet",
    sources: degreeSources("ingegneria-di-internet", "FacoltadiIngegneria", [
      { year: 1, corso: "P65", anno2: ["comune|1"] },
      { year: 2, corso: "P65", anno2: ["comune|2"] },
      { year: 3, corso: "P65", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria e Tecniche del Costruire",
    sources: degreeSources("ingegneria-e-tecniche-del-costruire", "FacoltadiIngegneria", [
      { year: 1, corso: "H32", anno2: ["comune|1"] },
      { year: 2, corso: "H32", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Edile-architettura",
    sources: degreeSources("ingegneria-edile-architettura", "FacoltadiIngegneria", [
      { year: 1, corso: "J53", anno2: ["comune|1"] },
      { year: 2, corso: "J53", anno2: ["comune|2"] },
      { year: 3, corso: "J53", anno2: ["comune|3"] },
      { year: 4, corso: "J53", anno2: ["comune|4"] },
      { year: 5, corso: "J53", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (magistrale)",
    sources: degreeSources("ingegneria-elettronica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H33", anno2: ["percorsoaelettronicaperlenergia|1", "percorsobelettronicaperlindustria|1", "percorsocelettronicaperlamedicina|1", "percorsodelettronicaperlospazioelasicurezza|1", "percorsoeelettronicaperildigitalchipdesign|1", "percorsofelettronicaperlfintelligenzaartificiale|1"] },
      { year: 2, corso: "H33", anno2: ["indirizzoaelettronicaperlenergia|2", "indirizzobelettronicaperlindustria|2", "indirizzocelettronicaperlasaluteelambiente|2", "indirizzodelettronicaperlospazioelasicurezza|2", "indirizzoeelettronicaperletelecomunicazionielamultimedialita|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (triennale)",
    sources: degreeSources("ingegneria-elettronica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H21", anno2: ["comune|1"] },
      { year: 2, corso: "H21", anno2: ["comune|2"] },
      { year: 3, corso: "H21", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources("ingegneria-energetica", "FacoltadiIngegneria", [
      { year: 1, corso: "H34", anno2: ["comune|1"] },
      { year: 2, corso: "H34", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (in Modalità Prevalentemente a Distanza)",
    sources: degreeSources("ingegneria-gestionale-in-modalita-prevalentemente-a-distanza", "FacoltadiIngegneria", [
      { year: 1, corso: "V89", anno2: ["comune|1"] },
      { year: 2, corso: "V89", anno2: ["comune|2"] },
      { year: 3, corso: "V89", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources("ingegneria-gestionale-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "AC1", anno2: ["dataanalytics|1", "direzionedimpresa|1", "ingegneriadelleimpresedigitali|1", "ingegneriagestionaledelletelecomunicazioni|1", "sistemidiproduzione|1", "sistemilogisticieditrasporto|1", "technologyandnewfrontiermanagement|1"] },
      { year: 2, corso: "AC1", anno2: ["dataanalytics|2", "direzionedimpresa|2", "gestionedellaproduzionealimentare|2", "ingegneriadelleimpresedigitali|2", "ingegneriagestionaledelletelecomunicazioni|2", "sistemidiproduzione|2", "sistemilogisticieditrasporto|2", "technologyandnewfrontiermanagement|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources("ingegneria-gestionale-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "U09", anno2: ["ingegneriadellorganizzazione|1", "ingegneriadellaproduzione|1", "ingegneriadelleinfrastruttureedeisistemiarete|1", "ingegneriagestionaledelletelecomunicazioni|1", "ingegnerialogisticaedeitrasporti|1"] },
      { year: 2, corso: "U09", anno2: ["ingegneriadellorganizzazione|2", "ingegneriadellaproduzione|2", "ingegneriadelleinfrastruttureedeisistemiarete|2", "ingegneriagestionaledelletelecomunicazioni|2", "ingegnerialogisticaedeitrasporti|2"] },
      { year: 3, corso: "U09", anno2: ["ingegneriadellorganizzazione|3", "ingegneriadellaproduzione|3", "ingegneriadelleinfrastruttureedeisistemiarete|3", "ingegneriagestionaledelletelecomunicazioni|3", "ingegnerialogisticaedeitrasporti|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources("ingegneria-informatica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H36", anno2: ["artificialintelligenceanddataengineering|1", "computerandinformationengineeringindirizzocybersecurity|1", "computerandinformationengineeringindirizzogenerale|1", "computerandinformationengineeringindirizzosystemsandsoftwareengineering|1"] },
      { year: 2, corso: "H36", anno2: ["computerandinformationengineeringindirizzocybersecurity|2", "computerandinformationengineeringindirizzogenerale|2", "computerandinformationengineeringindirizzosystemsandsoftwareengineering|2", "datascienceandengineering|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources("ingegneria-informatica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "U08", anno2: ["roboticaeautomazione|1", "sistemisoftwareeweb|1"] },
      { year: 2, corso: "U08", anno2: ["roboticaeautomazione|2", "sistemisoftwareeweb|2"] },
      { year: 3, corso: "U08", anno2: ["roboticaeautomazione|3", "sistemisoftwareeweb|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources("ingegneria-meccanica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H37", anno2: ["ingegneriadeiprocessisostenibili|1", "ingegneriadiprodotto|1"] },
      { year: 2, corso: "H37", anno2: ["ingegneriadeiprocessisostenibili|2", "ingegneriadiprodotto|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources("ingegneria-meccanica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H25", anno2: ["comune|1"] },
      { year: 2, corso: "H25", anno2: ["comune|2"] },
      { year: 3, corso: "H25", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Medica (magistrale)",
    sources: degreeSources("ingegneria-medica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H38", anno2: ["comune|1"] },
      { year: 2, corso: "H38", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Medica (triennale)",
    sources: degreeSources("ingegneria-medica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H26", anno2: ["comune|1"] },
      { year: 2, corso: "H26", anno2: ["comune|2"] },
      { year: 3, corso: "H26", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria per l'Ambiente e il Territorio",
    sources: degreeSources("ingegneria-per-l-ambiente-e-il-territorio", "FacoltadiIngegneria", [
      { year: 1, corso: "H29", anno2: ["indirizzoininglese|1", "indirizzoinitaliano|1"] },
      { year: 2, corso: "H29", anno2: ["indirizzoininglese|2", "indirizzoinitaliano|2"] },
    ]),
  },
  {
    programme: "Ingegneria per l'Energia e l'Ambiente",
    sources: degreeSources("ingegneria-per-l-energia-e-l-ambiente", "FacoltadiIngegneria", [
      { year: 1, corso: "X63", anno2: ["energeticaambientale|1", "energeticaindustriale|1"] },
      { year: 2, corso: "X63", anno2: ["energeticaambientale|2", "energeticaindustriale|2"] },
      { year: 3, corso: "X63", anno2: ["energeticaambientale|3", "energeticaindustriale|3"] },
    ]),
  },
  {
    programme: "Matematica",
    sources: degreeSources("matematica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H11", anno2: ["comune|1"] },
      { year: 2, corso: "H11", anno2: ["comune|2"] },
      { year: 3, corso: "H11", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Mechatronics Engineering",
    sources: degreeSources("mechatronics-engineering", "FacoltadiIngegneria", [
      { year: 1, corso: "T20", anno2: ["computionalmethods|1", "electromechanics|1", "electronicsanddigitaltransition|1", "mechanicsanddigitaltransition|1", "mechatronicsystemsandictinterconnectedelectricvehiclesengineering|1", "mechatronicsystemsandictlearningandcommunication|1"] },
      { year: 2, corso: "T20", anno2: ["computionalmethods|2", "electromechanics|2", "electronicsanddigitaltransition|2", "mechanicsanddigitaltransition|2", "mechatronicsystemsandictinterconnectedelectricvehiclesengineering|2", "mechatronicsystemsandictlearningandcommunication|2"] },
    ]),
  },
  {
    programme: "Metodi e Modelli per Data Science",
    sources: degreeSources("metodi-e-modelli-per-data-science", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA2", anno2: ["comune|1"] },
      { year: 2, corso: "AA2", anno2: ["comune|2"] },
      { year: 3, corso: "AA2", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Pharmacy",
    sources: degreeSources("pharmacy", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA4", anno2: ["comune|1"] },
      { year: 2, corso: "AA4", anno2: ["comune|2"] },
      { year: 3, corso: "AA4", anno2: ["comune|3"] },
      { year: 4, corso: "AA4", anno2: ["comune|4"] },
      { year: 5, corso: "AA4", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources("scienza-dei-materiali", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB1", anno2: ["comune|1"] },
      { year: 2, corso: "AB1", anno2: ["comune|2"] },
      { year: 3, corso: "AB1", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Scienza e Tecnologia dei Materiali",
    sources: degreeSources("scienza-e-tecnologia-dei-materiali", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA1", anno2: ["emjmgreenano|1", "materialigreenesostenibili|1", "scienzaetecnologiadeimateriali|1"] },
      { year: 2, corso: "AA1", anno2: ["emjmgreenano|2", "materialigreenesostenibili|2", "scienzaetecnologiadeimateriali|2"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources("scienze-biologiche", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H03", anno2: ["comune|1"] },
      { year: 2, corso: "H03", anno2: ["comune|2"] },
      { year: 3, corso: "H03", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Biologia Ambientale",
    sources: degreeSources("biologia-ambientale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA7", anno2: ["comune|1"] },
      { year: 2, corso: "AA7", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Matematica Pura e Applicata",
    sources: degreeSources("matematica-pura-e-applicata", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J66", anno2: ["comune|1"] },
      { year: 2, corso: "J66", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per i Media",
    sources: degreeSources("scienze-e-tecnologie-per-i-media", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H12", anno2: ["comune|1"] },
      { year: 2, corso: "H12", anno2: ["comune|2"] },
      { year: 3, corso: "H12", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources("semestre-filtro", "", [
      { year: 1, corso: "SMF", anno2: ["comune|1"] },
    ]),
  },
];

export const uniroma2: UniversityPreset = {
  // Stable id kept verbatim: it is the detectAteneo target for *.uniroma2.it and
  // may already be saved in profiles. The name is historical; this preset now
  // covers the whole ateneo via livePrograms.
  id: "uniroma2-informatica-triennale",
  name: 'Università di Roma "Tor Vergata"',
  shortName: "Tor Vergata",
  city: "Roma",
  programme: "Informatica (triennale)",
  liveSources: true,
  sources: [], // multi-programme ateneo: real sources live under livePrograms
  livePrograms,
  portalUrl: "https://delphi.uniroma2.it",
  links: [
    { label: "Delphi — Segreteria online", url: "https://delphi.uniroma2.it" },
    { label: "Portale di Ateneo", url: "https://web.uniroma2.it" },
  ],
};

