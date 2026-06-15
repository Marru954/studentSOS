"use client";

/**
 * "Obiettivo settimana": hours focused since Monday vs a user-set weekly goal,
 * shown as a circular gauge. The goal persists in localStorage via a tiny
 * external store (no setState-in-effect — mirrors `useTheme`), so the value is
 * read consistently across mounts and SSR (server snapshot = the default).
 */
import { Minus, Plus, Target } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { minutesInRange } from "@/lib/domain/focus";
import { fmtNum, mondayOf } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useFocusSessions } from "@/lib/state/manual";

const STORAGE_KEY = "studentos-weekly-goal-hours";
const DEFAULT_GOAL = 10;
const MIN_GOAL = 1;
const MAX_GOAL = 60;

const listeners = new Set<() => void>();

function clampGoal(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_GOAL;
  return Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.round(value)));
}

function readGoal(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_GOAL;
    return clampGoal(Number(raw));
  } catch {
    return DEFAULT_GOAL;
  }
}

function setGoal(value: number): void {
  const goal = clampGoal(value);
  try {
    localStorage.setItem(STORAGE_KEY, String(goal));
  } catch {
    // private mode / storage disabled — value still applies for this session
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function useWeeklyGoal(): number {
  return useSyncExternalStore(subscribe, readGoal, () => DEFAULT_GOAL);
}

/** Local-zone start of this week (Monday 00:00) as an ISO datetime. */
function mondayStartIso(now: Date): string {
  return mondayOf(now).toISOString();
}

export function WeeklyGoalCard({ className }: { className?: string }) {
  const sessions = useFocusSessions((s) => s.items);
  const now = useNowMinute();
  const goal = useWeeklyGoal();

  const hours = useMemo(() => {
    if (now === null) return 0;
    const from = mondayStartIso(now);
    const to = now.toISOString();
    return minutesInRange(sessions, from, to) / 60;
  }, [sessions, now]);

  const progress = Math.min(1, Math.max(0, goal > 0 ? hours / goal : 0));
  // one decimal only when it adds information
  const hoursLabel = Number.isInteger(hours) ? String(hours) : fmtNum(hours, 1);

  return (
    <Panel title="Obiettivo settimana" icon={<Target />} className={className}>
      <div className="flex flex-wrap items-center gap-5">
        <ProgressRing
          value={progress}
          label={`${hoursLabel} ore su ${goal} questa settimana`}
          tone={progress >= 1 ? "ok" : "signal"}
        >
          <span className="text-lg font-medium text-ink">
            {Math.round(progress * 100)}%
          </span>
        </ProgressRing>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-sm text-ink-mute">
            <span className="font-medium text-ink">{hoursLabel}/{goal}h</span>{" "}
            questa settimana
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint">Obiettivo settimanale</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGoal(goal - 1)}
                disabled={goal <= MIN_GOAL}
                aria-label="Riduci obiettivo di un'ora"
                className="btn flex size-7 items-center justify-center p-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="size-3.5" />
              </button>
              <span
                aria-live="polite"
                className="min-w-[3ch] text-center font-mono text-sm font-medium text-ink"
              >
                {goal}h
              </span>
              <button
                type="button"
                onClick={() => setGoal(goal + 1)}
                disabled={goal >= MAX_GOAL}
                aria-label="Aumenta obiettivo di un'ora"
                className="btn flex size-7 items-center justify-center p-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
