/**
 * Note search and course auto-linking. Dependency-free full-text search:
 * accent-folded, AND semantics across terms, field-weighted ranking
 * (title > tags/course > content). Pure functions, UI passes the data in.
 */
import type { ClassEvent, ExamCall, Note } from "./types";

/** Lowercase + strip accents, so "perche" matches "Perché". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const WEIGHT = { title: 5, tag: 3, course: 3, content: 1 } as const;

function scoreTerm(note: Note, term: string): number {
  let score = 0;
  if (normalize(note.title).includes(term)) score += WEIGHT.title;
  if (note.tags.some((t) => normalize(t).includes(term))) score += WEIGHT.tag;
  if (note.courseName && normalize(note.courseName).includes(term))
    score += WEIGHT.course;
  if (normalize(note.content).includes(term)) score += WEIGHT.content;
  return score;
}

/** Empty query → all notes by recency. Otherwise every term must match
 *  somewhere; results ranked by summed weight, ties by recency. */
export function searchNotes(notes: Note[], query: string): Note[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const byRecency = (a: Note, b: Note) =>
    b.updatedAt.localeCompare(a.updatedAt);
  if (terms.length === 0) return [...notes].sort(byRecency);

  return notes
    .map((note) => {
      const scores = terms.map((t) => scoreTerm(note, t));
      const matchesAll = scores.every((s) => s > 0);
      return { note, score: matchesAll ? scores.reduce((a, b) => a + b, 0) : 0 };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byRecency(a.note, b.note))
    .map((r) => r.note);
}

/** Unique course names across the synced caches, alphabetical. */
export function extractCourseNames(
  classEvents: ClassEvent[],
  examCalls: ExamCall[],
): string[] {
  const names = new Set<string>();
  for (const e of classEvents) names.add(e.courseName);
  for (const e of examCalls) names.add(e.courseName);
  return [...names].sort((a, b) => a.localeCompare(b, "it"));
}

/** Longest synced course name mentioned in the text, if any — the
 *  auto-tagging suggestion ("Appunti di basi di dati" → "BASI DI DATI"). */
export function suggestCourse(
  text: string,
  courses: string[],
): string | undefined {
  const haystack = normalize(text);
  return courses
    .filter((c) => c.length >= 4 && haystack.includes(normalize(c)))
    .sort((a, b) => b.length - a.length)[0];
}
