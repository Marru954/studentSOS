/**
 * The week timetable as a real CSS Grid: row 1 is the day header, every
 * following row is a 30-minute slot; events span their rows via inline
 * grid placement. Overlapping lessons split the day column into lanes
 * (see lib/domain/week). Pure: data in, markup out.
 */
import { cn } from "@/lib/cn";
import type { ClassEvent } from "@/lib/domain/types";
import { layoutDayLanes } from "@/lib/domain/week";
import { addDays, fmtTime, localDayOf, localToday } from "@/lib/format";

const DAYS_SHOWN = 6; // lun–sab
const SLOT_MIN = 30;
const MIN_START_HOUR = 8;
const MIN_END_HOUR = 18;

const weekdayShort = new Intl.DateTimeFormat("it-IT", { weekday: "short" });
const weekdayLong = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function localMinutes(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

// A stable colour hue per course so lesson blocks read consistently across
// the week (the immersive reference tints each block by course).
export const COURSE_HUES = [255, 280, 200, 330, 160, 25, 100, 220];
export function hueOf(courseName: string): number {
  let h = 0;
  for (let i = 0; i < courseName.length; i++) {
    h = (h * 31 + courseName.charCodeAt(i)) >>> 0;
  }
  return COURSE_HUES[h % COURSE_HUES.length];
}

export function WeekGrid({
  events,
  weekStart,
  now,
}: {
  /** Lessons already filtered to this week. */
  events: ClassEvent[];
  /** Monday 00:00, local. */
  weekStart: Date;
  now: Date;
}) {
  const dayDates = Array.from({ length: DAYS_SHOWN }, (_, i) =>
    addDays(weekStart, i),
  );
  const dayKeys = dayDates.map((d) => localToday(d));
  const today = localToday(now);

  // hour range grows to fit the data, never shrinks below the working day
  let startHour = MIN_START_HOUR;
  let endHour = MIN_END_HOUR;
  for (const e of events) {
    startHour = Math.min(startHour, Math.floor(localMinutes(e.start) / 60));
    endHour = Math.max(endHour, Math.ceil(localMinutes(e.end) / 60));
  }
  const slots = (endHour - startHour) * 2;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  const rowOf = (minutes: number) =>
    Math.min(Math.max((minutes - startHour * 60) / SLOT_MIN, 0), slots);

  const byDay = dayKeys.map((key) =>
    layoutDayLanes(events.filter((e) => localDayOf(e.start) === key)),
  );

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayIdx = dayKeys.indexOf(today);
  const showNowLine =
    todayIdx >= 0 &&
    nowMinutes >= startHour * 60 &&
    nowMinutes <= endHour * 60;

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-2xl"
        style={{
          gridTemplateColumns: `3.2rem repeat(${DAYS_SHOWN}, minmax(6.5rem, 1fr))`,
          gridTemplateRows: `2.25rem repeat(${slots}, 28px)`,
        }}
      >
        {/* header row */}
        <div
          aria-hidden="true"
          style={{ gridColumn: 1, gridRow: 1 }}
        />
        {dayDates.map((d, i) => (
          <div
            key={dayKeys[i]}
            style={{ gridColumn: i + 2, gridRow: 1 }}
            className={cn(
              "flex items-center justify-center gap-1.5 pb-1.5 text-center text-[0.85rem] font-semibold",
              dayKeys[i] === today ? "text-signal" : "text-ink",
            )}
          >
            {weekdayShort.format(d)} {d.getDate()}
            {dayKeys[i] === today && (
              <span className="sr-only"> (oggi)</span>
            )}
          </div>
        ))}

        {/* hour labels + background slot cells */}
        {hours.map((h, hi) => (
          <div
            key={`label-${h}`}
            aria-hidden="true"
            style={{ gridColumn: 1, gridRow: `${2 + hi * 2} / span 2` }}
            className="faint font-num -translate-y-1.5 pr-2 text-right text-[0.72rem]"
          >
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
        {hours.map((h, hi) =>
          dayKeys.map((key, di) => (
            <div
              key={`cell-${h}-${key}`}
              aria-hidden="true"
              style={{
                gridColumn: di + 2,
                gridRow: `${2 + hi * 2} / span 2`,
                borderLeft: "1px solid var(--hairline)",
                borderBottom: "1px solid var(--hairline)",
              }}
              className={cn(key === today && "bg-signal-dim/40")}
            />
          )),
        )}

        {/* events: list semantics survive the grid via display:contents */}
        <ul className="contents">
          {byDay.flatMap((laidOut, di) =>
            laidOut.map(({ event, lane, laneCount }) => {
              const cancelled = event.change?.field === "cancelled";
              const roomChanged = event.change?.field === "room";
              const r1 = 2 + Math.floor(rowOf(localMinutes(event.start)));
              const r2 = Math.max(2 + Math.ceil(rowOf(localMinutes(event.end))), r1 + 1);
              const hue = hueOf(event.courseName);
              return (
                <li key={event.id} className="contents">
                  <div
                    title={`${event.courseName} · ${fmtTime(event.start)}–${fmtTime(event.end)}${event.room ? ` · ${event.room}` : ""}`}
                    style={{
                      gridColumn: di + 2,
                      gridRow: `${r1} / ${r2}`,
                      borderRadius: 10,
                      borderLeft: cancelled
                        ? "3px solid var(--danger)"
                        : `3px solid oklch(0.68 0.2 ${hue})`,
                      background: cancelled
                        ? "var(--bg-2)"
                        : `color-mix(in oklch, oklch(0.6 0.2 ${hue}) 22%, var(--bg-2))`,
                      ...(laneCount > 1 && {
                        width: `${100 / laneCount}%`,
                        marginLeft: `${(100 / laneCount) * lane}%`,
                      }),
                    }}
                    className="lift relative z-[1] m-px overflow-hidden px-2 py-1.5"
                  >
                    <span className="sr-only">
                      {weekdayLong.format(dayDates[di])},{" "}
                      {fmtTime(event.start)}–{fmtTime(event.end)}:{" "}
                    </span>
                    <p
                      className={cn(
                        "line-clamp-2 text-[0.78rem] font-semibold leading-tight",
                        cancelled ? "text-ink-mute line-through" : "text-ink",
                      )}
                    >
                      {event.courseName}
                    </p>
                    {cancelled ? (
                      <p className="mt-0.5 text-[0.68rem] font-medium text-danger">
                        Annullata
                      </p>
                    ) : (
                      <p
                        className={cn(
                          "faint font-num mt-0.5 truncate text-[0.68rem]",
                          roomChanged && "text-warn",
                        )}
                      >
                        {fmtTime(event.start)}
                        {event.room && (
                          <>
                            {" · "}
                            {roomChanged && (
                              <span>
                                →
                                <span className="sr-only"> aula cambiata:</span>{" "}
                              </span>
                            )}
                            {event.room}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </li>
              );
            }),
          )}
        </ul>

        {/* current time marker */}
        {showNowLine && (
          <div
            aria-hidden="true"
            style={{
              gridColumn: todayIdx + 2,
              gridRow: 2 + Math.floor(rowOf(nowMinutes)),
            }}
            className="pointer-events-none relative z-[2]"
          >
            <div
              className="absolute inset-x-0 border-t-2 border-signal"
              style={{ top: `${((nowMinutes - startHour * 60) % SLOT_MIN) / SLOT_MIN * 100}%` }}
            >
              <span className="absolute -left-1 -top-[5px] size-2 rounded-full bg-signal" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
