/**
 * Pomodoro: 25' focus / 5' break. Drift-free — the deadline lives in a ref
 * and every tick recomputes the remainder from the wall clock. A focus
 * phase ≥ 5 minutes is recorded as a FocusSession even when interrupted;
 * the break auto-starts, the next focus waits for the user.
 */
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { inputClass } from "@/components/primitives/Field";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { cn } from "@/lib/cn";
import type { ExamCall, FocusSession } from "@/lib/domain/types";
import { daysFromToday, fmtPlainDayMonth } from "@/lib/format";

/** Selectable focus/break durations (minutes). */
const PRESETS = [
  { focus: 25, break: 5, label: "25/5" },
  { focus: 45, break: 10, label: "45/10" },
  { focus: 60, break: 15, label: "60/15" },
];
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
  const [preset, setPreset] = useState(0);
  const FOCUS_MS = PRESETS[preset].focus * 60_000;
  const BREAK_MS = PRESETS[preset].break * 60_000;

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
  }, [status, phase, course, onRecord, FOCUS_MS, BREAK_MS]);

  const nextExam = course
    ? examCalls.find(
        (e) => e.courseName === course && daysFromToday(e.date, now) >= 0,
      )
    : undefined;

  return (
    <section
      className={cn(
        "glass reveal relative flex flex-col items-center gap-6 overflow-hidden rounded-lg p-8",
        className,
      )}
    >
      {/* radial glow behind the ring — intensifies while running */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, var(--signal), transparent 70%)",
          opacity: status === "running" ? 0.22 : 0.1,
        }}
      />

      <div className="relative flex w-full flex-col gap-2">
        <label
          htmlFor="pomodoro-corso"
          className="eyebrow self-center"
        >
          Corso in studio
        </label>
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
        {nextExam && (
          <p className="muted self-center text-center text-xs">
            Prossimo appello: {fmtPlainDayMonth(nextExam.date)}{" "}
            {daysFromToday(nextExam.date, now) === 0
              ? "(oggi)"
              : `(tra ${daysFromToday(nextExam.date, now)} giorni)`}
          </p>
        )}
      </div>

      {/* preset durata — solo da fermo */}
      {status === "idle" && (
        <div className="relative flex items-center gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={preset === i}
              onClick={() => {
                setPreset(i);
                setRemainingMs(p.focus * 60_000);
              }}
              className={preset === i ? "chip chip-signal" : "chip"}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* big timer ring — indigo→violet gradient, Bricolage mm:ss readout */}
      <div className="relative w-[320px] max-w-[78vw]">
        <ProgressRing
          value={1 - remainingMs / phaseTotal}
          label={`${PHASE_LABEL[phase]}: mancano ${mmss(remainingMs)}`}
          size={320}
          strokeWidth={14}
          tone="signal"
          className="w-full [&>svg]:h-auto [&>svg]:w-full"
        >
          <span className="font-num text-[clamp(3rem,12vw,4.6rem)] font-extrabold leading-none tracking-[-0.03em] text-ink [font-family:var(--font-display)]">
            {mmss(remainingMs)}
          </span>
          <span className="eyebrow mt-1.5">{PHASE_LABEL[phase]}</span>
        </ProgressRing>
      </div>

      {/* controls */}
      <div className="relative flex items-center gap-3">
        {status === "running" ? (
          <button
            type="button"
            className="btn btn-primary px-8 py-3.5 text-base"
            onClick={pause}
          >
            <Pause size={18} aria-hidden="true" />
            Pausa
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary px-8 py-3.5 text-base"
            onClick={start}
          >
            <Play size={18} aria-hidden="true" />
            {status === "paused" ? "Riprendi" : "Avvia"}
          </button>
        )}
        {(status !== "idle" || phase === "break") && (
          <button
            type="button"
            className="btn px-3.5 py-3.5"
            onClick={stop}
            aria-label="Interrompi"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <p
        aria-live="polite"
        className="relative min-h-4 text-center text-xs font-medium text-signal"
      >
        {announce}
      </p>
      <p className="muted relative text-center text-xs">
        {PRESETS[preset].focus} minuti di focus, {PRESETS[preset].break} di
        pausa. Le sessioni da almeno 5 minuti vengono registrate
        {course ? ` su «${course}»` : ""}.
      </p>
    </section>
  );
}
