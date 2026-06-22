/**
 * Pure detection of smart alerts from the current synced + manual data.
 * Deterministic: every clock read arrives via `now`; same inputs → same output.
 * No storage, no network. The store persists the result and tracks dismissals;
 * this module only decides *what* should be raised right now.
 *
 * Ids are stable (cyrb53 of the alert's identifying parts) so running detection
 * after every sync re-emits the same id for the same underlying event and the
 * store deduplicates instead of accumulating.
 */
import { stableId } from "@/lib/sync/util";
import { weightedAverage } from "./libretto";
import { Alert, AlertType } from "./alerts";
import type { ClassEvent, ExamCall, IsoDate, LibrettoEntry } from "./types";
import type { SyncMeta } from "@/lib/storage/types";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
/** Booking-deadline radar: only within this many hours of closing. */
const BOOKING_WINDOW_HOURS = 48;

const TITLE_MAX = 60;
const MESSAGE_MAX = 120;

/** Inputs to one detection pass: the current synced + manual data plus the clock. */
export interface DetectAlertsParams {
  classEvents: ClassEvent[];
  examCalls: ExamCall[];
  /** Exam ids known before this sync — anything new is a NUOVO_ESAME. */
  previousExamIds: string[];
  libroEntries: LibrettoEntry[];
  /** The weighted average before the latest grade, or null when unknown. */
  previousMedia: number | null;
  syncMeta: SyncMeta[];
  now: Date;
}

/**
 * Run every detector over the current data and return all alerts that should be
 * raised right now. Deterministic for a given `params` (including `params.now`).
 * @param params The synced + manual data plus the clock to evaluate against.
 * @returns The alerts to raise, with stable ids for store-side deduplication.
 */
export function detectAlerts(params: DetectAlertsParams): Alert[] {
  return [
    ...bookingDeadlineAlerts(params),
    ...scheduleConflictAlerts(params),
    ...newExamAlerts(params),
    ...averageChangedAlerts(params),
    ...syncFailureAlerts(params),
  ];
}

// ── helpers ───────────────────────────────────────────────────────────────

/** Trim to `max` chars with an ellipsis, never cutting mid-whitespace ugly. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function makeAlert(a: {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  expiresAt: Date;
  sourceId?: string;
  now: Date;
}): Alert {
  return {
    id: a.id,
    type: a.type,
    title: clamp(a.title, TITLE_MAX),
    message: clamp(a.message, MESSAGE_MAX),
    expiresAt: a.expiresAt,
    sourceId: a.sourceId,
    createdAt: a.now,
  };
}

/** Last instant of an IsoDate (UTC) — a date-only deadline still "ends" the day. */
function endOfDay(date: IsoDate): Date {
  return new Date(
    Date.UTC(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      23,
      59,
      59,
      999,
    ),
  );
}

/** dd/mm/yyyy from an IsoDate, no zone math (the date is already a day). */
function itDate(date: IsoDate): string {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

/** Two decimals, Italian comma. */
function itNumber(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

// ── SCADENZA_APPELLO ────────────────────────────────────────────────────────
// Booking window closing within 48h. The source exposes a date-only
// `booking.closesAt`; we treat the end of that day as the deadline instant.

function bookingDeadlineAlerts({ examCalls, now }: DetectAlertsParams): Alert[] {
  const out: Alert[] = [];
  for (const e of examCalls) {
    const closesAt = e.booking?.closesAt;
    if (!closesAt) continue;
    const deadline = endOfDay(closesAt);
    const remainingMs = deadline.getTime() - now.getTime();
    if (remainingMs <= 0 || remainingMs > BOOKING_WINDOW_HOURS * HOUR_MS) continue;
    const hours = Math.ceil(remainingMs / HOUR_MS);
    out.push(
      makeAlert({
        id: stableId(AlertType.SCADENZA_APPELLO, e.id),
        type: AlertType.SCADENZA_APPELLO,
        title: "Scadenza prenotazione",
        message: `La prenotazione per ${e.courseName} scade tra ${hours} ${hours === 1 ? "ora" : "ore"}`,
        expiresAt: deadline,
        sourceId: e.id,
        now,
      }),
    );
  }
  return out;
}

// ── CONFLITTO_ORARIO ──────────────────────────────────────────────────────
// Two lessons of different courses on the same calendar day whose [start,end)
// intervals overlap. Each unordered pair is reported once.

function scheduleConflictAlerts({ classEvents, now }: DetectAlertsParams): Alert[] {
  // Group by UTC calendar day; only days that haven't ended yet can matter.
  const byDay = new Map<string, ClassEvent[]>();
  for (const e of classEvents) {
    const day = e.start.slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  }

  const out: Alert[] = [];
  const seen = new Set<string>();
  for (const [day, events] of byDay) {
    const dayEnd = endOfDay(day);
    if (dayEnd.getTime() <= now.getTime()) continue; // whole day already past
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        if (a.courseName === b.courseName) continue;
        const aStart = Date.parse(a.start);
        const aEnd = Date.parse(a.end);
        const bStart = Date.parse(b.start);
        const bEnd = Date.parse(b.end);
        if (aStart >= bEnd || bStart >= aEnd) continue; // no overlap
        const [id1, id2] = [a.id, b.id].sort();
        const pairKey = `${id1}|${id2}`;
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);
        out.push(
          makeAlert({
            id: stableId(AlertType.CONFLITTO_ORARIO, id1, id2),
            type: AlertType.CONFLITTO_ORARIO,
            title: "Conflitto di orario",
            message: `${a.courseName} e ${b.courseName} si sovrappongono`,
            expiresAt: dayEnd,
            sourceId: id1,
            now,
          }),
        );
      }
    }
  }
  return out;
}

// ── NUOVO_ESAME ─────────────────────────────────────────────────────────────
// Any exam call whose id wasn't present before the latest sync.

function newExamAlerts({ examCalls, previousExamIds, now }: DetectAlertsParams): Alert[] {
  if (previousExamIds.length === 0) return []; // first sync: everything is "new", say nothing
  const known = new Set(previousExamIds);
  const out: Alert[] = [];
  for (const e of examCalls) {
    if (known.has(e.id)) continue;
    out.push(
      makeAlert({
        id: stableId(AlertType.NUOVO_ESAME, e.id),
        type: AlertType.NUOVO_ESAME,
        title: "Nuovo appello disponibile",
        message: `${e.courseName} — ${itDate(e.date)}`,
        expiresAt: endOfDay(e.date),
        sourceId: e.id,
        now,
      }),
    );
  }
  return out;
}

// ── MEDIA_CAMBIATA ──────────────────────────────────────────────────────────
// The weighted average moved vs. the previously-known value. Compared at two
// decimals so floating noise never raises a phantom change.

function averageChangedAlerts({
  libroEntries,
  previousMedia,
  now,
}: DetectAlertsParams): Alert[] {
  if (previousMedia === null) return [];
  const current = weightedAverage(libroEntries);
  if (current === undefined) return [];
  const prev = Number(previousMedia.toFixed(2));
  const curr = Number(current.toFixed(2));
  if (prev === curr) return [];
  return [
    makeAlert({
      id: stableId(AlertType.MEDIA_CAMBIATA, prev, curr),
      type: AlertType.MEDIA_CAMBIATA,
      title: "Media aggiornata",
      message: `La tua media è passata da ${itNumber(prev)} a ${itNumber(curr)}`,
      expiresAt: new Date(now.getTime() + 7 * DAY_MS),
      now,
    }),
  ];
}

// ── SYNC_FALLITO ────────────────────────────────────────────────────────────
// Every failed source collapses into ONE alert listing the unreachable labels.

function syncFailureAlerts({ syncMeta, now }: DetectAlertsParams): Alert[] {
  const failed = syncMeta.filter((m) => m.ok === false);
  if (failed.length === 0) return [];
  const ids = failed.map((m) => m.sourceId).sort();
  const labels = ids.join(", ");
  return [
    makeAlert({
      id: stableId(AlertType.SYNC_FALLITO, ...ids),
      type: AlertType.SYNC_FALLITO,
      title: "Sincronizzazione parziale",
      message: `Alcune fonti non raggiungibili: ${labels}`,
      expiresAt: new Date(now.getTime() + 24 * HOUR_MS),
      now,
    }),
  ];
}
