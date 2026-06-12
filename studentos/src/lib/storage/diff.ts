/**
 * Diff engine: compares the previous cache with a fresh sync and produces
 * ChangeNotices. Ids are content hashes that include start time, so:
 *  - same id, different room        → room change
 *  - same course+day, moved start   → time change
 *  - explicit cancellation flag     → cancelled
 *  - exam id never seen before      → new exam call
 * Disappearance alone is NOT a cancellation — sync windows shift, sources
 * flap. We only alert on positive evidence.
 */
import type { ClassEvent, ExamCall } from "@/lib/domain/types";
import { stableId } from "@/lib/sync/util";
import type { ChangeNotice } from "./types";

function notice(
  kind: ChangeNotice["kind"],
  courseName: string,
  detail: string,
  entityId: string,
  now: string,
): ChangeNotice {
  return {
    // hash on kind+entity+detail: the same change re-detected on the next
    // sync gets the same id and stays a single notice instead of piling up
    id: stableId("notice", kind, entityId, detail),
    kind,
    courseName,
    detail,
    entityId,
    detectedAt: now,
    seen: false,
  };
}

const dayOf = (event: ClassEvent) => event.start.slice(0, 10);
const timeOf = (iso: string) => iso.slice(11, 16);

export function diffClassEvents(
  prev: ClassEvent[],
  next: ClassEvent[],
  now: string,
): ChangeNotice[] {
  const notices: ChangeNotice[] = [];
  const prevById = new Map(prev.map((e) => [e.id, e]));
  const prevByCourseDay = new Map<string, ClassEvent>(
    prev.map((e) => [`${e.courseName}|${dayOf(e)}`, e]),
  );

  for (const event of next) {
    const before = prevById.get(event.id);
    if (before) {
      if (event.room && before.room && event.room !== before.room) {
        notices.push(
          notice("room-change", event.courseName, `${before.room} → ${event.room}`, event.id, now),
        );
      }
      if (event.change?.field === "cancelled" && before.change?.field !== "cancelled") {
        notices.push(
          notice("cancelled", event.courseName, `lezione del ${dayOf(event)} annullata`, event.id, now),
        );
      }
      continue;
    }
    // new id: same course on the same day in the old cache = moved lesson
    const sibling = prevByCourseDay.get(`${event.courseName}|${dayOf(event)}`);
    if (sibling && !next.some((e) => e.id === sibling.id)) {
      notices.push(
        notice(
          "time-change",
          event.courseName,
          `${timeOf(sibling.start)} → ${timeOf(event.start)}`,
          event.id,
          now,
        ),
      );
    }
  }
  return notices;
}

export function diffExamCalls(prev: ExamCall[], next: ExamCall[], now: string): ChangeNotice[] {
  // an empty previous cache means first sync — everything would be "new"
  if (prev.length === 0) return [];
  const known = new Set(prev.map((e) => e.id));
  return next
    .filter((exam) => !known.has(exam.id))
    .map((exam) =>
      notice(
        "new-exam",
        exam.courseName,
        `nuovo appello il ${exam.date.split("-").reverse().join("/")}${exam.time ? ` alle ${exam.time}` : ""}`,
        exam.id,
        now,
      ),
    );
}
