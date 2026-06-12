/**
 * Adapter dati "sincronizzati da Delphi" per lo sviluppo (portato da
 * UniPortal/mockAdapter). Senza un IdP reale e senza l'API di segreteria,
 * restituisce 12 esami verosimili già nel formato del libretto di StudentOS
 * (source "delphi"), così il libretto e gli strumenti media/CFU si popolano
 * da soli. In produzione qui si interrogherebbe la carriera reale via matricola.
 */
import type { Grade, LibrettoEntry } from "@/lib/domain/types";
import type { SsoSession } from "./session";
import { stableId } from "@/lib/sync/util";

/** Studente fittizio per la dev-login (attributi come da Assertion SAML). */
export const MOCK_STUDENT: SsoSession = {
  matricola: "0000000",
  fullName: "Mario Rossi",
  email: "mario.rossi@students.uniroma2.eu",
  courseOfStudy: "Informatica (L-31)",
};

interface RawExam {
  courseName: string;
  cfu: number;
  /** Voto 18–30, "30L" per lode, "idoneo" per idoneità. */
  grade: string;
  date: string;
}

const RAW: RawExam[] = [
  { courseName: "Programmazione 1", cfu: 9, grade: "28", date: "2023-02-10" },
  { courseName: "Analisi Matematica 1", cfu: 12, grade: "25", date: "2023-06-20" },
  { courseName: "Architettura degli Elaboratori", cfu: 9, grade: "30L", date: "2023-09-05" },
  { courseName: "Matematica Discreta", cfu: 6, grade: "27", date: "2023-09-18" },
  { courseName: "Programmazione 2", cfu: 9, grade: "27", date: "2024-02-12" },
  { courseName: "Analisi Matematica 2", cfu: 9, grade: "24", date: "2024-02-22" },
  { courseName: "Fisica Generale", cfu: 9, grade: "26", date: "2024-06-10" },
  { courseName: "Basi di Dati", cfu: 9, grade: "30", date: "2024-06-18" },
  { courseName: "Calcolo delle Probabilità", cfu: 6, grade: "26", date: "2024-07-09" },
  { courseName: "Algoritmi e Strutture Dati", cfu: 9, grade: "29", date: "2024-09-12" },
  { courseName: "Lingua Inglese B2", cfu: 3, grade: "idoneo", date: "2024-09-20" },
  { courseName: "Sistemi Operativi", cfu: 9, grade: "28", date: "2025-02-14" },
];

function parseGrade(raw: string): Grade {
  const t = raw.toLowerCase().trim();
  if (/idone|idoneo|pass/.test(t)) return { kind: "pass" };
  const laude = /30\s*l|lode/.test(t);
  const value = Number.parseInt(t, 10);
  return { kind: "numeric", value, laude };
}

/** I 12 esami mock come righe di libretto (source "delphi"). */
export function mockLibretto(): LibrettoEntry[] {
  return RAW.map((e) => ({
    id: stableId("delphi", e.courseName, e.date),
    courseName: e.courseName,
    cfu: e.cfu,
    grade: parseGrade(e.grade),
    date: e.date,
    source: "delphi" as const,
  }));
}
