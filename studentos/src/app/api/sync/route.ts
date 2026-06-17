/**
 * POST /api/sync — the only bridge between the browser and university sites
 * (CORS forbids fetching them client-side). Receives the user's enabled
 * sources + date range, returns per-source results. Stateless: persistence
 * and change-diffing live in the client's IndexedDB layer.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { runSources } from "@/lib/sync/engine";
import { validateSources } from "@/lib/sync/validateUrl";
import { guardPost } from "@/lib/api/guard";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data ISO YYYY-MM-DD richiesta");

const requestSchema = z.object({
  range: z.object({ from: isoDate, to: isoDate }),
  sources: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string(),
        capability: z.enum(["timetable", "exams", "news"]),
        providerId: z.string().min(1),
        params: z.unknown(),
      }),
    )
    .min(1)
    .max(12),
});

export async function POST(request: Request) {
  const { response: blocked } = guardPost(request, "sync", {
    limit: 20,
    windowMs: 60_000,
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "richiesta non valida" },
      { status: 400 },
    );
  }

  // SSRF guard: every source URL must hit an allowlisted university host whose
  // resolved IP is public. A throw maps to a single generic 400 — we never echo
  // which internal address was probed. (The easyacademy adapter can't be edited,
  // so this upfront check is its sole SSRF defence; the editable adapters also
  // pass redirect:"manual" so a 3xx can't bounce onto an internal host.)
  try {
    await validateSources(parsed.data.sources);
  } catch {
    return NextResponse.json({ error: "sorgente non consentita" }, { status: 400 });
  }

  const results = await runSources(parsed.data.sources, parsed.data.range);
  return NextResponse.json({ syncedAt: new Date().toISOString(), results });
}
