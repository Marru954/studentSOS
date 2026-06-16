/**
 * Delphi libretto proxy. The client sends Delphi credentials over HTTPS to
 * THIS origin only; the route logs into delphi.uniroma2.it server-side,
 * scrapes the libretto, and returns parsed JSON.
 *
 * Credentials are used exactly once, as local consts, then dropped when the
 * handler returns — never logged, never written to disk, never cached.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { DelphiError, fetchDelphiLibretto } from "@/lib/sync/delphi/client";
import { guardPost } from "@/lib/api/guard";

export const runtime = "nodejs";
/** Never cache a credentialed scrape. */
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  login: z.string().min(1).max(32),
  password: z.string().min(1).max(64),
});

export async function POST(request: Request) {
  const blocked = guardPost(request, "sync-delphi", { limit: 8, windowMs: 60_000 });
  if (blocked) return blocked;

  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Richiesta non valida." },
      { status: 400 },
    );
  }

  try {
    const entries = await fetchDelphiLibretto(
      parsed.login,
      parsed.password,
      AbortSignal.timeout(25_000),
    );
    return NextResponse.json(
      { ok: true, entries },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof DelphiError) {
      const status = error.code === "credentials" ? 401 : 502;
      return NextResponse.json(
        { ok: false, error: error.message, code: error.code },
        { status, headers: { "Cache-Control": "no-store" } },
      );
    }
    const aborted = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? "Delphi non ha risposto in tempo. Riprova."
          : "Errore durante la sincronizzazione.",
      },
      { status: 504, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    // belt-and-suspenders: drop references before the GC pass
    parsed = { login: "", password: "" };
  }
}
