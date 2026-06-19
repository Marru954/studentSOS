/**
 * POST /api/insegnamenti/sync — server-side proxy for manifesto discovery.
 *
 * Browsers can't fetch other universities' sites (CORS), so this route discovers
 * the corso's manifesto URL and returns the raw HTML. It deliberately does NOT
 * parse (no `DOMParser` in Node) nor persist (no IndexedDB server-side): the
 * client (`src/lib/insegnamenti/sync.ts`) parses with `DOMParser` and writes to
 * IndexedDB, then assembles the final `SyncResult`. The body returned here is a
 * `ManifestoApiResponse` (`ok` carries `html`, not a count).
 *
 * Same security posture as the other proxies: same-origin + per-IP rate limit
 * (`guardPost`), zod-validated body, `nosniff`, never cached. The SSRF guard
 * lives in `discoverManifesto` (curated host allowlist + private-IP rejection +
 * `redirect:"manual"`) — the only network egress for this feature.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { guardPost } from "@/lib/api/guard";
import { discoverManifesto, type ManifestoApiResponse } from "@/lib/insegnamenti/discovery";

// Dipende da node:dns / node:net nella SSRF guard → forziamo il runtime Node.
export const runtime = "nodejs";
/** Mai cache di una scoperta manifesto. */
export const dynamic = "force-dynamic";

const NOSNIFF = { "X-Content-Type-Options": "nosniff" } as const;
const NO_STORE = { "Cache-Control": "no-store", ...NOSNIFF } as const;

const requestSchema = z.object({
  ateneo_id: z.string().min(1).max(64),
  corso_id: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const { response: blocked } = guardPost(request, "insegnamenti-sync", {
    limit: 10,
    windowMs: 60_000,
  });
  if (blocked) return blocked;

  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { status: "error", error: "Richiesta non valida." } satisfies ManifestoApiResponse,
      { status: 400, headers: NOSNIFF },
    );
  }

  try {
    const found = await discoverManifesto(parsed.ateneo_id, parsed.corso_id);
    const body: ManifestoApiResponse = found
      ? { status: "ok", url: found.url, html: found.html }
      : { status: "manual" };
    return NextResponse.json(body, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Sincronizzazione non riuscita." } satisfies ManifestoApiResponse,
      { status: 502, headers: NO_STORE },
    );
  }
}
