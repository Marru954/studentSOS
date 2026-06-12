"use client";

/** /orario: week navigation state + store wiring around the pure WeekGrid. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Panel } from "@/components/primitives/Panel";
import { SourceStatus } from "@/components/SourceStatus";
import { extractCourseNames } from "@/lib/domain/notes";
import { addDays, localDayOf, localToday, mondayOf } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { CoursePicker } from "./CoursePicker";
import { WeekGrid } from "./WeekGrid";

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

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Orario</h1>
          {weekStart && (
            <p className="mt-1 font-mono text-xs text-ink-mute">
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
            ←
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
            →
          </Button>
        </div>
      </header>

      {!ready ? (
        <p role="status" className="text-label font-medium text-ink-mute">
          Caricamento dei dati locali…
        </p>
      ) : !hasSources ? (
        <Panel>
          <p className="text-sm text-ink-mute">
            Nessuna fonte attiva.{" "}
            <Link href="/" className="text-signal underline underline-offset-2">
              Configura il tuo ateneo dal cruscotto
            </Link>{" "}
            per sincronizzare l&rsquo;orario delle lezioni.
          </p>
        </Panel>
      ) : (
        <>
          <CoursePicker
            courses={allCourses}
            pinned={pinnedCourses}
            onChange={(pinned) => void updateSettings({ pinnedCourses: pinned })}
          />
          {weekEvents.length === 0 && (
            <p className="text-sm text-ink-mute">
              Nessuna lezione in questa settimana
              {pinnedCourses.length > 0 ? " per i corsi selezionati" : ""}.
            </p>
          )}
          <Panel flush>
            <WeekGrid events={weekEvents} weekStart={weekStart!} now={now} />
          </Panel>
        </>
      )}

      <SourceStatus />
    </div>
  );
}
