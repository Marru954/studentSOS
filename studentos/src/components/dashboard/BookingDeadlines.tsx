"use client";

/**
 * "Scadenze prenotazione": exam calls whose enrolment window closes within the
 * next 7 days, soonest first. Booking windows come from Esse3/Delphi sources
 * (EasyAcademy doesn't expose them), so this stays empty for timetable-only
 * atenei and shows a friendly reassurance rather than a blank panel.
 */
import { CalendarCheck } from "lucide-react";
import { useMemo } from "react";
import { Panel } from "@/components/primitives/Panel";
import { examsClosingWithin } from "@/lib/domain/booking";
import { daysFromToday, fmtPlainDayMonth, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useSynced } from "@/lib/state/synced";

const WINDOW_HOURS = 168; // 7 days

export function BookingDeadlines({ className }: { className?: string }) {
  const examCalls = useSynced((s) => s.examCalls);
  const now = useNowMinute();

  // already returned ascending by closesAt
  const closing = useMemo(() => {
    if (now === null) return [];
    return examsClosingWithin(examCalls, localToday(now), WINDOW_HOURS);
  }, [examCalls, now]);

  return (
    <Panel
      title="Scadenze prenotazione"
      icon={<CalendarCheck />}
      className={className}
    >
      {closing.length === 0 ? (
        <p className="text-sm text-ink-mute">Nessuna scadenza imminente ✓</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {closing.map((exam) => {
            const closesAt = exam.booking!.closesAt!;
            const left = now ? daysFromToday(closesAt, now) : null;
            const urgent = left !== null && left <= 2;
            return (
              <li
                key={exam.id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {exam.courseName}
                </span>
                <span
                  className={
                    urgent ? "shrink-0 text-warn" : "shrink-0 text-ink-mute"
                  }
                >
                  entro {fmtPlainDayMonth(closesAt)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
