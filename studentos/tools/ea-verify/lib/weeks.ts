const pad = (n: number) => String(n).padStart(2, "0");

/** ISO YYYY-MM-DD -> DD-MM-YYYY (formato dei form). */
export function toItalian(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

/** Lunedi' (DD-MM-YYYY) da `fromIso` a `toIso` inclusi, partendo dal primo lunedi' >= from. */
export function mondaysBetween(fromIso: string, toIso: string): string[] {
  const d = new Date(`${fromIso}T12:00:00Z`);
  const end = new Date(`${toIso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7));
  const out: string[] = [];
  for (; d <= end; d.setUTCDate(d.getUTCDate() + 7)) {
    out.push(`${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`);
  }
  return out;
}

/** Anno accademico corrente (anno di inizio): da agosto in poi = anno solare, prima = anno-1. */
export function defaultAcademicYear(now: Date): string {
  return String(now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1);
}

/** Finestra di default dell'orario: 28-09 -> 30-11 dell'anno di inizio. */
export function defaultWindow(aa: string): { from: string; to: string } {
  return { from: `${aa}-09-28`, to: `${aa}-11-30` };
}

/** Finestra esami: 01-10 dell'anno -> 30-09 dell'anno dopo (sessioni del nuovo anno; nessun fallback sull'anno precedente, niente appelli di settembre che chiudono l'anno prima). */
export function defaultExamWindow(aa: string): { from: string; to: string } {
  return { from: `${aa}-10-01`, to: `${Number(aa) + 1}-09-30` };
}
