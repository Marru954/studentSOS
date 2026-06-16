/**
 * Server-side Supabase client (cookie sessions, @supabase/ssr).
 *
 * Used by `proxy.ts` to read + refresh the session cookie on each request, and
 * available to any future Route Handler / Server Component that needs the
 * signed-in user. Returns null when the online layer isn't configured, so
 * server code degrades to the offline-first build. Never import from a
 * "use client" module — this is server-only.
 */
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** The cookie bridge the caller supplies (Next request/response cookies). */
export interface CookieBridge {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options?: object }[]): void;
}

const isProd = process.env.NODE_ENV === "production";

/** A request-scoped server client, or null when Supabase isn't configured. */
export function getServerSupabase(cookies: CookieBridge): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createServerClient(url, anon, {
    cookieOptions: { sameSite: "lax", secure: isProd, path: "/" },
    cookies,
  });
}
