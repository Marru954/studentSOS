"use client";

/**
 * /calendario: one unified month calendar that overlays every kind of dated
 * thing in StudentOS — lessons, exam calls, study tasks with a due date, and
 * focus sessions — each colour-coded by a semantic token. The grid (Monday-first,
 * UTC) comes from the shared `buildMonthGrid`; the four data territories are
 * binned by local YYYY-MM-DD into separate maps so a day cell can show a small
 * coloured count per type. Clicking a day expands its full event list below,
 * grouped by type. No new data is written — this is a read-only overview.
 */
import {
  CalendarClock,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/cn";
import { buildMonthGrid } from "@/lib/domain/calendar";
import type { ClassEvent, ExamCall, IsoDate } from "@/lib/domain/types";
import { fmtLongDay, fmtMinutes, fmtTime, localDayOf, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useFocusSessions, useTasks } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const monthFmt = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
});

type TypeId = "lessons" | "exams" | "tasks" | "focus";

/** Each merged type: its accent colour (a CSS var token) and Italian label. */
const TYPES: {
  id: TypeId;
  label: string;
  /** Plural noun for aria-labels: "{n} lezioni", "{n} appelli", … */
  noun: (n: number) => string;
  color: string;
}[] = [
  {
    id: "lessons",
    label: "Lezioni",
    noun: (n) => (n === 1 ? "1 lezione" : `${n} lezioni`),
    color: "var(--signal)",
  },
  {
    id: "exams",
    label: "Appelli",
    noun: (n) => (n === 1 ? "1 appello" : `${n} appelli`),
    color: "var(--danger)",
  },
  {
    id: "tasks",
    label: "Task",
    noun: (n) => (n === 1 ? "1 task" : `${n} task`),
    color: "var(--warn)",
  },
  {
    id: "focus",
    label: "Focus",
    noun: (n) => (n === 1 ? "1 sessione focus" : `${n} sessioni focus`),
    color: "var(--ok)",
  },
];

/** Generic by-date binning: group a list by the YYYY-MM-DD derived from each
 *  item, preserving input order within a day. */
function binByDate<T>(items: T[], dateOf: (item: T) => IsoDate): Map<IsoDate, T[]> {
  const map = new Map<IsoDate, T[]>();
  for (const item of items) {
    const key = dateOf(item);
    const list = map.get(key);
    if (list) list.push(item);
    else map.set(key, [item]);
  }
  return map;
}

export function CalendarView() {
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const syncedHydrated = useSynced((s) => s.hydrated);
  const tasks = useTasks((s) => s.items);
  const tasksHydrated = useTasks((s) => s.hydrated);
  const focusSessions = useFocusSessions((s) => s.items);
  const focusHydrated = useFocusSessions((s) => s.hydrated);
  const now = useNowMinute();

  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<IsoDate | null>(null);

  const ready =
    now !== null && syncedHydrated && tasksHydrated && focusHydrated;
  const today = ready ? localToday(now) : undefined;

  // Displayed month derives from now + offset, so it needs no init-time clock.
  const displayed = useMemo(() => {
    const base = now ?? new Date();
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [now, monthOffset]);

  // Four by-date maps, one per territory. Lessons/focus carry ISO datetimes →
  // local day; exams/tasks are already plain YYYY-MM-DD. Tasks without a due
  // date never land on the calendar.
  const lessonsByDate = useMemo(
    () => binByDate(classEvents, (e) => localDayOf(e.start)),
    [classEvents],
  );
  const examsByDate = useMemo(
    () => binByDate(examCalls, (e) => e.date),
    [examCalls],
  );
  const tasksByDate = useMemo(
    () => binByDate(tasks.filter((t) => Boolean(t.due)), (t) => t.due as IsoDate),
    [tasks],
  );
  const focusByDate = useMemo(
    () => binByDate(focusSessions, (f) => localDayOf(f.startedAt)),
    [focusSessions],
  );

  const counts = useMemo(
    () =>
      ({
        lessons: lessonsByDate,
        exams: examsByDate,
        tasks: tasksByDate,
        focus: focusByDate,
      }) as Record<TypeId, Map<IsoDate, unknown[]>>,
    [lessonsByDate, examsByDate, tasksByDate, focusByDate],
  );

  const weeks = useMemo(
    () => buildMonthGrid(displayed.getFullYear(), displayed.getMonth()),
    [displayed],
  );
  const heading = monthFmt.format(displayed);

  // Selected-day detail: the four lists for the chosen day (empty arrays when
  // none), plus a flag for the "nothing here" message.
  const detail = useMemo(() => {
    if (!selectedDay) return null;
    const lessons = (lessonsByDate.get(selectedDay) ?? [])
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start));
    const exams = examsByDate.get(selectedDay) ?? [];
    const dayTasks = tasksByDate.get(selectedDay) ?? [];
    const focus = focusByDate.get(selectedDay) ?? [];
    const empty =
      lessons.length === 0 &&
      exams.length === 0 &&
      dayTasks.length === 0 &&
      focus.length === 0;
    return { lessons, exams, tasks: dayTasks, focus, empty };
  }, [selectedDay, lessonsByDate, examsByDate, tasksByDate, focusByDate]);

  function selectDay(date: IsoDate) {
    setSelectedDay((cur) => (cur === date ? null : date));
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Calendario</h1>
          {ready && (
            <p className="muted mt-1.5">
              Lezioni, appelli, scadenze e focus in un&rsquo;unica vista
            </p>
          )}
        </div>
      </header>

      {!ready ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-4">
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton />
        </div>
      ) : (
        <>
          <Panel title="Mese" icon={<CalendarDays />} className="accent-top">
            <section aria-label={`Calendario unificato — ${heading}`}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold capitalize">{heading}</h3>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Mese precedente"
                    onClick={() => {
                      setMonthOffset((o) => o - 1);
                      setSelectedDay(null);
                    }}
                    className="chip transition-colors hover:border-line-strong"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMonthOffset(0);
                      setSelectedDay(today ?? null);
                    }}
                    className="chip transition-colors hover:border-line-strong"
                  >
                    Oggi
                  </button>
                  <button
                    type="button"
                    aria-label="Mese successivo"
                    onClick={() => {
                      setMonthOffset((o) => o + 1);
                      setSelectedDay(null);
                    }}
                    className="chip transition-colors hover:border-line-strong"
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    aria-hidden="true"
                    className="pb-1 text-center text-label font-medium text-ink-mute"
                  >
                    {d}
                  </div>
                ))}

                {weeks.flat().map((cell) => {
                  const isToday = cell.date === today;
                  const isSelected = cell.date === selectedDay;
                  // Per-type counts for this day, in TYPES order.
                  const dayCounts = TYPES.map((t) => ({
                    type: t,
                    n: counts[t.id].get(cell.date)?.length ?? 0,
                  })).filter((c) => c.n > 0);
                  const total = dayCounts.reduce((s, c) => s + c.n, 0);
                  // Human aria-label: "12 marzo, 2 lezioni, 1 appello".
                  const ariaLabel = [
                    fmtLongDay(new Date(`${cell.date}T00:00:00`)),
                    ...dayCounts.map((c) => c.type.noun(c.n)),
                    total === 0 ? "nessun evento" : null,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <button
                      key={cell.date}
                      type="button"
                      aria-label={ariaLabel}
                      aria-pressed={isSelected}
                      onClick={() => selectDay(cell.date)}
                      className={cn(
                        "min-h-16 rounded-sm border p-1.5 text-left transition-colors",
                        cell.inMonth
                          ? "glass-2 border-line hover:border-line-strong"
                          : "border-transparent bg-transparent hover:bg-night-900",
                        isToday && "ring-1 ring-signal",
                        isSelected && "border-line-strong ring-2 ring-signal-2",
                      )}
                    >
                      <div
                        className={cn(
                          "text-right font-mono text-xs",
                          isToday
                            ? "font-semibold text-signal"
                            : cell.inMonth
                              ? "text-ink-mute"
                              : "text-ink-faint",
                        )}
                      >
                        {cell.day}
                        {isToday && <span className="sr-only"> (oggi)</span>}
                      </div>
                      {dayCounts.length > 0 && (
                        <div
                          aria-hidden="true"
                          className="mt-1 flex flex-wrap gap-1"
                        >
                          {dayCounts.map((c) => (
                            <span
                              key={c.type.id}
                              className="inline-flex min-w-4 items-center justify-center gap-0.5 rounded-xs px-1 py-0.5 text-[0.6rem] font-semibold leading-none"
                              style={{
                                color: c.type.color,
                                background: `color-mix(in oklch, ${c.type.color} 16%, transparent)`,
                              }}
                            >
                              <span
                                className="size-1.5 rounded-full"
                                style={{ background: c.type.color }}
                              />
                              {c.n}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Colour legend — type ↔ colour mapping, never colour alone. */}
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-mute">
                {TYPES.map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ background: t.color }}
                    />
                    {t.label}
                  </li>
                ))}
              </ul>
            </section>
          </Panel>

          {/* Selected-day detail, below the grid. */}
          {selectedDay && detail && (
            <Panel
              title={fmtLongDay(new Date(`${selectedDay}T00:00:00`))}
              icon={<CalendarClock />}
            >
              {detail.empty ? (
                <p className="muted text-sm">Nessun evento questo giorno.</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {detail.lessons.length > 0 && (
                    <DayGroup
                      type={TYPES[0]}
                      icon={<CalendarDays aria-hidden="true" className="size-4" />}
                      items={detail.lessons.map((e) => ({
                        key: e.id,
                        primary: e.courseName,
                        meta: lessonMeta(e),
                      }))}
                    />
                  )}
                  {detail.exams.length > 0 && (
                    <DayGroup
                      type={TYPES[1]}
                      icon={<CalendarClock aria-hidden="true" className="size-4" />}
                      items={detail.exams.map((e) => ({
                        key: e.id,
                        primary: e.courseName,
                        meta: examMeta(e),
                      }))}
                    />
                  )}
                  {detail.tasks.length > 0 && (
                    <DayGroup
                      type={TYPES[2]}
                      icon={<CheckSquare aria-hidden="true" className="size-4" />}
                      items={detail.tasks.map((t) => ({
                        key: t.id,
                        primary: t.title,
                        meta: t.courseName,
                      }))}
                    />
                  )}
                  {detail.focus.length > 0 && (
                    <DayGroup
                      type={TYPES[3]}
                      icon={<Timer aria-hidden="true" className="size-4" />}
                      items={detail.focus.map((f) => ({
                        key: f.id,
                        primary: f.courseName ?? "Sessione di studio",
                        meta: `${fmtMinutes(f.minutes)} studiati`,
                      }))}
                    />
                  )}
                </div>
              )}
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

/** "09:30–11:00 · Aula B1" for a lesson row. */
function lessonMeta(e: ClassEvent): string {
  const span = `${fmtTime(e.start)}–${fmtTime(e.end)}`;
  return [span, e.room].filter(Boolean).join(" · ");
}

/** "ore 09:00 · Aula 3" for an exam row. */
function examMeta(e: ExamCall): string | undefined {
  const parts = [e.time ? `ore ${e.time}` : null, e.room].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

interface DayItem {
  key: string;
  primary: string;
  meta?: string;
}

/** One coloured section of the day detail: a tinted heading + its rows. */
function DayGroup({
  type,
  icon,
  items,
}: {
  type: (typeof TYPES)[number];
  icon: React.ReactNode;
  items: DayItem[];
}) {
  return (
    <section aria-label={type.noun(items.length)}>
      <h4
        className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
        style={{ color: type.color }}
      >
        <span aria-hidden="true">{icon}</span>
        {type.label}
        <span className="font-mono text-ink-mute">{items.length}</span>
      </h4>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-center gap-2 rounded-sm border border-line glass-2 px-3 py-2"
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ background: type.color }}
            />
            <span className="min-w-0 flex-1 truncate text-sm text-ink">
              {item.primary}
            </span>
            {item.meta && (
              <span className="shrink-0 font-mono text-xs text-ink-mute">
                {item.meta}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
