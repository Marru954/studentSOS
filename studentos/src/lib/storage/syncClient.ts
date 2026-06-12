/**
 * Client-side sync driver: POST the enabled sources to /api/sync, apply each
 * result to IndexedDB (atomic per source), collect change notices. Pure
 * I/O orchestration — no UI state in here.
 */
import type { DateRange } from "@/lib/domain/types";
import type { SyncSource } from "@/lib/sync/provider";
import { recordSyncFailure, replaceSourceData, type SyncedEntity } from "./repo";
import type { ChangeNotice } from "./types";

interface SyncApiResult {
  sourceId: string;
  capability: SyncSource["capability"];
  ok: boolean;
  data?: SyncedEntity[];
  error?: string;
}

export interface SyncSummary {
  syncedAt: string;
  okCount: number;
  failCount: number;
  failures: { sourceId: string; error: string }[];
  notices: ChangeNotice[];
}

export async function runSync(sources: SyncSource[], range: DateRange): Promise<SyncSummary> {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sources, range }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `sync API ${res.status}`);
  }
  const { syncedAt, results } = (await res.json()) as {
    syncedAt: string;
    results: SyncApiResult[];
  };

  const summary: SyncSummary = {
    syncedAt,
    okCount: 0,
    failCount: 0,
    failures: [],
    notices: [],
  };

  for (const result of results) {
    if (result.ok && result.data) {
      const notices = await replaceSourceData(
        result.capability,
        result.sourceId,
        result.data,
        syncedAt,
      );
      summary.okCount++;
      summary.notices.push(...notices);
    } else {
      const error = result.error ?? "errore sconosciuto";
      await recordSyncFailure(result.capability, result.sourceId, error, syncedAt);
      summary.failCount++;
      summary.failures.push({ sourceId: result.sourceId, error });
    }
  }
  return summary;
}

/** The window the app keeps warm: from last Monday to the sync horizon. */
export function defaultSyncRange(horizonDays: number, today = new Date()): DateRange {
  const from = new Date(today);
  from.setDate(from.getDate() - ((from.getDay() + 6) % 7)); // back to Monday
  const to = new Date(today);
  to.setDate(to.getDate() + horizonDays);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}
