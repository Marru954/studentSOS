/** Study-constancy heatmap (GitHub-style): last ~6 months, one cell per day,
 *  tinted by minutes studied. Pure props → no client boundary needed. */
import { dailyMinutes } from "@/lib/domain/focus";
import type { FocusSession, IsoDate } from "@/lib/domain/types";
import { fmtMinutes } from "@/lib/format";

const WEEKS = 26; // ~6 months of columns
const DAYS = 7; // Monday-first rows
const CELL = 13; // cell edge in viewBox units
const GAP = 3; // space between cells
const STEP = CELL + GAP;
const PAD_TOP = 16; // room for month labels
const PAD_LEFT = 26; // room for weekday labels

const itDayMonth = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
});
const itMonth = new Intl.DateTimeFormat("it-IT", { month: "short" });

/** Five intensity buckets; index 0 = no study. */
function levelOf(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 90) return 2;
  if (minutes < 180) return 3;
  return 4;
}

/** Fill per level: empty reads as a faint surface tile, study scales the signal. */
const LEVEL_FILL: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "color-mix(in oklch, var(--ink) 8%, transparent)",
  1: "color-mix(in oklch, var(--signal) 22%, transparent)",
  2: "color-mix(in oklch, var(--signal) 42%, transparent)",
  3: "color-mix(in oklch, var(--signal) 66%, transparent)",
  4: "var(--signal)",
};

function isoOf(date: Date): IsoDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface Cell {
  iso: IsoDate;
  date: Date;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function FocusHeatmap({
  sessions,
  now,
}: {
  sessions: FocusSession[];
  now: Date;
}) {
  const byDay = dailyMinutes(sessions);

  // Anchor: the Monday of the current week, so the last column ends on today.
  const end = new Date(now);
  end.setHours(0, 0, 0, 0);
  const lastMonday = new Date(end);
  lastMonday.setDate(lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7));
  const start = new Date(lastMonday);
  start.setDate(start.getDate() - (WEEKS - 1) * 7);

  const columns: Cell[][] = [];
  let totalMinutes = 0;
  let activeDays = 0;
  for (let w = 0; w < WEEKS; w++) {
    const col: Cell[] = [];
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + w * 7 + d);
      const future = date > end;
      const iso = isoOf(date);
      const minutes = future ? 0 : (byDay.get(iso) ?? 0);
      if (minutes > 0) {
        totalMinutes += minutes;
        activeDays++;
      }
      col.push({ iso, date, minutes, level: future ? 0 : levelOf(minutes) });
    }
    columns.push(col);
  }

  const width = PAD_LEFT + WEEKS * STEP;
  const height = PAD_TOP + DAYS * STEP;

  // Month labels: render an abbreviation at a column when its first row crosses
  // into a new month, so the axis stays readable without one label per week.
  const monthMarks: { x: number; label: string }[] = [];
  let prevMonth = -1;
  columns.forEach((col, w) => {
    const first = col[0].date;
    if (first.getMonth() !== prevMonth) {
      prevMonth = first.getMonth();
      monthMarks.push({
        x: PAD_LEFT + w * STEP,
        label: itMonth.format(first).replace(".", ""),
      });
    }
  });

  // Weekday guides (Lun/Mer/Ven) — odd rows, like GitHub.
  const weekdayLabels = ["Lun", "", "Mer", "", "Ven", "", ""];

  const summary =
    activeDays === 0
      ? "Nessuna sessione di studio negli ultimi sei mesi."
      : `${fmtMinutes(totalMinutes)} di studio in ${activeDays} ${activeDays === 1 ? "giorno" : "giorni"} negli ultimi sei mesi.`;

  // Vuoto = compatto: niente griglia 26 settimane full-width finché non c'è
  // studio — solo una riga attenuata.
  if (activeDays === 0) {
    return (
      <p className="text-sm text-ink-mute">
        Nessuna sessione di studio negli ultimi sei mesi. Avvia un timer per
        iniziare a riempire la mappa.
      </p>
    );
  }

  return (
    <div className="reveal flex flex-col gap-3">
      <svg
        role="img"
        aria-label={`Mappa della costanza di studio. ${summary}`}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        preserveAspectRatio="xMinYMid meet"
        className="block h-auto w-full overflow-visible"
      >
        {monthMarks.map((m) => (
          <text
            key={`${m.label}-${m.x}`}
            x={m.x}
            y={10}
            className="fill-ink-faint text-[9px]"
          >
            {m.label}
          </text>
        ))}
        {weekdayLabels.map((label, d) =>
          label ? (
            <text
              key={label}
              x={PAD_LEFT - 6}
              y={PAD_TOP + d * STEP + CELL / 2}
              dy="0.32em"
              textAnchor="end"
              className="fill-ink-faint text-[9px]"
            >
              {label}
            </text>
          ) : null,
        )}
        {columns.map((col, w) =>
          col.map((cell, d) => {
            const future = cell.date > end;
            if (future) return null;
            const label =
              cell.minutes > 0
                ? `${fmtMinutes(cell.minutes)} studiati il ${itDayMonth.format(cell.date)}`
                : `Nessuno studio il ${itDayMonth.format(cell.date)}`;
            return (
              <rect
                key={cell.iso}
                x={PAD_LEFT + w * STEP}
                y={PAD_TOP + d * STEP}
                width={CELL}
                height={CELL}
                rx={3}
                ry={3}
                fill={LEVEL_FILL[cell.level]}
                className="stroke-line"
                strokeWidth={cell.level === 0 ? 1 : 0}
                vectorEffect="non-scaling-stroke"
              >
                <title>{label}</title>
              </rect>
            );
          }),
        )}
      </svg>

      <div className="flex items-center justify-end gap-1.5 text-[0.72rem] text-ink-faint">
        <span>meno</span>
        <div className="flex items-center gap-1" aria-hidden="true">
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <span
              key={lvl}
              className="inline-block size-3 rounded-[3px]"
              style={{ background: LEVEL_FILL[lvl] }}
            />
          ))}
        </div>
        <span>più</span>
      </div>
      <p className="sr-only">{summary}</p>
    </div>
  );
}
