import { Clock } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import { cn } from "@/lib/cn";
import type { ClassEvent, ClassEventKind } from "@/lib/domain/types";
import { fmtTime } from "@/lib/format";

const KIND_LABEL: Partial<Record<ClassEventKind, string>> = {
  lab: "Lab",
  exercise: "Eserc.",
  seminar: "Sem.",
};

/** Today's lessons in chronological order, with live change flags. */
export function TodayTimeline({
  events,
  className,
}: {
  events: ClassEvent[];
  className?: string;
}) {
  // Niente lezioni oggi → non mostrare nulla.
  if (events.length === 0) return null;

  return (
    <Panel title="Oggi" icon={<Clock />} className={className}>
      {
        <ol className="flex flex-col divide-y divide-line">
          {events.map((e) => {
            const cancelled = e.change?.field === "cancelled";
            const place = [e.room, e.building, e.teacher]
              .filter(Boolean)
              .join(" · ");
            return (
              <li
                key={e.id}
                className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="shrink-0 font-mono text-xs text-ink-mute">
                  {fmtTime(e.start)}–{fmtTime(e.end)}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm",
                      cancelled ? "text-ink-mute line-through" : "text-ink",
                    )}
                  >
                    {e.courseName}
                  </p>
                  {place && (
                    <p className="truncate text-xs text-ink-mute">{place}</p>
                  )}
                </div>
                {cancelled && <Badge tone="danger">Annullata</Badge>}
                {e.change?.field === "room" && (
                  <Badge tone="warn">Cambio aula</Badge>
                )}
                {!cancelled && KIND_LABEL[e.kind] && (
                  <Badge tone="neutral">{KIND_LABEL[e.kind]}</Badge>
                )}
              </li>
            );
          })}
        </ol>
      }
    </Panel>
  );
}
