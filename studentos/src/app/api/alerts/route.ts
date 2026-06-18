/**
 * POST /api/alerts — server-side parity surface for the smart-alerts engine.
 *
 * `detectAlerts` is a PURE function that normally runs client-side in the alerts
 * store after every sync (see StoreProvider). This route exposes the very same
 * computation to a caller that already holds the data: the browser posts its
 * current synced + manual snapshot and gets back the detected `Alert[]`.
 *
 * There is NO server-side IndexedDB (it is a browser-only API), so the inputs
 * MUST travel in the request body — which is why this is a POST, not a GET (the
 * Fetch standard forbids a body on GET/HEAD, so a GET could never carry the
 * timetable / exam / libretto arrays detection needs).
 *
 * Local-first contract: like the other proxies this needs NO mandatory auth —
 * requiring a login would break the no-account build. `guardPost` only blocks
 * cross-site calls and rate-limits per IP. Nothing is persisted or logged here;
 * the request body is read once and dropped.
 */
import { guardPost } from "@/lib/api/guard";
import { detectAlerts, type DetectAlertsParams } from "@/lib/domain/detectAlerts";
import type { ClassEvent, ExamCall, LibrettoEntry } from "@/lib/domain/types";
import type { SyncMeta } from "@/lib/storage/types";

export const runtime = "nodejs";
/** Detection is data-dependent and produces a timestamped result; never cache. */
export const dynamic = "force-dynamic";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** A missing/null array field is treated as empty; a present-but-not-array value
 *  is a client error (returns `null`, which the handler turns into a 400). */
function asArray(value: unknown): unknown[] | null {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : null;
}

export async function POST(req: Request): Promise<Response> {
  const { response: blocked, remaining } = guardPost(req, "alerts", {
    limit: 30,
    windowMs: 60_000,
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Corpo della richiesta non valido.", 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonError("Corpo della richiesta non valido.", 400);
  }

  const b = body as Record<string, unknown>;
  const classEvents = asArray(b.classEvents);
  const examCalls = asArray(b.examCalls);
  const previousExamIds = asArray(b.previousExamIds);
  const libroEntries = asArray(b.libroEntries);
  const syncMeta = asArray(b.syncMeta);
  if (
    classEvents === null ||
    examCalls === null ||
    previousExamIds === null ||
    libroEntries === null ||
    syncMeta === null
  ) {
    return jsonError("Parametri non validi.", 400);
  }

  const rawMedia = b.previousMedia;
  if (rawMedia !== null && rawMedia !== undefined && typeof rawMedia !== "number") {
    return jsonError("Parametri non validi.", 400);
  }
  const previousMedia = typeof rawMedia === "number" ? rawMedia : null;

  const params: DetectAlertsParams = {
    classEvents: classEvents as ClassEvent[],
    examCalls: examCalls as ExamCall[],
    previousExamIds: previousExamIds.map((id) => String(id)),
    libroEntries: libroEntries as LibrettoEntry[],
    previousMedia,
    syncMeta: syncMeta as SyncMeta[],
    now: new Date(),
  };

  let alerts;
  try {
    alerts = detectAlerts(params);
  } catch {
    // Detection is pure but defensive: malformed inner objects must never crash
    // the route or leak a stack trace to the client.
    return jsonError("Impossibile calcolare gli avvisi.", 500);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  // Debug only in sviluppo: non esporre lo stato del rate-limit in produzione.
  if (process.env.NODE_ENV !== "production") {
    headers["X-RateLimit-Remaining"] = String(remaining);
  }
  // The task contract is "ritorna Alert[] come JSON": the success body is the
  // bare array (Date fields serialize to ISO strings). Errors are non-2xx with
  // an { ok:false, error } envelope, so callers branch on HTTP status.
  return new Response(JSON.stringify(alerts), { headers });
}
