/**
 * Immersive exam cards: a responsive glass-card grid. Each card shows the
 * course title + a status chip, a big gradient day number with the month
 * beside it, a faint clock/room row, a thin urgency progress bar, and a
 * "tra N giorni" line. Pure — exams (already filtered/sorted) and `today`
 * come from the caller.
 */
import { Clock, Hourglass, MapPin } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
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

/** Status chip tone + label, by how soon the exam is. */
function statusChip(days: number): { cls: string; label: string } {
  if (days < 0) return { cls: "chip", label: "passato" };
  if (days <= 2) return { cls: "chip chip-danger", label: `scade tra ${days}g` };
  if (days <= 7) return { cls: "chip chip-danger", label: `tra ${days}g` };
  if (days <= 21) return { cls: "chip chip-signal", label: "prenotabile" };
  return { cls: "chip", label: "appello" };
}

function ExamCard({
  exam,
  today,
  index,
  onDelete,
}: {
  exam: ExamCall;
  today: IsoDate;
  index: number;
  onDelete?: (id: string) => void;
}) {
  const days = daysBetweenIso(today, exam.date);
  const month = MONTH_ABBR[Number(exam.date.slice(5, 7)) - 1];
  const dayNum = exam.date.slice(8, 10);
  const booking = bookingState(exam.booking, today);
  const chip = statusChip(days);
  const urgent = days >= 0 && days <= 7;
  const barWidth = days < 0 ? 100 : Math.max(8, 100 - days * 2.5);
  // Manually-added appelli carry a `manual-…` sentinel sourceId; only these
  // are deletable. Synced exams expose no delete control.
  const deletable = Boolean(onDelete) && exam.sourceId.startsWith("manual");

  return (
    <article
      className={cn(
        "glass lift flex flex-col gap-4 rounded-lg p-[1.4rem]",
        urgent && "urgent-card",
      )}
      style={{ ["--d" as string]: `${index * 0.06}s` }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <h3 className="text-[1.05rem] font-semibold tracking-normal text-ink [font-family:var(--font-sans)]">
          {exam.courseName}
        </h3>
        <span className={`${chip.cls} shrink-0`}>{chip.label}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="grad-text font-num text-[2.4rem] font-extrabold leading-none [font-family:var(--font-display)]">
          {dayNum}
        </span>
        <span className="muted font-semibold">{month}</span>
      </div>

      <dl className="faint font-num flex flex-wrap gap-x-4 gap-y-1 text-[0.85rem]">
        <div className="flex items-center gap-1">
          <Hourglass aria-hidden="true" className="size-3.5" />
          <dt className="sr-only">Tipo</dt>
          <dd>{KIND_LABEL[exam.kind]}</dd>
        </div>
        {exam.time && (
          <div className="flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            <dt className="sr-only">Ora</dt>
            <dd>{exam.time}</dd>
          </div>
        )}
        {exam.room && (
          <div className="flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3.5" />
            <dt className="sr-only">Aula</dt>
            <dd>{exam.room}</dd>
          </div>
        )}
      </dl>

      {exam.teacher && (
        <p className="muted -mt-2 truncate text-xs">{exam.teacher}</p>
      )}

      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--hairline)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${barWidth}%`,
            background: urgent
              ? "var(--danger)"
              : "linear-gradient(90deg, var(--signal), var(--signal-2))",
          }}
        />
      </div>

      <div className="faint text-[0.78rem]">{countdownLabel(days)}</div>

      {booking.kind === "closing" && (
        <Badge tone={booking.daysLeft <= 1 ? "danger" : "warn"} className="self-start">
          iscrizione in scadenza
        </Badge>
      )}

      {deletable && (
        <div className="mt-auto flex justify-end pt-1">
          <ConfirmButton
            onConfirm={() => onDelete!(exam.id)}
            armedLabel="Elimina davvero?"
          >
            Elimina
          </ConfirmButton>
        </div>
      )}
    </article>
  );
}

export function ExamCards({
  exams,
  today,
  onDelete,
}: {
  exams: ExamCall[];
  today: IsoDate;
  /** When provided, manual appelli (sourceId starting with "manual") show a
   *  confirm-to-delete control; synced exams never do. */
  onDelete?: (id: string) => void;
}) {
  if (exams.length === 0) {
    return (
      <p className="muted text-sm">Nessun appello per questo filtro.</p>
    );
  }
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
    >
      {exams.map((exam, i) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          today={today}
          index={i}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
