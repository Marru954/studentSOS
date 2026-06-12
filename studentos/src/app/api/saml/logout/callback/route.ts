/**
 * /api/saml/logout/callback — risposta di Single Logout dall'IdP.
 * Validiamo ESPLICITAMENTE la firma del messaggio (LogoutResponse o, per il
 * logout iniziato dall'IdP, LogoutRequest) prima di considerarlo valido. La
 * sessione locale è già stata chiusa all'avvio dell'SLO; qui confermiamo e
 * riportiamo l'utente al libretto.
 */
import { type NextRequest, NextResponse } from "next/server";
import { saml } from "@/lib/saml/config";
import { SSO_COOKIE } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function done(request: NextRequest, ok: boolean) {
  const res = NextResponse.redirect(
    new URL(ok ? "/libretto?sso=logout" : "/libretto?sso=slo-error", request.url),
    303,
  );
  res.cookies.delete(SSO_COOKIE);
  return res;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (!params.get("SAMLResponse") && !params.get("SAMLRequest")) {
    return done(request, true);
  }
  const originalQuery = request.nextUrl.search.replace(/^\?/, "");
  const container = Object.fromEntries(params.entries()) as unknown as Parameters<
    typeof saml.validateRedirectAsync
  >[0];
  try {
    await saml.validateRedirectAsync(container, originalQuery);
    return done(request, true);
  } catch (err) {
    console.warn("[saml] LogoutResponse non valido:", (err as Error).message);
    return done(request, false);
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const SAMLResponse = form.get("SAMLResponse");
    const SAMLRequest = form.get("SAMLRequest");
    if (typeof SAMLResponse === "string") {
      await saml.validatePostResponseAsync({ SAMLResponse });
    } else if (typeof SAMLRequest === "string") {
      await saml.validatePostRequestAsync({ SAMLRequest });
    } else {
      return done(request, true);
    }
    return done(request, true);
  } catch (err) {
    console.warn("[saml] messaggio di logout non valido:", (err as Error).message);
    return done(request, false);
  }
}
