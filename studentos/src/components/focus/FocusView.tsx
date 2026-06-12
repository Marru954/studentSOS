"use client";

/** /focus: pomodoro + studio stats + kanban. Sessions and tasks are manual
 *  territory; synced courses and exams only feed selects and countdowns. */
import { useMemo } from "react";
import { extractCourseNames } from "@/lib/domain/notes";
import type { FocusSession } from "@/lib/domain/types";
import { localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useFocusSessions, useLibretto, useTasks } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
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
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold">Focus</h1>
        <p className="mt-1 text-xs text-ink-mute">
          Sessioni di studio e attività, solo su questo dispositivo.
        </p>
      </header>

      {!ready ? (
        <p role="status" className="text-label font-medium text-ink-mute">
          Caricamento dei dati locali…
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <PomodoroTimer
              courses={courses}
              examCalls={examCalls}
              now={now}
              onRecord={recordSession}
              className="lg:col-span-5"
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
