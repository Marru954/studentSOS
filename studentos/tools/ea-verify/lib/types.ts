/** Tipi condivisi da ea-verify. Nessuna dipendenza da rete o da React. */

export interface ComboCourse {
  /** Codice corso (parametro `corso` di grid_call / `cdl` di test_call). */
  valore: string;
  label: string;
  tipo: string;
  /** Codice scuola del combo; puo' essere vuoto (es. Salerno, Federico II). */
  scuola: string;
  facoltaId: string;
  /** Valori `anno2` offerti dal combo, es. "GEN|1", "PDS0-2026|2". */
  anni: string[];
}

export type Flag =
  | "NO_CELLS"
  | "PARTIAL"
  | "CODE_MISSING_IN_COMBO"
  | "ANNO2_STALE"
  | "NAME_MISMATCH"
  | "COMBO_EMPTY"
  | "EXAMS_EMPTY_ARRAY_RISK"
  | "SCUOLA_NOT_IN_COMBO"
  | "NET_ERROR";

export interface SourceRecord {
  id: string;
  programme: string;
  kind: "timetable" | "exams";
  year: number;
  scuola: string;
  corso: string;
  anno2: string[];
  /** Celle per settimana (timetable); -1 = errore di rete. Vuoto per gli esami. */
  weeks: number[];
  total: number;
  weeksWithCells: number;
  /** Appelli nella finestra esami (solo kind=exams); -1 = errore. */
  appelli?: number;
  live: boolean;
  flags: Flag[];
}

export interface SnapshotParams {
  aa: string;
  from: string;
  to: string;
  examFrom: string;
  examTo: string;
  weeks: string[];
}

export interface Snapshot {
  tool: "ea-verify";
  version: 1;
  presetId: string;
  generatedAt: string;
  params: SnapshotParams;
  /** Host+percorso base SENZA schema (l'URL completo si ricostruisce dal preset). */
  baseHost: string;
  combo: { status: "ok" | "empty" | "error"; count: number; entries: ComboCourse[] };
  presetFlags: Flag[];
  sources: SourceRecord[];
}

/** Anno di un programma come lo vede il preset (uno per anno-sorgente). */
export interface YearModel {
  year: number;
  scuola: string;
  corso: string;
  anno2: string[];
}

export interface ProgramModel {
  programme: string;
  slug: string;
  hasExams: boolean;
  /** true se il programma ha una forma non generata da degreeSources (ID bare, news...). */
  special: boolean;
  years: YearModel[];
}

export type YearAction = "kept" | "refreshed" | "recaptured" | "removed" | "ambiguous";

export interface YearPlan {
  year: number;
  action: YearAction;
  /** Codici originali (per il ripristino). */
  old: YearModel;
  /** Codici finali (assenti se rimosso). */
  next?: YearModel;
  celle?: number;
  appelli?: number;
  reason?: string;
  via?: string;
}

export interface ProgramPlan {
  programme: string;
  slug: string;
  special: boolean;
  hadExams: boolean;
  wantExams: boolean;
  years: YearPlan[];
}

export interface Plan {
  presetId: string;
  aa: string;
  date: string;
  comboEmpty: boolean;
  /** true se il preset deve passare a modalita' manuale (combo vuoto o 0 anni live). */
  toManual: boolean;
  programs: ProgramPlan[];
}
