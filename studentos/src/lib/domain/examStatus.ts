/**
 * Bridge between the libretto (esami già verbalizzati) and the synced appelli
 * feed. A recorded libretto entry *is*, by definition, a passed exam — so an
 * upcoming appello whose course matches one already in the libretto should
 * never nag the student (prossimo esame, avvisi critici, banner Focus). On
 * /appelli it stays visible but flagged "già superato".
 *
 * Pure and deterministic: no clock, no storage. Course names are messy across
 * sources ("Analisi Matematica 1" vs "Analisi Matematica", "Calcolo delle
 * Probabilità" vs "Calcolo delle Probabilità e Statistica"), so matching is
 * token-based and *conservative*: a false "superato" hides a real upcoming
 * exam, which is worse than showing one already passed. We therefore match on
 * exact normalized equality, or a token-subset only when BOTH names carry ≥2
 * significant tokens — single-word courses ("Fisica") match exactly or not at
 * all, so "Fisica" never swallows "Fisica 2".
 */
import type { ExamCall, LibrettoEntry } from "./types";

/** Articles/prepositions that carry no discriminating signal in a course name. */
const STOPWORDS = new Set([
  "di", "del", "dello", "della", "dei", "degli", "delle", "d",
  "e", "ed", "il", "lo", "la", "i", "gli", "le", "l",
  "a", "ad", "al", "in", "con", "per", "su",
]);

/** Lowercase roman numerals → arabic, so "Analisi I" keys like "Analisi 1". */
const ROMAN: Record<string, string> = {
  i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6", vii: "7", viii: "8",
};

/** Significant, normalized tokens of a course name (accents/punctuation gone,
 *  stopwords dropped, roman numerals folded to arabic). */
function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents
    .replace(/[^a-z0-9\s]/g, " ") // punctuation → space
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ROMAN[t] ?? t)
    .filter((t) => !STOPWORDS.has(t));
}

/** Canonical key: significant tokens, space-joined. "" for an empty name. */
function courseKey(name: string): string {
  return tokens(name).join(" ");
}

/** Keys of every course recorded in the libretto (= passed). Empty names drop. */
export function passedCourseKeys(libretto: LibrettoEntry[]): Set<string> {
  const keys = new Set<string>();
  for (const e of libretto) {
    const k = courseKey(e.courseName);
    if (k) keys.add(k);
  }
  return keys;
}

function isSubset(a: Set<string>, b: Set<string>): boolean {
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/** True when this appello's course is already in the libretto (passed). */
export function isExamPassed(exam: ExamCall, passed: Set<string>): boolean {
  const key = courseKey(exam.courseName);
  if (!key) return false;
  if (passed.has(key)) return true; // exact normalized match
  const examTokens = new Set(key.split(" "));
  if (examTokens.size < 2) return false; // single-word: exact-only, no fuzzy
  for (const p of passed) {
    const pTokens = p.split(" ");
    if (pTokens.length < 2) continue; // single-word libretto: exact-only
    const pSet = new Set(pTokens);
    if (isSubset(pSet, examTokens) || isSubset(examTokens, pSet)) return true;
  }
  return false;
}

/** Drop appelli whose course is already passed. Identity when libretto empty. */
export function filterUnpassedExams(
  exams: ExamCall[],
  libretto: LibrettoEntry[],
): ExamCall[] {
  const passed = passedCourseKeys(libretto);
  if (passed.size === 0) return exams;
  return exams.filter((e) => !isExamPassed(e, passed));
}
