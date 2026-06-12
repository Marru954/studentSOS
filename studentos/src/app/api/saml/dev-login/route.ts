/**
 * GET /api/saml/dev-login — SOLO sviluppo. Apre una sessione con uno studente
 * fittizio (senza IdP reale) così la dashboard/libretto è completa: i 12 esami
 * mock arrivano poi da /api/saml/synced. In produzione restituisce 404.
 */
import { type NextRequest, NextResponse } from "next/server";
import { MOCK_STUDENT } from "@/lib/saml/mock";
import { cookieOptions, signSession, SSO_COOKIE } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  const res = NextResponse.redirect(
    new URL("/libretto?sso=demo", request.url),
    303,
  );
  res.cookies.set(SSO_COOKIE, signSession(MOCK_STUDENT), cookieOptions());
  return res;
}
