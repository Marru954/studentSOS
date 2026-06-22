/**
 * Week-view layout math. Overlapping lessons of one day are assigned
 * side-by-side lanes; every event in a cluster of (transitively)
 * overlapping lessons shares the cluster's lane count so their widths
 * divide the day column evenly.
 */
import type { ClassEvent } from "./types";

/** One event placed into a horizontal lane within its day column. */
export interface LaidOutEvent {
  event: ClassEvent;
  /** 0-based horizontal slot within the day column. */
  lane: number;
  /** Total lanes in this event's overlap cluster (≥ 1). */
  laneCount: number;
}

/**
 * Assign overlapping lessons of one day to side-by-side lanes, so a cluster of
 * (transitively) overlapping events shares a lane count and divides the column.
 * @param events The day's class events (any order).
 * @returns Each event with its `lane` and the cluster's `laneCount`.
 */
export function layoutDayLanes(events: ClassEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort(
    (a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end),
  );

  const out: LaidOutEvent[] = [];
  let cluster: LaidOutEvent[] = [];
  let laneEnds: string[] = []; // per lane: end of its latest event
  let clusterEnd = "";

  const flush = () => {
    for (const item of cluster) item.laneCount = laneEnds.length;
    out.push(...cluster);
    cluster = [];
    laneEnds = [];
  };

  for (const event of sorted) {
    if (cluster.length > 0 && event.start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((end) => end <= event.start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(event.end);
    } else {
      laneEnds[lane] = event.end;
    }
    cluster.push({ event, lane, laneCount: 0 });
    if (event.end > clusterEnd) clusterEnd = event.end;
  }
  flush();
  return out;
}
