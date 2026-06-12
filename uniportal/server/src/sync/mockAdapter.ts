import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

/**
 * Adapter dati "sincronizzati" per lo sviluppo. In assenza di un IdP reale e
 * degli adapter di produzione (Esse3/Delphi…), popola la tabella SyncedData
 * con dati verosimili di esami, CFU e piano di studi, così la dashboard è
 * completa e navigabile. Idempotente: l'upsert per (userId, kind) si limita
 * ad aggiornare i blocchi esistenti.
 */

export interface MockExam {
  courseName: string;
  cfu: number;
  grade: string; // "28", "30L", "Idoneo"
  date: string; // ISO yyyy-mm-dd
}

export interface MockCfuSummary {
  acquired: number;
  total: number;
  average: number; // media ponderata su 30
  projected: string; // base di laurea proiettata, es. "101/110"
}

export interface MockPlanItem {
  courseName: string;
  cfu: number;
  year: number;
  status: "superato" | "in_corso" | "da_sostenere";
}

const ESAMI: MockExam[] = [
  { courseName: "Programmazione 1", cfu: 9, grade: "28", date: "2023-02-10" },
  { courseName: "Analisi Matematica 1", cfu: 12, grade: "25", date: "2023-06-20" },
  { courseName: "Architettura degli Elaboratori", cfu: 9, grade: "30L", date: "2023-09-05" },
  { courseName: "Programmazione 2", cfu: 9, grade: "27", date: "2024-02-12" },
  { courseName: "Basi di Dati", cfu: 9, grade: "30", date: "2024-06-18" },
  { courseName: "Calcolo delle Probabilità", cfu: 6, grade: "26", date: "2024-07-09" },
];

// Somma CFU sostenuti = 54; media ponderata ≈ 27,6/30 → base ≈ 101/110.
const CFU: MockCfuSummary = {
  acquired: 54,
  total: 180,
  average: 27.6,
  projected: "101/110",
};

const PIANO_STUDI: MockPlanItem[] = [
  { courseName: "Programmazione 1", cfu: 9, year: 1, status: "superato" },
  { courseName: "Analisi Matematica 1", cfu: 12, year: 1, status: "superato" },
  { courseName: "Architettura degli Elaboratori", cfu: 9, year: 1, status: "superato" },
  { courseName: "Programmazione 2", cfu: 9, year: 1, status: "superato" },
  { courseName: "Basi di Dati", cfu: 9, year: 2, status: "superato" },
  { courseName: "Calcolo delle Probabilità", cfu: 6, year: 2, status: "superato" },
  { courseName: "Algoritmi e Strutture Dati", cfu: 9, year: 2, status: "in_corso" },
  { courseName: "Sistemi Operativi", cfu: 9, year: 2, status: "in_corso" },
  { courseName: "Reti di Calcolatori", cfu: 9, year: 3, status: "da_sostenere" },
  { courseName: "Ingegneria del Software", cfu: 6, year: 3, status: "da_sostenere" },
  { courseName: "Intelligenza Artificiale", cfu: 9, year: 3, status: "da_sostenere" },
];

/** I blocchi che l'adapter scrive su SyncedData, uno per `kind`. Le strutture
 *  tipizzate vanno cast a `InputJsonValue` (Prisma non inferisce gli index
 *  signature dalle interfacce, pur essendo JSON validi). */
function mockBlocks(): { kind: string; payload: Prisma.InputJsonValue }[] {
  const json = (v: unknown) => v as Prisma.InputJsonValue;
  return [
    { kind: "esami", payload: json(ESAMI) },
    { kind: "cfu", payload: json(CFU) },
    { kind: "pianoStudi", payload: json(PIANO_STUDI) },
  ];
}

/** Popola/aggiorna i dati sincronizzati mock per un utente (idempotente). */
export async function seedMockSyncedData(userId: string): Promise<void> {
  for (const block of mockBlocks()) {
    await prisma.syncedData.upsert({
      where: { userId_kind: { userId, kind: block.kind } },
      update: { payload: block.payload, syncedAt: new Date() },
      create: { userId, kind: block.kind, payload: block.payload },
    });
  }
}
