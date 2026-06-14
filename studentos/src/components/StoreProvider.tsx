"use client";

/** Hydrates every store from IndexedDB once on mount, then triggers a
 *  background sync. Renders children immediately — the UI shows cached data
 *  first (offline-first) and updates in place when sync lands. */
import { useEffect } from "react";
import { useDelphi } from "@/lib/state/delphi";
import { useFocusSessions, useLibretto, useNotes, useTasks } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useAuth } from "@/lib/supabase/auth";
import { startCloudSync, stopCloudSync } from "@/lib/supabase/sync";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const authStatus = useAuth((s) => s.status);

  useEffect(() => {
    // Optional online layer: no-op when Supabase isn't configured.
    useAuth.getState().hydrate();
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

  // Cloud sync follows the auth session. No-op offline / signed-out.
  useEffect(() => {
    if (authStatus !== "signedIn") {
      stopCloudSync();
      return;
    }
    const user = useAuth.getState().user;
    if (!user) return;
    let cancelled = false;
    (async () => {
      // local cache must be hydrated before we reconcile against the cloud
      await useSettings.getState().hydrate();
      await Promise.all([
        useLibretto.getState().hydrate(),
        useNotes.getState().hydrate(),
        useTasks.getState().hydrate(),
        useFocusSessions.getState().hydrate(),
      ]);
      if (cancelled) return;
      await startCloudSync(user.id, user.email ?? null);
      if (!cancelled) void useSynced.getState().sync();
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  return <>{children}</>;
}
