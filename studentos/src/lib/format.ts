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

const monthAbbr = new Intl.DateTimeFormat("it-IT", { month: "short" });

/** Day-of-month without leading zero, e.g. "19" from "2026-06-19". */
export function fmtDayOfMonth(date: IsoDate): string {
  return String(Number(date.slice(8, 10)));
}

/** Italian short month, e.g. "giu" from a plain IsoDate. */
export function fmtMonthAbbr(date: IsoDate): string {
  return monthAbbr.format(new Date(`${date}T00:00:00`)).replace(".", "");
}

/** Monday 00:00 (local) of the week containing `date`. */
export function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/** A new Date `days` after `date` (negative goes back).
 *  @param date Base date (not mutated).
 *  @param days Number of days to add.
 *  @returns The shifted Date. */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Number with Italian decimal comma: fmtNum(27.5, 2) → "27,50". */
export function fmtNum(value: number, digits = 0): string {
  return value.toFixed(digits).replace(".", ",");
}

/** ISO date "2026-06-20" → "20/06/2026"; non-ISO/empty → "". */
export function formatItDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

/** "20/06/2026" (also "-"/"." separators) → ISO "2026-06-20"; invalid → null. */
export function parseItDate(display: string): string | null {
  const m = /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/.exec(display.trim());
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** "85" minutes → "1h 25m"; under an hour → "45m". */
export function fmtMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}
