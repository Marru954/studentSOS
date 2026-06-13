import { cn } from "@/lib/cn";
import type { GradePoint } from "@/lib/domain/libretto";

interface ScatterPlotProps {
  points: GradePoint[];
  /** Accessible description — the chart is invisible to screen readers otherwise. */
  label: string;
  className?: string;
}

// Wide, short viewBox → the chart scales to the panel width keeping circular
// dots (preserveAspectRatio meet, height derived from the viewBox ratio).
const VIEW_W = 480;
const VIEW_H = 132;
const PAD_L = 24; // room for the Y labels (18 / 24 / 30)
const PAD_R = 10;
const PAD_T = 12;
const PAD_B = 10;

// Italian grade scale — a fixed 18→30 Y domain reads truer than auto-scaling.
const Y_MIN = 18;
const Y_MAX = 30;
const Y_TICKS = [18, 24, 30];

function isoToUtc(date: string): number {
  return Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
}

function fmtDate(date: string): string {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Grades over time: X = exam date, Y = voto (18–30). A faint trend line joins
 *  the marks chronologically; lode marks are ringed; each dot carries a native
 *  tooltip (course, grade, date). Minimal axes, no chartjunk. */
export function ScatterPlot({ points, label, className }: ScatterPlotProps) {
  if (points.length === 0) return null;

  const plotW = VIEW_W - PAD_L - PAD_R;
  const plotH = VIEW_H - PAD_T - PAD_B;

  const times = points.map((p) => isoToUtc(p.date));
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const tSpan = tMax - tMin || 1; // all on one day → stack at the centre

  const x = (t: number) =>
    points.length === 1 ? PAD_L + plotW / 2 : PAD_L + ((t - tMin) / tSpan) * plotW;
  const y = (v: number) =>
    PAD_T + (1 - (clamp(v, Y_MIN, Y_MAX) - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

  const trend = points
    .map((p, i) => `${x(times[i]).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      role="img"
      aria-label={label}
      width="100%"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      {/* Gridlines + Y labels — nearly invisible hairlines */}
      {Y_TICKS.map((t) => (
        <g key={t}>
          <line
            x1={PAD_L}
            x2={VIEW_W - PAD_R}
            y1={y(t)}
            y2={y(t)}
            className="stroke-line-strong"
            strokeWidth={1}
            strokeDasharray="2 5"
            strokeOpacity={0.5}
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={0}
            y={y(t)}
            dy="0.32em"
            className="fill-ink-faint text-[9px]"
          >
            {t}
          </text>
        </g>
      ))}

      {/* Trend line through the grades in chronological order, drawn L→R */}
      {points.length >= 2 && (
        <polyline
          points={trend}
          pathLength={1}
          fill="none"
          className="trend-draw stroke-signal"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity={0.45}
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Points — pop in one by one after the line is drawn */}
      {points.map((p, i) => {
        const delay = `${0.25 + i * 0.08}s`;
        return (
          <g key={`${p.date}-${i}`}>
            {p.laude && (
              <circle
                cx={x(times[i])}
                cy={y(p.value)}
                r={6.5}
                fill="none"
                className="scatter-dot-in stroke-ok"
                style={{ animationDelay: delay }}
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            )}
            <circle
              cx={x(times[i])}
              cy={y(p.value)}
              r={4}
              style={{ animationDelay: delay }}
              className={cn(
                "scatter-dot scatter-dot-in",
                p.laude ? "fill-ok" : "fill-signal",
              )}
            >
              <title>
                {`${p.courseName} — ${p.value}${p.laude ? " e lode" : ""}/30 — ${fmtDate(p.date)}`}
              </title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
