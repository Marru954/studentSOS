"use client";

/** In-memory mirror of the trophy engine. Like the manual stores it hydrates
 *  once from IndexedDB (the append-only first-unlock ledger + the relock log)
 *  and write-through on change. `statuses` are recomputed live from the
 *  libretto — they are a consequence of that data, never a second copy of it.
 *  `recompute` is driven by the libretto store (see StoreProvider), so it fires
 *  on every save path: form, CSV, Delphi import, cloud reconcile, deletion, and
 *  returns the celebration decision for that change. */
import { create } from "zustand";
import {
  applyUnlocks,
  evaluateAll,
  type TrophyLedger,
  type TrophyStatus,
} from "@/lib/domain/achievements";
import {
  type CelebrationDecision,
  decideCelebrations,
} from "@/lib/domain/celebrations";
import type { LibrettoEntry } from "@/lib/domain/types";
import {
  getRelockLog,
  getTrophyLedger,
  saveRelockLog,
  saveTrophyLedger,
} from "@/lib/storage/repo";

interface TrophyStore {
  /** Append-only record of when each trophy was first earned. */
  ledger: TrophyLedger;
  /** Per event-trophy: when it last relocked. Governs only scenic replay. */
  relockedAt: Record<string, string>;
  /** Live status of every trophy against the current libretto. */
  statuses: TrophyStatus[];
  hydrated: boolean;
  hydrate(): Promise<void>;
  /** Re-evaluate against the libretto, stamp first-time unlocks, persist what
   *  changed, and return the celebration decision (scenic/toast) for this
   *  change. The caller decides whether to actually celebrate. */
  recompute(entries: LibrettoEntry[], now?: string): Promise<CelebrationDecision>;
  /** Wipe ledger + relock log (account switch). Local IndexedDB only. */
  clear(): Promise<void>;
}

export const useTrophies = create<TrophyStore>()((set, get) => ({
  ledger: {},
  relockedAt: {},
  statuses: evaluateAll([]),
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const [ledger, relockedAt] = await Promise.all([
      getTrophyLedger(),
      getRelockLog(),
    ]);
    set({ ledger, relockedAt, hydrated: true });
  },

  async recompute(entries, now = new Date().toISOString()) {
    const statuses = evaluateAll(entries);
    // Decide against the OLD ledger/relock log (before stamping), so "earned
    // before" is judged correctly.
    const decision = decideCelebrations(
      get().statuses,
      statuses,
      get().ledger,
      { relockedAt: get().relockedAt },
      now,
    );
    const applied = applyUnlocks(get().ledger, statuses, now);
    const relockChanged =
      JSON.stringify(decision.state.relockedAt) !==
      JSON.stringify(get().relockedAt);
    set({
      statuses,
      ledger: applied.ledger,
      relockedAt: decision.state.relockedAt,
    });
    if (applied.changed) await saveTrophyLedger(applied.ledger);
    if (relockChanged) await saveRelockLog(decision.state.relockedAt);
    return decision;
  },

  async clear() {
    set({ ledger: {}, relockedAt: {}, statuses: evaluateAll([]) });
    await Promise.all([saveTrophyLedger({}), saveRelockLog({})]);
  },
}));
