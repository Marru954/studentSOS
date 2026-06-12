/**
 * GET /api/saml/synced — carriera "sincronizzata da Delphi" per lo studente
 * autenticato. In sviluppo restituisce i 12 esami mock; in produzione qui si
 * interrogherebbe il sistema di segreteria (Esse3/Delphi) con la matricola
 * presa dalla sessione SSO.
 */
import { type NextRequest, NextResponse } from "next/server";
import { Esse3Error, esse3Enabled, fetchEsse3Libretto } from "@/lib/esse3/client";
import { mockLibretto } from "@/lib/saml/mock";
import { SSO_COOKIE, verifySession } from "@/lib/saml/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = verifySession(request.cookies.get(SSO_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "non_autenticato" }, { status: 401 });
  }

  // Carriera reale via Esse3 se l'account integrazione è configurato,
  // altrimenti i 12 esami mock (sviluppo / senza segreteria).
  if (esse3Enabled()) {
    try {
      const exams = await fetchEsse3Libretto(
        session.matricola,
        AbortSignal.timeout(20_000),
      );
      return NextResponse.json(
        { exams },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      const message =
        error instanceof Esse3Error
          ? error.message
          : "Errore durante la sincronizzazione da Esse3.";
      return NextResponse.json(
        { error: "esse3", message },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  return NextResponse.json(
    { exams: mockLibretto() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
