/**
 * Presets for the major Italian universities.
 *
 * These ship WITHOUT live sync sources: each university's timetable/exam
 * endpoints differ (EasyAcademy vs UniWeb vs Esse3 vs custom) and must be
 * verified one by one. Until a preset is wired (`liveSources: true`, see
 * uniroma2-informatica), the app runs in MANUAL mode for it: the student adds
 * the libretto by hand or imports the career PDF from their own portal — no
 * credentials, fully offline. Onboarding still tailors year/course/CFU.
 */
import type { UniversityPreset } from "../provider";

/** A broad, generic course list for the onboarding "corso" step. */
const COMMON_PROGRAMMES = [
  "Informatica",
  "Ingegneria Informatica",
  "Ingegneria",
  "Economia",
  "Giurisprudenza",
  "Medicina e Chirurgia",
  "Lettere e Filosofia",
  "Scienze Politiche",
  "Matematica",
  "Fisica",
  "Psicologia",
  "Biologia",
];

interface Ateneo {
  id: string;
  name: string;
  shortName: string;
  city: string;
  programmes?: string[];
}

const ATENEI: Ateneo[] = [
  { id: "uniroma1-sapienza", name: "Sapienza Università di Roma", shortName: "La Sapienza", city: "Roma" },
  { id: "unibo", name: "Alma Mater Studiorum — Università di Bologna", shortName: "Università di Bologna", city: "Bologna" },
  { id: "polimi", name: "Politecnico di Milano", shortName: "Politecnico di Milano", city: "Milano", programmes: ["Ingegneria Informatica", "Ingegneria", "Architettura", "Design", "Matematica", "Fisica"] },
  { id: "polito", name: "Politecnico di Torino", shortName: "Politecnico di Torino", city: "Torino", programmes: ["Ingegneria Informatica", "Ingegneria", "Architettura", "Design", "Matematica", "Fisica"] },
  { id: "unipd", name: "Università degli Studi di Padova", shortName: "Università di Padova", city: "Padova" },
  { id: "unisi", name: "Università degli Studi di Siena", shortName: "Università di Siena", city: "Siena" },
  { id: "unifi", name: "Università degli Studi di Firenze", shortName: "Università di Firenze", city: "Firenze" },
  { id: "unipi", name: "Università di Pisa", shortName: "Università di Pisa", city: "Pisa" },
  { id: "unina-federico2", name: "Università degli Studi di Napoli Federico II", shortName: "Federico II", city: "Napoli" },
  { id: "unimi-statale", name: "Università degli Studi di Milano", shortName: "Statale di Milano", city: "Milano" },
  { id: "unito", name: "Università degli Studi di Torino", shortName: "Università di Torino", city: "Torino" },
  { id: "unitn", name: "Università degli Studi di Trento", shortName: "Università di Trento", city: "Trento" },
  { id: "unive-cafoscari", name: "Università Ca' Foscari Venezia", shortName: "Ca' Foscari", city: "Venezia", programmes: ["Economia", "Lingue", "Lettere e Filosofia", "Informatica", "Scienze Ambientali"] },
  { id: "unibocconi", name: "Università Commerciale Luigi Bocconi", shortName: "Bocconi", city: "Milano", programmes: ["Economia", "Management", "Finanza", "Scienze Politiche", "Data Science"] },
  { id: "unipv", name: "Università degli Studi di Pavia", shortName: "Università di Pavia", city: "Pavia" },
  { id: "unige", name: "Università degli Studi di Genova", shortName: "Università di Genova", city: "Genova" },
];

export const italianAtenei: UniversityPreset[] = ATENEI.map((a) => ({
  id: a.id,
  name: a.name,
  shortName: a.shortName,
  city: a.city,
  programmes: a.programmes ?? COMMON_PROGRAMMES,
  liveSources: false,
  sources: [],
}));
