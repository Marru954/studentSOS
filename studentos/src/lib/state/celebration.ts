"use client";

/** Serialized queue of pending trophy celebrations. Events render a full-screen
 *  scenic; thresholds a corner toast. One plays at a time (FIFO) so nothing
 *  stacks or clobbers — the host advances with `shift()` when each finishes. */
import { create } from "zustand";

export interface CelebrationItem {
  /** Monotonic key so the host can re-arm timers even for repeat trophies. */
  key: number;
  trophyId: string;
  title: string;
  condition: string;
  kind: "scenic" | "toast";
}

interface CelebrationStore {
  queue: CelebrationItem[];
  nextKey: number;
  enqueue(items: Omit<CelebrationItem, "key">[]): void;
  shift(): void;
}

export const useCelebration = create<CelebrationStore>()((set, get) => ({
  queue: [],
  nextKey: 1,

  enqueue(items) {
    if (items.length === 0) return;
    let key = get().nextKey;
    const added = items.map((item) => ({ ...item, key: key++ }));
    set({ queue: [...get().queue, ...added], nextKey: key });
  },

  shift() {
    set({ queue: get().queue.slice(1) });
  },
}));
