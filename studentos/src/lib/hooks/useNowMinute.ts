"use client";

/** Wall clock, minute resolution, as an external store: the server snapshot
 *  is null, so SSR and the first client render always agree on skeletons. */
import { useSyncExternalStore } from "react";

const MINUTE_MS = 60_000;
let nowSnapshot: Date | null = null;

function subscribeMinute(onTick: () => void): () => void {
  nowSnapshot = new Date();
  const kick = setTimeout(onTick, 0);
  const id = setInterval(() => {
    nowSnapshot = new Date();
    onTick();
  }, MINUTE_MS);
  return () => {
    clearTimeout(kick);
    clearInterval(id);
  };
}

export function useNowMinute(): Date | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => nowSnapshot,
    () => null,
  );
}
