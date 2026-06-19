"use client";

/** Smart-alerts store: in-memory mirror of the derived alert list plus the
 *  user's manual dismissals. Write-through to the IndexedDB `settings` bucket
 *  (key "alerts") so dismissals survive reloads. `hydrate()` is called once by
 *  StoreProvider; `setAlerts` is fed by `detectAlerts` after every sync. */
import { create } from "zustand";
import { type Alert, type AlertType, isAlertActive } from "@/lib/domain/alerts";
import { getStoredAlerts, saveStoredAlerts } from "@/lib/storage/repo";

interface AlertsState {
  alerts: Alert[];
  lastCheckedAt: Date | null;
  hydrated: boolean;

  hydrate(): Promise<void>;
  /** Replace the active alert set with a freshly-detected one, carrying over
   *  the `dismissedAt` of any alert the user had already closed (same id) so a
   *  manual dismissal is never undone by the next detection pass. */
  setAlerts(alerts: Alert[]): void;
  /** Mark one alert dismissed (now). */
  dismiss(id: string): void;
  /** Drop every alert that is no longer active (dismissed or expired). */
  clearExpired(now: Date): void;
  /** Wipe everything (e.g. account switch). */
  clear(): void;

  /** Active alerts (not dismissed, not expired) — the UI reads this. */
  activeAlerts(now: Date): Alert[];
  /** Active alerts of one type — for contextual banners. */
  activeByType(type: AlertType, now: Date): Alert[];
}

export const useAlerts = create<AlertsState>()((set, get) => {
  function persist(): void {
    void saveStoredAlerts({ alerts: get().alerts, lastCheckedAt: get().lastCheckedAt });
  }

  return {
    alerts: [],
    lastCheckedAt: null,
    hydrated: false,

    async hydrate() {
      if (get().hydrated) return;
      const stored = await getStoredAlerts();
      set({ alerts: stored.alerts, lastCheckedAt: stored.lastCheckedAt, hydrated: true });
    },

    setAlerts(alerts) {
      const dismissed = new Map(
        get().alerts.filter((a) => a.dismissedAt).map((a) => [a.id, a.dismissedAt!]),
      );
      const merged = alerts.map((a) =>
        dismissed.has(a.id) ? { ...a, dismissedAt: dismissed.get(a.id) } : a,
      );
      set({ alerts: merged, lastCheckedAt: new Date() });
      persist();
    },

    dismiss(id) {
      const now = new Date();
      set({
        alerts: get().alerts.map((a) =>
          a.id === id ? { ...a, dismissedAt: now } : a,
        ),
      });
      persist();
    },

    clearExpired(now) {
      set({ alerts: get().alerts.filter((a) => isAlertActive(a, now)) });
      persist();
    },

    clear() {
      set({ alerts: [], lastCheckedAt: null });
      persist();
    },

    activeAlerts(now) {
      return get().alerts.filter((a) => isAlertActive(a, now));
    },

    activeByType(type, now) {
      return get().alerts.filter((a) => a.type === type && isAlertActive(a, now));
    },
  };
});
