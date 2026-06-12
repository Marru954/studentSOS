/** GET /api/saml/metadata — metadata XML del SP, da registrare presso l'IdP. */
import { NextResponse } from "next/server";
import { saml, spCert } from "@/lib/saml/config";

export const runtime = "nodejs";

export function GET() {
  const xml = saml.generateServiceProviderMetadata(spCert ?? null, spCert ?? null);
  return new NextResponse(xml, {
    headers: { "content-type": "application/xml" },
  });
}
