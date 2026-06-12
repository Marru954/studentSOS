/**
 * Predictive urgency engine. Pure and deterministic: every clock read comes
 * in via `now`, every locale-sensitive time via `timeZone` — same inputs,
 * same output. The dashboard recomputes on each data change; nothing here
 * touches storage or network.
 */
import { stableId } from "@/lib/sync/util";
import type {
  ClassEvent,
  ExamCall,
  IsoDate,
  Urgency,
  UrgencySeverity,
} from "./types";

export interface UrgencyOptions {
  /** IANA zone for day/time labels and "today" resolution. Defaults to the
   *  runtime's local zone; tests pass "UTC" for determinism. */
  timeZone?: string;
}

const DAY_MS = 86_400_000;
/** Class overlaps further out than this are noise, not urgencies. */
const OVERLAP_HORIZON_DAYS = 14;
/** Booking deadlines enter the radar this many days before closing. */
const BOOKING_WINDOW_DAYS = 7;
/** Exams enter the radar this many days before the call. */
const IMMINENT_WINDOW_DAYS = 7;

const SEVERITY_RANK: Record<UrgencySeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export function computeUrgencies(
  classEvents: ClassEvent[],
  examCalls: ExamCall[],
  now: Date,
  options: UrgencyOptions = {},
): Urgency[] {
  const ctx = makeContext(now, options.timeZone);
  const all = [
    ...classOverlaps(classEvents, ctx),
    ...examOverlaps(examCalls, ctx),
    ...bookingDeadlines(examCalls, ctx),
    ...roomChanges(classEvents, ctx),
    ...imminentExams(examCalls, ctx),
  ];

  const unique = new Map<string, Urgency>();
  for (const u of all) {
    if (Date.parse(u.expiresAt) <= now.getTime()) continue;
    unique.set(u.id, u);
  }
  return [...unique.values()].sort(
    (a, b) =>
      SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
      a.expiresAt.localeCompare(b.expiresAt),
  );
}

// ── shared context: clock + formatters ──────────────────────────────────────

interface Ctx {
  now: Date;
  /** Today as YYYY-MM-DD in the target zone. */
  today: IsoDate;
  /** "15/06" from an ISO datetime, in the target zone. */
  dayOf(iso: string): string;
  /** "09:30" from an ISO datetime, in the target zone. */
  timeOf(iso: string): string;
}

function makeContext(now: Date, timeZone?: string): Ctx {
  // en-CA yields YYYY-MM-DD — the cheapest zone-correct "today".
  const isoDay = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dayFmt = new Intl.DateTimeFormat("it-IT", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
  });
  const timeFmt = new Intl.DateTimeFormat("it-IT", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    now,
    today: isoDay.format(now),
    dayOf: (iso) => dayFmt.format(new Date(iso)),
    timeOf: (iso) => timeFmt.format(new Date(iso)),
  };
}

function dayStartUtc(date: IsoDate): number {
  return Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
}

/** Whole calendar days from today to `date` (0 = today, negative = past). */
function daysUntil(date: IsoDate, ctx: Ctx): number {
  return Math.round((dayStartUtc(date) - dayStartUtc(ctx.today)) / DAY_MS);
}

/** "12/06" from a plain IsoDate — no zone math, the date is already a day. */
function plainDayLabel(date: IsoDate): string {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
}

function endOfDayIso(date: IsoDate): string {
  return `${date}T23:59:59.000Z`;
}

function relativeDayLabel(days: number, date: IsoDate): string {
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `il ${plainDayLabel(date)}`;
}

// ── rules ───────────────────────────────────────────────────────────────────

function activeUpcoming(events: ClassEvent[], ctx: Ctx): ClassEvent[] {
  const horizon = ctx.now.getTime() + OVERLAP_HORIZON_DAYS * DAY_MS;
  return events
    .filter((e) => e.change?.field !== "cancelled")
    .filter(
      (e) => Date.parse(e.end) > ctx.now.getTime() && Date.parse(e.start) < horizon,
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Two future lessons of different courses sharing wall-clock time. */
function classOverlaps(events: ClassEvent[], ctx: Ctx): Urgency[] {
  const upcoming = activeUpcoming(events, ctx);
  const out: Urgency[] = [];
  for (let i = 0; i < upcoming.length; i++) {
    const a = upcoming[i];
    for (let j = i + 1; j < upcoming.length; j++) {
      const b = upcoming[j];
      if (b.start >= a.end) break; // sorted by start: nothing later overlaps a
      if (a.courseName === b.courseName) continue;
      out.push({
        id: stableId("urg", "class-overlap", ...[a.id, b.id].sort()),
        kind: "class-overlap",
        severity: "warning",
        message: `Sovrapposizione il ${ctx.dayOf(a.start)}: «${a.courseName}» e «${b.courseName}» alle ${ctx.timeOf(b.start)}`,
        expiresAt: a.end < b.end ? a.end : b.end,
        relatedIds: [a.id, b.id],
      });
    }
  }
  return out;
}

/** Two exam calls on the same day; same declared time is critical. */
function examOverlaps(exams: ExamCall[], ctx: Ctx): Urgency[] {
  const byDate = new Map<IsoDate, ExamCall[]>();
  for (const e of exams) {
    if (daysUntil(e.date, ctx) < 0) continue;
    byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]);
  }
  const out: Urgency[] = [];
  for (const [date, calls] of byDate) {
    for (let i = 0; i < calls.length; i++) {
      for (let j = i + 1; j < calls.length; j++) {
        const [a, b] = [calls[i], calls[j]];
        if (a.courseName === b.courseName) continue;
        const sameTime = Boolean(a.time && b.time && a.time === b.time);
        out.push({
          id: stableId("urg", "exam-overlap", ...[a.id, b.id].sort()),
          kind: "exam-overlap",
          severity: sameTime ? "critical" : "warning",
          message: sameTime
            ? `Due appelli il ${plainDayLabel(date)} alla stessa ora (${a.time}): «${a.courseName}» e «${b.courseName}»`
            : `Due appelli il ${plainDayLabel(date)}: «${a.courseName}» e «${b.courseName}»`,
          expiresAt: endOfDayIso(date),
          relatedIds: [a.id, b.id],
        });
      }
    }
  }
  return out;
}

/** Booking window closing within BOOKING_WINDOW_DAYS. */
function bookingDeadlines(exams: ExamCall[], ctx: Ctx): Urgency[] {
  const out: Urgency[] = [];
  for (const e of exams) {
    const closesAt = e.booking?.closesAt;
    if (!closesAt) continue;
    const days = daysUntil(closesAt, ctx);
    if (days < 0 || days > BOOKING_WINDOW_DAYS) continue;
    out.push({
      id: stableId("urg", "booking-deadline", e.id, closesAt),
      kind: "booking-deadline",
      severity: days <= 2 ? "critical" : "warning",
      message: `L'iscrizione all'appello di «${e.courseName}» chiude ${relativeDayLabel(days, closesAt)}`,
      expiresAt: endOfDayIso(closesAt),
      relatedIds: [e.id],
    });
  }
  return out;
}

/** Future lessons the diff engine flagged as moved to another room. */
function roomChanges(events: ClassEvent[], ctx: Ctx): Urgency[] {
  const out: Urgency[] = [];
  for (const e of events) {
    if (e.change?.field !== "room") continue;
    if (Date.parse(e.end) <= ctx.now.getTime()) continue;
    out.push({
      id: stableId("urg", "room-change", e.id),
      kind: "room-change",
      severity: "warning",
      message: `Cambio aula: «${e.courseName}» del ${ctx.dayOf(e.start)} alle ${ctx.timeOf(e.start)}${e.room ? ` si tiene in ${e.room}` : ""}`,
      expiresAt: e.end,
      relatedIds: [e.id],
    });
  }
  return out;
}

/** Exam calls within IMMINENT_WINDOW_DAYS, escalating as the day nears. */
function imminentExams(exams: ExamCall[], ctx: Ctx): Urgency[] {
  const out: Urgency[] = [];
  for (const e of exams) {
    const days = daysUntil(e.date, ctx);
    if (days < 0 || days > IMMINENT_WINDOW_DAYS) continue;
    const when =
      days === 0 ? "oggi" : days === 1 ? "domani" : `tra ${days} giorni`;
    out.push({
      id: stableId("urg", "exam-imminent", e.id),
      kind: "exam-imminent",
      severity: days <= 1 ? "critical" : days <= 3 ? "warning" : "info",
      message: `Appello di «${e.courseName}» ${when} (${plainDayLabel(e.date)}${e.time ? `, ore ${e.time}` : ""})`,
      expiresAt: endOfDayIso(e.date),
      relatedIds: [e.id],
    });
  }
  return out;
}
