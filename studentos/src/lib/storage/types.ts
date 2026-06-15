/** App-level persistence types: sync bookkeeping, change detection, settings.
 *  University data types live in lib/domain/types. */
import type { IsoDateTime } from "@/lib/domain/types";
import type { SyncCapability } from "@/lib/sync/provider";

export interface SyncMeta {
  sourceId: string;
  capability: SyncCapability;
  lastAttemptAt: IsoDateTime;
  lastSuccessAt?: IsoDateTime;
  ok: boolean;
  error?: string;
  itemCount: number;
}

/** A meaningful difference between two syncs, surfaced on the dashboard.
 *  This is what makes sync feel alive: "aula cambiata", "nuovo appello". */
export interface ChangeNotice {
  id: string;
  kind: "room-change" | "time-change" | "cancelled" | "new-exam";
  courseName: string;
  /** Already-localized detail, e.g. "Aula T5 → Aula A2". */
  detail: string;
  /** id of the ClassEvent or ExamCall this notice refers to. */
  entityId: string;
  detectedAt: IsoDateTime;
  seen: boolean;
}

export interface AppSettings {
  /** Selected built-in preset, if any. */
  presetId?: string;
  /** Year of study chosen at onboarding (tailors exams, defaults). */
  yearOfStudy?: number;
  /** Degree course chosen at onboarding (label only — tailors copy). */
  programme?: string;
  /** Which of the preset's sources actually sync. */
  enabledSourceIds: string[];
  /** Courses the user actually attends; empty = show everything.
   *  The merged all-years timetable filters on this. */
  pinnedCourses: string[];
  degreePlan: { totalCfu: number; targetAverage?: number };
  /** How far ahead the sync window reaches, in days. */
  syncHorizonDays: number;
  /** UI density: "comfortable" (default) or "compact" (tighter spacing). */
  density?: "comfortable" | "compact";
  /** First day of the week for the calendar grid. */
  weekStartsOn?: "mon" | "sun";
  /** Show in-app reminders for upcoming exams. */
  examReminders?: boolean;
  /** How many days before an exam the reminder kicks in. */
  reminderDaysBefore?: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  enabledSourceIds: [],
  pinnedCourses: [],
  degreePlan: { totalCfu: 180 },
  syncHorizonDays: 120,
  density: "comfortable",
  weekStartsOn: "mon",
  examReminders: true,
  reminderDaysBefore: 3,
};
