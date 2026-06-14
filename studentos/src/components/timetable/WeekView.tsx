"use client";

/** /orario: week navigation state + store wiring around the pure WeekGrid. */
import { CalendarClock, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import type { ClassEvent } from "@/lib/domain/types";
import { extractCourseNames } from "@/lib/domain/notes";
import { addDays, fmtTime, localDayOf, localToday, mondayOf } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { CoursePicker } from "./CoursePicker";
import { hueOf, WeekGrid } from "./WeekGrid";

const lessonDay = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Two zero-padded digits. */
const pad = (n: number) => String(n).padStart(2, "0");

/** "1g 04:30:12" / "04:30:12" / "00:00:42" from a millisecond gap. */
function fmtCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const clock = `${pad(h)}:${pad(m)}:${pad(s)}`;
  return days > 0 ? `${days}g ${clock}` : clock;
}

/** "Prossima lezione" card with a per-second live countdown to its start and a
 *  course-coloured accent bar (same hue as the calendar block). Replaces the
 *  old "Fonti dati" table. */
function NextLessonCard({ event }: { event: ClassEvent }) {
  const start = new Date(event.start);
  // null until mounted so SSR and the first client render agree (no hydration
  // mismatch); the interval then ticks every second.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const startMs = new Date(event.start).getTime();
    const tick = () => setRemaining(startMs - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.start]);

  const hue = hueOf(event.courseName);

  return (
    <section
      className="glass reveal relative overflow-hidden rounded-lg p-5"
      style={{ borderLeft: `3px solid oklch(0.68 0.2 ${hue})` }}
      aria-label="Prossima lezione"
    >
      <p className="eyebrow text-ink-faint">Prossima lezione</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.3rem]">{event.courseName}</h2>
          <p className="muted font-num mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="first-letter:uppercase">{lessonDay.format(start)}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock aria-hidden="true" className="size-4" />
              {fmtTime(event.start)}–{fmtTime(event.end)}
            </span>
            {event.room && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4" />
                {event.room}
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div
            className="font-display font-num text-[2rem] font-bold leading-none text-ink"
            role="timer"
            aria-live="off"
          >
            {remaining === null ? "—:—:—" : fmtCountdown(remaining)}
          </div>
          <div className="faint mt-1 text-[0.72rem]">
            {remaining !== null && remaining <= 0 ? "in corso" : "all'inizio"}
          </div>
        </div>
      </div>
    </section>
  );
}

const weekRange = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function WeekView() {
  const classEvents = useSynced((s) => s.classEvents);
  const hydrated = useSynced((s) => s.hydrated);
  const settingsHydrated = useSettings((s) => s.hydrated);
  const hasSources = useSettings((s) => s.enabledSourceIds.length > 0);
  const pinnedCourses = useSettings((s) => s.pinnedCourses);
  const updateSettings = useSettings((s) => s.update);
  const now = useNowMinute();
  const [weekOffset, setWeekOffset] = useState(0);

  const ready = now !== null && hydrated && settingsHydrated;
  const weekStart = ready ? addDays(mondayOf(now), weekOffset * 7) : null;

  // every course in the merged all-years feed, for the picker
  const allCourses = useMemo(
    () => extractCourseNames(classEvents, []),
    [classEvents],
  );

  const weekEvents = useMemo(() => {
    if (!weekStart) return [];
    const from = localToday(weekStart);
    const to = localToday(addDays(weekStart, 5));
    return classEvents
      .filter((e) => {
        const day = localDayOf(e.start);
        return day >= from && day <= to;
      })
      .filter(
        (e) =>
          pinnedCourses.length === 0 || pinnedCourses.includes(e.courseName),
      );
  }, [classEvents, weekStart, pinnedCourses]);

  // soonest lesson still ahead (or in progress), from the same feed as the grid
  const nextLesson = useMemo<ClassEvent | null>(() => {
    if (!ready || !now) return null;
    const ms = now.getTime();
    return (
      classEvents
        .filter((e) => new Date(e.end).getTime() > ms)
        .filter(
          (e) =>
            pinnedCourses.length === 0 || pinnedCourses.includes(e.courseName),
        )
        .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null
    );
  }, [ready, classEvents, pinnedCourses, now]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Orario</h1>
          {weekStart && (
            <p className="muted font-num mt-1.5">
              Settimana corrente ·{" "}
              {weekRange.formatRange(weekStart, addDays(weekStart, 5))}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            aria-label="Settimana precedente"
            onClick={() => setWeekOffset((w) => w - 1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            size="sm"
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset(0)}
          >
            Oggi
          </Button>
          <Button
            size="sm"
            aria-label="Settimana successiva"
            onClick={() => setWeekOffset((w) => w + 1)}
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </header>

      {!ready ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-3">
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton className="h-64" />
        </div>
      ) : !hasSources ? (
        <div className="glass reveal p-5">
          <p className="muted text-sm">
            Nessuna fonte attiva.{" "}
            <Link href="/" className="text-signal underline underline-offset-2">
              Configura il tuo ateneo dal cruscotto
            </Link>{" "}
            per sincronizzare l&rsquo;orario delle lezioni.
          </p>
        </div>
      ) : (
        <>
          <CoursePicker
            courses={allCourses}
            pinned={pinnedCourses}
            onChange={(pinned) => void updateSettings({ pinnedCourses: pinned })}
          />
          {weekEvents.length === 0 && (
            <p className="muted text-sm">
              Nessuna lezione in questa settimana
              {pinnedCourses.length > 0 ? " per i corsi selezionati" : ""}.
            </p>
          )}
          <div className="glass reveal overflow-x-auto p-5">
            <WeekGrid events={weekEvents} weekStart={weekStart!} now={now} />
          </div>
        </>
      )}

      {nextLesson && <NextLessonCard event={nextLesson} />}
    </div>
  );
}
