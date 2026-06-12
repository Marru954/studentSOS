/**
 * Glassmorphic exam cards: a prominent date block on the left (vibrant for
 * upcoming exams, muted for past ones) and the exam details on the right.
 * Pure — exams (already filtered/sorted) and `today` come from the caller.
 */
import { Clock, Hourglass, MapPin } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import { bookingState } from "@/lib/domain/booking";
import type { ExamCall, ExamKind, IsoDate } from "@/lib/domain/types";
import { daysBetweenIso } from "@/lib/format";

const MONTH_ABBR = [
  "gen", "feb", "mar", "apr", "mag", "giu",
  "lug", "ago", "set", "ott", "nov", "dic",
];

const KIND_LABEL: Record<ExamKind, string> = {
  written: "Scritto",
  oral: "Orale",
  "written+oral": "Scritto+Orale",
  practical: "Pratico",
  unknown: "Esame",
};

function countdownLabel(days: number): string {
  if (days < 0) return "passato";
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `tra ${days} giorni`;
}

/** Left date block: warm red→orange for imminent, indigo for later, grey for past. */
function dateBlockClass(days: number): string {
  if (days < 0) return "bg-night-950 text-ink-faint";
  if (days <= 7)
    return "bg-danger text-white";
  return "bg-signal text-white";
}

function ExamCard({ exam, today }: { exam: ExamCall; today: IsoDate }) {
  const days = daysBetweenIso(today, exam.date);
  const month = MONTH_ABBR[Number(exam.date.slice(5, 7)) - 1];
  const dayNum = exam.date.slice(8, 10);
  const booking = bookingState(exam.booking, today);

  return (
    <article className="glass flex overflow-hidden rounded-md border border-line shadow-soft shadow-soft-hover">
      <div
        className={cn(
          "flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 py-4",
          dateBlockClass(days),
        )}
      >
        <span className="font-mono text-2xl font-semibold leading-none">
          {dayNum}
        </span>
        <span className="text-label font-medium uppercase">{month}</span>
      </div>

      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">{exam.courseName}</h3>
          <span
            className={cn(
              "shrink-0 text-xs font-medium",
              days < 0
                ? "text-ink-mute"
                : days <= 7
                  ? "text-danger"
                  : "text-ink-mute",
            )}
          >
            {countdownLabel(days)}
          </span>
        </div>

        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-mute">
          <div className="flex items-center gap-1">
            <Hourglass aria-hidden="true" className="size-3" />
            <dt className="sr-only">Tipo</dt>
            <dd>{KIND_LABEL[exam.kind]}</dd>
          </div>
          {exam.time && (
            <div className="flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3" />
              <dt className="sr-only">Ora</dt>
              <dd className="font-mono">{exam.time}</dd>
            </div>
          )}
          {exam.room && (
            <div className="flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3" />
              <dt className="sr-only">Aula</dt>
              <dd>{exam.room}</dd>
            </div>
          )}
        </dl>

        {exam.teacher && (
          <p className="mt-1 truncate text-xs text-ink-faint">{exam.teacher}</p>
        )}
        {booking.kind === "closing" && (
          <Badge tone={booking.daysLeft <= 1 ? "danger" : "warn"} className="mt-2">
            iscrizione in scadenza
          </Badge>
        )}
      </div>
    </article>
  );
}

export function ExamCards({
  exams,
  today,
}: {
  exams: ExamCall[];
  today: IsoDate;
}) {
  if (exams.length === 0) {
    return (
      <p className="text-sm text-ink-mute">
        Nessun appello per questo filtro.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} today={today} />
      ))}
    </div>
  );
}
