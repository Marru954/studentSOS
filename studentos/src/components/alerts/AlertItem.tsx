"use client";

/** A single smart alert row: a type-specific icon, the title + message, and a
 *  dismiss button. Presentational — the parent owns the alert list and passes
 *  `onDismiss`; this component only renders one `Alert` and reports clicks.
 *  Colour tone tracks urgency: warn for time-critical (booking deadline, clash),
 *  signal for informative (new exam, average moved), muted for the neutral sync
 *  failure. Icon set mirrors the rest of the app (lucide). */
import {
  Clock,
  TriangleAlert,
  CalendarPlus,
  TrendingUp,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { type Alert, AlertType } from "@/lib/domain/alerts";

/** Icon per alert type. `TriangleAlert` is lucide's current name for the old
 *  `AlertTriangle` (kept consistent with `SyncFailureBanner`). */
const ICONS: Record<AlertType, LucideIcon> = {
  [AlertType.SCADENZA_APPELLO]: Clock,
  [AlertType.CONFLITTO_ORARIO]: TriangleAlert,
  [AlertType.NUOVO_ESAME]: CalendarPlus,
  [AlertType.MEDIA_CAMBIATA]: TrendingUp,
  [AlertType.SYNC_FALLITO]: WifiOff,
};

/** Colour tone per type: warn = urgent, signal = informative, muted = neutral. */
const TONES: Record<AlertType, string> = {
  [AlertType.SCADENZA_APPELLO]: "text-warn",
  [AlertType.CONFLITTO_ORARIO]: "text-warn",
  [AlertType.NUOVO_ESAME]: "text-signal",
  [AlertType.MEDIA_CAMBIATA]: "text-signal",
  [AlertType.SYNC_FALLITO]: "text-ink-mute",
};

export function AlertItem({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICONS[alert.type];
  const tone = TONES[alert.type];

  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${tone}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{alert.title}</p>
        <p className="text-sm text-ink-mute">{alert.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(alert.id)}
        aria-label={`Chiudi avviso: ${alert.title}`}
        className="shrink-0 rounded-md p-1 text-ink-mute transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
