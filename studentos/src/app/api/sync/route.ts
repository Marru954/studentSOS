/**
 * POST /api/sync — the only bridge between the browser and university sites
 * (CORS forbids fetching them client-side). Receives the user's enabled
 * sources + date range, returns per-source results. Stateless: persistence
 * and change-diffing live in the client's IndexedDB layer.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { runSources } from "@/lib/sync/engine";

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

  const results = await runSources(parsed.data.sources, parsed.data.range);
  return NextResponse.json({ syncedAt: new Date().toISOString(), results });
}
