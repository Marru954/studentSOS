/**
 * Typed repositories over IndexedDB. All sync writes go through
 * replaceSourceData so a source's cache is always replaced atomically —
 * no half-applied syncs, diff notices computed inside the same flow.
 */
import type {
  ClassEvent,
  ExamCall,
  FocusSession,
  LibrettoEntry,
  NewsItem,
  Note,
  StudyTask,
} from "@/lib/domain/types";
import type { TrophyLedger } from "@/lib/domain/achievements";
import type { Alert } from "@/lib/domain/alerts";
import type { SyncCapability } from "@/lib/sync/provider";
import { getDb } from "./db";
import { diffClassEvents, diffExamCalls } from "./diff";
import { type AppSettings, type ChangeNotice, DEFAULT_SETTINGS, type SyncMeta } from "./types";

const CAPABILITY_STORE = {
  timetable: "classEvents",
  exams: "examCalls",
  news: "news",
} as const;

export type SyncedEntity = ClassEvent | ExamCall | NewsItem;

/** Atomically replace one source's cache; returns fresh change notices. */
export async function replaceSourceData(
  capability: SyncCapability,
  sourceId: string,
  data: SyncedEntity[],
  now: string,
): Promise<ChangeNotice[]> {
  const db = await getDb();
  const storeName = CAPABILITY_STORE[capability];

  const previous = await db.getAllFromIndex(storeName, "by-source", sourceId);
  const notices =
    capability === "timetable"
      ? diffClassEvents(previous as ClassEvent[], data as ClassEvent[], now)
      : capability === "exams"
        ? diffExamCalls(previous as ExamCall[], data as ExamCall[], now)
        : [];

  const tx = db.transaction([storeName, "changeNotices", "syncMeta"], "readwrite");
  const store = tx.objectStore(storeName);
  for (const entity of previous) await store.delete(entity.id);
  for (const entity of data) await store.put(entity as never);
  for (const n of notices) await tx.objectStore("changeNotices").put(n);
  await tx.objectStore("syncMeta").put({
    sourceId,
    capability,
    lastAttemptAt: now,
    lastSuccessAt: now,
    ok: true,
    itemCount: data.length,
  });
  await tx.done;
  return notices;
}

export async function recordSyncFailure(
  capability: SyncCapability,
  sourceId: string,
  error: string,
  now: string,
): Promise<void> {
  const db = await getDb();
  const prev = await db.get("syncMeta", sourceId);
  const meta: SyncMeta = {
    sourceId,
    capability,
    lastAttemptAt: now,
    lastSuccessAt: prev?.lastSuccessAt,
    ok: false,
    error,
    itemCount: prev?.itemCount ?? 0,
  };
  await db.put("syncMeta", meta);
}

// ── synced reads ────────────────────────────────────────────────────────────

export async function getClassEvents(): Promise<ClassEvent[]> {
  return (await getDb()).getAllFromIndex("classEvents", "by-start");
}

/** Bulk-upsert class events in one transaction. Used for manually-added
 *  lessons, which live in the same store as synced ones under a
 *  `manual-anno-N` sourceId — `replaceSourceData` only deletes rows whose
 *  sourceId matches an *enabled* sync source, so these survive every sync. */
export async function putClassEvents(events: ClassEvent[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("classEvents", "readwrite");
  for (const event of events) await tx.store.put(event);
  await tx.done;
}

/** Delete every class event of a manual weekly series. Each instance id is
 *  `manual:${seriesId}:${isoDate}`, so we drop all rows with that prefix. */
export async function deleteClassEventSeries(seriesId: string): Promise<void> {
  const db = await getDb();
  const prefix = `manual:${seriesId}:`;
  const tx = db.transaction("classEvents", "readwrite");
  for (const event of await tx.store.getAll()) {
    if (event.id.startsWith(prefix)) await tx.store.delete(event.id);
  }
  await tx.done;
}

export async function getExamCalls(): Promise<ExamCall[]> {
  return (await getDb()).getAllFromIndex("examCalls", "by-date");
}

/** Upsert a single exam call. Used for manually-added appelli, which live in
 *  the same store as synced ones under a `manual-anno-N` sourceId — sync only
 *  ever deletes rows whose sourceId matches an *enabled* source, so these
 *  survive every sync untouched. */
export async function putExamCall(call: ExamCall): Promise<void> {
  await (await getDb()).put("examCalls", call);
}

/** Delete a single exam call by id (only manual appelli are deletable). */
export async function deleteExamCall(id: string): Promise<void> {
  await (await getDb()).delete("examCalls", id);
}

export async function getNews(): Promise<NewsItem[]> {
  return (await getDb()).getAll("news");
}

export async function getSyncMeta(): Promise<SyncMeta[]> {
  return (await getDb()).getAll("syncMeta");
}

export async function getChangeNotices(): Promise<ChangeNotice[]> {
  const all = await (await getDb()).getAllFromIndex("changeNotices", "by-detected");
  return all.reverse(); // newest first
}

export async function markNoticesSeen(ids: string[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("changeNotices", "readwrite");
  for (const id of ids) {
    const n = await tx.store.get(id);
    if (n && !n.seen) await tx.store.put({ ...n, seen: true });
  }
  await tx.done;
}

// ── manual territories: plain CRUD, sync never touches these ───────────────

function crud<T extends { id: string }>(
  storeName: "libretto" | "notes" | "studyTasks" | "focusSessions",
) {
  return {
    async getAll(): Promise<T[]> {
      const all = await (await getDb()).getAll(storeName);
      return all as unknown as T[];
    },
    async put(value: T): Promise<void> {
      await (await getDb()).put(storeName, value as never);
    },
    async remove(id: string): Promise<void> {
      await (await getDb()).delete(storeName, id);
    },
    async clear(): Promise<void> {
      await (await getDb()).clear(storeName);
    },
  };
}

export const librettoRepo = crud<LibrettoEntry>("libretto");
export const notesRepo = crud<Note>("notes");
export const tasksRepo = crud<StudyTask>("studyTasks");
export const focusRepo = crud<FocusSession>("focusSessions");

/** Replace all Delphi-sourced libretto rows with a fresh scrape, in one
 *  transaction. Manual entries (source undefined or "manual") are never
 *  touched — the two territories coexist in the same store. */
export async function replaceDelphiLibretto(
  entries: LibrettoEntry[],
): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("libretto", "readwrite");
  for (const existing of await tx.store.getAll()) {
    if (existing.source === "delphi") await tx.store.delete(existing.id);
  }
  for (const entry of entries) await tx.store.put({ ...entry, source: "delphi" });
  await tx.done;
}

// ── settings ────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "app";

export async function getSettings(): Promise<AppSettings> {
  const stored = await (await getDb()).get("settings", SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...((stored as Partial<AppSettings>) ?? {}) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await (await getDb()).put("settings", settings, SETTINGS_KEY);
}

// ── trophy ledger ─────────────────────────────────────────────────────────────
// The append-only record of when each trophy was first earned. Lives under its
// own key in the generic `settings` bucket (no schema change), kept apart from
// AppSettings so it never rides the profile/settings cloud push — trophies are
// local-first and re-derive from the libretto on any device.

const TROPHIES_KEY = "trophies";

export async function getTrophyLedger(): Promise<TrophyLedger> {
  const stored = await (await getDb()).get("settings", TROPHIES_KEY);
  return (stored as TrophyLedger) ?? {};
}

export async function saveTrophyLedger(ledger: TrophyLedger): Promise<void> {
  await (await getDb()).put("settings", ledger, TROPHIES_KEY);
}

// The relock log governs only whether a scenic unlock animation replays (the
// 1h anti-repeat window); it is not the trophy data. Separate key, same bucket.

const RELOCK_KEY = "trophy-relock";

export async function getRelockLog(): Promise<Record<string, string>> {
  const stored = await (await getDb()).get("settings", RELOCK_KEY);
  return (stored as Record<string, string>) ?? {};
}

export async function saveRelockLog(log: Record<string, string>): Promise<void> {
  await (await getDb()).put("settings", log, RELOCK_KEY);
}

// ── smart alerts ──────────────────────────────────────────────────────────────
// Derived, short-lived notices + the user's manual dismissals. Lives under its
// own key in the generic `settings` bucket (no schema change), same pattern as
// the trophy ledger. IndexedDB structured clone preserves the `Date` fields, so
// alerts round-trip without any parse step. Kept apart from AppSettings so it
// never rides the profile/settings cloud push — alerts re-derive on any device.

const ALERTS_KEY = "alerts";

export interface StoredAlerts {
  alerts: Alert[];
  lastCheckedAt: Date | null;
}

export async function getStoredAlerts(): Promise<StoredAlerts> {
  const stored = await (await getDb()).get("settings", ALERTS_KEY);
  const value = stored as Partial<StoredAlerts> | undefined;
  return {
    alerts: value?.alerts ?? [],
    lastCheckedAt: value?.lastCheckedAt ?? null,
  };
}

export async function saveStoredAlerts(state: StoredAlerts): Promise<void> {
  await (await getDb()).put("settings", state, ALERTS_KEY);
}
