/** GET /api/saml/login — avvia l'SSO: costruisce l'AuthnRequest e reindirizza
 *  all'IdP di Tor Vergata. */
import { type NextRequest, NextResponse } from "next/server";
import { saml } from "@/lib/saml/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = await saml.getAuthorizeUrlAsync("", undefined, {});
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(new URL("/libretto?sso=error", request.url), 303);
  }
}
