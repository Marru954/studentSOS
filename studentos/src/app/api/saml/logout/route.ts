/**
 * /api/saml/logout — chiusura sessione.
 *  - GET: Single Logout. Se la sessione è reale (ha nameID) e l'IdP è
 *    configurato → costruisce un LogoutRequest firmato e reindirizza all'IdP
 *    (la sessione locale viene chiusa subito); l'IdP risponde su
 *    /api/saml/logout/callback. Altrimenti (dev/mock) logout locale.
 *  - POST: usato dalla SPA per il logout puramente locale (dev), risponde JSON.
 */
import { type NextRequest, NextResponse } from "next/server";
import { idpConfigured, saml } from "@/lib/saml/config";
import { SSO_COOKIE, verifySession } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function localLogout(request: NextRequest) {
  const res = NextResponse.redirect(
    new URL("/libretto?sso=logout", request.url),
    303,
  );
  res.cookies.delete(SSO_COOKIE);
  return res;
}

export async function GET(request: NextRequest) {
  const session = verifySession(request.cookies.get(SSO_COOKIE)?.value);

  if (!session?.nameID || !idpConfigured()) {
    return localLogout(request);
  }

  try {
    const url = await saml.getLogoutUrlAsync(
      {
        nameID: session.nameID,
        nameIDFormat: session.nameIDFormat,
        sessionIndex: session.sessionIndex,
      } as never,
      "",
      {},
    );
    const res = NextResponse.redirect(url, 303);
    res.cookies.delete(SSO_COOKIE); // termina subito la sessione locale
    return res;
  } catch {
    return localLogout(request);
  }
}

export function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SSO_COOKIE);
  return res;
}
