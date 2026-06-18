"use client";

/** Hydrates every store from IndexedDB once on mount, then triggers a
 *  background sync. Renders children immediately — the UI shows cached data
 *  first (offline-first) and updates in place when sync lands. */
import { useEffect } from "react";
import { getTrophy } from "@/lib/domain/achievements";
import type { CelebrationDecision } from "@/lib/domain/celebrations";
import { detectAlerts } from "@/lib/domain/detectAlerts";
import { weightedAverage } from "@/lib/domain/libretto";
import { useAlerts } from "@/lib/state/alerts";
import { type CelebrationItem, useCelebration } from "@/lib/state/celebration";
import { useFocusSessions, useLibretto, useNotes, useTasks } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useTrophies } from "@/lib/state/trophies";
import { UID_STORAGE_KEY, useAuth } from "@/lib/supabase/auth";
import {
  isApplyingRemote,
  resetLocalData,
  startCloudSync,
  stopCloudSync,
} from "@/lib/supabase/sync";

/** Turn a recompute decision into queued celebrations (event → scenic,
 *  threshold → toast), skipping any trophy id we can't resolve. */
function queueCelebrations(decision: CelebrationDecision): void {
  const items: Omit<CelebrationItem, "key">[] = [];
  for (const id of decision.scenic) {
    const t = getTrophy(id);
    if (t) items.push({ trophyId: id, title: t.title, condition: t.condition, kind: "scenic" });
  }
  for (const id of decision.toast) {
    const t = getTrophy(id);
    if (t) items.push({ trophyId: id, title: t.title, condition: t.condition, kind: "toast" });
  }
  useCelebration.getState().enqueue(items);
}

/** Recompute the smart alerts from the freshly-synced data and store them.
 *  `previousExamIds` / `previousMedia` are captured *before* the sync so
 *  NUOVO_ESAME and MEDIA_CAMBIATA can diff against the prior state. */
function detectAndStoreAlerts(
  previousExamIds: string[],
  previousMedia: number | null,
): void {
  const synced = useSynced.getState();
  const alerts = detectAlerts({
    classEvents: synced.classEvents,
    examCalls: synced.examCalls,
    previousExamIds,
    libroEntries: useLibretto.getState().items,
    previousMedia,
    syncMeta: synced.syncMeta,
    now: new Date(),
  });
  useAlerts.getState().setAlerts(alerts);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const authStatus = useAuth((s) => s.status);
  const userId = useAuth((s) => s.user?.id ?? null);
  const email = useAuth((s) => s.email);

  useEffect(() => {
    // Optional online layer: no-op when Supabase isn't configured.
    useAuth.getState().hydrate();
    let cancelled = false;
    let unsubscribeTrophies: (() => void) | undefined;
    (async () => {
      await useSettings.getState().hydrate();
      await Promise.all([
        useSynced.getState().hydrate(),
        useLibretto.getState().hydrate(),
        useNotes.getState().hydrate(),
        useTasks.getState().hydrate(),
        useFocusSessions.getState().hydrate(),
      ]);
      if (cancelled) return;
      // Smart alerts: load any persisted (still-dismissed) alerts, then drop
      // whatever has expired since the last run.
      await useAlerts.getState().hydrate();
      if (cancelled) return;
      useAlerts.getState().clearExpired(new Date());
      // Trophies are a consequence of the libretto: load the first-unlock
      // ledger, do one pass against the freshly-hydrated exams, then recompute
      // on every later libretto change. This single subscription is the unlock
      // hook for *all* save paths — form, CSV, Delphi import, cloud reconcile,
      // deletion — so no individual handler has to remember to fire it.
      await useTrophies.getState().hydrate();
      if (cancelled) return;
      // Bootstrap pass: stamp the ledger against the freshly-loaded exams but
      // never animate — trophies earned before this session are not news.
      void useTrophies.getState().recompute(useLibretto.getState().items);
      unsubscribeTrophies = useLibretto.subscribe((state, prev) => {
        if (state.items === prev.items) return;
        // Capture suppression synchronously: a cloud reconcile mutates the
        // libretto with `applying` true *now*, but it may flip false before the
        // async recompute resolves — checking inside `.then` would race and
        // replay the cloud account's existing trophies on sign-in.
        const suppress = isApplyingRemote();
        void useTrophies
          .getState()
          .recompute(state.items)
          .then((decision) => {
            if (!suppress) queueCelebrations(decision);
          });
      });
      // Capture pre-sync state so detection can diff for new exams / media.
      const prevExamIds = useSynced.getState().examCalls.map((e) => e.id);
      const prevMedia = weightedAverage(useLibretto.getState().items) ?? null;
      await useSynced.getState().sync();
      if (cancelled) return;
      detectAndStoreAlerts(prevExamIds, prevMedia);
    })();
    return () => {
      cancelled = true;
      unsubscribeTrophies?.();
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
      // Pre-sync snapshot for new-exam / media diffing (see mount effect).
      const prevExamIds = useSynced.getState().examCalls.map((e) => e.id);
      const prevMedia = weightedAverage(useLibretto.getState().items) ?? null;
      await useSynced.getState().sync();
      if (cancelled) return;
      detectAndStoreAlerts(prevExamIds, prevMedia);
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, email]);

  // Returning to the app drops alerts that expired while it was backgrounded,
  // so the user never sees a stale "scade tra 2 ore" on resume.
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "visible") {
        useAlerts.getState().clearExpired(new Date());
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return <>{children}</>;
}
