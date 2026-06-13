import { cn } from "@/lib/cn";
import type { GradePoint } from "@/lib/domain/libretto";

interface ScatterPlotProps {
  points: GradePoint[];
  /** Accessible description — the chart is invisible to screen readers otherwise. */
  label: string;
  height?: number;
  className?: string;
}

const VIEW_W = 280;
const PAD_L = 22; // room for the Y labels (18 / 24 / 30)
const PAD_R = 6;
const PAD_T = 8;
const PAD_B = 4;

// Italian grade scale — a fixed Y domain reads truer than auto-scaling.
const Y_MIN = 18;
const Y_MAX = 30;
const Y_TICKS = [18, 24, 30];

const MS_PER_DAY = 86_400_000;

function isoToUtc(date: string): number {
  return Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
}

/** Grades over time: X = exam date, Y = voto (18–30). Lode marks are ringed.
 *  Minimal axes — two gridlines and three Y labels, no chartjunk. */
export function ScatterPlot({
  points,
  label,
  height = 132,
  className,
}: ScatterPlotProps) {
  if (points.length === 0) return null;

  const plotW = VIEW_W - PAD_L - PAD_R;
  const plotH = height - PAD_T - PAD_B;

  const times = points.map((p) => isoToUtc(p.date));
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const tSpan = tMax - tMin || 1; // all on one day → stack at the left edge

  const x = (t: number) =>
    points.length === 1 ? PAD_L + plotW / 2 : PAD_L + ((t - tMin) / tSpan) * plotW;
  const y = (v: number) =>
    PAD_T + (1 - (clamp(v, Y_MIN, Y_MAX) - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

  const spanDays = Math.round(tSpan / MS_PER_DAY);

  return (
    <svg
      role="img"
      aria-label={label}
      width="100%"
      height={height}
      viewBox={`0 0 ${VIEW_W} ${height}`}
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
    >
      {/* Gridlines + Y labels */}
      {Y_TICKS.map((t) => (
        <g key={t}>
          <line
            x1={PAD_L}
            x2={VIEW_W - PAD_R}
            y1={y(t)}
            y2={y(t)}
            className="stroke-line"
            strokeWidth={1}
            strokeDasharray={t === Y_MIN ? undefined : "2 3"}
          />
          <text
            x={0}
            y={y(t)}
            dy="0.32em"
            className="fill-ink-mute font-mono text-[9px]"
          >
            {t}
          </text>
        </g>
      ))}

      {/* Points */}
      {points.map((p, i) => (
        <g key={`${p.date}-${i}`}>
          {p.laude && (
            <circle
              cx={x(times[i])}
              cy={y(p.value)}
              r={4.5}
              fill="none"
              className="stroke-ok"
              strokeWidth={1.25}
            />
          )}
          <circle
            cx={x(times[i])}
            cy={y(p.value)}
            r={2.6}
            className={p.laude ? "fill-ok" : "fill-signal"}
          />
        </g>
      ))}

      {spanDays > 0 && (
        <text
          x={VIEW_W - PAD_R}
          y={height - 0.5}
          textAnchor="end"
          className="fill-ink-mute text-[9px]"
        >
          {points.length} esami · ~{Math.max(1, Math.round(spanDays / 30))} mesi
        </text>
      )}
    </svg>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
