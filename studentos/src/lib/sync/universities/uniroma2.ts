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
/** Academic-year start (2025/26). Bump each September after re-verifying codes. */
const ANNO = "2025";

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
    programme: "Archeologia, Filologia, Letterature e Storia dell'Antichità",
    sources: degreeSources("archeologia-filologia-letterature-e-storia-dell-antichita", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "K80/LM-2 - M93/LM-15", anno2: ["lm-15|1", "lm-2|1"] },
      { year: 2, corso: "K80/LM-2 - M93/LM-15", anno2: ["lm-15|2", "lm-2|2"] },
    ]),
  },
  {
    programme: "Art History in Rome, From Late Antiquity to the Present",
    sources: degreeSources("art-history-in-rome-from-late-antiquity-to-the-present", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "T22", anno2: ["comune|1"] },
      { year: 2, corso: "T22", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Astrophysics and Space Science",
    sources: degreeSources("astrophysics-and-space-science", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA3", anno2: ["comune|1"] },
      { year: 2, corso: "AA3", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Beni Culturali (archeologici, Artistici, Musicali e dello Spettacolo)",
    sources: degreeSources("beni-culturali-archeologici-artistici-musicali-e-dello-spettacolo", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "L85", anno2: ["archeologia|1", "benistorico-artistici|1", "generico|1", "musica|1", "spettacolo|1"] },
      { year: 2, corso: "L85", anno2: ["archeologia|2", "benistorico-artistici|2", "generico|2", "musica|2", "spettacolo|2"] },
      { year: 3, corso: "L85", anno2: ["archeologia|3", "benistorico-artistici|3", "generico|3", "musica|3", "spettacolo|3"] },
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
    ]),
  },
  {
    programme: "Biotechnology - Biotecnologie",
    sources: degreeSources("biotechnology-biotecnologie", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 2, corso: "Q67", anno2: ["appliedbiotechnology|2", "clinicalresearch|2"] },
    ]),
  },
  {
    programme: "Biotechnology for Industry and Health",
    sources: degreeSources("biotechnology-for-industry-and-health", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB6", anno2: ["clinicalresearch|1", "experimentalbiotechnology|1"] },
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
      { year: 1, corso: "H05", anno2: ["comune|1"] },
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
    programme: "Comunicazione e Intelligenza Artificiale",
    sources: degreeSources("comunicazione-e-intelligenza-artificiale", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "AB5", anno2: ["editoriagiornalismocomunicazione|1", "linguaggicomunicazioneintelligenzaartificiale|1"] },
    ]),
  },
  {
    programme: "Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004)",
    sources: degreeSources("conservazione-e-restauro-dei-beni-culturali-abilitante-ai-sensi-del-d-lgs-n-42-2004", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "M91", anno2: ["comune|1"] },
      { year: 2, corso: "M91", anno2: ["comune|2"] },
      { year: 3, corso: "M91", anno2: ["comune|3"] },
      { year: 4, corso: "M91", anno2: ["comune|4"] },
      { year: 5, corso: "M91", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Digital Humanities: Comunicazione, Lingue, Patrimonio Culturale",
    sources: degreeSources("digital-humanities-comunicazione-lingue-patrimonio-culturale", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "AA9", anno2: ["orientamentounico|1"] },
      { year: 2, corso: "AA9", anno2: ["comunicazionedigitale|2", "linguenelleradigitale|2", "patrimoniocuturaledigitale|2"] },
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
    programme: "Filologia Moderna",
    sources: degreeSources("filologia-moderna", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "AB4", anno2: ["italianistica|1", "linguistica|1", "scienzedeltesto|1"] },
    ]),
  },
  {
    programme: "Filosofia (magistrale)",
    sources: degreeSources("filosofia-magistrale", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H59", anno2: ["filosofia|1", "filosofiapoliticaeconomia|1", "formedellarazionalitapercorsostudentihalle|1", "formedellarazionalitapercorsostudentitv|1"] },
      { year: 2, corso: "H59", anno2: ["filosofia|2", "filosofiapoliticaeconomia|2", "formedellarazionalitapercorsostudentihalle|2", "formedellarazionalitapercorsostudentitv|2"] },
    ]),
  },
  {
    programme: "Filosofia (triennale)",
    sources: degreeSources("filosofia-triennale", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H42", anno2: ["comune|1"] },
      { year: 2, corso: "H42", anno2: ["comune|2"] },
      { year: 3, corso: "H42", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources("fisica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J64", anno2: ["astrophysicsandspacescience|1", "fisicadellaatmosferaedelclimaemeteorologia|1", "fisicaelettronicaecibernetica|1", "fisicafisicadeibiosistemi|1", "fisicafisicateorica|1", "fisicastrutturadellamateria|1", "physicsofcomplexsystemsandbigdata|1", "physicsoffundamentalinteractionsandexperimentaltechniques|1"] },
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
      { year: 1, corso: "H33", anno2: ["indirizzoaelettronicaperlenergia|1", "indirizzobelettronicaperlindustria|1", "indirizzocelettronicaperlasaluteelambiente|1", "indirizzodelettronicaperlospazioelasicurezza|1", "indirizzoeelettronicaperletelecomunicazionielamultimedialita|1"] },
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
      { year: 1, corso: "AC1", anno2: ["dataanalytics|1", "direzionedimpresa|1", "gestionedellaproduzionealimentare|1", "ingegneriadelleimpresedigitali|1", "ingegneriagestionaledelletelecomunicazioni|1", "sistemidiproduzione|1", "sistemilogisticieditrasporto|1", "technologyandnewfrontiermanagement|1"] },
      { year: 2, corso: "AC1", anno2: ["dataanalytics|2", "direzionedimpresa|2", "gestionedellaproduzionealimentare|2", "ingegneriadelleimpresedigitali|2", "ingegneriagestionaledelletelecomunicazioni|2", "sistemidiproduzione|2", "sistemilogisticieditrasporto|2"] },
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
      { year: 1, corso: "H36", anno2: ["computerandinformationengineeringindirizzocybersecurity|1", "computerandinformationengineeringindirizzogenerale|1", "computerandinformationengineeringindirizzosystemsandsoftwareengineering|1", "datascienceandengineering|1"] },
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
      { year: 2, corso: "H37", anno2: ["ingegneriadiprocesso|2", "ingegneriadiprodotto|2"] },
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
    programme: "Letteratura Italiana, Filologia Moderna e Linguistica",
    sources: degreeSources("letteratura-italiana-filologia-moderna-e-linguistica", "FacoltadiLettereeFilosofia", [
      { year: 2, corso: "H53/LM-14 - M94/LM-39", anno2: ["filologico|2", "letterario|2", "linguistico-glottodidatticoglottodidattico|2", "linguistico-glottodidatticolinguistico|2"] },
    ]),
  },
  {
    programme: "Lingua e Cultura Italiana a Stranieri per l'Accoglienza e l'Internazionalizzazione",
    sources: degreeSources("lingua-e-cultura-italiana-a-stranieri-per-l-accoglienza-e-l-internazionalizzazione", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "V86", anno2: ["comune|1"] },
      { year: 2, corso: "V86", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Europee e Americane",
    sources: degreeSources("lingue-e-letterature-europee-e-americane", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H56", anno2: ["comune|1"] },
      { year: 2, corso: "H56", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Lingue e Letterature Moderne",
    sources: degreeSources("lingue-e-letterature-moderne", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H44", anno2: ["comune|1"] },
      { year: 2, corso: "H44", anno2: ["comune|2"] },
      { year: 3, corso: "H44", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Lingue nella Società dell'Informazione",
    sources: degreeSources("lingue-nella-societa-dell-informazione", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H45", anno2: ["comune|1"] },
      { year: 2, corso: "H45", anno2: ["comune|2"] },
      { year: 3, corso: "H45", anno2: ["comune|3"] },
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
      { year: 2, corso: "T20", anno2: ["computionalmethods|2", "electromechanics|2", "electronics|2", "mechatronicsystemsandictinterconnectedelectricvehiclesengineering|2", "mechatronicsystemsandictlearningandcommunication|2", "thermo-mechanics|2"] },
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
    programme: "Musica e Spettacolo",
    sources: degreeSources("musica-e-spettacolo", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H57/LM-45 - M95/LM-65", anno2: ["musicologia|1", "spettacolo|1"] },
      { year: 2, corso: "H57/LM-45 - M95/LM-65", anno2: ["musicologia|2", "spettacolo|2"] },
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
    programme: "Psicologia e Salute Mentale nel Ciclo di Vita",
    sources: degreeSources("psicologia-e-salute-mentale-nel-ciclo-di-vita", "FacoltadiMedicina", [
      { year: 1, corso: "AB2", anno2: ["differenzeevariabilitaindividualinelledimensionicognitive-relazionali-socialiedigenere|1", "processipsicologicidisviluppo|1"] },
    ]),
  },
  {
    programme: "Psicologia Generale, dello Sviluppo, del Genere e del Comportamento Sociale",
    sources: degreeSources("psicologia-generale-dello-sviluppo-del-genere-e-del-comportamento-sociale", "", [
      { year: 1, corso: "Y44", anno2: ["comune|1"] },
      { year: 2, corso: "Y44", anno2: ["comune|2"] },
      { year: 3, corso: "Y44", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources("scienza-dei-materiali", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB1", anno2: ["comune|1"] },
      { year: 2, corso: "H10", anno2: ["comune|2"] },
      { year: 3, corso: "H10", anno2: ["comune|3"] },
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
    programme: "Scienze del Turismo",
    sources: degreeSources("scienze-del-turismo", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "AB8", anno2: ["aturismoculturale|1", "bgestionedelturismoedellospitalita|1", "cinnovationtourismformadeinitaly|1"] },
      { year: 2, corso: "AB8", anno2: ["aturismoculturale|2", "bgestionedelturismoedellospitalita|2", "csporteturismo|2"] },
      { year: 3, corso: "AB8", anno2: ["aturismoculturale|3", "bgestionedelturismoedellospitalita|3", "csporteturismo|3"] },
    ]),
  },
  {
    programme: "Scienze dell'Educazione e della Formazione",
    sources: degreeSources("scienze-dell-educazione-e-della-formazione", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "U06", anno2: ["comune|1"] },
      { year: 2, corso: "U06", anno2: ["comune|2"] },
      { year: 3, corso: "U06", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Scienze dell'Informazione, della Comunicazione e dell'Editoria",
    sources: degreeSources("scienze-dell-informazione-della-comunicazione-e-dell-editoria", "FacoltadiLettereeFilosofia", [
      { year: 2, corso: "L87", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources("scienze-della-comunicazione", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H48", anno2: ["comune|1"] },
      { year: 2, corso: "H48", anno2: ["comune|2"] },
      { year: 3, corso: "H48", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Scienze della Storia e del Documento",
    sources: degreeSources("scienze-della-storia-e-del-documento", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "U12", anno2: ["europeanhistory|1", "medioevoeuropeo|1", "publichistorydivulgazioneedidatticadellastoria|1", "storiaecultureglobali|1"] },
      { year: 2, corso: "U12", anno2: ["europeanhistory|2", "medioevoeuropeo|2", "publichistorydivulgazioneedidatticadellastoria|2", "storiaecultureglobali|2"] },
    ]),
  },
  {
    programme: "Scienze Pedagogiche",
    sources: degreeSources("scienze-pedagogiche", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "U07", anno2: ["comune|1"] },
      { year: 2, corso: "U07", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Storia dell'Arte",
    sources: degreeSources("storia-dell-arte", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "H62", anno2: ["comune|1"] },
      { year: 2, corso: "H62", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Tourism Strategy, Cultural Heritage and Made in Italy",
    sources: degreeSources("tourism-strategy-cultural-heritage-and-made-in-italy", "FacoltadiLettereeFilosofia", [
      { year: 1, corso: "AB9", anno2: ["e-tourism-heritageandmadeinitaly|1", "progettazioneegestionedelturismo|1"] },
      { year: 2, corso: "AB9", anno2: ["curriculumunico|2"] },
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
  links: [
    { label: "Delphi — Segreteria online", url: "https://delphi.uniroma2.it" },
    { label: "Portale di Ateneo", url: "https://web.uniroma2.it" },
  ],
};

