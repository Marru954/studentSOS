import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "signal" | "warn" | "danger" | "ok";

interface BadgeProps {
  tone?: BadgeTone;
  /** Leading status dot (e.g. live sync indicator). */
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TONE: Record<BadgeTone, string> = {
  neutral: "border-line bg-night-950 text-ink-mute",
  signal: "border-signal/30 bg-signal-dim text-signal",
  warn: "border-warn/30 bg-warn-dim text-warn",
  danger: "border-danger/35 bg-danger-dim text-danger",
  ok: "border-ok/30 bg-ok-dim text-ok",
};

/** Soft status pill. Tone only — meaning must also be carried by the
 *  text itself, never by color alone. */
export function Badge({ tone = "neutral", dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-px",
        "text-label font-medium",
        TONE[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
