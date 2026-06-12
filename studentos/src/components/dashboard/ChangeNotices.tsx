import { BellRing } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Panel } from "@/components/primitives/Panel";
import type { ChangeNotice } from "@/lib/storage/types";

const KIND: Record<ChangeNotice["kind"], { label: string; tone: BadgeTone }> = {
  "room-change": { label: "Aula", tone: "warn" },
  "time-change": { label: "Orario", tone: "warn" },
  cancelled: { label: "Annullata", tone: "danger" },
  "new-exam": { label: "Appello", tone: "signal" },
};

/** What changed since the last sync — the diff engine's voice. */
export function ChangeNotices({
  notices,
  onDismiss,
  className,
}: {
  notices: ChangeNotice[];
  onDismiss: (ids: string[]) => void;
  className?: string;
}) {
  const unseen = notices.filter((n) => !n.seen);

  return (
    <Panel
      title="Modifiche rilevate"
      icon={<BellRing />}
      className={className}
      actions={
        unseen.length > 0 && (
          <Button size="sm" onClick={() => onDismiss(unseen.map((n) => n.id))}>
            Segna lette
          </Button>
        )
      }
    >
      {unseen.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessuna modifica dall&rsquo;ultima sincronizzazione.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {unseen.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <Badge tone={KIND[n.kind].tone} className="mt-px shrink-0">
                {KIND[n.kind].label}
              </Badge>
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{n.courseName}</p>
                <p className="font-mono text-xs text-ink-mute">{n.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
