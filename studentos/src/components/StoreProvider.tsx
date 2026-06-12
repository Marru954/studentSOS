"use client";

/** Hydrates every store from IndexedDB once on mount, then triggers a
 *  background sync. Renders children immediately — the UI shows cached data
 *  first (offline-first) and updates in place when sync lands. */
import { useEffect } from "react";
import { useDelphi } from "@/lib/state/delphi";
import { useFocusSessions, useLibretto, useNotes, useTasks } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await useSettings.getState().hydrate();
      await Promise.all([
        useSynced.getState().hydrate(),
        useLibretto.getState().hydrate(),
        useNotes.getState().hydrate(),
        useTasks.getState().hydrate(),
        useFocusSessions.getState().hydrate(),
      ]);
      if (!cancelled) {
        void useSynced.getState().sync();
        // auto-syncs the libretto when Delphi credentials are saved
        void useDelphi.getState().hydrate();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
