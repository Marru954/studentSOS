/**
 * Study timer driven by a StudyMode. Count-down modes (Pomodoro/Deep Work/
 * Sprint) run a drift-free focus→break machine: the deadline lives in a ref and
 * every tick recomputes the remainder from the wall clock; a focus phase ≥ 5 min
 * is recorded even if interrupted, the break auto-starts, the next focus waits.
 * Count-up mode (Flow) ticks elapsed upward until the user stops. A soft chime
 * plays on completion; a beforeunload guard warns on tab-close while running.
 */
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { inputClass } from "@/components/primitives/Field";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { cn } from "@/lib/cn";
import type { ExamCall, FocusSession } from "@/lib/domain/types";
import { daysFromToday, fmtPlainDayMonth } from "@/lib/format";
import { STUDY_MODES, type StudyMode } from "./studyModes";

/** Interruptions shorter than this aren't worth recording. */
const MIN_RECORD_MS = 5 * 60_000;

type Phase = "focus" | "break";
type Status = "idle" | "running" | "paused";

const PHASE_LABEL: Record<Phase, string> = { focus: "Focus", break: "Pausa" };
const pad = (n: number) => n.toString().padStart(2, "0");

/** mm:ss, or h:mm:ss past an hour (for long Flow sessions). */
function clock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Soft two-tone completion bell via Web Audio (no asset). */
function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
    window.setTimeout(() => void ctx.close(), 1200);
  } catch {
    /* AudioContext unavailable — silent */
  }
}

export function PomodoroTimer({
  mode = STUDY_MODES[0],
  courses,
  examCalls,
  now,
  onRecord,
  onStatusChange,
  className,
}: {
  mode?: StudyMode;
  courses: string[];
  examCalls: ExamCall[];
  now: Date;
  onRecord: (session: Omit<FocusSession, "id">) => void;
  onStatusChange?: (active: boolean) => void;
  className?: string;
}) {
  const FOCUS_MS = mode.focus * 60_000;
  const BREAK_MS = mode.break * 60_000;

  const [phase, setPhase] = useState<Phase>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [remainingMs, setRemainingMs] = useState(FOCUS_MS);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [course, setCourse] = useState("");
  const [announce, setAnnounce] = useState("");

  const deadline = useRef(0);
  const sessionStart = useRef<string | null>(null);
  const elapsedBase = useRef(0);
  const runStart = useRef(0);

  const phaseTotal = phase === "focus" ? FOCUS_MS : BREAK_MS;

  function recordMinutes(elapsedMsValue: number, full = false): boolean {
    if (!sessionStart.current) return false;
    if (!full && elapsedMsValue < MIN_RECORD_MS) return false;
    onRecord({
      courseName: course || undefined,
      startedAt: sessionStart.current,
      minutes: Math.max(1, Math.round(elapsedMsValue / 60_000)),
    });
    return true;
  }

  function start() {
    if (mode.countUp) {
      if (status === "idle") {
        sessionStart.current = new Date().toISOString();
        elapsedBase.current = 0;
      }
      runStart.current = Date.now();
    } else {
      if (phase === "focus" && status === "idle") {
        sessionStart.current = new Date().toISOString();
      }
      deadline.current = Date.now() + remainingMs;
    }
    setStatus("running");
    onStatusChange?.(true);
  }

  function pause() {
    if (mode.countUp) {
      elapsedBase.current += Date.now() - runStart.current;
      setElapsedMs(elapsedBase.current);
    } else {
      setRemainingMs(Math.max(0, deadline.current - Date.now()));
    }
    setStatus("paused");
  }

  function stop() {
    if (mode.countUp) {
      const total =
        elapsedBase.current +
        (status === "running" ? Date.now() - runStart.current : 0);
      const recorded = recordMinutes(total);
      sessionStart.current = null;
      elapsedBase.current = 0;
      runStart.current = 0;
      setElapsedMs(0);
      setStatus("idle");
      setAnnounce(
        recorded ? "Sessione registrata." : "Sessione troppo breve (< 5 min).",
      );
    } else {
      const left =
        status === "running" ? deadline.current - Date.now() : remainingMs;
      const recorded =
        phase === "focus" ? recordMinutes(phaseTotal - left) : false;
      sessionStart.current = null;
      setPhase("focus");
      setStatus("idle");
      setRemainingMs(FOCUS_MS);
      setAnnounce(
        recorded
          ? "Sessione registrata. Timer interrotto."
          : "Timer interrotto.",
      );
    }
    onStatusChange?.(false);
  }

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      if (mode.countUp) {
        setElapsedMs(elapsedBase.current + (Date.now() - runStart.current));
        return;
      }
      const left = deadline.current - Date.now();
      if (left > 0) {
        setRemainingMs(left);
        return;
      }
      if (phase === "focus") {
        if (sessionStart.current) {
          onRecord({
            courseName: course || undefined,
            startedAt: sessionStart.current,
            minutes: Math.round(FOCUS_MS / 60_000),
          });
          sessionStart.current = null;
        }
        playChime();
        if (BREAK_MS > 0) {
          deadline.current = Date.now() + BREAK_MS;
          setPhase("break");
          setRemainingMs(BREAK_MS);
          setAnnounce(
            `Sessione registrata. Blocco completato: pausa di ${mode.break} minuti.`,
          );
        } else {
          setStatus("idle");
          setRemainingMs(FOCUS_MS);
          setAnnounce("Sessione registrata. Blocco completato!");
          onStatusChange?.(false);
        }
      } else {
        setPhase("focus");
        setStatus("idle");
        setRemainingMs(FOCUS_MS);
        setAnnounce("Pausa finita: pronto per il prossimo blocco.");
        onStatusChange?.(false);
      }
    }, 500);
    return () => clearInterval(id);
  }, [status, phase, course, onRecord, onStatusChange, mode, FOCUS_MS, BREAK_MS]);

  // warn before closing the tab mid-session
  useEffect(() => {
    if (status !== "running") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  const display = mode.countUp ? clock(elapsedMs) : clock(remainingMs);
  const ringValue = mode.countUp
    ? (elapsedMs % 3_600_000) / 3_600_000
    : 1 - remainingMs / phaseTotal;
  const phaseLabel = mode.countUp ? "Flow" : PHASE_LABEL[phase];

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(60% 50% at 50% 30%, ${mode.accent}, transparent 70%)`,
          opacity: status === "running" ? 0.22 : 0.1,
        }}
      />

      <div className="relative flex w-full flex-col gap-2">
        <label htmlFor="pomodoro-corso" className="eyebrow self-center">
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

      <div className="relative w-[320px] max-w-[78vw]">
        <ProgressRing
          value={ringValue}
          label={
            mode.countUp
              ? `Flow: ${display} trascorsi`
              : `${phaseLabel}: mancano ${display}`
          }
          size={320}
          strokeWidth={14}
          tone="signal"
          className="w-full [&>svg]:h-auto [&>svg]:w-full"
        >
          <span className="font-num text-[clamp(2.6rem,11vw,4.4rem)] font-extrabold leading-none tracking-[-0.03em] text-ink [font-family:var(--font-display)]">
            {display}
          </span>
          <span className="eyebrow mt-1.5">{phaseLabel}</span>
        </ProgressRing>
      </div>

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
        {status !== "idle" && (
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
        {mode.countUp
          ? "Studia quanto vuoi — la sessione viene registrata quando ti fermi"
          : `${mode.focus} min di focus${mode.break > 0 ? `, ${mode.break} di pausa` : ""} — sessioni da almeno 5 min registrate`}
        {course ? ` su «${course}»` : ""}.
      </p>
    </section>
  );
}
