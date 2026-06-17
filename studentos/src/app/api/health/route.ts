/**
 * GET /api/health — liveness + dependency presence for Vercel / uptime monitors
 * / quick debugging. Always 200, no guard (must answer even offline), no network
 * calls: it only reports whether the optional integrations are CONFIGURED, never
 * their values. The app works fully local-only, so "not-configured" is normal,
 * not an error.
 */
import { NextResponse } from "next/server";
import { version } from "../../../../package.json";

export const runtime = "nodejs";

/** Present iff both Supabase env vars exist (either alone is unusable). */
function supabaseStatus(): "configured" | "not-configured" {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "configured"
    : "not-configured";
}

function groqStatus(): "configured" | "not-configured" {
  return process.env.GROQ_API_KEY ? "configured" : "not-configured";
}

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      supabase: supabaseStatus(),
      groq: groqStatus(),
      version,
    },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
