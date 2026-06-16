/**
 * Next 16 Proxy (the renamed Middleware). Refreshes the Supabase auth session
 * cookie on every navigation so the access token stays fresh and is readable
 * server-side. No-op when the online layer isn't configured → StudentOS stays
 * offline-first. API routes and static assets are excluded by the matcher.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = getServerSupabase({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      for (const { name, value } of cookiesToSet) {
        request.cookies.set(name, value);
      }
      response = NextResponse.next({ request });
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
    },
  });

  // Online layer off → pass the request straight through.
  if (!supabase) return response;

  // Touch the user: @supabase/ssr refreshes the token and rewrites the cookie
  // (via setAll above) when it's near expiry. Do not run logic between the
  // client creation and this call, per Supabase's SSR guidance.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals, and static assets.
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
