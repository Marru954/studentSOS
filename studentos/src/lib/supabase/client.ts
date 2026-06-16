"use client";

/**
 * Browser Supabase client — a lazy singleton.
 *
 * The whole online layer is OPTIONAL: when the two NEXT_PUBLIC_SUPABASE_* env
 * vars are absent, `getSupabase()` returns null and StudentOS keeps running as
 * the offline-first app it has always been (IndexedDB only, no account). Every
 * caller must handle the null case. The anon key is public by design — row
 * security is enforced server-side by Supabase RLS, never by hiding the key.
 *
 * Sessions live in COOKIES (via @supabase/ssr), not localStorage: the token is
 * Secure (prod) + SameSite=Lax and readable by the matching server client in
 * `proxy.ts`, which refreshes it on each request. The cookie is intentionally
 * not HttpOnly — the browser client must read it because all data access is
 * client-side under RLS, which stays the real authorization boundary.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

const isProd = process.env.NODE_ENV === "production";

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
  cached = createBrowserClient(url, anon, {
    cookieOptions: {
      // SameSite=Lax survives the email-link redirect GET; Secure only in prod
      // (a Secure cookie is dropped over http://localhost during dev).
      sameSite: "lax",
      secure: isProd,
      path: "/",
    },
  });
  return cached;
}
