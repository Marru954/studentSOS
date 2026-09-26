/**
 * Parallel channels ("canali"/turni) of a course, as they appear in the
 * timetable feed: the portal appends a tag to the course name, e.g.
 * "GEOMETRIA ED ALGEBRA (SG1:A-I)" vs "GEOMETRIA ED ALGEBRA (SG2:J-Z)". A
 * student follows ONE channel, so lessons of the others are alternatives.
 * Pure + deterministic — shared by the conflict detector and the /orario filter.
 */

/** The trailing "(…)" channel tag of a course name, upper-cased, or null. */
export function channelOf(courseName: string): string | null {
  const m = /\(([^()]+)\)\s*$/.exec(courseName);
  return m ? m[1].trim().toUpperCase() : null;
}

/** Distinct channel tags found in `events`, sorted, with lesson counts. Empty
 *  when the feed carries no channel tags. */
export function channelsOf(
  events: readonly { courseName: string }[],
): { channel: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of events) {
    const c = channelOf(e.courseName);
    if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts]
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => a.channel.localeCompare(b.channel, "it", { numeric: true }));
}

/** Keep lessons of the chosen channel plus lessons with no channel tag.
 *  `channel === null` keeps everything. */
export function filterByChannel<T extends { courseName: string }>(
  events: readonly T[],
  channel: string | null,
): T[] {
  if (channel === null) return [...events];
  return events.filter((e) => {
    const c = channelOf(e.courseName);
    return c === null || c === channel;
  });
}
