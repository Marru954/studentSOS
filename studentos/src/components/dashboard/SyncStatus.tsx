import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { fmtPlainDayMonth, fmtTime } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import type { SyncMeta } from "@/lib/storage/types";

/** "agg. adesso / 5 min fa / alle 09:08 / il 28/06" — l'età del dato a colpo
 *  d'occhio invece del timestamp tecnico. Il dettaglio completo resta nel
 *  testo sr-only (accessibile, non solo nel title hover). */
function relativeLabel(lastIso: string, now: Date | null): string {
  if (now === null) {
    return `${fmtPlainDayMonth(lastIso.slice(0, 10))} · ${fmtTime(lastIso)}`;
  }
  const minutes = Math.floor((now.getTime() - Date.parse(lastIso)) / 60_000);
  if (minutes < 1) return "adesso";
  if (minutes < 60) return `${minutes} min fa`;
  const last = new Date(lastIso);
  const sameDay =
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate();
  if (sameDay) return `alle ${fmtTime(lastIso)}`;
  return `il ${fmtPlainDayMonth(lastIso.slice(0, 10))}`;
}

/** Header instrument cluster: sync health at a glance plus manual trigger. */
export function SyncStatus({
  syncing,
  lastSyncError,
  syncMeta,
  canSync,
  onSync,
}: {
  syncing: boolean;
  lastSyncError?: string;
  syncMeta: SyncMeta[];
  canSync: boolean;
  onSync: () => void;
}) {
  const lastSuccess = syncMeta
    .map((m) => m.lastSuccessAt)
    .filter((t): t is string => Boolean(t))
    .sort()
    .at(-1);
  const failing = syncMeta.filter((m) => !m.ok).length;
  const now = useNowMinute();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {syncing ? (
        <Badge tone="signal" dot>
          Sincronizzazione…
        </Badge>
      ) : lastSyncError ? (
        <Badge tone="danger">Sync non riuscita</Badge>
      ) : failing > 0 ? (
        <Badge tone="warn">
          {failing} {failing === 1 ? "fonte in errore" : "fonti in errore"}
        </Badge>
      ) : lastSuccess ? (
        <Badge tone="neutral">
          <span aria-hidden="true">agg. {relativeLabel(lastSuccess, now)}</span>
          <span className="sr-only">
            Ultimo aggiornamento: {fmtPlainDayMonth(lastSuccess.slice(0, 10))}{" "}
            alle {fmtTime(lastSuccess)}
          </span>
        </Badge>
      ) : null}
      <Button size="sm" loading={syncing} disabled={!canSync} onClick={onSync}>
        Sincronizza
      </Button>
    </div>
  );
}
