"use client";

/** Data provenance panel: one row per enabled sync source with its health.
 *  The pure table is exported separately for markup audits. */
import { Database } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import { fmtTime } from "@/lib/format";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import type { SyncCapability, SyncSource } from "@/lib/sync/provider";
import type { SyncMeta } from "@/lib/storage/types";

const CAPABILITY_LABEL: Record<SyncCapability, string> = {
  timetable: "Orario",
  exams: "Appelli",
  news: "Avvisi",
};

export interface SourceRow {
  source: SyncSource;
  meta?: SyncMeta;
}

export function SourceStatusTable({ rows }: { rows: SourceRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-line text-left">
          {["Fonte", "Tipo", "Elementi", "Aggiornata", "Stato"].map((h) => (
            <th
              key={h}
              scope="col"
              className="px-4 py-2 text-label font-medium text-ink-mute"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ source, meta }) => (
          <tr key={source.id} className="border-b border-line last:border-b-0">
            <td className="px-4 py-2">{source.label}</td>
            <td className="px-4 py-2 text-ink-mute">
              {CAPABILITY_LABEL[source.capability]}
            </td>
            <td className="px-4 py-2 font-mono">{meta?.itemCount ?? "—"}</td>
            <td className="px-4 py-2 font-mono text-ink-mute">
              {meta?.lastSuccessAt ? fmtTime(meta.lastSuccessAt) : "mai"}
            </td>
            <td className="px-4 py-2">
              {!meta ? (
                <Badge tone="neutral">in attesa</Badge>
              ) : meta.ok ? (
                <Badge tone="ok">OK</Badge>
              ) : (
                <>
                  <Badge tone="danger">errore</Badge>
                  <span className="sr-only">: {meta.error}</span>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SourceStatus({ className }: { className?: string }) {
  const syncMeta = useSynced((s) => s.syncMeta);
  const enabledSources = useSettings((s) => s.enabledSources);
  const hydrated = useSettings((s) => s.hydrated);

  if (!hydrated) return null;
  const sources = enabledSources();
  if (sources.length === 0) return null;

  const rows: SourceRow[] = sources.map((source) => ({
    source,
    meta: syncMeta.find((m) => m.sourceId === source.id),
  }));

  return (
    <Panel title="Fonti dati" icon={<Database />} flush className={className}>
      <div className="overflow-x-auto">
        <SourceStatusTable rows={rows} />
      </div>
    </Panel>
  );
}
