/**
 * Pure normalization for the "Importa da PDF" feature. An AI (Groq) reads the
 * raw text of a timetable or exam PDF and returns loosely-shaped JSON rows;
 * these functions coerce them into the app's strict vocabulary — ISO weekday,
 * "HH:MM" times, "YYYY-MM-DD" dates, typed `kind` — and DROP any row that can't
 * be trusted (no course, unparseable day/date, missing times). Wrong data is
 * worse than none, so anything ambiguous is discarded rather than guessed.
 *
 * Framework-free and deterministic (tested in tests/pdfImport.test.ts).
 */
import type { ClassEventKind, ExamKind } from "./types";

/** Which kind of PDF the student is importing. */
export type ImportKind = "orario" | "esami";

/** A weekly lesson slot, normalized from one AI row. */
export interface ParsedLesson {
  courseName: string;
  /** ISO weekday: 1 = Lunedì … 7 = Domenica. */
  weekday: number;
  /** Local start, "HH:MM". */
  startTime: string;
  /** Local end, "HH:MM". */
  endTime: string;
  room?: string;
  kind: ClassEventKind;
}

/** A single exam call, normalized from one AI row. */
export interface ParsedExam {
  courseName: string;
  /** "YYYY-MM-DD". */
  date: string;
  /** "HH:MM". */
  time?: string;
  room?: string;
  kind: ExamKind;
  teacher?: string;
}

/**
 * Sentinel sourceId for PDF-imported rows. It deliberately starts with
 * "manual" so every existing manual-handling path works unchanged — the year
 * filter never hides it (sources.ts), exam cards show a delete control and the
 * series manager picks up lessons — while the "pdf-import" segment records the
 * provenance (and drives the distinct "da PDF" badge). The trailing `anno-N`
 * keeps `yearOfSource()` happy. Mirrors ManualExamForm's year-default of 1.
 */
export function pdfImportSourceId(yearOfStudy: number | undefined): string {
  return `manual-pdf-import-anno-${yearOfStudy ?? 1}`;
}

/** Lowercase + strip accents, for tolerant keyword matching. */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Read an unknown row's string field, trimmed; "" when absent. */
function field(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

const DAY_PREFIX: Record<string, number> = {
  lun: 1, mar: 2, mer: 3, gio: 4, ven: 5, sab: 6, dom: 7,
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7,
};

/** Italian/English day name (or 1–7) → ISO weekday, or null when unreadable. */
function parseWeekday(value: string): number | null {
  const f = fold(value);
  if (!f) return null;
  if (/^[1-7]$/.test(f)) return Number(f);
  return DAY_PREFIX[f.slice(0, 3)] ?? null;
}

/** "9:5" / "14.30" / "11" → "HH:MM"; null when out of range or empty. */
function parseTime(value: string): string | null {
  const f = value.trim();
  if (!f) return null;
  const m = /^(\d{1,2})(?:[:.](\d{1,2}))?$/.exec(f);
  if (!m) return null;
  const h = Number(m[1]);
  const min = m[2] === undefined ? 0 : Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Validate calendar fields and emit "YYYY-MM-DD", or null. */
function isoDate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // reject impossible day-of-month (e.g. 31 Feb) via a round-trip
  const d = new Date(Date.UTC(year, month - 1, day));
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** ISO ("2026-06-20") or European ("20/06/2026", "9-1-2027", "15.02.2026"). */
function parseDate(value: string): string | null {
  const f = value.trim();
  if (!f) return null;
  const parts = f.split(/[/.\-]/).map((p) => p.trim());
  if (parts.length !== 3 || parts.some((p) => !/^\d{1,4}$/.test(p))) return null;
  // 4-digit leading group → ISO order; otherwise day-first (European).
  if (parts[0].length === 4) {
    return isoDate(Number(parts[0]), Number(parts[1]), Number(parts[2]));
  }
  return isoDate(Number(parts[2]), Number(parts[1]), Number(parts[0]));
}

function lessonKind(tipo: string): ClassEventKind {
  const f = fold(tipo);
  if (f.includes("lab")) return "lab";
  if (f.includes("eserc")) return "exercise";
  if (f.includes("semin")) return "seminar";
  return "lecture";
}

function examKind(tipo: string): ExamKind {
  const f = fold(tipo);
  const written = f.includes("scritt") || f.includes("writt");
  const oral = f.includes("oral");
  if (written && oral) return "written+oral";
  if (oral) return "oral";
  if (written) return "written";
  if (f.includes("pratic") || f.includes("practic")) return "practical";
  return "unknown";
}

/** Coerce the unknown into a plain object array (anything else → []). */
function asRows(raw: unknown): Record<string, unknown>[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is Record<string, unknown> =>
      typeof r === "object" && r !== null && !Array.isArray(r),
  );
}

/** Normalize AI rows into weekly lesson slots, dropping untrustworthy ones. */
export function normalizeLessons(raw: unknown): ParsedLesson[] {
  const out: ParsedLesson[] = [];
  for (const row of asRows(raw)) {
    const courseName = field(row, "corso", "course", "nome", "insegnamento");
    const weekday = parseWeekday(field(row, "giorno", "day", "weekday"));
    const startTime = parseTime(field(row, "oraInizio", "inizio", "start", "ora"));
    const endTime = parseTime(field(row, "oraFine", "fine", "end"));
    if (!courseName || weekday === null || !startTime || !endTime) continue;
    const room = field(row, "aula", "room", "luogo") || undefined;
    out.push({
      courseName,
      weekday,
      startTime,
      endTime,
      room,
      kind: lessonKind(field(row, "tipo", "kind", "type")),
    });
  }
  return out;
}

/** Normalize AI rows into exam calls, dropping untrustworthy ones. */
export function normalizeExams(raw: unknown): ParsedExam[] {
  const out: ParsedExam[] = [];
  for (const row of asRows(raw)) {
    const courseName = field(row, "corso", "course", "nome", "insegnamento");
    const date = parseDate(field(row, "data", "date", "giorno"));
    if (!courseName || !date) continue;
    const time = parseTime(field(row, "ora", "orario", "time")) ?? undefined;
    const room = field(row, "aula", "room", "luogo") || undefined;
    const teacher = field(row, "docente", "teacher", "prof") || undefined;
    out.push({
      courseName,
      date,
      time,
      room,
      kind: examKind(field(row, "tipo", "kind", "type")),
      teacher,
    });
  }
  return out;
}
