/**
 * Generic iCalendar adapter — the universal fallback. Any university (or
 * Moodle/Google Calendar export) that publishes an .ics feed works with a
 * single URL. Recurring events are expanded inside the requested range.
 */
import ICAL from "ical.js";
import { z } from "zod";
import type { ClassEvent, ClassEventKind } from "@/lib/domain/types";
import type { FetchContext, SyncProvider } from "../provider";
import { stableId } from "../util";

const paramsSchema = z.object({
  url: z.string().url(),
  /** How to label events from this feed; feeds rarely carry a type. */
  defaultKind: z
    .enum(["lecture", "lab", "exercise", "seminar", "other"])
    .optional()
    .default("lecture"),
});
export type ICalParams = z.infer<typeof paramsSchema>;

const MAX_OCCURRENCES_PER_EVENT = 200;

async function fetchTimetable(params: ICalParams, ctx: FetchContext): Promise<ClassEvent[]> {
  const res = await fetch(params.url, { signal: ctx.signal, redirect: "manual" });
  if (!res.ok) throw new Error(`iCal feed responded ${res.status}`);
  const component = new ICAL.Component(ICAL.parse(await res.text()));

  const rangeStart = ICAL.Time.fromJSDate(new Date(`${ctx.range.from}T00:00:00Z`), true);
  const rangeEnd = ICAL.Time.fromJSDate(new Date(`${ctx.range.to}T23:59:59Z`), true);
  const events: ClassEvent[] = [];

  const push = (event: ICAL.Event, start: ICAL.Time, end: ICAL.Time) => {
    const startIso = start.toJSDate().toISOString();
    events.push({
      id: stableId("ics", params.url, event.uid, startIso),
      courseName: event.summary?.trim() || "Evento senza titolo",
      start: startIso,
      end: end.toJSDate().toISOString(),
      room: event.location?.trim() || undefined,
      kind: params.defaultKind as ClassEventKind,
      sourceId: "",
    });
  };

  for (const sub of component.getAllSubcomponents("vevent")) {
    const event = new ICAL.Event(sub);
    if (event.isRecurring()) {
      const iterator = event.iterator();
      let next: ICAL.Time | null;
      let guard = 0;
      while ((next = iterator.next()) && guard++ < MAX_OCCURRENCES_PER_EVENT) {
        if (next.compare(rangeEnd) > 0) break;
        const occ = event.getOccurrenceDetails(next);
        if (occ.endDate.compare(rangeStart) < 0) continue;
        push(event, occ.startDate, occ.endDate);
      }
    } else {
      if (event.endDate.compare(rangeStart) < 0 || event.startDate.compare(rangeEnd) > 0) continue;
      push(event, event.startDate, event.endDate);
    }
  }
  return events;
}

export const icalProvider: SyncProvider<ICalParams> = {
  id: "ical",
  label: "Feed iCalendar (.ics)",
  paramsSchema,
  capabilities: ["timetable"],
  fetchTimetable,
};
