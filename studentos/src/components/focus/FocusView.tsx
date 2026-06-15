"use client";

/** /focus: study modes + immersive session + studio stats + kanban. Sessions and
 *  tasks are manual territory; synced courses and exams only feed selects and
 *  countdowns. While a session runs the page collapses to the timer alone. */
import { CalendarCheck, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { extractCourseNames } from "@/lib/domain/notes";
import { bestDay, longestSession } from "@/lib/domain/focus";
import type { FocusSession } from "@/lib/domain/types";
import { daysFromToday, localDayOf, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useFocusSessions, useLibretto, useTasks } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
import { AmbientSounds } from "./AmbientSounds";
import { BackgroundPicker } from "./BackgroundPicker";
import { FocusHeatmap } from "./FocusHeatmap";
import { FocusInsights } from "./FocusInsights";
import { FocusStats } from "./FocusStats";
import { MotivationWidget } from "./MotivationWidget";
import { PomodoroTimer } from "./PomodoroTimer";
import { StudyModeSelector } from "./StudyModeSelector";
import { STUDY_MODES, type StudyMode } from "./studyModes";
import { TaskBoard } from "./TaskBoard";

function hm(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function ddmm(iso: string): string {
  const [, mo, d] = iso.split("-");
  return `${d}/${mo}`;
}

export function FocusView() {
  const tasks = useTasks();
  const focus = useFocusSessions();
  const libretto = useLibretto();
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const syncedHydrated = useSynced((s) => s.hydrated);
  const now = useNowMinute();

  const [mode, setMode] = useState<StudyMode>(STUDY_MODES[0]);
  const [sessionActive, setSessionActive] = useState(false);

  const ready =
    now !== null &&
    tasks.hydrated &&
    focus.hydrated &&
    libretto.hydrated &&
    syncedHydrated;

  const courses = useMemo(
    () => extractCourseNames(classEvents, examCalls),
    [classEvents, examCalls],
  );

  // motivation inputs
  const nextExam = useMemo(() => {
    if (!now) return undefined;
    const today = localToday(now);
    const soon = examCalls
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    return soon
      ? { courseName: soon.courseName, days: daysFromToday(soon.date, now) }
      : undefined;
  }, [examCalls, now]);

  const streak = useMemo(() => {
    if (!now) return 0;
    const days = new Set(focus.items.map((s) => localDayOf(s.startedAt)));
    let count = 0;
    const cursor = new Date(now);
    if (!days.has(localToday(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(localToday(cursor))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [focus.items, now]);

  const longest = longestSession(focus.items);
  const best = bestDay(focus.items);

  function recordSession(session: Omit<FocusSession, "id">) {
    void focus.upsert({ ...session, id: crypto.randomUUID() });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Focus</h1>
        <p className="muted mt-1.5">
          {sessionActive
            ? "Sessione in corso — resta sul pezzo. 🎧"
            : "Scegli una modalità e studia in sessioni. La costanza diventa una statistica."}
        </p>
      </header>

      {!ready ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-3">
          <span className="sr-only">Caricamento dei dati locali…</span>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <PanelSkeleton className="lg:col-span-5" />
            <PanelSkeleton className="lg:col-span-7" />
          </div>
          <PanelSkeleton />
        </div>
      ) : (
        <>
          {!sessionActive && (
            <StudyModeSelector
              activeId={mode.id}
              onSelect={setMode}
              locked={sessionActive}
            />
          )}
          {!sessionActive && (
            <MotivationWidget nextExam={nextExam} streak={streak} now={now} />
          )}
          {!sessionActive && (
            <div className="glass card-glow gradient-ring reveal flex flex-wrap items-center gap-x-10 gap-y-4 rounded-2xl px-5 py-4">
              <AmbientSounds />
              <BackgroundPicker />
            </div>
          )}

          {/* Timer is rendered exactly once (stable key) so toggling the
              immersive layout never remounts/resets a running session. */}
          <div
            className={
              sessionActive
                ? "flex justify-center"
                : "grid grid-cols-1 gap-5 lg:grid-cols-12"
            }
          >
            <PomodoroTimer
              key={mode.id}
              mode={mode}
              courses={courses}
              examCalls={examCalls}
              now={now}
              onRecord={recordSession}
              onStatusChange={setSessionActive}
              className={
                sessionActive
                  ? "panel-hero w-full max-w-lg"
                  : "panel-hero lg:col-span-5"
              }
            />
            {!sessionActive && (
              <div className="flex flex-col gap-5 lg:col-span-7">
                <FocusStats
                  sessions={focus.items}
                  libretto={libretto.items}
                  now={now}
                />
                {longest && best && (
                  <div className="glass grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-[color:var(--warn)]/15 text-[color:var(--warn)]">
                        <Trophy aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-ink">
                          {hm(longest.minutes)}
                        </div>
                        <div className="text-xs text-ink-mute">
                          sessione più lunga · {ddmm(localDayOf(longest.date))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-signal/15 text-signal">
                        <CalendarCheck aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-ink">
                          {hm(best.minutes)}
                        </div>
                        <div className="text-xs text-ink-mute">
                          giorno migliore · {ddmm(best.day)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <FocusInsights
                  sessions={focus.items}
                  libretto={libretto.items}
                />
              </div>
            )}
          </div>

          {!sessionActive && (
            <Panel
              title="Costanza"
              icon={<CalendarCheck aria-hidden="true" />}
              headingLevel={2}
              className="reveal"
            >
              <FocusHeatmap sessions={focus.items} now={now} />
            </Panel>
          )}
          {!sessionActive && (
            <TaskBoard
              tasks={tasks.items}
              courses={courses}
              today={localToday(now)}
              onUpsert={(t) => void tasks.upsert(t)}
              onRemove={(id) => void tasks.remove(id)}
            />
          )}
        </>
      )}
    </div>
  );
}
