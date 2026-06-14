/**
 * The pluggable Sync Engine contract.
 *
 * A SyncProvider is a stateless adapter for ONE source system (EasyAcademy,
 * an iCal feed, Esse3's public endpoints, a department WordPress site…).
 * It only ever touches PUBLIC data — providers have no concept of credentials.
 *
 * A university is wired up by a UniversityPreset: a list of SyncSources, each
 * binding a capability ("timetable" | "exams" | "news") to a provider id plus
 * the provider-specific params (validated by the provider's own zod schema).
 *
 * Providers run server-side only (Next.js route handlers) — browsers can't
 * cross-origin-fetch university sites. The client talks to /api/sync.
 */
import type { z } from "zod";
import type { ClassEvent, DateRange, ExamCall, NewsItem } from "@/lib/domain/types";

export type SyncCapability = "timetable" | "exams" | "news";

export interface CapabilityPayload {
  timetable: ClassEvent[];
  exams: ExamCall[];
  news: NewsItem[];
}

export interface FetchContext {
  /** Date window the caller is interested in (providers may over-fetch). */
  range: DateRange;
  /** Abort on slow sources — every provider must pass this to fetch(). */
  signal: AbortSignal;
}

export interface SyncProvider<TParams = unknown> {
  /** Stable id referenced by university presets, e.g. "easyacademy". */
  id: string;
  /** Human label shown in the source-configuration UI. */
  label: string;
  /** Runtime validation for the params stored in a preset. */
  paramsSchema: z.ZodType<TParams>;
  capabilities: readonly SyncCapability[];

  fetchTimetable?(params: TParams, ctx: FetchContext): Promise<ClassEvent[]>;
  fetchExams?(params: TParams, ctx: FetchContext): Promise<ExamCall[]>;
  fetchNews?(params: TParams, ctx: FetchContext): Promise<NewsItem[]>;
}

/** One configured data source inside a university preset. */
export interface SyncSource {
  /** Unique within the preset; stamped on every entity as `sourceId`. */
  id: string;
  label: string;
  capability: SyncCapability;
  providerId: string;
  /** Provider-specific, validated against the provider's paramsSchema. */
  params: unknown;
}

export interface UniversityPreset {
  id: string;
  name: string;
  shortName: string;
  /** City, for the onboarding picker. */
  city?: string;
  /** Department / degree programme this preset covers, if scoped. */
  programme?: string;
  /** Degree courses offered in the onboarding "corso" step. Falls back to
   *  `programme` when absent. */
  programmes?: string[];
  /** True when live sources (timetable/exams/news) are wired and verified.
   *  Presets without live sources still work in manual / PDF-import mode. */
  liveSources?: boolean;
  sources: SyncSource[];
}

export class SyncError extends Error {
  constructor(
    message: string,
    public readonly sourceId: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "SyncError";
  }
}
