/** POST /api/saml/acs — Assertion Consumer Service: valida la SAML Response
 *  firmata, estrae gli attributi e apre la sessione (cookie firmato). */
import { type NextRequest, NextResponse } from "next/server";
import { mapSamlProfile } from "@/lib/saml/attributes";
import { saml } from "@/lib/saml/config";
import { cookieOptions, signSession, SSO_COOKIE } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const fail = () =>
    NextResponse.redirect(new URL("/libretto?sso=error", request.url), 303);
  try {
    const form = await request.formData();
    const SAMLResponse = form.get("SAMLResponse");
    const RelayState = form.get("RelayState");
    if (typeof SAMLResponse !== "string") return fail();

    const container: { SAMLResponse: string; RelayState?: string } = {
      SAMLResponse,
    };
    if (typeof RelayState === "string") container.RelayState = RelayState;
    const { profile } = await saml.validatePostResponseAsync(container);
    if (!profile) return fail();

    const attrs = mapSamlProfile(profile);
    const matricola = attrs.matricola ?? profile.nameID;
    if (!matricola) return fail();

    const res = NextResponse.redirect(
      new URL("/libretto?sso=ok", request.url),
      303,
    );
    res.cookies.set(
      SSO_COOKIE,
      signSession({
        matricola,
        fullName: attrs.fullName,
        email: attrs.email,
        courseOfStudy: attrs.courseOfStudy,
        // conservati per il Single Logout
        nameID: profile.nameID,
        nameIDFormat: profile.nameIDFormat,
        sessionIndex: profile.sessionIndex,
      }),
      cookieOptions(),
    );
    return res;
  } catch {
    return fail();
  }
}
