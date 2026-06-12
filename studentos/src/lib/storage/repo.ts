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

export async function getExamCalls(): Promise<ExamCall[]> {
  return (await getDb()).getAllFromIndex("examCalls", "by-date");
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
