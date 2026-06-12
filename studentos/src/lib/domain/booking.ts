/**
 * Booking-window state for an exam call. Pure: `today` comes from the
 * caller. EasyAcademy doesn't expose booking windows (enrollment lives on
 * Esse3/Delphi), so for those sources this resolves to "none" — the future
 * Esse3 adapter will populate `booking` and light these states up.
 */
import { daysBetweenIso } from "@/lib/format";
import type { ExamCall, IsoDate } from "./types";

export type BookingState =
  | { kind: "none" }
  | { kind: "opens"; opensAt: IsoDate }
  | { kind: "open"; closesAt?: IsoDate; daysLeft?: number }
  | { kind: "closing"; closesAt: IsoDate; daysLeft: number }
  | { kind: "closed"; closesAt: IsoDate };

/** Within this many days of closing, "open" escalates to "closing". */
const CLOSING_DAYS = 3;

export function bookingState(
  booking: ExamCall["booking"],
  today: IsoDate,
): BookingState {
  if (!booking || (!booking.opensAt && !booking.closesAt)) {
    return { kind: "none" };
  }
  if (booking.opensAt && today < booking.opensAt) {
    return { kind: "opens", opensAt: booking.opensAt };
  }
  if (!booking.closesAt) return { kind: "open" };

  const daysLeft = daysBetweenIso(today, booking.closesAt);
  if (daysLeft < 0) return { kind: "closed", closesAt: booking.closesAt };
  if (daysLeft <= CLOSING_DAYS) {
    return { kind: "closing", closesAt: booking.closesAt, daysLeft };
  }
  return { kind: "open", closesAt: booking.closesAt, daysLeft };
}
