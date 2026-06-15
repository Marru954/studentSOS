/** Advanced focus stats: per-weekday minutes (bar chart) + an auto insight.
 *  Pure props → no client boundary needed. */
import { focusByCourse, minutesByWeekday, NO_COURSE } from "@/lib/domain/focus";
import type { FocusSession, LibrettoEntry } from "@/lib/domain/types";
import { fmtMinutes } from "@/lib/format";

// Monday-first, matching minutesByWeekday()'s index order.
const SHORT_DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const LONG_DAYS = [
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
  "domenica",
];

const VIEW_W = 320;
const VIEW_H = 132;
const PAD_X = 6;
const PAD_TOP = 10;
const LABEL_H = 16; // room for the weekday labels under the axis
const BAR_GAP = 8;

export function FocusInsights({
  sessions,
  libretto,
}: {
  sessions: FocusSession[];
  libretto: LibrettoEntry[];
}) {
  const weekday = minutesByWeekday(sessions);
  const max = Math.max(...weekday);
  const total = weekday.reduce((a, b) => a + b, 0);

  // Top weekday — first index reaching the max (only meaningful with data).
  const topDay = total > 0 ? weekday.indexOf(max) : -1;

  // Top course — most-studied named course (skip the "Senza corso" bucket).
  const perCourse = focusByCourse(sessions, libretto);
  const topCourse = perCourse.find(
    (c) => c.courseName !== NO_COURSE && c.minutes > 0,
  );

  let insight: string;
  if (total === 0) {
    insight = "Avvia qualche sessione per vedere le tue statistiche.";
  } else {
    insight = `Studi di più il ${LONG_DAYS[topDay]}`;
    if (topCourse) {
      insight += ` · il tuo corso più studiato è ${topCourse.courseName}`;
    }
  }

  const plotH = VIEW_H - PAD_TOP - LABEL_H;
  const colW = (VIEW_W - PAD_X * 2) / 7;
  const barW = colW - BAR_GAP;

  return (
    <div className="reveal flex flex-col gap-4">
      <h3 className="font-sans text-[0.95rem] font-semibold tracking-normal text-ink">
        Quando studi di più
      </h3>

      {total === 0 ? (
        <p className="glass muted rounded-lg p-4 text-sm">{insight}</p>
      ) : (
        <>
          <svg
            role="img"
            aria-label={`Minuti di studio per giorno della settimana. Studi di più il ${LONG_DAYS[topDay]} con ${fmtMinutes(max)}.`}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full overflow-visible"
          >
            {/* baseline */}
            <line
              x1={PAD_X}
              x2={VIEW_W - PAD_X}
              y1={PAD_TOP + plotH}
              y2={PAD_TOP + plotH}
              className="stroke-line"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {weekday.map((minutes, i) => {
              const h = max > 0 ? (minutes / max) * plotH : 0;
              const x = PAD_X + i * colW + BAR_GAP / 2;
              const y = PAD_TOP + plotH - h;
              const isTop = i === topDay;
              return (
                <g key={SHORT_DAYS[i]}>
                  {minutes > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      rx={3}
                      ry={3}
                      fill={
                        isTop
                          ? "var(--signal)"
                          : "color-mix(in oklch, var(--signal) 34%, transparent)"
                      }
                    >
                      <title>{`${SHORT_DAYS[i]}: ${fmtMinutes(minutes)}`}</title>
                    </rect>
                  )}
                  <text
                    x={x + barW / 2}
                    y={VIEW_H - 4}
                    textAnchor="middle"
                    className={
                      isTop
                        ? "fill-ink text-[10px] font-semibold"
                        : "fill-ink-faint text-[10px]"
                    }
                  >
                    {SHORT_DAYS[i]}
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="text-sm text-ink-mute">
            <span aria-hidden="true">✨ </span>
            {insight}
          </p>
        </>
      )}
    </div>
  );
}
