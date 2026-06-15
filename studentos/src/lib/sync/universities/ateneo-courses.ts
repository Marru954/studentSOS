/**
 * Real degree-course catalogues per live ateneo, captured via the public
 * EasyAcademy combo cascade (combo.php?sw=ec_&aa=2025&page=corsi) on 2026-06-15
 * and cleaned (title-cased, per-year splits merged, deduped).
 *
 * Used only to populate the onboarding course picker so every live ateneo shows
 * its full course list — NOT sync config. A course here activates the live sync
 * only when it equals the verified live programme (preset.programme, placed first
 * by coursesFor); every other course runs in manual mode.
 */
export const ATENEO_COURSES: Record<string, string[]> = {
  "uniroma2-informatica-triennale": ["Biologia Ambientale", "Biologia Cellulare e Molecolare e Scienze Biomediche", "Business Administration and Economics", "Business Administration-Gestione D'impresa", "Diritto, Innovazione Tecnologica e Sostenibilità", "Economia dei Mercati e degli Intermediari Finanziari", "Economia e Finanza", "Economia e Management", "Economics - Economia", "European Economy and Business Law", "Finance and Banking - Finanza e Banca", "Giurisprudenza", "Global Governance", "Scienze dell'Amministrazione e delle Relazioni Internazionali", "Specializzazione per Sostegno Infanzia", "Specializzazione per Sostegno Primaria", "Specializzazione per Sostegno Secondaria Primo Grado", "Specializzazione per Sostegno Secondaria Secondo Grado"],
  "units-ingegneria-informatica": [],
  "unipg-informatica": ["Civil Engineering", "Design", "Engineering Management", "Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista)", "Infermieristica (abilitante alla Professione Sanitaria di Infermiere)", "Ingegneria Ambientale per lo Sviluppo Sostenibile e la Tutela del Territorio", "Ingegneria Civile", "Ingegneria Civile e Ambientale", "Ingegneria dei Materiali e dei Processi Sostenibili", "Ingegneria della Sicurezza per il Territorio e il Costruito", "Ingegneria Edile-architettura", "Ingegneria Elettronica", "Ingegneria Elettronica per L'internet-of-things", "Ingegneria Industriale", "Ingegneria Informatica e Robotica", "Ingegneria Informatica ed Elettronica", "Ingegneria Meccanica", "Ingegneria per L'ambiente e il Territorio", "Logopedia (abilitante alla Professione Sanitaria di Logopedista)", "Medicina e Chirurgia", "Odontoiatria e Protesi Dentaria", "Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o)", "Planet Life Design", "Scienze Biotecnologiche Mediche, Veterinarie e Forensi", "Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate", "Scienze Infermieristiche e Ostetriche", "Scienze Motorie e Sportive", "Scienze Riabilitative delle Professioni Sanitarie", "Semestre Filtro", "Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro)", "Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico)", "Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica)", "Tecniche Digitali per la Gestione Sostenibile delle Costruzioni, Dell?ambiente e del Territorio"],
  "unica-informatica": ["Discipline Letterarie Nell'istruzione Secondaria di i e Ii Grado"],
  "unitn-informatica": ["School of Innovation"],
  "unina-informatica": ["Archeologia del Mediterraneo", "Archeologia e Storia Dell'arte", "Archeologia, Storia delle Arti e Scienze del Patrimonio Culturale", "Biology for One-health", "Biology of Extreme Environments", "Coordinamento dei Servizi Educativi per la Prima Infanzia e per il Disagio Sociale", "Discipline della Musica e dello Spettacolo. Storia e Teoria", "Economia Aziendale", "Economia delle Imprese Finanziarie", "Economia e Commercio", "Economia e Finanza", "Economics and Finance", "Filologia Moderna", "Filologia, Letterature e Civilta' del Mondo Antico", "Filosofia", "Finanza", "Fisica", "Geoscienze per L'ambiente, le Risorse e i Rischi Naturali", "Gestione dei Sistemi Aerospaziali per la Difesa", "Gestione delle Politiche e dei Servizi Sociali", "Giurisprudenza", "Hospitality Management", "Ingegneria Navale Interateneo Livorno", "Innovation and International Management", "International Relations", "Lettere Classiche", "Lettere Moderne", "Lingue e Letterature per il Plurilinguismo Europeo", "Lingue, Culture e Letterature Moderne Europee", "Management del Patrimonio Culturale", "Mathematical Engineering", "Patrimonio Culturale, Storia delle Arti e Museologia", "Psicologia Clinica e degli Interventi Nei Contesti Sociali e dello Sviluppo", "Relazioni Internazionali ed Analisi di Scenario", "Relazioni Internazionali, Studi Sull'integrazione Europea e per la Sostenibilità", "Scienze Criminologiche, Investigative e di Contrasto Ai Crimini Informatici", "Scienze dei Servizi Giuridici", "Scienze dei Sistemi Aerospaziali per la Difesa", "Scienze del Servizio Sociale", "Scienze del Turismo Ad Indirizzo Manageriale", "Scienze Dell'amministrazione e Dell'organizzazione", "Scienze della Pubblica Amministrazione e del Lavoro", "Scienze e Tecniche Psicologiche", "Scienze Geologiche", "Scienze Politiche", "Scienze Statistiche per le Decisioni", "Scienze Storiche", "Servizio Sociale", "Statistica e Tecnologie per L'analisi dei Dati", "Statistica per L'impresa e la Societa'", "Storia", "Volcanology"],
  "unife-informatica": ["4P - Postgraduate Program for Proficiency in Periodontology", "FISIOTERAPIA (abilitante alla Professione Sanitaria di Fisioterapista) - SEDE BOLZANO", "Giurisprudenza", "Giurisprudenza (sede di Rovigo)", "Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Sede di Adria", "INFERMIERISTICA (abilitante alla Professione Sanitaria di Infermiere) - SEDE DI PIEVE DI CENTO", "Medicina e Chirurgia - Sede di Cotignola", "Scienze Giuridiche della Sicurezza e della Prevenzione"],
  "unipr-informatica": [],
  "unisa-informatica": ["Pro3"],
  "uniss-ingegneria-informatica": [],
  "unifi-informatica": ["Scienze delle Professioni Sanitarie della Prevenzione", "Scienze delle Professioni Sanitarie Tecniche Diagnostiche"],
  "unige-informatica": [],
  "uniupo-informatica": ["Disaster and Health Crisis Management", "Lettere - Alessandria"],
  "unistrasi-mediazione": [],
};

/** The course list for a live ateneo with its verified live programme first
 *  (so onboarding can mark it), the rest of the real catalogue after. */
export function coursesFor(presetId: string, liveProgramme: string): string[] {
  const catalogue = ATENEO_COURSES[presetId] ?? [];
  const lower = liveProgramme.trim().toLowerCase();
  const rest = catalogue.filter((c) => c.trim().toLowerCase() !== lower);
  return [liveProgramme, ...rest];
}
