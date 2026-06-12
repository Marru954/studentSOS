/**
 * Sync orchestrator (server-side). Runs a set of configured sources,
 * isolating failures per source: one dead feed never poisons the others.
 */
import type { ClassEvent, DateRange, ExamCall, NewsItem } from "@/lib/domain/types";
import type { SyncSource } from "./provider";
import { getProvider } from "./registry";

const SOURCE_TIMEOUT_MS = 25_000;

export type SourceResult =
  | { sourceId: string; capability: SyncSource["capability"]; ok: true; data: ClassEvent[] | ExamCall[] | NewsItem[] }
  | { sourceId: string; capability: SyncSource["capability"]; ok: false; error: string };

export async function runSources(sources: SyncSource[], range: DateRange): Promise<SourceResult[]> {
  return Promise.all(sources.map((source) => runSource(source, range)));
}

async function runSource(source: SyncSource, range: DateRange): Promise<SourceResult> {
  const fail = (error: string): SourceResult => ({
    sourceId: source.id,
    capability: source.capability,
    ok: false,
    error,
  });

  const provider = getProvider(source.providerId);
  if (!provider) return fail(`provider sconosciuto: ${source.providerId}`);
  if (!provider.capabilities.includes(source.capability))
    return fail(`${provider.id} non supporta "${source.capability}"`);

  const parsed = provider.paramsSchema.safeParse(source.params);
  if (!parsed.success) return fail(`parametri non validi: ${parsed.error.issues[0]?.message}`);

  const method = {
    timetable: provider.fetchTimetable,
    exams: provider.fetchExams,
    news: provider.fetchNews,
  }[source.capability];
  if (!method) return fail(`${provider.id} dichiara "${source.capability}" ma non la implementa`);

  try {
    const data = await method(parsed.data as never, {
      range,
      signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
    });
    // Stamp provenance so the client can diff/replace per source.
    for (const entity of data) entity.sourceId = source.id;
    return { sourceId: source.id, capability: source.capability, ok: true, data };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return fail(message);
  }
}
