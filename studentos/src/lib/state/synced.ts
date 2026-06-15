"use client";

/** Synced-data store: in-memory mirror of the IndexedDB caches plus sync
 *  status. The UI renders from here; IndexedDB is the source of truth that
 *  survives reloads and offline periods. */
import { create } from "zustand";
import type { ClassEvent, ExamCall, NewsItem } from "@/lib/domain/types";
import {
  getChangeNotices,
  getClassEvents,
  getExamCalls,
  getNews,
  getSyncMeta,
  markNoticesSeen,
} from "@/lib/storage/repo";
import { defaultSyncRange, runSync } from "@/lib/storage/syncClient";
import type { ChangeNotice, SyncMeta } from "@/lib/storage/types";
import { useSettings } from "./settings";

interface SyncedState {
  classEvents: ClassEvent[];
  examCalls: ExamCall[];
  news: NewsItem[];
  syncMeta: SyncMeta[];
  notices: ChangeNotice[];
  hydrated: boolean;
  syncing: boolean;
  /** Set when the last sync attempt failed entirely (e.g. offline). */
  lastSyncError?: string;

  hydrate(): Promise<void>;
  sync(): Promise<void>;
  /** Re-read the synced caches from IndexedDB without running a sync. Needed
   *  after an out-of-band write (e.g. a manually-added exam), since hydrate()
   *  early-returns once hydrated and so wouldn't pick the new row up. */
  refresh(): Promise<void>;
  dismissNotices(ids: string[]): Promise<void>;
}

export const useSynced = create<SyncedState>()((set, get) => ({
  classEvents: [],
  examCalls: [],
  news: [],
  syncMeta: [],
  notices: [],
  hydrated: false,
  syncing: false,

  async hydrate() {
    if (get().hydrated) return;
    const [classEvents, examCalls, news, syncMeta, notices] = await Promise.all([
      getClassEvents(),
      getExamCalls(),
      getNews(),
      getSyncMeta(),
      getChangeNotices(),
    ]);
    set({ classEvents, examCalls, news, syncMeta, notices, hydrated: true });
  },

  async sync() {
    if (get().syncing) return;
    const sources = useSettings.getState().enabledSources();
    if (sources.length === 0) return;
    set({ syncing: true, lastSyncError: undefined });
    try {
      const range = defaultSyncRange(useSettings.getState().syncHorizonDays);
      await runSync(sources, range);
      // re-read from IndexedDB: it's the single source of truth
      const [classEvents, examCalls, news, syncMeta, notices] = await Promise.all([
        getClassEvents(),
        getExamCalls(),
        getNews(),
        getSyncMeta(),
        getChangeNotices(),
      ]);
      set({ classEvents, examCalls, news, syncMeta, notices });
    } catch (error) {
      set({ lastSyncError: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ syncing: false });
    }
  },

  async refresh() {
    const [classEvents, examCalls, news] = await Promise.all([
      getClassEvents(),
      getExamCalls(),
      getNews(),
    ]);
    set({ classEvents, examCalls, news });
  },

  async dismissNotices(ids) {
    await markNoticesSeen(ids);
    set({
      notices: get().notices.map((n) => (ids.includes(n.id) ? { ...n, seen: true } : n)),
    });
  },
}));
