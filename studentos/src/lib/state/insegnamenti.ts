"use client";

/** Insegnamenti store: in-memory mirror of the corso's piano di studi — synced
 *  rows from the manifesto (`inserito_manualmente === false`) plus the student's
 *  manually-added ones — together with the manifesto metadata. IndexedDB stays
 *  the source of truth: `loadInsegnamenti` re-reads from disk (by-corso index),
 *  `syncInsegnamenti` drives the client-side scrape (`lib/insegnamenti/sync`)
 *  then reloads, and manual mutations write through to disk before state.
 *
 *  Unlike the manual-territory stores, this one is NOT hydrated by
 *  StoreProvider: the data only matters on /insegnamenti, so the page loads it
 *  on mount once the onboarded ateneo/corso is known. */
import { create } from "zustand";
import { getDb } from "@/lib/storage/db";
import {
  syncInsegnamenti as runSync,
  type SyncResult,
} from "@/lib/insegnamenti/sync";
import type { Insegnamento, ManifestoInsegnamenti } from "@/types/insegnamenti";

/** What `addInsegnamentoManuale` accepts: the form fills everything except the
 *  identity/timestamps, which the store stamps. Structurally identical to the
 *  form's own draft type. */
export type DraftInsegnamento = Omit<
  Insegnamento,
  "id" | "created_at" | "updated_at"
>;

/** Drives the page's banner/form copy after a sync attempt. */
export type SyncStatus = "idle" | "syncing" | "ok" | "manual" | "error";

interface InsegnamentiState {
  insegnamenti: Insegnamento[];
  manifesto: ManifestoInsegnamenti | null;
  loading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
  hydrated: boolean;

  /** Read the corso's insegnamenti + manifesto from IndexedDB. With no corso
   *  (un-onboarded) the store is simply empty — manual entry still works. */
  loadInsegnamenti(ateneoId?: string, corsoId?: string): Promise<void>;
  /** Run the client-side manifesto scrape, then reload from disk on success.
   *  Returns the raw result so the page can branch on ok / manual / error. */
  syncInsegnamenti(ateneoId: string, corsoId: string): Promise<SyncResult>;
  /** Stamp identity + timestamps, persist, then mirror into state. */
  addInsegnamentoManuale(draft: DraftInsegnamento): Promise<void>;
  /** Remove one row (manual or synced) from disk + state. */
  deleteInsegnamento(id: string): Promise<void>;
  /** Wipe the store (e.g. account switch). Local only. */
  clear(): void;
}

/** Stable sort: anno (numeric), then semestre, then nome (locale). Keeps the
 *  list deterministic across reloads regardless of insertion order. */
function ordina(rows: Insegnamento[]): Insegnamento[] {
  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };
  return [...rows].sort(
    (a, b) =>
      num(a.anno) - num(b.anno) ||
      num(a.semestre) - num(b.semestre) ||
      a.nome.localeCompare(b.nome, "it"),
  );
}

export const useInsegnamenti = create<InsegnamentiState>()((set, get) => ({
  insegnamenti: [],
  manifesto: null,
  loading: false,
  error: null,
  syncStatus: "idle",
  hydrated: false,

  async loadInsegnamenti(ateneoId, corsoId) {
    set({ loading: true, error: null });
    try {
      if (!corsoId) {
        set({
          insegnamenti: [],
          manifesto: null,
          loading: false,
          hydrated: true,
        });
        return;
      }
      const db = await getDb();
      const rows = await db.getAllFromIndex("insegnamenti", "by-corso", corsoId);
      const manifesti = await db.getAllFromIndex(
        "manifesti",
        "by-corso",
        corsoId,
      );
      // When an ateneo is known, narrow to it (a corso slug could in theory
      // collide across atenei); otherwise take what the corso index returned.
      const filtered = ateneoId
        ? rows.filter((r) => r.ateneo_id === ateneoId)
        : rows;
      const manifesto =
        (ateneoId
          ? manifesti.find((m) => m.ateneo_id === ateneoId)
          : manifesti[0]) ??
        manifesti[0] ??
        null;
      set({
        insegnamenti: ordina(filtered),
        manifesto,
        loading: false,
        hydrated: true,
      });
    } catch (cause) {
      set({
        loading: false,
        hydrated: true,
        error:
          cause instanceof Error
            ? cause.message
            : "Lettura insegnamenti non riuscita.",
      });
    }
  },

  async syncInsegnamenti(ateneoId, corsoId) {
    set({ syncStatus: "syncing", loading: true, error: null });
    const result = await runSync(ateneoId, corsoId);
    if (result.status === "ok") {
      await get().loadInsegnamenti(ateneoId, corsoId);
      set({ syncStatus: "ok" });
    } else if (result.status === "manual") {
      set({ syncStatus: "manual", loading: false });
    } else {
      set({ syncStatus: "error", loading: false, error: result.error });
    }
    return result;
  },

  async addInsegnamentoManuale(draft) {
    const now = new Date().toISOString();
    const row: Insegnamento = {
      ...draft,
      id: `ins-man-${crypto.randomUUID()}`,
      inserito_manualmente: true,
      created_at: now,
      updated_at: now,
    };
    const db = await getDb();
    await db.put("insegnamenti", row);
    set({ insegnamenti: ordina([...get().insegnamenti, row]) });
  },

  async deleteInsegnamento(id) {
    const db = await getDb();
    await db.delete("insegnamenti", id);
    set({ insegnamenti: get().insegnamenti.filter((i) => i.id !== id) });
  },

  clear() {
    set({
      insegnamenti: [],
      manifesto: null,
      loading: false,
      error: null,
      syncStatus: "idle",
      hydrated: false,
    });
  },
}));
