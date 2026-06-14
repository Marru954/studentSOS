import { CalendarClock } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { fmtNum } from "@/lib/format";

/** Big-number recap bar above the dashboard: next exam, exams this week,
 *  weighted average — three columns split by hairline dividers, matching the
 *  immersive reference. */
export function SummaryBar({
  nextExamDays,
  examsThisWeek,
  average,
  className,
}: {
  /** Days to the nearest upcoming exam, or null if none. */
  nextExamDays: number | null;
  examsThisWeek: number;
  /** Weighted average, or undefined when the libretto has no graded exams. */
  average: number | undefined;
  className?: string;
}) {
  const nextExamValue =
    nextExamDays === null
      ? "—"
      : nextExamDays === 0
        ? "oggi"
        : nextExamDays === 1
          ? "domani"
          : `${nextExamDays} giorni`;

  const cells: { value: string; label: string }[] = [
    { value: nextExamValue, label: "al prossimo appello" },
    {
      value: String(examsThisWeek),
      label: examsThisWeek === 1 ? "appello questa settimana" : "appelli questa settimana",
    },
    {
      value: average === undefined ? "—" : fmtNum(average, 2),
      label: "media ponderata",
    },
  ];

  return (
    <div
      className={cn(
        "glass shadow-soft rounded-lg px-5 py-[1.1rem]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grad-fill inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
          >
            <CalendarClock className="size-[1.125rem]" />
          </span>
          <Cell {...cells[0]} />
        </div>
        {cells.slice(1).map((c) => (
          <Fragment key={c.label}>
            <span aria-hidden="true" className="h-9 w-px bg-[var(--hairline)]" />
            <Cell {...c} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-num font-display text-[1.4rem] font-bold leading-none text-ink">
        {value}
      </div>
      <div className="mt-1 text-[0.76rem] text-ink-faint">{label}</div>
    </div>
  );
}
