"use client";

/** Stores for the manual territories (libretto, notes, tasks, focus).
 *  Identical shape: hydrate from IndexedDB once, write-through on mutation.
 *  Sync never writes here — these are the user's own records. */
import { create } from "zustand";
import type {
  FocusSession,
  LibrettoEntry,
  Note,
  StudyTask,
} from "@/lib/domain/types";
import { focusRepo, librettoRepo, notesRepo, tasksRepo } from "@/lib/storage/repo";

interface ManualStore<T extends { id: string }> {
  items: T[];
  hydrated: boolean;
  hydrate(): Promise<void>;
  /** Force a re-read from IndexedDB (e.g. after an out-of-band write like
   *  the Delphi libretto sync). */
  reload(): Promise<void>;
  upsert(item: T): Promise<void>;
  /** Bulk upsert (e.g. CSV import): one state update, then write-through. */
  upsertMany(items: T[]): Promise<void>;
  remove(id: string): Promise<void>;
  /** Wipe the whole store (e.g. "svuota libretto"). */
  clear(): Promise<void>;
}

function createManualStore<T extends { id: string }>(repo: {
  getAll(): Promise<T[]>;
  put(value: T): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}) {
  return create<ManualStore<T>>()((set, get) => ({
    items: [],
    hydrated: false,

    async hydrate() {
      if (get().hydrated) return;
      set({ items: await repo.getAll(), hydrated: true });
    },

    async reload() {
      set({ items: await repo.getAll(), hydrated: true });
    },

    async upsert(item) {
      // optimistic: state first, then disk — IndexedDB writes don't fail
      // under normal operation, and the store re-hydrates on next load
      set({ items: [...get().items.filter((i) => i.id !== item.id), item] });
      await repo.put(item);
    },

    async upsertMany(items) {
      if (items.length === 0) return;
      const byId = new Map(get().items.map((i) => [i.id, i]));
      for (const item of items) byId.set(item.id, item);
      set({ items: [...byId.values()] });
      for (const item of items) await repo.put(item);
    },

    async remove(id) {
      set({ items: get().items.filter((i) => i.id !== id) });
      await repo.remove(id);
    },

    async clear() {
      set({ items: [] });
      await repo.clear();
    },
  }));
}

export const useLibretto = createManualStore<LibrettoEntry>(librettoRepo);
export const useNotes = createManualStore<Note>(notesRepo);
export const useTasks = createManualStore<StudyTask>(tasksRepo);
export const useFocusSessions = createManualStore<FocusSession>(focusRepo);
