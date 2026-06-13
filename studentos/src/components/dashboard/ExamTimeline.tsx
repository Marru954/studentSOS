"use client";

import { CalendarClock, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import type { ExamCall } from "@/lib/domain/types";
import { daysFromToday, fmtPlainDayMonth } from "@/lib/format";

/** Urgency tier from the REAL days left: rosso oggi/domani, arancione entro la
 *  settimana, grigio oltre. */
type Tier = "today" | "week" | "later";

function tierOf(days: number): Tier {
  if (days <= 1) return "today";
  if (days <= 7) return "week";
  return "later";
}

const TONE: Record<Tier, BadgeTone> = {
  today: "danger",
  week: "warn",
  later: "neutral",
};

function relLabel(days: number): string {
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `tra ${days} giorni`;
}

function metaLine(e: ExamCall): string {
  return [fmtPlainDayMonth(e.date), e.time && `ore ${e.time}`, e.room]
    .filter(Boolean)
    .join(" · ");
}

/** One course = one row; multiple future calls of the same course collapse to
 *  the nearest, with the rest behind "+N altre date". */
interface Group {
  course: string;
  nearest: ExamCall;
  extra: ExamCall[];
}

/** Same date+time, different courses → a clash the student must resolve. */
interface Clash {
  when: string;
  courses: string[];
}

function buildGroups(upcoming: ExamCall[]): Group[] {
  const byCourse = new Map<string, ExamCall[]>();
  for (const e of upcoming) {
    byCourse.set(e.courseName, [...(byCourse.get(e.courseName) ?? []), e]);
  }
  const groups = [...byCourse.values()].map((calls) => ({
    course: calls[0].courseName,
    nearest: calls[0],
    extra: calls.slice(1),
  }));
  return groups.sort(
    (a, b) =>
      a.nearest.date.localeCompare(b.nearest.date) ||
      (a.nearest.time ?? "").localeCompare(b.nearest.time ?? ""),
  );
}

function buildClashes(upcoming: ExamCall[]): Clash[] {
  const bySlot = new Map<string, ExamCall[]>();
  for (const e of upcoming) {
    if (!e.time) continue;
    bySlot.set(`${e.date} ${e.time}`, [...(bySlot.get(`${e.date} ${e.time}`) ?? []), e]);
  }
  const out: Clash[] = [];
  for (const group of bySlot.values()) {
    const courses = [...new Set(group.map((e) => e.courseName))];
    if (courses.length < 2) continue;
    out.push({ when: metaLine(group[0]), courses });
  }
  return out;
}

const COMPACT = 5;

/** Unified, chronological timeline of upcoming exam calls. Compact by default:
 *  conflicts pinned on top, then the 5 nearest courses; the rest expand into a
 *  fixed-height scroll area so the page never grows without bound. */
export function ExamTimeline({
  exams,
  now,
  className,
}: {
  exams: ExamCall[];
  now: Date;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());

  const upcoming = exams
    .filter((e) => daysFromToday(e.date, now) >= 0)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""),
    );
  const groups = buildGroups(upcoming);
  const clashes = buildClashes(upcoming);

  const visible = expanded ? groups : groups.slice(0, COMPACT);

  function toggleDates(course: string) {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(course)) next.delete(course);
      else next.add(course);
      return next;
    });
  }

  return (
    <Panel
      title="Appelli in arrivo"
      icon={<CalendarClock />}
      className={className}
      actions={
        upcoming.length > 0 ? <Badge tone="neutral">{upcoming.length}</Badge> : undefined
      }
    >
      {upcoming.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessun appello in programma. Attiva le fonti del tuo corso per vedere
          il calendario.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Conflitti di orario, sempre in cima ed evidenziati. */}
          {clashes.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {clashes.map((c) => (
                <li
                  key={c.when}
                  className="flex items-start gap-2 rounded-md border border-danger/35 bg-danger-dim px-3 py-2 text-xs font-medium text-danger"
                >
                  <TriangleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                  <span>
                    Conflitto: devi scegliere — {c.when}: «{c.courses.join("», «")}»
                  </span>
                </li>
              ))}
            </ul>
          )}

          <ul className="flex flex-col divide-y divide-line">
            {visible.map((g) => {
              const days = daysFromToday(g.nearest.date, now);
              const bookingDays = g.nearest.booking?.closesAt
                ? daysFromToday(g.nearest.booking.closesAt, now)
                : undefined;
              const datesOpen = openDates.has(g.course);
              return (
                <li key={g.course} className="flex items-start gap-3 py-3">
                  <Badge
                    tone={TONE[tierOf(days)]}
                    className="mt-0.5 w-24 shrink-0 justify-center"
                  >
                    {relLabel(days)}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{g.course}</p>
                    <p className="text-xs text-ink-mute">{metaLine(g.nearest)}</p>
                    {bookingDays !== undefined &&
                      bookingDays >= 0 &&
                      bookingDays <= 14 && (
                        <p className="mt-1 text-xs text-warn">
                          Iscrizione entro il{" "}
                          {fmtPlainDayMonth(g.nearest.booking!.closesAt!)}
                        </p>
                      )}
                    {g.extra.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleDates(g.course)}
                          className="mt-1 text-xs font-medium text-signal hover:underline"
                        >
                          {datesOpen
                            ? "Nascondi date"
                            : `+${g.extra.length} altre date`}
                        </button>
                        {datesOpen && (
                          <ul className="mt-1 flex flex-col gap-0.5 border-l border-line pl-3">
                            {g.extra.map((x) => (
                              <li key={x.id} className="text-xs text-ink-mute">
                                {relLabel(daysFromToday(x.date, now))} ·{" "}
                                {metaLine(x)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {groups.length > COMPACT && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="self-start text-xs font-medium text-signal hover:underline"
            >
              {expanded ? "Mostra meno" : `Mostra tutti (${upcoming.length})`}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}
