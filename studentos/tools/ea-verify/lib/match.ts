const STOP = new Set([
  "di", "del", "della", "dei", "delle", "degli", "dello", "dell", "e", "ed", "in", "per", "la", "il", "lo", "le", "i", "gli",
  "a", "al", "alla", "ai", "and", "of", "the", "for", "l", "d", "da", "su", "con", "corso", "laurea", "magistrale", "triennale",
  "ciclo", "unico",
]);

/** Minuscolo, senza accenti, senza parentesi/codici tra [] , solo alfanumerici. */
export function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalizeName(s)
    .split(" ")
    .filter((t) => t && !STOP.has(t));
}

/** Somiglianza 0..1: contenimento dei token (set minore) + Jaccard. Nessuna dipendenza. */
export function nameSimilarity(a: string, b: string): number {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (A.size === 0 || B.size === 0) return normalizeName(a) === normalizeName(b) ? 1 : 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const contain = inter / Math.min(A.size, B.size);
  const jac = inter / (A.size + B.size - inter);
  return 0.7 * contain + 0.3 * jac;
}

export const NAME_MISMATCH_THRESHOLD = 0.6;

export function namesMatch(a: string, b: string): boolean {
  return nameSimilarity(a, b) >= NAME_MISMATCH_THRESHOLD;
}

export type Tipo = "cu" | "mag" | "tri" | "any";

/** Tipo di laurea dichiarato nel NOME del programma nel preset. */
export function tipoOfProgramme(name: string): Tipo {
  const n = name.toLowerCase();
  if (n.includes("ciclo unico")) return "cu";
  if (n.includes("magistrale")) return "mag";
  if (n.includes("triennale")) return "tri";
  return "any";
}

/** Il tipo del combo (es. "Laurea Magistrale", "CORSO DI LAUREA") e' compatibile col tipo cercato? */
export function tipoCompatible(want: Tipo, comboTipo: string): boolean {
  const t = comboTipo.toLowerCase();
  const cu = t.includes("ciclo unico");
  const mag = t.includes("magistrale") && !cu;
  if (want === "cu") return cu;
  if (want === "mag") return mag;
  if (want === "tri") return !cu && !mag;
  return true;
}
