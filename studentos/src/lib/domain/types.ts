/**
 * Core domain models for StudentOS.
 *
 * Two strict data territories:
 *  - SYNCED (public data): timetables, exam calls, news — fetched by SyncProviders.
 *  - MANUAL (personal data): libretto, notes, tasks, focus sessions — offline-first,
 *    never scraped, never sent anywhere.
 */

// ── Shared ──────────────────────────────────────────────────────────────────

/** ISO 8601 datetime string, always UTC (`...Z`). Render in the user's timezone. */
export type IsoDateTime = string;
/** ISO date `YYYY-MM-DD` (no time component). */
export type IsoDate = string;

export interface DateRange {
  from: IsoDate;
  to: IsoDate;
}

// ── Synced: timetable ───────────────────────────────────────────────────────

export type ClassEventKind = "lecture" | "lab" | "exercise" | "seminar" | "other";

export interface ClassEvent {
  /** Stable hash of (source, course, start) — survives re-syncs for diffing. */
  id: string;
  courseName: string;
  /** Course code on the source system, when exposed (e.g. EasyAcademy course key). */
  courseCode?: string;
  teacher?: string;
  start: IsoDateTime;
  end: IsoDateTime;
  room?: string;
  building?: string;
  kind: ClassEventKind;
  /** Set by the diff engine when room/time changed vs. the previous sync. */
  change?: { field: "room" | "time" | "cancelled"; previous?: string };
  sourceId: string;
}

// ── Synced: exams ───────────────────────────────────────────────────────────

export type ExamKind = "written" | "oral" | "written+oral" | "practical" | "unknown";

export interface ExamCall {
  id: string;
  courseName: string;
  courseCode?: string;
  date: IsoDate;
  time?: string;
  room?: string;
  kind: ExamKind;
  /** Booking window when the source exposes it — drives deadline urgencies. */
  booking?: { opensAt?: IsoDate; closesAt?: IsoDate };
  teacher?: string;
  notes?: string;
  sourceId: string;
}

// ── Synced: news ────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  publishedAt?: IsoDateTime;
  excerpt?: string;
  sourceId: string;
}

// ── Manual: libretto (strictly local, never synced) ─────────────────────────

/** 18–30 numeric, 30 e lode, or pass/fail ("idoneo"). */
export type Grade =
  | { kind: "numeric"; value: number; laude: boolean }
  | { kind: "pass" };

export interface LibrettoEntry {
  id: string;
  courseName: string;
  cfu: number;
  grade: Grade;
  date: IsoDate;
  /** Academic year, e.g. "2023/2024". */
  academicYear?: string;
  /** Teacher, optional. */
  teacher?: string;
  /** Excluded from the weighted average (e.g. extracurricular CFU). */
  excludeFromAverage?: boolean;
  /** Provenance: hand-entered, or scraped from the Delphi portal.
   *  Defaults to manual when absent. Delphi-sourced rows are replaced
   *  wholesale on each sync; manual rows are never touched. */
  source?: "manual" | "delphi";
}

export interface DegreePlan {
  totalCfu: number; // e.g. 180 triennale, 120 magistrale
  /** Optional target the predictive widgets compare against. */
  targetAverage?: number;
}

// ── Manual: knowledge base ──────────────────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  /** Markdown with ```lang code fences and $…$/$$…$$ LaTeX. */
  content: string;
  tags: string[];
  /** Auto-linked from the synced timetable when titles match a course. */
  courseName?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

// ── Manual: focus hub ───────────────────────────────────────────────────────

export type TaskStatus = "backlog" | "todo" | "doing" | "done";

export interface StudyTask {
  id: string;
  title: string;
  status: TaskStatus;
  courseName?: string;
  /** Links the task to a specific exam call for countdown context. */
  examId?: string;
  due?: IsoDate;
  createdAt: IsoDateTime;
}

export interface FocusSession {
  id: string;
  courseName?: string;
  startedAt: IsoDateTime;
  /** Actual focused minutes (breaks excluded). */
  minutes: number;
}

// ── Derived: predictive engine output ───────────────────────────────────────

export type UrgencyKind =
  | "class-overlap"
  | "exam-overlap"
  | "booking-deadline"
  | "room-change"
  | "exam-imminent";

export type UrgencySeverity = "info" | "warning" | "critical";

export interface Urgency {
  id: string;
  kind: UrgencyKind;
  severity: UrgencySeverity;
  /** Already-localized human message, composed by the urgency engine. */
  message: string;
  /** When the urgency stops mattering — expired urgencies are dropped. */
  expiresAt: IsoDateTime;
  relatedIds: string[];
}
