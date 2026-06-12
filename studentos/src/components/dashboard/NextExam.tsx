import { CalendarClock } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import { Stat } from "@/components/primitives/Stat";
import type { ExamCall } from "@/lib/domain/types";
import { fmtPlainDate } from "@/lib/format";

/** Countdown to the nearest synced exam call. */
export function NextExam({
  exam,
  days,
  className,
}: {
  exam?: ExamCall;
  /** Calendar days from today to the call; meaningless without `exam`. */
  days: number;
  className?: string;
}) {
  if (!exam) {
    return (
      <Panel title="Prossimo appello" icon={<CalendarClock />} className={className}>
        <p className="text-sm text-ink-mute">
          Nessun appello sincronizzato. Attiva le fonti del tuo corso per
          vedere il conto alla rovescia.
        </p>
      </Panel>
    );
  }

  const where = [
    fmtPlainDate(exam.date),
    exam.time && `ore ${exam.time}`,
    exam.room,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Panel title="Prossimo appello" icon={<CalendarClock />} className={className}>
      <Stat
        label={exam.courseName}
        value={days === 0 ? "oggi" : String(days)}
        unit={days === 1 ? "giorno" : days > 1 ? "giorni" : undefined}
        hint={where}
      />
      {exam.booking?.closesAt && (
        <p className="mt-3 text-xs text-warn">
          Iscrizione entro il {fmtPlainDate(exam.booking.closesAt)}
        </p>
      )}
    </Panel>
  );
}
