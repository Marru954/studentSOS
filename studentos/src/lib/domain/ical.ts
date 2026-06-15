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

// ── Parser (RFC 5545 reader) ─────────────────────────────────────────────────
//
// The reverse of the generator above: turn an .ics file's text into IcsEvent[].
// Single-occurrence only — RRULE is tolerated (never crashes) but not expanded.
// Zero dependencies on purpose (no ical.js): unfolding, block splitting and the
// three DTSTART forms are a few string rules, far cheaper than a library + dep.

/** Unescape a TEXT value per RFC 5545 §3.3.11 (the inverse of `escapeIcsText`).
 *  Single pass so an escaped backslash (`\\`) can't re-trigger on the next char. */
function unescapeIcsText(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch !== "\\" || i === s.length - 1) {
      out += ch;
      continue;
    }
    const next = s[++i];
    if (next === "n" || next === "N") out += "\n";
    else out += next; // covers \, \; \\ and any unknown escape (drop the slash)
  }
  return out;
}

/** Two-digit slice of a string → number (no validation; callers pre-check). */
function num(s: string, from: number, len: number): number {
  return Number(s.slice(from, from + len));
}

/**
 * Parse an iCalendar date/date-time value into an ISO 8601 string.
 *
 *  - `YYYYMMDDTHHMMSSZ` — explicit UTC → `Date.UTC(...).toISOString()`.
 *  - `YYYYMMDDTHHMMSS`  — floating / TZID local time → `new Date(y,mo,d,…)`
 *    (interpreted in the runtime's local zone; best effort, no tz database).
 *  - `YYYYMMDD`         — all-day (VALUE=DATE, or a bare 8-digit value) → local
 *    midnight.
 *
 * Returns `undefined` when the value doesn't match any known form.
 */
export function parseIcsDate(raw: string, hasDateParam: boolean): string | undefined {
  const v = raw.trim();

  // Date-only: VALUE=DATE param, or a bare 8-digit token with no time part.
  if ((hasDateParam || !v.includes("T")) && /^\d{8}$/.test(v)) {
    const y = num(v, 0, 4);
    const mo = num(v, 4, 2);
    const d = num(v, 6, 2);
    return new Date(y, mo - 1, d).toISOString(); // local midnight
  }

  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(v);
  if (!m) return undefined;
  const [, ys, mos, ds, hs, mis, ss, z] = m;
  const y = Number(ys);
  const mo = Number(mos);
  const d = Number(ds);
  const h = Number(hs);
  const mi = Number(mis);
  const s = Number(ss);
  if (z === "Z") {
    return new Date(Date.UTC(y, mo - 1, d, h, mi, s)).toISOString();
  }
  // Floating or TZID — treat as local wall-clock (best effort).
  return new Date(y, mo - 1, d, h, mi, s).toISOString();
}

/** A single property line split into name, params and raw value. `NAME` is
 *  upper-cased; `params` keeps each `KEY=VALUE` segment (uppercased) as-is. */
interface IcsProp {
  name: string;
  params: string[];
  value: string;
}

/** Parse `NAME[;PARAM=VAL][;…]:value` → {name, params, value}. The colon that
 *  ends the property part is the first one *not* inside a quoted param value. */
function parsePropLine(line: string): IcsProp | undefined {
  let inQuote = false;
  let colon = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ":" && !inQuote) {
      colon = i;
      break;
    }
  }
  if (colon === -1) return undefined;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const segments = head.split(";");
  const name = segments.shift()?.trim().toUpperCase() ?? "";
  if (!name) return undefined;
  return { name, params: segments.map((p) => p.toUpperCase()), value };
}

/** True when a property's params declare `VALUE=DATE` (all-day). */
function hasDateValueParam(params: string[]): boolean {
  return params.some((p) => p === "VALUE=DATE");
}

/**
 * Parse an iCalendar (.ics) document into single-occurrence events.
 *
 * Steps, per RFC 5545:
 *  1. Normalize CRLF/CR line endings to LF.
 *  2. Unfold: a line beginning with a space or TAB continues the previous
 *     physical line — strip that one leading whitespace char and append.
 *  3. Slice out every `BEGIN:VEVENT … END:VEVENT` block; ignore everything
 *     outside (VTIMEZONE, VCALENDAR props, …).
 *  4. Per block read DTSTART/DTEND/SUMMARY/LOCATION/UID/DESCRIPTION
 *     (case-insensitive). Blocks without a parseable DTSTART are skipped;
 *     a missing DTEND defaults to start + 1 hour. RRULE lines are ignored.
 */
export function parseIcs(text: string): IcsEvent[] {
  // 1 + 2 — normalize endings, then unfold continuation lines.
  const physical = text.replace(/\r\n|\r/g, "\n").split("\n");
  const logical: string[] = [];
  for (const line of physical) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && logical.length > 0) {
      logical[logical.length - 1] += line.slice(1);
    } else {
      logical.push(line);
    }
  }

  const events: IcsEvent[] = [];
  let block: IcsProp[] | null = null;

  for (const line of logical) {
    const upper = line.trim().toUpperCase();
    if (upper === "BEGIN:VEVENT") {
      block = [];
      continue;
    }
    if (upper === "END:VEVENT") {
      if (block) events.push(...buildEvent(block));
      block = null;
      continue;
    }
    if (!block) continue; // outside a VEVENT → ignore
    const prop = parsePropLine(line);
    if (prop) block.push(prop);
  }

  return events;
}

/** Build zero or one IcsEvent from a VEVENT's properties. Returns `[]` (and so
 *  is skipped) when there's no parseable DTSTART. */
function buildEvent(props: IcsProp[]): IcsEvent[] {
  const find = (name: string) => props.find((p) => p.name === name);

  const dtstart = find("DTSTART");
  if (!dtstart) return [];
  const start = parseIcsDate(dtstart.value, hasDateValueParam(dtstart.params));
  if (!start) return [];

  const dtend = find("DTEND");
  let end: string | undefined;
  if (dtend) end = parseIcsDate(dtend.value, hasDateValueParam(dtend.params));
  if (!end) {
    end = new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
  }

  const summaryRaw = find("SUMMARY")?.value;
  const summary = summaryRaw
    ? unescapeIcsText(summaryRaw)
    : "Evento senza titolo";
  const locationRaw = find("LOCATION")?.value;
  const descriptionRaw = find("DESCRIPTION")?.value;

  return [
    {
      uid: find("UID")?.value.trim() ?? "",
      summary,
      start,
      end,
      location: locationRaw ? unescapeIcsText(locationRaw) || undefined : undefined,
      description: descriptionRaw
        ? unescapeIcsText(descriptionRaw) || undefined
        : undefined,
    },
  ];
}
