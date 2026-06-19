/**
 * Smart-alerts domain model. Alerts are short-lived, derived notices surfaced
 * across the app (banner, badge, panel). They are computed from the synced and
 * manual data by `detectAlerts` (pure) and stored/dismissed by the `useAlerts`
 * store. Each alert carries a stable id so re-running detection after every sync
 * never piles up duplicates of the same underlying event.
 *
 * Dates are real `Date` objects (not ISO strings) because alerts live only in
 * memory + the IndexedDB settings bucket, both of which preserve `Date` via
 * structured clone — no parse step on read.
 */

/** The five kinds of intelligent alert StudentOS raises. */
export enum AlertType {
  /** A booking window is closing within 48h. */
  SCADENZA_APPELLO = "SCADENZA_APPELLO",
  /** Two lessons on the same day overlap in wall-clock time. */
  CONFLITTO_ORARIO = "CONFLITTO_ORARIO",
  /** An exam call appeared since the previous sync. */
  NUOVO_ESAME = "NUOVO_ESAME",
  /** A new grade moved the weighted average. */
  MEDIA_CAMBIATA = "MEDIA_CAMBIATA",
  /** One or more sync sources were unreachable. */
  SYNC_FALLITO = "SYNC_FALLITO",
}

export interface Alert {
  /** Stable across syncs: cyrb53 of type + the event's identifying parts, so
   *  the same underlying event always maps to the same id and never duplicates. */
  id: string;
  type: AlertType;
  /** Italian, ≤ 60 chars. */
  title: string;
  /** Italian detail, ≤ 120 chars. */
  message: string;
  /** When the alert stops mattering — auto-dropped once `now` passes it. */
  expiresAt: Date;
  /** Set when the user closes the alert by hand; a dismissed alert never
   *  reappears even if detection re-emits it (same id). */
  dismissedAt?: Date;
  /** id of the linked exam/lesson, when there is exactly one. */
  sourceId?: string;
  createdAt: Date;
}

/** An alert is active when it is neither dismissed nor expired. */
export function isAlertActive(alert: Alert, now: Date): boolean {
  if (alert.dismissedAt) return false;
  if (now.getTime() > alert.expiresAt.getTime()) return false;
  return true;
}
