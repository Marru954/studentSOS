import { cn } from "@/lib/cn";

interface ProgressRingProps {
  /** Progress in [0, 1]; values outside are clamped. */
  value: number;
  /** Accessible description, e.g. "96 CFU su 180". */
  label: string;
  size?: number;
  strokeWidth?: number;
  tone?: "signal" | "ok" | "warn";
  /** Center readout (mono). Falls back to a percentage. */
  children?: React.ReactNode;
  className?: string;
}

const TONE = {
  signal: "text-signal",
  ok: "text-ok",
  warn: "text-warn",
} as const;

/** Circular gauge. Round caps, soft sweep. */
export function ProgressRing({
  value,
  label,
  size = 104,
  strokeWidth = 6,
  tone = "signal",
  children,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // unique gradient id per size so multiple rings on a page don't collide
  const gradId = `ring-grad-${size}-${strokeWidth}`;

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--signal)" />
            <stop offset="100%" stopColor="var(--signal-2)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone === "signal" ? `url(#${gradId})` : "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          style={{ ["--ring-circ" as string]: `${circumference}px` }}
          className={cn(TONE[tone], "ring-progress")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
        {children ?? (
          <span className="text-lg font-medium text-ink">{Math.round(clamped * 100)}%</span>
        )}
      </div>
    </div>
  );
}
