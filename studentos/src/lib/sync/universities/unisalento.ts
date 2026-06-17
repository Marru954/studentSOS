/**
 * Preset: Università del Salento (Lecce) — the WHOLE ateneo (auto-generated).
 *
 * Every degree below was enumerated from the public combo.php cascade and
 * verified live by driving the real easyacademy adapter end-to-end (grid_call /
 * test_call, non-empty `celle` / `Appelli`) on 2026-06-17. Codes captured by
 * GET, NEVER invented. Courses without verifiable timetable data stay manual
 * (ateneo-courses.ts). Per-course status is in _unisalento-economia_coverage.md.
 * Re-verify each September and bump ANNO.
 *
 * Base host: logistica.unisalento.it/PortaleStudenti (scuola is empty for every
 * corso — this instance keys the grid by corso+anno2 only). The 2025/26
 * ordinamento reform splits LB/LM/LMG degrees across a year-1 "<code>R" corso
 * and a year-2+ "<code>" base corso, each with its own curriculum-coded anno2.
 * The combo entry for the year-1 "R" corso often carries only a placeholder
 * "999|1", so the real year-1 anno2 were harvested from the degree's verified
 * curriculum codes and re-checked against the adapter.
 *
 * Exams are PER-DEGREE: the engineering / physics / maths / medicine corsi
 * expose easytest appelli (exams: true), while economics / humanities / social
 * corsi keep their exam calendar outside EasyAcademy — those ship timetable-only
 * (the `false` 6th arg to degreeSources). Wrong data is worse than none.
 */
import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "https://logistica.unisalento.it/PortaleStudenti";
const ANNO = "2025";

const livePrograms: LiveProgram[] = [
  {
    programme: "Aerospace Engineering",
    sources: degreeSources(BASE, ANNO, "aerospace-engineering", "", [
      { year: 1, corso: "LM52R", anno2: ["A258|1","A259|1"] },
      { year: 2, corso: "LM52", anno2: ["A258|2","A259|2"] },
    ]),
  },
  {
    programme: "Archeologia",
    sources: degreeSources(BASE, ANNO, "archeologia", "", [
      { year: 1, corso: "LM13R", anno2: ["PDS0-2010|1"] },
      { year: 2, corso: "LM13", anno2: ["PDS0-2010|2"] },
    ], false),
  },
  {
    programme: "Beni Culturali",
    sources: degreeSources(BASE, ANNO, "beni-culturali", "", [
      { year: 1, corso: "LB13R", anno2: ["A68|1","A177|1","A179|1","A60|1","A281|1"] },
      { year: 2, corso: "LB13", anno2: ["A68|2","A177|2","A179|2","A60|2","A69|2"] },
      { year: 3, corso: "LB13", anno2: ["A68|3","A177|3","A179|3","A60|3","A69|3"] },
    ], false),
  },
  {
    programme: "Biologia Sperimentale ed Applicata",
    sources: degreeSources(BASE, ANNO, "biologia-sperimentale-ed-applicata", "", [
      { year: 1, corso: "LM68R", anno2: ["999|1"] },
      { year: 2, corso: "LM68", anno2: ["A31|2","A32|2","A170|2","A33|2"] },
    ], false),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie", "", [
      { year: 1, corso: "LB01R", anno2: ["PDS0-2010|1"] },
      { year: 2, corso: "LB01", anno2: ["PDS0-2010|2"] },
      { year: 3, corso: "LB01", anno2: ["PDS0-2010|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Mediche e Nanobiotecnologie",
    sources: degreeSources(BASE, ANNO, "biotecnologie-mediche-e-nanobiotecnologie", "", [
      { year: 1, corso: "LM49R", anno2: ["PDS0-2010|1"] },
      { year: 2, corso: "LM49", anno2: ["A30|2","A39|2"] },
    ], false),
  },
  {
    programme: "Chimica per la Sostenibilità",
    sources: degreeSources(BASE, ANNO, "chimica-per-la-sostenibilita", "", [
      { year: 1, corso: "LB59", anno2: ["999|1"] },
      { year: 2, corso: "LB59", anno2: ["999|2"] },
    ]),
  },
  {
    programme: "Coastal and Marine Biology and Ecology (Biologia ed Ecologia Costiera e Marina)",
    sources: degreeSources(BASE, ANNO, "coastal-and-marine-biology-and-ecology-biologia-ed-ecologia-costiera-e-marina", "", [
      { year: 1, corso: "LM51R", anno2: ["169|1","168|1"] },
      { year: 2, corso: "LM51", anno2: ["169|2","168|2"] },
    ], false),
  },
  {
    programme: "Comunicazione, Media Digitali, Giornalismo",
    sources: degreeSources(BASE, ANNO, "comunicazione-media-digitali-giornalismo", "", [
      { year: 1, corso: "LM78R", anno2: ["A276|1","A277|1"] },
      { year: 2, corso: "LM78", anno2: ["000|2"] },
    ], false),
  },
  {
    programme: "Consulenza Pedagogica e Progettazione dei Processi Formativi",
    sources: degreeSources(BASE, ANNO, "consulenza-pedagogica-e-progettazione-dei-processi-formativi", "", [
      { year: 1, corso: "LM66R", anno2: ["999|1"] },
      { year: 2, corso: "LM66", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Data Science per le Scienze Umane e Sociali",
    sources: degreeSources(BASE, ANNO, "data-science-per-le-scienze-umane-e-sociali", "", [
      { year: 1, corso: "LM81R", anno2: ["999|1"] },
      { year: 2, corso: "LM81", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Digital Heritage",
    sources: degreeSources(BASE, ANNO, "digital-heritage", "", [
      { year: 1, corso: "LM85", anno2: ["993|1"] },
      { year: 2, corso: "LM85", anno2: ["993|2"] },
    ], false),
  },
  {
    programme: "Diritto e Management dello Sport",
    sources: degreeSources(BASE, ANNO, "diritto-e-management-dello-sport", "", [
      { year: 1, corso: "LB48R", anno2: ["A285|1","A284|1"] },
      { year: 2, corso: "LB48", anno2: ["999|2"] },
      { year: 3, corso: "LB48", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Diritto e Politiche per le Pubbliche Amministrazioni",
    sources: degreeSources(BASE, ANNO, "diritto-e-politiche-per-le-pubbliche-amministrazioni", "", [
      { year: 1, corso: "LB54R", anno2: ["999|1"] },
      { year: 2, corso: "LB54", anno2: ["999|2"] },
      { year: 3, corso: "LB54", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Discipline delle Arti, della Musica e dello Spettacolo (Dams)",
    sources: degreeSources(BASE, ANNO, "discipline-delle-arti-della-musica-e-dello-spettacolo-dams", "", [
      { year: 1, corso: "LB40R", anno2: ["999|1"] },
      { year: 2, corso: "LB40", anno2: ["999|2"] },
      { year: 3, corso: "LB40", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Economia Aziendale",
    sources: degreeSources(BASE, ANNO, "economia-aziendale", "", [
      { year: 1, corso: "LB05R", anno2: ["A-L|1","M-Z|1"] },
      { year: 2, corso: "LB05", anno2: ["A-L|2","M-Z|2"] },
      { year: 3, corso: "LB05", anno2: ["A207|3","A208|3","149|3"] },
    ], false),
  },
  {
    programme: "Economia e Finanza",
    sources: degreeSources(BASE, ANNO, "economia-e-finanza", "", [
      { year: 3, corso: "LB06", anno2: ["A80|3","A81|3"] },
    ], false),
  },
  {
    programme: "Economia Finanza e Assicurazioni",
    sources: degreeSources(BASE, ANNO, "economia-finanza-e-assicurazioni", "", [
      { year: 1, corso: "LM16R", anno2: ["A13|1","A12|1"] },
      { year: 2, corso: "LM16", anno2: ["A13|2","A12|2"] },
    ], false),
  },
  {
    programme: "Economia, Finanza e Innovazione",
    sources: degreeSources(BASE, ANNO, "economia-finanza-e-innovazione", "", [
      { year: 1, corso: "LB60R", anno2: ["999|1"] },
      { year: 2, corso: "LB60", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Educazione Sociale e Tecniche Dell'intervento Educativo",
    sources: degreeSources(BASE, ANNO, "educazione-sociale-e-tecniche-dell-intervento-educativo", "", [
      { year: 1, corso: "LB47R", anno2: ["999|1"] },
      { year: 2, corso: "LB47", anno2: ["999|2"] },
      { year: 3, corso: "LB47", anno2: ["A197|3","A196|3"] },
    ], false),
  },
  {
    programme: "Engineering for Safety of Critical Industrial and Civil Infrastructures",
    sources: degreeSources(BASE, ANNO, "engineering-for-safety-of-critical-industrial-and-civil-infrastructures", "", [
      { year: 1, corso: "LM80R", anno2: ["A282|1","A283|1"] },
      { year: 2, corso: "LM80", anno2: ["A234|2","A240|2","A233|2","A241|2"] },
    ]),
  },
  {
    programme: "Filosofia",
    sources: degreeSources(BASE, ANNO, "filosofia", "", [
      { year: 1, corso: "LB16R", anno2: ["031|1","A244|1"] },
      { year: 2, corso: "LB16", anno2: ["031|2","A244|2"] },
      { year: 3, corso: "LB16", anno2: ["031|3","A244|3"] },
    ], false),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources(BASE, ANNO, "fisica-magistrale", "", [
      { year: 1, corso: "LM38R", anno2: ["A219|1","A220|1","081|1"] },
      { year: 2, corso: "LM38", anno2: ["A219|2","081|2","A220|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources(BASE, ANNO, "fisica-triennale", "", [
      { year: 1, corso: "LB23R", anno2: ["999|1"] },
      { year: 2, corso: "LB23", anno2: ["999|2"] },
      { year: 3, corso: "LB23", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Fisica Medica",
    sources: degreeSources(BASE, ANNO, "fisica-medica", "", [
      { year: 1, corso: "LM87", anno2: ["999|1"] },
    ]),
  },
  {
    programme: "Gestione delle Attivita' Turistiche e Culturali",
    sources: degreeSources(BASE, ANNO, "gestione-delle-attivita-turistiche-e-culturali", "", [
      { year: 2, corso: "LM02", anno2: ["PDS0-2010|2"] },
    ], false),
  },
  {
    programme: "Giurisprudenza",
    sources: degreeSources(BASE, ANNO, "giurisprudenza", "", [
      { year: 1, corso: "LMG2R", anno2: ["999|1"] },
      { year: 2, corso: "LMG2", anno2: ["999|2"] },
      { year: 3, corso: "LMG2", anno2: ["A73|3","031|3","A74|3"] },
      { year: 4, corso: "LMG2", anno2: ["A73|4","031|4","A74|4"] },
      { year: 5, corso: "LMG2", anno2: ["A73|5","031|5","A74|5"] },
    ], false),
  },
  {
    programme: "Governance Euro-Mediterranea delle Politiche Migratorie",
    sources: degreeSources(BASE, ANNO, "governance-euro-mediterranea-delle-politiche-migratorie", "", [
      { year: 1, corso: "LM67R", anno2: ["999|1"] },
      { year: 2, corso: "LM67", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Infermieristica (Abilitante alla Professione Sanitaria di Infermiere)",
    sources: degreeSources(BASE, ANNO, "infermieristica-abilitante-alla-professione-sanitaria-di-infermiere", "", [
      { year: 1, corso: "LB51T", anno2: ["999|1"] },
      { year: 2, corso: "LB51", anno2: ["A231|2","A230|2"] },
      { year: 3, corso: "LB51", anno2: ["A231|3","A230|3"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-magistrale", "", [
      { year: 1, corso: "LM79R", anno2: ["A228|1","A229|1"] },
      { year: 2, corso: "LM79", anno2: ["A228|2","A229|2"] },
    ]),
  },
  {
    programme: "Ingegneria Biomedica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-biomedica-triennale", "", [
      { year: 1, corso: "LB49R", anno2: ["999|1"] },
      { year: 2, corso: "LB49", anno2: ["A210|2","A211|2"] },
      { year: 3, corso: "LB49", anno2: ["A210|3","A211|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-magistrale", "", [
      { year: 1, corso: "LM03R", anno2: ["A257|1","A256|1"] },
      { year: 2, corso: "LM03", anno2: ["A257|2","A256|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-civile-triennale", "", [
      { year: 1, corso: "LB07R", anno2: ["999|1"] },
      { year: 2, corso: "LB07", anno2: ["999|2"] },
      { year: 3, corso: "LB07", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Ingegneria dei Materiali e Nanotecnologie",
    sources: degreeSources(BASE, ANNO, "ingegneria-dei-materiali-e-nanotecnologie", "", [
      { year: 1, corso: "LM76R", anno2: ["A243|1","A242|1"] },
      { year: 2, corso: "LM76", anno2: ["A243|2","A242|2"] },
    ]),
  },
  {
    programme: "Ingegneria Dell' Informazione: Elettronica, Informatica e Telecomunicazioni",
    sources: degreeSources(BASE, ANNO, "ingegneria-dell-informazione-elettronica-informatica-e-telecomunicazioni", "", [
      { year: 1, corso: "LB56R", anno2: ["999|1"] },
      { year: 2, corso: "LB56", anno2: ["A237|2","A239|2","A238|2"] },
      { year: 3, corso: "LB56", anno2: ["A237|3","A239|3","A238|3"] },
    ]),
  },
  {
    programme: "Ingegneria delle Telecomunicazioni e delle Tecnologie Elettroniche",
    sources: degreeSources(BASE, ANNO, "ingegneria-delle-telecomunicazioni-e-delle-tecnologie-elettroniche", "", [
      { year: 1, corso: "LM65R", anno2: ["A180|1","A181|1"] },
      { year: 2, corso: "LM65", anno2: ["A180|2","A181|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "ingegneria-gestionale", "", [
      { year: 1, corso: "LB61", anno2: ["999|1"] },
    ]),
  },
  {
    programme: "Ingegneria Industriale",
    sources: degreeSources(BASE, ANNO, "ingegneria-industriale", "", [
      { year: 1, corso: "LB09R", anno2: ["999|1"] },
      { year: 2, corso: "LB09", anno2: ["A221|2","A223|2","A224|2","A225|2"] },
      { year: 3, corso: "LB09", anno2: ["A221|3","A223|3","A224|3","A225|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-magistrale", "", [
      { year: 1, corso: "LM75R", anno2: ["999|1"] },
      { year: 2, corso: "LM75", anno2: ["999|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources(BASE, ANNO, "ingegneria-informatica-triennale", "", [
      { year: 1, corso: "LB55R", anno2: ["999|1"] },
      { year: 2, corso: "LB55", anno2: ["999|2"] },
      { year: 3, corso: "LB55", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica",
    sources: degreeSources(BASE, ANNO, "ingegneria-meccanica", "", [
      { year: 1, corso: "LM07R", anno2: ["A88|1","A87|1","A43|1"] },
      { year: 2, corso: "LM07", anno2: ["A88|2","A87|2","A43|2"] },
    ]),
  },
  {
    programme: "Ingegneria per L'industria Sostenibile",
    sources: degreeSources(BASE, ANNO, "ingegneria-per-l-industria-sostenibile", "", [
      { year: 1, corso: "LB52R", anno2: ["999|1"] },
      { year: 2, corso: "LB52", anno2: ["A212|2","A213|2","A214|2"] },
      { year: 3, corso: "LB52", anno2: ["A212|3","A213|3","A214|3"] },
    ]),
  },
  {
    programme: "Lettere",
    sources: degreeSources(BASE, ANNO, "lettere", "", [
      { year: 1, corso: "LB11R", anno2: ["031|1","A206|1","005|1"] },
      { year: 2, corso: "LB11", anno2: ["031|2","A206|2","005|2"] },
      { year: 3, corso: "LB11", anno2: ["031|3","A206|3","005|3"] },
    ], false),
  },
  {
    programme: "Lettere Classiche",
    sources: degreeSources(BASE, ANNO, "lettere-classiche", "", [
      { year: 1, corso: "LM11R", anno2: ["999|1"] },
      { year: 2, corso: "LM11", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Lettere Moderne",
    sources: degreeSources(BASE, ANNO, "lettere-moderne", "", [
      { year: 1, corso: "LM10R", anno2: ["A270|1","A269|1"] },
      { year: 2, corso: "LM10", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Lingue Moderne, Letterature e Traduzione",
    sources: degreeSources(BASE, ANNO, "lingue-moderne-letterature-e-traduzione", "", [
      { year: 1, corso: "LM57R", anno2: ["A189|1","A268|1","A188|1"] },
      { year: 2, corso: "LM57", anno2: ["A189|2","A188|2"] },
    ], false),
  },
  {
    programme: "Lingue, Culture e Letterature Straniere",
    sources: degreeSources(BASE, ANNO, "lingue-culture-e-letterature-straniere", "", [
      { year: 1, corso: "LB38R", anno2: ["999|1"] },
      { year: 2, corso: "LB38", anno2: ["999|2"] },
      { year: 3, corso: "LB38", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Management Aziendale",
    sources: degreeSources(BASE, ANNO, "management-aziendale", "", [
      { year: 1, corso: "LM01R", anno2: ["A278|1","A280|1","A279|1"] },
      { year: 2, corso: "LM01", anno2: ["A209|2","A90|2","A72|2"] },
    ], false),
  },
  {
    programme: "Management dei Territori, delle Aziende Pubbliche e del Turismo",
    sources: degreeSources(BASE, ANNO, "management-dei-territori-delle-aziende-pubbliche-e-del-turismo", "", [
      { year: 1, corso: "LM88", anno2: ["A260|1","A261|1"] },
    ], false),
  },
  {
    programme: "Management delle Organizzazioni Turistiche",
    sources: degreeSources(BASE, ANNO, "management-delle-organizzazioni-turistiche", "", [
      { year: 1, corso: "LB53R", anno2: ["999|1"] },
      { year: 2, corso: "LB53", anno2: ["999|2"] },
      { year: 3, corso: "LB53", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Management Digitale",
    sources: degreeSources(BASE, ANNO, "management-digitale", "", [
      { year: 1, corso: "LB46R", anno2: ["000|1"] },
      { year: 2, corso: "LB46", anno2: ["000|2"] },
      { year: 3, corso: "LB46", anno2: ["A95|3","A94|3"] },
    ], false),
  },
  {
    programme: "Management Engineering - Ingegneria Gestionale",
    sources: degreeSources(BASE, ANNO, "management-engineering-ingegneria-gestionale", "", [
      { year: 1, corso: "LM54R", anno2: ["A253|1","A252|1"] },
      { year: 2, corso: "LM54", anno2: ["A253|2","A252|2"] },
    ]),
  },
  {
    programme: "Matematica (magistrale)",
    sources: degreeSources(BASE, ANNO, "matematica-magistrale", "", [
      { year: 1, corso: "LM39R", anno2: ["A218|1","A227|1","A217|1"] },
      { year: 2, corso: "LM39", anno2: ["A218|2","A227|2","A217|2"] },
    ]),
  },
  {
    programme: "Matematica (triennale)",
    sources: degreeSources(BASE, ANNO, "matematica-triennale", "", [
      { year: 1, corso: "LB04R", anno2: ["999|1"] },
      { year: 2, corso: "LB04", anno2: ["999|2"] },
      { year: 3, corso: "LB04", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Medicina e Chirurgia",
    sources: degreeSources(BASE, ANNO, "medicina-e-chirurgia", "", [
      { year: 1, corso: "LM73R", anno2: ["999|1"] },
      { year: 2, corso: "LM73", anno2: ["999|2"] },
      { year: 3, corso: "LM73", anno2: ["999|3"] },
      { year: 4, corso: "LM73", anno2: ["999|4"] },
      { year: 5, corso: "LM73", anno2: ["999|5"] },
    ]),
  },
  {
    programme: "Ottica e Optometria",
    sources: degreeSources(BASE, ANNO, "ottica-e-optometria", "", [
      { year: 1, corso: "LB24R", anno2: ["PDS0-2010|1"] },
      { year: 2, corso: "LB24", anno2: ["PDS0-2010|2"] },
      { year: 3, corso: "LB24", anno2: ["PDS0-2010|3"] },
    ]),
  },
  {
    programme: "Progettazione e Gestione delle Politiche e dei Servizi Sociali",
    sources: degreeSources(BASE, ANNO, "progettazione-e-gestione-delle-politiche-e-dei-servizi-sociali", "", [
      { year: 1, corso: "LM42R", anno2: ["A199|1","A200|1"] },
      { year: 2, corso: "LM42", anno2: ["A199|2","A200|2"] },
    ], false),
  },
  {
    programme: "Psicologia Dell'intervento Nei Contesti Relazionali e Sociali",
    sources: degreeSources(BASE, ANNO, "psicologia-dell-intervento-nei-contesti-relazionali-e-sociali", "", [
      { year: 1, corso: "LM84R", anno2: ["999|1"] },
      { year: 2, corso: "LM84", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Scienza e Tecnica della Mediazione Linguistica",
    sources: degreeSources(BASE, ANNO, "scienza-e-tecnica-della-mediazione-linguistica", "", [
      { year: 1, corso: "LB19R", anno2: ["A191|1","A190|1","A245|1"] },
      { year: 2, corso: "LB19", anno2: ["A191|2","A190|2","A245|2"] },
      { year: 3, corso: "LB19", anno2: ["A191|3","A190|3","A245|3"] },
    ]),
  },
  {
    programme: "Scienza e Tecniche Psicologiche",
    sources: degreeSources(BASE, ANNO, "scienza-e-tecniche-psicologiche", "", [
      { year: 1, corso: "LB58R", anno2: ["PDS0-2010|1"] },
      { year: 2, corso: "LB58", anno2: ["PDS0-2010|2"] },
      { year: 3, corso: "LB58", anno2: ["PDS0-2010|3"] },
    ], false),
  },
  {
    programme: "Scienze Ambientali",
    sources: degreeSources(BASE, ANNO, "scienze-ambientali", "", [
      { year: 1, corso: "LM60R", anno2: ["A185|1","A184|1"] },
      { year: 2, corso: "LM60", anno2: ["A185|2","A184|2"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources(BASE, ANNO, "scienze-biologiche", "", [
      { year: 1, corso: "LB02R", anno2: ["PDS0-2008|1"] },
      { year: 2, corso: "LB02", anno2: ["PDS0-2008|2"] },
      { year: 3, corso: "LB02", anno2: ["PDS0-2008|3"] },
    ], false),
  },
  {
    programme: "Scienze della Comunicazione",
    sources: degreeSources(BASE, ANNO, "scienze-della-comunicazione", "", [
      { year: 1, corso: "LB36R", anno2: ["999|1"] },
      { year: 2, corso: "LB36", anno2: ["999|2"] },
      { year: 3, corso: "LB36", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Scienze della Formazione Primaria",
    sources: degreeSources(BASE, ANNO, "scienze-della-formazione-primaria", "", [
      { year: 1, corso: "LM63", anno2: ["000|1"] },
      { year: 2, corso: "LM63", anno2: ["000|2"] },
      { year: 3, corso: "LM63", anno2: ["000|3"] },
      { year: 4, corso: "LM63", anno2: ["000|4"] },
      { year: 5, corso: "LM63", anno2: ["000|5"] },
    ], false),
  },
  {
    programme: "Scienze dello Spettacolo e della Produzione Audiovisiva",
    sources: degreeSources(BASE, ANNO, "scienze-dello-spettacolo-e-della-produzione-audiovisiva", "", [
      { year: 1, corso: "LM77R", anno2: ["993|1"] },
      { year: 2, corso: "LM77", anno2: ["993|2"] },
    ], false),
  },
  {
    programme: "Scienze e Tecniche delle Attivita' Motorie Preventive e Adattate",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecniche-delle-attivita-motorie-preventive-e-adattate", "", [
      { year: 1, corso: "LM82R", anno2: ["999|1"] },
      { year: 2, corso: "LM82", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Scienze e Tecnologie per L'ambiente",
    sources: degreeSources(BASE, ANNO, "scienze-e-tecnologie-per-l-ambiente", "", [
      { year: 1, corso: "LB03R", anno2: ["999|1"] },
      { year: 2, corso: "LB03", anno2: ["999|2"] },
      { year: 3, corso: "LB03", anno2: ["999|3"] },
    ]),
  },
  {
    programme: "Scienze Filosofiche",
    sources: degreeSources(BASE, ANNO, "scienze-filosofiche", "", [
      { year: 1, corso: "LM30R", anno2: ["031|1","A266|1","A244|1","A67|1","A66|1"] },
      { year: 2, corso: "LM30", anno2: ["031|2","A244|2","A67|2","A66|2"] },
    ], false),
  },
  {
    programme: "Scienze Infermieristiche e Ostetriche",
    sources: degreeSources(BASE, ANNO, "scienze-infermieristiche-e-ostetriche", "", [
      { year: 1, corso: "LM86", anno2: ["000|1"] },
    ]),
  },
  {
    programme: "Scienze Motorie e dello Sport",
    sources: degreeSources(BASE, ANNO, "scienze-motorie-e-dello-sport", "", [
      { year: 1, corso: "LB57R", anno2: ["999|1"] },
      { year: 2, corso: "LB57", anno2: ["999|2"] },
      { year: 3, corso: "LB57", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Scienze per la Cooperazione Internazionale",
    sources: degreeSources(BASE, ANNO, "scienze-per-la-cooperazione-internazionale", "", [
      { year: 1, corso: "LM72R", anno2: ["999|1"] },
      { year: 2, corso: "LM72", anno2: ["A173|2","A172|2"] },
    ], false),
  },
  {
    programme: "Scienze Politiche e delle Relazioni Internazionali",
    sources: degreeSources(BASE, ANNO, "scienze-politiche-e-delle-relazioni-internazionali", "", [
      { year: 1, corso: "LB17R", anno2: ["999|1"] },
      { year: 2, corso: "LB17", anno2: ["999|2"] },
      { year: 3, corso: "LB17", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources(BASE, ANNO, "semestre-filtro", "", [
      { year: 1, corso: "SFMC", anno2: ["000|1"] },
    ], false),
  },
  {
    programme: "Servizio Sociale",
    sources: degreeSources(BASE, ANNO, "servizio-sociale", "", [
      { year: 1, corso: "LB27R", anno2: ["999|1"] },
      { year: 2, corso: "LB27", anno2: ["999|2"] },
      { year: 3, corso: "LB27", anno2: ["999|3"] },
    ], false),
  },
  {
    programme: "Sociologia",
    sources: degreeSources(BASE, ANNO, "sociologia", "", [
      { year: 1, corso: "LB26R", anno2: ["145|1","A104|1"] },
      { year: 2, corso: "LB26", anno2: ["145|2","A104|2"] },
      { year: 3, corso: "LB26", anno2: ["145|3","A104|3"] },
    ], false),
  },
  {
    programme: "Sociologia e Ricerca Sociale",
    sources: degreeSources(BASE, ANNO, "sociologia-e-ricerca-sociale", "", [
      { year: 1, corso: "LM83R", anno2: ["A192|1","A194|1","A193|1"] },
      { year: 2, corso: "LM83", anno2: ["A192|2","A194|2","A193|2"] },
    ], false),
  },
  {
    programme: "Storia Dell'arte",
    sources: degreeSources(BASE, ANNO, "storia-dell-arte", "", [
      { year: 1, corso: "LM14R", anno2: ["999|1"] },
      { year: 2, corso: "LM14", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Studi Geopolitici e Internazionali",
    sources: degreeSources(BASE, ANNO, "studi-geopolitici-e-internazionali", "", [
      { year: 1, corso: "LM59R", anno2: ["999|1"] },
      { year: 2, corso: "LM59", anno2: ["999|2"] },
    ], false),
  },
  {
    programme: "Sviluppo Sostenibile e Cambiamenti Climatici",
    sources: degreeSources(BASE, ANNO, "sviluppo-sostenibile-e-cambiamenti-climatici", "", [
      { year: 3, corso: "LB50", anno2: ["A175|3","A174|3","A176|3"] },
    ], false),
  },
  {
    programme: "Traduzione Tecnico-Scientifica e Interpretariato",
    sources: degreeSources(BASE, ANNO, "traduzione-tecnico-scientifica-e-interpretariato", "", [
      { year: 1, corso: "LM33R", anno2: ["A205|1","A97|1","A98|1"] },
      { year: 2, corso: "LM33", anno2: ["A98|2"] },
    ], false),
  },
  {
    programme: "Viticoltura ed Enologia",
    sources: degreeSources(BASE, ANNO, "viticoltura-ed-enologia", "", [
      { year: 1, corso: "LB42R", anno2: ["999|1"] },
      { year: 2, corso: "LB42", anno2: ["999|2"] },
      { year: 3, corso: "LB42", anno2: ["999|3"] },
    ], false),
  },
];

export const unisalento: UniversityPreset = {
  id: "unisalento-economia",
  name: "Università del Salento",
  shortName: "UniSalento",
  city: "Lecce",
  programme: "Economia Aziendale",
  liveSources: true,
  sources: [],
  livePrograms,
};
