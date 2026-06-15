/**
 * Pure RFC 5545 (iCalendar) generation — zero dependencies, framework-free,
 * deterministic. Produces a VCALENDAR string that opens in Google Calendar,
 * Apple Calendar and Outlook. Used by /appelli to export the visible future
 * exam calls to an .ics file (the browser side wraps the output in a Blob).
 *
 * Intentionally NOT importing ical.js or any other library: emitting iCal is a
 * handful of string rules and a tested pure module is far cheaper than a dep.
 */

export interface IcsEvent {
  uid: string;
  summary: string;
  /** ISO datetime string (e.g. from Date.toISOString()). */
  start: string;
  /** ISO datetime string (e.g. from Date.toISOString()). */
  end: string;
  location?: string;
  description?: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** ISO datetime → UTC basic format `YYYYMMDDTHHMMSSZ` (RFC 5545 form 2). */
export function toIcsUtc(iso: string): string {
  const d = new Date(iso);
  return (
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
    `T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`
  );
}

/** Escape a TEXT value per RFC 5545 §3.3.11: backslash, semicolon, comma and
 *  newlines. Backslash first so we don't double-escape the escapes we add. */
export function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Fold a content line to ≤75 octets per RFC 5545 §3.1: continuations begin
 * with a single leading space and are joined by CRLF. Folding is measured in
 * UTF-8 octets (not characters) and never splits a multi-byte sequence.
 */
export function foldIcsLine(line: string): string {
  const MAX = 75;
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  let first = true;

  for (const ch of line) {
    const chBytes = utf8Len(ch);
    // Continuation lines reserve one octet for the leading space.
    const limit = first ? MAX : MAX - 1;
    if (bytes + chBytes > limit) {
      out.push(current);
      current = "";
      bytes = 0;
      first = false;
    }
    current += ch;
    bytes += chBytes;
  }
  out.push(current);

  return out.map((seg, i) => (i === 0 ? seg : ` ${seg}`)).join("\r\n");
}

/** UTF-8 byte length of a single code point. */
function utf8Len(ch: string): number {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp <= 0x7f) return 1;
  if (cp <= 0x7ff) return 2;
  if (cp <= 0xffff) return 3;
  return 4;
}

/**
 * Build a complete VCALENDAR from `events`. CRLF line endings, every property
 * line passed through `foldIcsLine`. `DTSTAMP` is shared across all VEVENTs and
 * derived from `opts.dtstamp` (falling back to the first event's start) so the
 * output is deterministic for a given input rather than depending on `now`.
 */
export function eventsToIcs(
  events: IcsEvent[],
  opts?: { calName?: string; dtstamp?: string },
): string {
  const dtstamp = toIcsUtc(opts?.dtstamp ?? events[0]?.start ?? new Date(0).toISOString());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StudentOS//Appelli//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  if (opts?.calName) {
    lines.push(`X-WR-CALNAME:${escapeIcsText(opts.calName)}`);
  }

  for (const ev of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeIcsText(ev.uid)}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${toIcsUtc(ev.start)}`);
    lines.push(`DTEND:${toIcsUtc(ev.end)}`);
    lines.push(`SUMMARY:${escapeIcsText(ev.summary)}`);
    if (ev.location) lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
    if (ev.description) lines.push(`DESCRIPTION:${escapeIcsText(ev.description)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}
