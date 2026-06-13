import { cn } from "@/lib/cn";

interface StatProps {
  label: string;
  /** Pre-formatted value — formatting decisions stay with the caller. */
  value: React.ReactNode;
  unit?: string;
  /** Secondary reading under the value (e.g. "su 180 CFU"). */
  hint?: React.ReactNode;
  delta?: { text: string; tone: "ok" | "danger" | "neutral" };
  className?: string;
}

const DELTA_TONE = {
  ok: "text-ok",
  danger: "text-danger",
  neutral: "text-ink-mute",
} as const;

/** Primary numeric readout of the instrument panel. Mono, tabular, large. */
export function Stat({ label, value, unit, hint, delta, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-label font-medium text-ink-mute">{label}</span>
      <span className="font-mono text-3xl font-medium leading-none text-ink">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-ink-mute">{unit}</span>}
      </span>
      {(hint || delta) && (
        <span className="flex items-baseline gap-2 text-xs text-ink-mute">
          {delta && (
            <span className={cn("font-mono font-medium", DELTA_TONE[delta.tone])}>
              {delta.text}
            </span>
          )}
          {hint}
        </span>
      )}
    </div>
  );
}
