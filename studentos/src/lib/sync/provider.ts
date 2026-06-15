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

/**
 * One verified-live degree programme inside a *multi-programme* preset (a whole
 * ateneo wired end-to-end, e.g. Tor Vergata). Its `sources` are the live
 * timetable/exams/news for THIS programme only, with ids namespaced per
 * programme so caches never collide across courses. `programme` is matched
 * case-insensitively to `settings.programme` (the course the student picked).
 *
 * When a preset carries `livePrograms`, it supersedes the single-programme
 * `programme`/`sources` fields for liveness + sync resolution.
 */
export interface LiveProgram {
  programme: string;
  sources: SyncSource[];
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
  /** Multi-programme atenei: every degree whose EasyAcademy codes were verified
   *  live, each with its own namespaced sources. Present → the resolver keys off
   *  the chosen course (`settings.programme`); absent → the legacy single
   *  `programme`/`sources` path is used. */
  livePrograms?: LiveProgram[];
  /** A few quick institutional links (student portal, ateneo site…) surfaced in
   *  the dashboard "Link utili" panel. Optional: presets without it fall back to
   *  generic national links, so the panel is never empty. */
  links?: { label: string; url: string }[];
  /** Ateneo student portal (e.g. the online secretariat) — surfaced as the
   *  dashboard "Vai al portale" shortcut. Optional: when absent the shortcut
   *  falls back to `links[0]`, then to an internal page, so it's never a dead
   *  link. Set only to a real, verified URL. */
  portalUrl?: string;
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
