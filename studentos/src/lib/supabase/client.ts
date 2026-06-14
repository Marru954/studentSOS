"use client";

/**
 * Browser Supabase client — a lazy singleton.
 *
 * The whole online layer is OPTIONAL: when the two NEXT_PUBLIC_SUPABASE_* env
 * vars are absent, `getSupabase()` returns null and StudentOS keeps running as
 * the offline-first app it has always been (IndexedDB only, no account). Every
 * caller must handle the null case. The anon key is public by design — row
 * security is enforced server-side by Supabase RLS, never by hiding the key.
 */
import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** The shared browser client, or null when Supabase is not configured. */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    cached = null;
    return cached;
  }
  cached = createClient(url, anon, {
    auth: {
      // magic-link tokens land in the URL; finalise the session client-side.
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
    },
  });
  return cached;
}
