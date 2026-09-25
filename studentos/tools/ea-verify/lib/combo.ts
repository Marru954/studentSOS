import type { ComboCourse } from "./types";

/** Estrae l'array JSON assegnato a `var <name> = [...]` (bracket matching string-aware). */
export function extractArray(text: string, name = "elenco_corsi"): unknown[] | null {
  const at = text.indexOf(name);
  if (at < 0) return null;
  const start = text.indexOf("[", at);
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        try {
          const v: unknown = JSON.parse(text.slice(start, i + 1));
          return Array.isArray(v) ? v : null;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

/** Risposta grezza del combo -> corsi normalizzati. Vuoto se il sistema non ha l'anno. */
export function parseCombo(text: string): ComboCourse[] {
  const arr = extractArray(text) ?? [];
  const out: ComboCourse[] = [];
  for (const raw of arr) {
    if (typeof raw !== "object" || raw === null) continue;
    const r = raw as Record<string, unknown>;
    const valore = str(r.valore);
    if (!valore) continue;
    const anni = Array.isArray(r.elenco_anni)
      ? (r.elenco_anni as unknown[])
          .map((a) => (typeof a === "object" && a !== null ? str((a as Record<string, unknown>).valore) : ""))
          .filter(Boolean)
      : [];
    out.push({ valore, label: str(r.label), tipo: str(r.tipo), scuola: str(r.scuola), facoltaId: str(r.facolta_id), anni });
  }
  return out;
}

/** Anno numerico dal suffisso `|N` di un valore anno2 (NaN se assente). */
export function yearOfValore(v: string): number {
  const i = v.lastIndexOf("|");
  return i < 0 ? NaN : Number.parseInt(v.slice(i + 1), 10);
}

/** Tutti i valori anno2 del corso per un dato anno di corso. */
export function valoriForYear(c: ComboCourse, year: number): string[] {
  return c.anni.filter((v) => yearOfValore(v) === year);
}
