"use client";

/** Non-invasive banner shown on /orario and /appelli when one or more sync
 *  sources of the given capability failed their last attempt. Derived purely
 *  from `syncMeta` (ok:false) — a successful sync flips the row back to
 *  ok:true, so the banner disappears on its own at the next good sync. */
import { TriangleAlert } from "lucide-react";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import type { SyncCapability } from "@/lib/sync/provider";

/** How many failing source labels to name before collapsing into "e altre N". */
const MAX_LABELS = 3;

export function SyncFailureBanner({ capability }: { capability: SyncCapability }) {
  const syncMeta = useSynced((s) => s.syncMeta);
  const settingsHydrated = useSettings((s) => s.hydrated);
  const enabledSources = useSettings((s) => s.enabledSources);

  if (!settingsHydrated) return null;

  // Failing sources of this capability, by their human label (deduped).
  const failingLabels = [
    ...new Set(
      enabledSources()
        .filter((source) => source.capability === capability)
        .filter((source) => {
          const meta = syncMeta.find((m) => m.sourceId === source.id);
          return meta && !meta.ok;
        })
        .map((source) => source.label),
    ),
  ];

  if (failingLabels.length === 0) return null;

  const shown = failingLabels.slice(0, MAX_LABELS);
  const extra = failingLabels.length - shown.length;
  const list = extra > 0 ? `${shown.join(", ")} e altre ${extra}` : shown.join(", ");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Avviso: alcune fonti di sincronizzazione non sono raggiungibili"
      className="glass reveal flex items-start gap-3 rounded-lg border border-warn/30 bg-warn-dim p-4"
    >
      <TriangleAlert aria-hidden="true" className="size-5 shrink-0 text-warn" />
      <p className="text-sm text-ink">
        Alcune fonti non raggiungibili ({list}). I dati mostrati potrebbero
        essere incompleti; riprova a sincronizzare più tardi.
      </p>
    </div>
  );
}
