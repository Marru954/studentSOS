import { cn } from "@/lib/cn";

interface SparklineProps {
  values: number[];
  /** Accessible description of what the series shows — required, the chart
   *  is otherwise invisible to screen readers. */
  label: string;
  width?: number;
  height?: number;
  tone?: "signal" | "ok" | "warn" | "ink";
  className?: string;
}

const TONE = {
  signal: "text-signal",
  ok: "text-ok",
  warn: "text-warn",
  ink: "text-ink-mute",
} as const;

/** Inline trend line. No axes, no grid — context comes from the Stat beside it. */
export function Sparkline({
  values,
  label,
  width = 96,
  height = 28,
  tone = "signal",
  className,
}: SparklineProps) {
  if (values.length < 2) return null;

  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // flat series renders as a mid line
  const stepX = (width - pad * 2) / (values.length - 1);
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const points = values.map((v, i) => `${(pad + i * stepX).toFixed(1)},${y(v).toFixed(1)}`);
  const [lastX, lastY] = points[points.length - 1].split(",");

  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(TONE[tone], className)}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}
