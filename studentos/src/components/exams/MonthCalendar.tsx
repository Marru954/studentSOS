/**
 * Month calendar grid with colored exam chips per day. Pure: the visible
 * month, the exams, and `today` come from the caller; navigation is delegated
 * via onPrev/onNext. Chip colour encodes urgency (past / imminent / future)
 * and every day's exams are also exposed to screen readers.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import { buildMonthGrid, examsByDate } from "@/lib/domain/calendar";
import type { ExamCall } from "@/lib/domain/types";
import { daysBetweenIso } from "@/lib/format";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const monthFmt = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
});

/** Tailwind classes for a chip, by how soon the exam is. */
function chipTone(days: number): string {
  if (days < 0) return "bg-night-700 text-ink-mute";
  if (days <= 7) return "bg-danger-dim text-danger";
  return "bg-signal-dim text-signal";
}

export function MonthCalendar({
  year,
  month0,
  exams,
  today,
  onPrev,
  onNext,
}: {
  year: number;
  month0: number;
  exams: ExamCall[];
  today: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const weeks = buildMonthGrid(year, month0);
  const byDate = examsByDate(exams);
  const heading = monthFmt.format(new Date(Date.UTC(year, month0, 1)));

  return (
    <section aria-label={`Calendario esami — ${heading}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold capitalize">{heading}</h2>
        <div className="flex gap-1.5">
          <Button size="sm" aria-label="Mese precedente" onClick={onPrev}>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button size="sm" aria-label="Mese successivo" onClick={onNext}>
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            aria-hidden="true"
            className="pb-1 text-center text-label font-medium text-ink-mute"
          >
            {d}
          </div>
        ))}

        {weeks.flat().map((cell) => {
          const dayExams = byDate.get(cell.date) ?? [];
          const isToday = cell.date === today;
          return (
            <div
              key={cell.date}
              className={cn(
                "min-h-16 rounded-sm border p-1.5",
                cell.inMonth
                  ? "border-line bg-night-800"
                  : "border-transparent bg-transparent",
                isToday && "ring-1 ring-signal",
              )}
            >
              <div
                className={cn(
                  "text-right font-mono text-xs",
                  isToday
                    ? "font-semibold text-signal"
                    : cell.inMonth
                      ? "text-ink-mute"
                      : "text-ink-faint",
                )}
              >
                {cell.day}
                {isToday && <span className="sr-only"> (oggi)</span>}
              </div>
              {dayExams.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1">
                  {dayExams.slice(0, 2).map((exam) => (
                    <li
                      key={exam.id}
                      title={exam.courseName}
                      className={cn(
                        "truncate rounded-xs px-1 py-0.5 text-[0.65rem] font-medium leading-tight",
                        chipTone(daysBetweenIso(today, exam.date)),
                      )}
                    >
                      {exam.courseName}
                    </li>
                  ))}
                  {dayExams.length > 2 && (
                    <li className="px-1 text-[0.65rem] text-ink-mute">
                      +{dayExams.length - 2} altri
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
