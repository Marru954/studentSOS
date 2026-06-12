/** GET /api/saml/me — profilo dello studente autenticato (dal cookie firmato). */
import { type NextRequest, NextResponse } from "next/server";
import { SSO_COOKIE, verifySession } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const session = verifySession(request.cookies.get(SSO_COOKIE)?.value);
  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  // non esponiamo nameID/sessionIndex al client: basta un flag che indica se
  // la disconnessione deve passare dal Single Logout SAML (sessione reale).
  return NextResponse.json(
    {
      authenticated: true,
      student: {
        matricola: session.matricola,
        fullName: session.fullName,
        email: session.email,
        courseOfStudy: session.courseOfStudy,
      },
      slo: Boolean(session.nameID),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
