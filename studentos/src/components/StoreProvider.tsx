"use client";

/** Hydrates every store from IndexedDB once on mount, then triggers a
 *  background sync. Renders children immediately — the UI shows cached data
 *  first (offline-first) and updates in place when sync lands. */
import { useEffect } from "react";
import { useFocusSessions, useLibretto, useNotes, useTasks } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { UID_STORAGE_KEY, useAuth } from "@/lib/supabase/auth";
import { resetLocalData, startCloudSync, stopCloudSync } from "@/lib/supabase/sync";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const authStatus = useAuth((s) => s.status);
  const userId = useAuth((s) => s.user?.id ?? null);
  const email = useAuth((s) => s.email);

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
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cloud sync follows the *account*. Keyed on the user id so switching account
  // (a different uid, even without an explicit sign-out) re-runs this: we wipe
  // the previous user's local cache before touching the new account's data.
  // `reconciled` gates the onboarding redirect so it never fires on stale
  // settings while the cloud profile is still being applied.
  useEffect(() => {
    if (authStatus !== "signedIn" || !userId) {
      stopCloudSync();
      // offline / signed-out → local settings are authoritative right away.
      useAuth.setState({ reconciled: true });
      return;
    }
    let cancelled = false;
    useAuth.setState({ reconciled: false });
    (async () => {
      // Account switch on this browser → drop everything from the previous user
      // BEFORE hydrating, so nothing of theirs can show or migrate upward.
      const prevUid =
        typeof window !== "undefined"
          ? localStorage.getItem(UID_STORAGE_KEY)
          : null;
      if (prevUid && prevUid !== userId) {
        await resetLocalData();
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(UID_STORAGE_KEY, userId);
      }
      if (cancelled) return;
      // local cache must be hydrated before we reconcile against the cloud
      await useSettings.getState().hydrate();
      await Promise.all([
        useLibretto.getState().hydrate(),
        useNotes.getState().hydrate(),
        useTasks.getState().hydrate(),
        useFocusSessions.getState().hydrate(),
      ]);
      if (cancelled) return;
      try {
        await startCloudSync(userId, email ?? null);
      } catch {
        // cloud unreachable → degrade to local; never trap the onboarding gate
      }
      if (cancelled) return;
      useAuth.setState({ reconciled: true });
      void useSynced.getState().sync();
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, email]);

  return <>{children}</>;
}
