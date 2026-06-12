import { CalendarDays } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import type { ExamCall } from "@/lib/domain/types";
import { daysFromToday } from "@/lib/format";

const monthShort = new Intl.DateTimeFormat("it-IT", { month: "short" });

function relDays(days: number): string {
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `tra ${days} gg`;
}

/** Compact agenda of the nearest synced exam calls — fills the right column
 *  next to the countdown. Reads the same date-sorted feed as NextExam. */
export function ExamMiniCalendar({
  exams,
  now,
  limit = 5,
  className,
}: {
  exams: ExamCall[];
  now: Date;
  limit?: number;
  className?: string;
}) {
  const upcoming = exams
    .filter((e) => daysFromToday(e.date, now) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);

  return (
    <Panel title="Appelli in arrivo" icon={<CalendarDays />} className={className}>
      {upcoming.length === 0 ? (
        <p className="text-sm text-ink-mute">Nessun appello in arrivo.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {upcoming.map((e) => {
            const days = daysFromToday(e.date, now);
            const mon = monthShort
              .format(new Date(`${e.date}T00:00:00`))
              .replace(".", "");
            return (
              <li key={e.id} className="flex items-center gap-3 py-2.5">
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-md border border-line bg-night-900">
                  <span className="font-mono text-base font-semibold leading-none text-ink">
                    {e.date.slice(8, 10)}
                  </span>
                  <span className="text-[10px] uppercase text-ink-mute">{mon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {e.courseName}
                  </p>
                  <p className="text-xs text-ink-mute">
                    {relDays(days)}
                    {e.time && ` · ore ${e.time}`}
                    {e.room && ` · ${e.room}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
