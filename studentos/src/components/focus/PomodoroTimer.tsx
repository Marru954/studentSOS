/**
 * Pomodoro: 25' focus / 5' break. Drift-free — the deadline lives in a ref
 * and every tick recomputes the remainder from the wall clock. A focus
 * phase ≥ 5 minutes is recorded as a FocusSession even when interrupted;
 * the break auto-starts, the next focus waits for the user.
 */
import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import type { ExamCall, FocusSession } from "@/lib/domain/types";
import { daysFromToday, fmtPlainDayMonth } from "@/lib/format";

const FOCUS_MS = 25 * 60_000;
const BREAK_MS = 5 * 60_000;
/** Interruptions shorter than this aren't worth recording. */
const MIN_RECORD_MS = 5 * 60_000;

type Phase = "focus" | "break";
type Status = "idle" | "running" | "paused";

const PHASE_LABEL: Record<Phase, string> = { focus: "Focus", break: "Pausa" };

function mmss(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer({
  courses,
  examCalls,
  now,
  onRecord,
  className,
}: {
  courses: string[];
  examCalls: ExamCall[];
  now: Date;
  onRecord: (session: Omit<FocusSession, "id">) => void;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [remainingMs, setRemainingMs] = useState(FOCUS_MS);
  const [course, setCourse] = useState("");
  const [announce, setAnnounce] = useState("");

  const deadline = useRef(0);
  const sessionStart = useRef<string | null>(null);

  const phaseTotal = phase === "focus" ? FOCUS_MS : BREAK_MS;

  function recordIfWorthIt(elapsedMs: number): boolean {
    if (phase !== "focus" || !sessionStart.current) return false;
    if (elapsedMs < MIN_RECORD_MS) return false;
    onRecord({
      courseName: course || undefined,
      startedAt: sessionStart.current,
      minutes: Math.round(elapsedMs / 60_000),
    });
    return true;
  }

  function start() {
    if (phase === "focus" && status === "idle") {
      sessionStart.current = new Date().toISOString();
    }
    deadline.current = Date.now() + remainingMs;
    setStatus("running");
  }

  function pause() {
    setRemainingMs(Math.max(0, deadline.current - Date.now()));
    setStatus("paused");
  }

  function stop() {
    const left =
      status === "running" ? deadline.current - Date.now() : remainingMs;
    const recorded = recordIfWorthIt(phaseTotal - left);
    sessionStart.current = null;
    setPhase("focus");
    setStatus("idle");
    setRemainingMs(FOCUS_MS);
    setAnnounce(
      recorded ? "Sessione registrata. Timer interrotto." : "Timer interrotto.",
    );
  }

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      const left = deadline.current - Date.now();
      if (left > 0) {
        setRemainingMs(left);
        return;
      }
      if (phase === "focus") {
        // completed pomodoro: record it and roll straight into the break
        if (sessionStart.current) {
          onRecord({
            courseName: course || undefined,
            startedAt: sessionStart.current,
            minutes: Math.round(FOCUS_MS / 60_000),
          });
          sessionStart.current = null;
        }
        deadline.current = Date.now() + BREAK_MS;
        setPhase("break");
        setRemainingMs(BREAK_MS);
        setAnnounce("Sessione registrata. Pomodoro completato: pausa di 5 minuti.");
      } else {
        setPhase("focus");
        setStatus("idle");
        setRemainingMs(FOCUS_MS);
        setAnnounce("Pausa finita: pronto per il prossimo pomodoro.");
      }
    }, 500);
    return () => clearInterval(id);
    // course/onRecord are read at completion time; restarting the interval
    // on their change is correct and cheap
  }, [status, phase, course, onRecord]);

  const nextExam = course
    ? examCalls.find(
        (e) => e.courseName === course && daysFromToday(e.date, now) >= 0,
      )
    : undefined;

  return (
    <Panel title="Pomodoro" icon={<Timer />} className={className}>
      <div className="flex flex-col gap-4">
        <Field label="Corso in studio" htmlFor="pomodoro-corso">
          <select
            id="pomodoro-corso"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={inputClass}
          >
            <option value="">— nessuno —</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        {nextExam && (
          <p className="text-xs text-ink-mute">
            Prossimo appello: {fmtPlainDayMonth(nextExam.date)}{" "}
            {daysFromToday(nextExam.date, now) === 0
              ? "(oggi)"
              : `(tra ${daysFromToday(nextExam.date, now)} giorni)`}
          </p>
        )}

        <div className="flex items-center gap-5">
          <ProgressRing
            value={1 - remainingMs / phaseTotal}
            label={`${PHASE_LABEL[phase]}: mancano ${mmss(remainingMs)}`}
            size={120}
            tone={phase === "focus" ? "signal" : "ok"}
          >
            <span className="text-2xl font-medium text-ink">
              {mmss(remainingMs)}
            </span>
            <span className="text-label text-ink-mute">
              {PHASE_LABEL[phase]}
            </span>
          </ProgressRing>

          <div className="flex flex-col gap-2">
            {status === "running" ? (
              <Button onClick={pause}>Pausa</Button>
            ) : (
              <Button variant="primary" onClick={start}>
                {status === "paused" ? "Riprendi" : "Avvia"}
              </Button>
            )}
            {(status !== "idle" || phase === "break") && (
              <Button onClick={stop}>Interrompi</Button>
            )}
          </div>
        </div>

        <p
          aria-live="polite"
          className="min-h-4 text-xs font-medium text-signal"
        >
          {announce}
        </p>
        <p className="text-xs text-ink-mute">
          25 minuti di focus, 5 di pausa. Le sessioni da almeno 5 minuti
          vengono registrate{course ? ` su «${course}»` : ""}.
        </p>
      </div>
    </Panel>
  );
}
