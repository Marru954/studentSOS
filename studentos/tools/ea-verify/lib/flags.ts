import type { ComboCourse, Flag } from "./types";
import { valoriForYear } from "./combo";
import { nameSimilarity, NAME_MISMATCH_THRESHOLD } from "./match";

export interface WeekVerdict {
  total: number;
  weeksWithCells: number;
  live: boolean;
  flags: Flag[];
}

/** Regola live: celle > 0 in almeno una settimana della finestra. */
export function classifyWeeks(weeks: number[]): WeekVerdict {
  const cells = weeks.map((n) => (n > 0 ? n : 0));
  const total = cells.reduce((a, b) => a + b, 0);
  const weeksWithCells = cells.filter((n) => n > 0).length;
  const flags: Flag[] = [];
  if (weeks.some((n) => n < 0)) flags.push("NET_ERROR");
  if (weeksWithCells === 0) {
    flags.push("NO_CELLS");
  } else {
    const first = cells.findIndex((n) => n > 0);
    const after = cells.slice(first);
    const share = after.filter((n) => n > 0).length / after.length;
    const collapsed = after.length >= 4 && after.slice(-3).every((n) => n === 0);
    if (share < 0.5 || collapsed) flags.push("PARTIAL");
  }
  return { total, weeksWithCells, live: weeksWithCells > 0, flags };
}

/** Flag di confronto col combo per una sorgente orario. Combo vuoto => nessun flag (COMBO_EMPTY e' del preset). */
export function comboFlags(
  src: { programme: string; scuola: string; corso: string; anno2: string[]; year: number },
  combo: ComboCourse[],
): Flag[] {
  if (combo.length === 0) return [];
  const flags: Flag[] = [];
  const entries = combo.filter((c) => c.valore === src.corso);
  if (entries.length === 0) return ["CODE_MISSING_IN_COMBO"];
  // Alcuni sistemi (es. Salerno) non espongono la scuola nel combo (sempre vuota): nessun confronto possibile.
  if (src.scuola && entries.some((c) => c.scuola) && !entries.some((c) => c.scuola === src.scuola)) flags.push("SCUOLA_NOT_IN_COMBO");
  const best = Math.max(...entries.map((c) => nameSimilarity(src.programme, c.label)));
  if (best < NAME_MISMATCH_THRESHOLD) flags.push("NAME_MISMATCH");
  const offered = new Set(entries.flatMap((c) => valoriForYear(c, src.year)));
  if (offered.size > 0 && src.anno2.some((a) => !offered.has(a))) flags.push("ANNO2_STALE");
  return flags;
}

/** Regola esami rigida: exams:true solo se almeno un anno ha appelli nella finestra. */
export function wantExams(appelliPerYear: number[]): boolean {
  return appelliPerYear.some((n) => n > 0);
}
