import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { fmtPlainDayMonth, fmtTime } from "@/lib/format";
import type { SyncMeta } from "@/lib/storage/types";

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
          <span title={`Ultimo aggiornamento: ${fmtPlainDayMonth(lastSuccess.slice(0, 10))} alle ${fmtTime(lastSuccess)}`}>
            agg. {fmtPlainDayMonth(lastSuccess.slice(0, 10))} · {fmtTime(lastSuccess)}
          </span>
        </Badge>
      ) : null}
      <Button size="sm" loading={syncing} disabled={!canSync} onClick={onSync}>
        Sincronizza
      </Button>
    </div>
  );
}
