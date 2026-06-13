/** Italian display formatters for the UI. Always the user's local zone —
 *  domain data stays UTC, conversion happens only at render time. These run
 *  client-side after hydration, so server/client zone drift can't mismatch. */
import type { IsoDate } from "@/lib/domain/types";

const time = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
});
const dayMonth = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
});
const longDay = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const isoDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "09:30" from an ISO datetime. */
export function fmtTime(iso: string): string {
  return time.format(new Date(iso));
}

/** "15/06" from an ISO datetime. */
export function fmtDayMonth(iso: string): string {
  return dayMonth.format(new Date(iso));
}

/** "venerdì 12 giugno" from a Date. */
export function fmtLongDay(date: Date): string {
  return longDay.format(date);
}

const monthYear = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
});

/** "marzo 2027" from a Date — for coarse projections. */
export function fmtMonthYear(date: Date): string {
  return monthYear.format(date);
}

/** "19/06/2026" from a plain IsoDate — no zone conversion, it's already a day. */
export function fmtPlainDate(date: IsoDate): string {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

/** The local calendar day of an ISO datetime, as YYYY-MM-DD. */
export function localDayOf(iso: string): IsoDate {
  return isoDay.format(new Date(iso));
}

/** Today as YYYY-MM-DD in the local zone. */
export function localToday(now: Date): IsoDate {
  return isoDay.format(now);
}

const DAY_MS = 86_400_000;

function dayStartUtc(date: IsoDate): number {
  return Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
}

/** Whole calendar days between two plain IsoDates (positive = `to` later). */
export function daysBetweenIso(from: IsoDate, to: IsoDate): number {
  return Math.round((dayStartUtc(to) - dayStartUtc(from)) / DAY_MS);
}

/** Whole calendar days from today (local) to `date`: 0 oggi, 1 domani. */
export function daysFromToday(date: IsoDate, now: Date): number {
  return daysBetweenIso(localToday(now), date);
}

/** "19/06" from a plain IsoDate. */
export function fmtPlainDayMonth(date: IsoDate): string {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
}

/** Monday 00:00 (local) of the week containing `date`. */
export function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Number with Italian decimal comma: fmtNum(27.5, 2) → "27,50". */
export function fmtNum(value: number, digits = 0): string {
  return value.toFixed(digits).replace(".", ",");
}

/** "85" minutes → "1h 25m"; under an hour → "45m". */
export function fmtMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}
