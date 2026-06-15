"use client";

/** /focus: pomodoro + studio stats + kanban. Sessions and tasks are manual
 *  territory; synced courses and exams only feed selects and countdowns. */
import { CalendarCheck } from "lucide-react";
import { useMemo } from "react";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { extractCourseNames } from "@/lib/domain/notes";
import type { FocusSession } from "@/lib/domain/types";
import { localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useFocusSessions, useLibretto, useTasks } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
import { AmbientSounds } from "./AmbientSounds";
import { BackgroundPicker } from "./BackgroundPicker";
import { FocusHeatmap } from "./FocusHeatmap";
import { FocusStats } from "./FocusStats";
import { PomodoroTimer } from "./PomodoroTimer";
import { TaskBoard } from "./TaskBoard";

export function FocusView() {
  const tasks = useTasks();
  const focus = useFocusSessions();
  const libretto = useLibretto();
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const syncedHydrated = useSynced((s) => s.hydrated);
  const now = useNowMinute();

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

  function recordSession(session: Omit<FocusSession, "id">) {
    void focus.upsert({ ...session, id: crypto.randomUUID() });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Focus</h1>
        <p className="muted mt-1.5">
          Studia in sessioni. La costanza diventa una statistica.
        </p>
      </header>

      {!ready ? (
        <div
          role="status"
          aria-busy="true"
          className="flex flex-col gap-3"
        >
          <span className="sr-only">Caricamento dei dati locali…</span>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <PanelSkeleton className="lg:col-span-5" />
            <PanelSkeleton className="lg:col-span-7" />
          </div>
          <PanelSkeleton />
        </div>
      ) : (
        <>
          <div className="glass card-glow gradient-ring reveal flex flex-wrap items-center gap-x-10 gap-y-4 rounded-2xl px-5 py-4">
            <AmbientSounds />
            <BackgroundPicker />
          </div>
          <Panel
            title="Costanza"
            icon={<CalendarCheck aria-hidden="true" />}
            headingLevel={2}
            className="reveal"
          >
            <FocusHeatmap sessions={focus.items} now={now} />
          </Panel>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <PomodoroTimer
              courses={courses}
              examCalls={examCalls}
              now={now}
              onRecord={recordSession}
              className="panel-hero lg:col-span-5"
            />
            <FocusStats
              sessions={focus.items}
              libretto={libretto.items}
              now={now}
              className="lg:col-span-7"
            />
          </div>
          <TaskBoard
            tasks={tasks.items}
            courses={courses}
            today={localToday(now)}
            onUpsert={(t) => void tasks.upsert(t)}
            onRemove={(id) => void tasks.remove(id)}
          />
        </>
      )}
    </div>
  );
}
