"use client";

/** Contextual alert banner for a given route. `types` filters which alert kinds
 *  this banner surfaces (e.g. /orario passes [CONFLITTO_ORARIO, SYNC_FALLITO]),
 *  so each page shows only the alerts relevant to it. Reads the active alert set
 *  from the store reactively; renders nothing (no layout space) when there is
 *  nothing to show. Up to `maxVisible` items render, with an "e altri N" line
 *  for the rest. Dismissals go straight back to the store. */
import { useAlerts } from "@/lib/state/alerts";
import { type AlertType } from "@/lib/domain/alerts";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { AlertItem } from "./AlertItem";

const DEFAULT_MAX_VISIBLE = 3;

export function AlertBanner({
  types,
  maxVisible = DEFAULT_MAX_VISIBLE,
}: {
  types: AlertType[];
  maxVisible?: number;
}) {
  const now = useNowMinute();
  const alerts = useAlerts((s) => s.alerts);
  const dismiss = useAlerts((s) => s.dismiss);

  // `now` is null on the server snapshot and the very first client paint
  // (useSyncExternalStore) — render nothing until the clock ticks, matching the
  // app's skeleton-on-SSR convention and avoiding any hydration mismatch.
  if (!now) return null;

  // Derive active + type-filtered list from the reactive `alerts` slice (not the
  // `activeAlerts` selector) so the banner re-renders on every store mutation
  // and as alerts expire when `now` ticks.
  const active = alerts.filter(
    (a) =>
      types.includes(a.type) &&
      !a.dismissedAt &&
      now.getTime() <= a.expiresAt.getTime(),
  );

  if (active.length === 0) return null;

  const shown = active.slice(0, maxVisible);
  const extra = active.length - shown.length;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Avvisi"
      className="glass reveal flex flex-col gap-3 rounded-lg border border-warn/30 bg-warn-dim p-4"
    >
      {shown.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={dismiss} />
      ))}
      {extra > 0 && (
        <p className="pl-8 text-xs text-ink-mute">e altri {extra}</p>
      )}
    </div>
  );
}
