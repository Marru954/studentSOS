"use client";

/**
 * Thin data layer over the Supabase tables. Every personal record round-trips
 * as `{ user_id, id, data }` where `data` is the full domain object — see
 * supabase/migrations/0001_init.sql. All writes are best-effort: a network
 * failure must never block the local-first UI, so callers fire-and-forget and
 * we just log. RLS makes `user_id` filtering redundant for security, but we set
 * it explicitly so upserts satisfy the `with check` policy.
 */
import type {
  FocusSession,
  LibrettoEntry,
  Note,
  StudyTask,
} from "@/lib/domain/types";
import type { AppSettings } from "@/lib/storage/types";
import { getSupabase } from "./client";

/** Names of the per-user territory tables that hold `{ user_id, id, data }` rows. */
export type RemoteTable =
  | "libretto_entries"
  | "notes"
  | "tasks"
  | "focus_sessions";

/** One round-trip's worth of a whole account: every personal territory plus the profile. */
export interface RemoteSnapshot {
  libretto: LibrettoEntry[];
  notes: Note[];
  tasks: StudyTask[];
  focus: FocusSession[];
  profile: RemoteProfile | null;
}

/** The onboarding/profile facts stored in the `profiles` row (the cloud source of truth for "onboarded"). */
export interface RemoteProfile {
  preset_id: string | null;
  programme: string | null;
  year_of_study: number | null;
  degree_plan: AppSettings["degreePlan"] | null;
}

const TABLES: Record<RemoteTable, true> = {
  libretto_entries: true,
  notes: true,
  tasks: true,
  focus_sessions: true,
};

async function pullTable<T>(
  table: RemoteTable,
  userId: string,
): Promise<T[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from(table)
    .select("data")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => (r as { data: T }).data);
}

/** Pull the whole account: every territory + the profile, in parallel. */
export async function pullAll(userId: string): Promise<RemoteSnapshot> {
  const sb = getSupabase();
  if (!sb) {
    return { libretto: [], notes: [], tasks: [], focus: [], profile: null };
  }
  const [libretto, notes, tasks, focus, profileRes] = await Promise.all([
    pullTable<LibrettoEntry>("libretto_entries", userId),
    pullTable<Note>("notes", userId),
    pullTable<StudyTask>("tasks", userId),
    pullTable<FocusSession>("focus_sessions", userId),
    sb
      .from("profiles")
      .select("preset_id, programme, year_of_study, degree_plan")
      .eq("id", userId)
      .maybeSingle(),
  ]);
  return {
    libretto,
    notes,
    tasks,
    focus,
    profile: (profileRes.data as RemoteProfile | null) ?? null,
  };
}

/** Just the profile row — the cheap query the auth callback uses to decide
 *  first-run vs returning, authoritative across devices. Null when Supabase is
 *  off, the row is missing, or the read fails. */
export async function fetchProfile(
  userId: string,
): Promise<RemoteProfile | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("preset_id, programme, year_of_study, degree_plan")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return (data as RemoteProfile | null) ?? null;
}

/** Upsert one record into a territory table. Best-effort. */
export async function pushItem(
  table: RemoteTable,
  userId: string,
  item: { id: string },
): Promise<void> {
  const sb = getSupabase();
  if (!sb || !(table in TABLES)) return;
  const { error } = await sb
    .from(table)
    .upsert({ user_id: userId, id: item.id, data: item });
  if (error) console.warn(`[sync] push ${table} failed:`, error.message);
}

/** Bulk upsert (initial migration of a local-only account to the cloud). */
export async function pushMany(
  table: RemoteTable,
  userId: string,
  items: { id: string }[],
): Promise<void> {
  const sb = getSupabase();
  if (!sb || !(table in TABLES) || items.length === 0) return;
  const rows = items.map((item) => ({ user_id: userId, id: item.id, data: item }));
  const { error } = await sb.from(table).upsert(rows);
  if (error) console.warn(`[sync] pushMany ${table} failed:`, error.message);
}

/**
 * Delete one record from a territory table. Best-effort.
 * @param table The territory table to delete from.
 * @param userId The owning user's id (also enforced by RLS).
 * @param id The record id to remove.
 */
export async function deleteItem(
  table: RemoteTable,
  userId: string,
  id: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb || !(table in TABLES)) return;
  const { error } = await sb
    .from(table)
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) console.warn(`[sync] delete ${table} failed:`, error.message);
}

/** Write the onboarding/profile facts (preset, course, year, plan). */
export async function pushProfile(
  userId: string,
  email: string | null,
  settings: Pick<
    AppSettings,
    "presetId" | "programme" | "yearOfStudy" | "degreePlan"
  >,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from("profiles").upsert({
    id: userId,
    email,
    preset_id: settings.presetId ?? null,
    programme: settings.programme ?? null,
    year_of_study: settings.yearOfStudy ?? null,
    degree_plan: settings.degreePlan,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("[sync] push profile failed:", error.message);
}
