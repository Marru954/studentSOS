"use client";

/** /orario: week navigation state + store wiring around the pure WeekGrid. */
import { CalendarClock, CalendarCog, ChevronLeft, ChevronRight, MapPin, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { YearFilter } from "@/components/YearFilter";
import type { ClassEvent } from "@/lib/domain/types";
import { extractCourseNames } from "@/lib/domain/notes";
import { matchesYear } from "@/lib/domain/sources";
import { addDays, fmtTime, localDayOf, localToday, mondayOf } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { deleteClassEventSeries } from "@/lib/storage/repo";
import { CoursePicker } from "@/components/CoursePicker";
import { ImportIcalForm } from "./ImportIcalForm";
import {
  ManualLessonForm,
  type ManualLessonDraft,
} from "./ManualLessonForm";
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

const weekdayName = new Intl.DateTimeFormat("it-IT", { weekday: "long" });

// ── Manual lessons: derive editable series from the classEvents store ───────

/** One manual weekly series, reconstructed from its materialized rows. */
interface ManualSeries {
  seriesId: string;
  draft: ManualLessonDraft;
  /** Human label: e.g. "lunedì · 09:00–11:00". */
  schedule: string;
}

/** ISO weekday (1=Mon..7=Sun) of a Date in the local zone. */
function isoWeekday(date: Date): number {
  return ((date.getDay() + 6) % 7) + 1;
}

/** "HH:MM" local wall-clock time of an ISO datetime. */
function localHm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Group the manual rows (sourceId starting "manual") by their seriesId —
 *  parsed from the id `manual:<seriesId>:<date>` — into one editable entry
 *  each. We reconstruct the draft (weekday + start/end) from any one
 *  occurrence, since every row of a series shares the same weekly slot. */
function deriveManualSeries(classEvents: ClassEvent[]): ManualSeries[] {
  const firstById = new Map<string, ClassEvent>();
  for (const e of classEvents) {
    if (!e.sourceId.startsWith("manual")) continue;
    const parts = e.id.split(":"); // ["manual", seriesId, date]
    if (parts[0] !== "manual" || parts.length < 3) continue;
    const seriesId = parts[1];
    if (!firstById.has(seriesId)) firstById.set(seriesId, e);
  }
  return [...firstById.entries()]
    .map(([seriesId, e]) => {
      const start = new Date(e.start);
      const weekday = isoWeekday(start);
      const startTime = localHm(e.start);
      const endTime = localHm(e.end);
      return {
        seriesId,
        draft: {
          seriesId,
          courseName: e.courseName,
          weekday,
          startTime,
          endTime,
          room: e.room,
          kind: e.kind,
        } satisfies ManualLessonDraft,
        schedule: `${weekdayName.format(start)} · ${startTime}–${endTime}`,
      };
    })
    .sort(
      (a, b) =>
        a.draft.weekday - b.draft.weekday ||
        a.draft.startTime.localeCompare(b.draft.startTime),
    );
}

/** Editable list of the student's manual weekly lessons. Each row offers
 *  "Modifica" (opens an inline prefilled ManualLessonForm — submit deletes the
 *  old series and writes a fresh one) and "Elimina" (drops the whole series).
 *  Renders nothing when there are no manual lessons. */
function ManualLessonsManager({
  classEvents,
  courses,
}: {
  classEvents: ClassEvent[];
  courses: string[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const series = useMemo(() => deriveManualSeries(classEvents), [classEvents]);

  if (series.length === 0) return null;

  async function remove(seriesId: string) {
    await deleteClassEventSeries(seriesId);
    useSynced.getState().refresh();
    useToast.getState().show("Lezione eliminata.", "ok");
  }

  return (
    <section className="glass reveal rounded-lg p-5" aria-label="Lezioni manuali">
      <h2 className="flex items-center gap-2 font-sans text-[0.95rem] font-semibold tracking-normal text-ink">
        <CalendarCog aria-hidden="true" className="size-[1.125rem] text-[var(--signal-2)]" />
        Lezioni manuali
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {series.map((s) => (
          <li
            key={s.seriesId}
            className="rounded-md border border-line bg-night-800 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{s.draft.courseName}</p>
                <p className="muted font-num mt-0.5 text-xs first-letter:uppercase">
                  {s.schedule}
                  {s.draft.room ? ` · ${s.draft.room}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  aria-label={`Modifica la lezione di ${s.draft.courseName}`}
                  aria-expanded={editing === s.seriesId}
                  onClick={() =>
                    setEditing((cur) => (cur === s.seriesId ? null : s.seriesId))
                  }
                >
                  <Pencil aria-hidden="true" className="size-3.5" />
                  Modifica
                </Button>
                <ConfirmButton onConfirm={() => void remove(s.seriesId)}>
                  Elimina
                </ConfirmButton>
              </div>
            </div>
            {editing === s.seriesId && (
              <ManualLessonForm
                courses={courses}
                initial={s.draft}
                onDone={() => setEditing(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WeekView() {
  const classEvents = useSynced((s) => s.classEvents);
  const hydrated = useSynced((s) => s.hydrated);
  const settingsHydrated = useSettings((s) => s.hydrated);
  const hasSources = useSettings((s) => s.enabledSourceIds.length > 0);
  const pinnedCourses = useSettings((s) => s.pinnedCourses);
  const yearOfStudy = useSettings((s) => s.yearOfStudy);
  const updateSettings = useSettings((s) => s.update);
  const now = useNowMinute();
  const [weekOffset, setWeekOffset] = useState(0);
  // "auto" = mostra l'anno impostato nelle settings finché l'utente non sceglie.
  const [yearFilter, setYearFilter] = useState<number | "all" | "auto">("auto");

  const ready = now !== null && hydrated && settingsHydrated;
  const weekStart = ready ? addDays(mondayOf(now), weekOffset * 7) : null;

  // l'anno effettivamente mostrato: la scelta dell'utente, o l'anno di corso
  const effectiveYear: number | "all" =
    yearFilter === "auto" ? (yearOfStudy ?? "all") : yearFilter;

  // gli eventi del solo anno selezionato (l'anno è codificato nel sourceId)
  const yearFilteredEvents = useMemo(
    () => classEvents.filter((e) => matchesYear(e.sourceId, effectiveYear)),
    [classEvents, effectiveYear],
  );

  // every course in the selected year's feed, for the picker
  const allCourses = useMemo(
    () => extractCourseNames(yearFilteredEvents, []),
    [yearFilteredEvents],
  );

  const weekEvents = useMemo(() => {
    if (!weekStart) return [];
    const from = localToday(weekStart);
    const to = localToday(addDays(weekStart, 5));
    return yearFilteredEvents
      .filter((e) => {
        const day = localDayOf(e.start);
        return day >= from && day <= to;
      })
      .filter(
        (e) =>
          pinnedCourses.length === 0 || pinnedCourses.includes(e.courseName),
      );
  }, [yearFilteredEvents, weekStart, pinnedCourses]);

  // soonest lesson still ahead (or in progress), from the same feed as the grid
  const nextLesson = useMemo<ClassEvent | null>(() => {
    if (!ready || !now) return null;
    const ms = now.getTime();
    return (
      yearFilteredEvents
        .filter((e) => new Date(e.end).getTime() > ms)
        .filter(
          (e) =>
            pinnedCourses.length === 0 || pinnedCourses.includes(e.courseName),
        )
        .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null
    );
  }, [ready, yearFilteredEvents, pinnedCourses, now]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Orario</h1>
          {weekStart && (
            <p className="muted font-num mt-1.5">
              {weekOffset === 0 ? "Settimana corrente" : "Settimana"} ·{" "}
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
      ) : (
        <>
          {/* No live sources → keep the configure hint, but still let the
              student build their week by hand (the manual form below writes
              into the same classEvents store the grid reads). */}
          {!hasSources && (
            <div className="glass reveal p-5">
              <p className="muted text-sm">
                Nessuna fonte attiva.{" "}
                <Link href="/" className="text-signal underline underline-offset-2">
                  Configura il tuo ateneo dal cruscotto
                </Link>{" "}
                per sincronizzare l&rsquo;orario, oppure inserisci le lezioni
                manualmente qui sotto.
              </p>
            </div>
          )}
          {hasSources && <YearFilter value={effectiveYear} onChange={setYearFilter} />}
          <CoursePicker
            courses={allCourses}
            pinned={pinnedCourses}
            onChange={(pinned) => void updateSettings({ pinnedCourses: pinned })}
          />
          <ManualLessonForm courses={allCourses} />
          <ImportIcalForm />
          {weekEvents.length === 0 && (
            <div className="muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span>
                Nessuna lezione in questa settimana
                {pinnedCourses.length > 0 ? " per i corsi selezionati" : ""}
                {nextLesson && now ? "." : " 🎉"}
              </span>
              {nextLesson && now && (
                <button
                  type="button"
                  className="text-signal underline underline-offset-2"
                  onClick={() =>
                    setWeekOffset(
                      Math.round(
                        (mondayOf(new Date(nextLesson.start)).getTime() -
                          mondayOf(now).getTime()) /
                          (7 * 86_400_000),
                      ),
                    )
                  }
                >
                  Prossima lezione: {nextLesson.courseName},{" "}
                  {lessonDay.format(new Date(nextLesson.start))} →
                </button>
              )}
            </div>
          )}
          <div className="glass gradient-ring reveal overflow-x-auto p-5">
            <WeekGrid events={weekEvents} weekStart={weekStart!} now={now} />
          </div>
          <ManualLessonsManager classEvents={classEvents} courses={allCourses} />
        </>
      )}

      {nextLesson && <NextLessonCard event={nextLesson} />}
    </div>
  );
}
