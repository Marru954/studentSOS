import { Sparkles } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { fmtNum } from "@/lib/format";

/** One-line recap above the dashboard: next exam, exams this week, average. */
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
  const parts: React.ReactNode[] = [];

  parts.push(
    nextExamDays === null ? (
      <>Nessun appello in programma</>
    ) : (
      <>
        Prossimo appello{" "}
        <strong className="font-semibold text-ink">
          {nextExamDays === 0
            ? "oggi"
            : nextExamDays === 1
              ? "domani"
              : `tra ${nextExamDays} giorni`}
        </strong>
      </>
    ),
  );

  if (examsThisWeek > 0) {
    parts.push(
      <>
        <strong className="font-semibold text-ink">{examsThisWeek}</strong>{" "}
        {examsThisWeek === 1 ? "appello" : "appelli"} questa settimana
      </>,
    );
  }

  if (average !== undefined) {
    parts.push(
      <>
        media <strong className="font-semibold text-ink">{fmtNum(average, 2)}</strong>
      </>,
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-line bg-night-950 px-4 py-2.5 text-sm text-ink-mute",
        className,
      )}
    >
      <Sparkles aria-hidden="true" className="size-4 shrink-0 text-signal" />
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden="true" className="text-line-strong">·</span>}
          <span>{p}</span>
        </Fragment>
      ))}
    </div>
  );
}
