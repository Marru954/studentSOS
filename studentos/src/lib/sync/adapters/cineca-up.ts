/**
 * Cineca University Planner (UP) adapter — the public calendar
 * ("calendarioPubblico") that ~13 Italian atenei run on `*.prod.up.cineca.it`
 * (Pisa, Torino, Pavia, Verona, Siena, …). AngularJS SPA over a LoopBack REST
 * API whose public routes are POST (the same route in GET answers 401):
 *
 *   POST {baseUrl}/api/Impegni/getImpegniCalendarioPubblico
 *        { clienteId, linkCalendarioId, dataInizio, dataFine, … } → Impegno[]
 *
 * `clienteId` (the tenant, from GET /api/Clienti/cercaPerDominio) and every
 * `linkCalendarioId` are 24-hex ObjectIds CAPTURED from the ateneo with
 * scripts/probe-cineca-up.ts — never invented. Calendar enumeration is not
 * public (401): calendars are harvested from the ateneo's own pages, and they
 * rotate every academic year.
 *
 * DORMANT: the contract comes from the 2026-07-02 recon plus public calendar
 * links, not yet from a committed real fixture. No preset references this
 * provider, so the SSRF allowlist holds no host for it and /api/sync rejects any
 * source that tries. Before the first preset: capture a real response, commit it
 * under tests/fixtures/cineca-up/ and parse it in tests/cinecaUp.test.ts
 * (docs/superpowers/specs/2026-09-25-adapter-cineca-up-design.md).
 */
import { z } from "zod";
import type { ClassEvent } from "@/lib/domain/types";
import type { FetchContext, SyncProvider } from "../provider";
import { stableId } from "../util";
import { politeFetch } from "../http";

export const IMPEGNI_PATH = "/api/Impegni/getImpegniCalendarioPubblico";

const objectId = z
  .string()
  .regex(/^[0-9a-f]{24}$/, "atteso un ObjectId UP (24 cifre esadecimali)");

const paramsSchema = z.object({
  kind: z.literal("timetable"),
  /** Tenant origin on *.prod.up.cineca.it. */
  baseUrl: z.string().url(),
  /** Tenant id (GET /api/Clienti/cercaPerDominio?dominio=<host>). */
  clienteId: objectId,
  /** Public calendars merged into this source (e.g. I and II semester). */
  linkCalendarioIds: z.array(objectId).min(1),
  /** Keep only impegni whose didactic details declare one of these course
   *  years — for calendars that carry the whole degree. Absent = keep all. */
  anniCorso: z.array(z.number().int().min(1).max(6)).min(1).optional(),
});
export type CinecaUpParams = z.infer<typeof paramsSchema>;

// Only the envelope is strict. Nested fields are read tolerantly below, so one
// odd teacher/room entry never drops a lesson; unreadable dates drop the impegno.
const impegnoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  _id: z.union([z.string(), z.number()]).optional(),
  nome: z.string().nullish(),
  dataInizio: z.string(),
  dataFine: z.string(),
  aule: z.unknown().optional(),
  docenti: z.unknown().optional(),
  evento: z.unknown().optional(),
});

/** The few fields StudentOS uses from one impegno (~24 KB raw → a few hundred bytes). */
export interface UpImpegno {
  upstreamId?: string;
  courseName: string;
  courseCode?: string;
  /** Course years declared by the didactic details (empty = none declared). */
  years: number[];
  start: string;
  end: string;
  rooms: string[];
  teachers: string[];
}

const text = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;
const record = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const present = <T>(v: T | undefined): v is T => v !== undefined;

/** "Mario Rossi" from `{nome, cognome}`, or the string itself. */
function teacherName(d: unknown): string | undefined {
  if (typeof d === "string") return text(d);
  const o = record(d);
  if (!o) return undefined;
  return [text(o.nome), text(o.cognome)].filter(present).join(" ") || undefined;
}

function courseYear(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v.trim()) ? Number(v) : NaN;
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

const romeClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Rome",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Europe/Rome's UTC offset (ms) at a given instant. */
function romeOffsetMs(utcMs: number): number {
  const p = Object.fromEntries(romeClock.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return wall - Math.floor(utcMs / 1000) * 1000;
}

/** UP datetime → UTC ISO. A string with `Z`/offset is taken as-is; a zone-less
 *  one is Rome wall-clock time (the ateneo's), converted with the offset in
 *  force on that day — never the server's own zone. */
export function upDateTimeToIso(value: string): string | undefined {
  const v = value.trim();
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(v)) {
    const t = Date.parse(v);
    return Number.isNaN(t) ? undefined : new Date(t).toISOString();
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(v);
  if (!m) return undefined;
  const [y, mo, d, h, mi, s = "0"] = m.slice(1);
  const wall = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
  const utc = wall - romeOffsetMs(wall - romeOffsetMs(wall));
  return new Date(utc).toISOString();
}

/** One raw impegno → the fields we use, or null when it can't be placed honestly. */
export function readImpegno(raw: unknown): UpImpegno | null {
  const parsed = impegnoSchema.safeParse(raw);
  if (!parsed.success) return null;
  const imp = parsed.data;

  const details = list(record(imp.evento)?.dettagliDidattici).map(record).filter(present);
  const courseName = details.map((x) => text(x.nome)).find(present) ?? text(imp.nome);
  const start = upDateTimeToIso(imp.dataInizio);
  const end = upDateTimeToIso(imp.dataFine);
  if (!courseName || !start || !end || end <= start) return null;

  const upstreamId = imp.id ?? imp._id;
  return {
    upstreamId: upstreamId !== undefined ? String(upstreamId) : undefined,
    courseName,
    courseCode: details.map((x) => text(x.codice)).find(present),
    years: [...new Set(details.map((x) => courseYear(x.annoCorso)).filter(present))],
    start,
    end,
    rooms: list(imp.aule).map((a) => text(record(a)?.descrizione)).filter(present),
    teachers: list(imp.docenti).map(teacherName).filter(present),
  };
}

/** A read impegno → ClassEvent for this source, or null when the year filter drops it. */
export function toClassEvent(imp: UpImpegno, params: CinecaUpParams): ClassEvent | null {
  // A whole-degree calendar entry with no declared year could be any year: drop it.
  if (params.anniCorso && !imp.years.some((y) => params.anniCorso!.includes(y))) return null;
  return {
    // Ids key IndexedDB across ALL sources: seed with calendar + year filter so
    // sibling sources sharing a calendar never overwrite each other's rows.
    id: stableId(
      "up",
      params.linkCalendarioIds.join(","),
      (params.anniCorso ?? []).join(","),
      imp.upstreamId ?? `${imp.courseName}|${imp.start}`,
    ),
    courseName: imp.courseName,
    courseCode: imp.courseCode,
    teacher: imp.teachers.join(", ") || undefined,
    start: imp.start,
    end: imp.end,
    room: imp.rooms.join(", ") || undefined,
    // The activity-type field is not confirmed yet ("other" renders like a lecture).
    kind: "other",
    sourceId: "", // stamped by the engine
  };
}

// One request per 28 days — no longer than the SPA's own month view — and at
// most 5 (140 days, the horizon EasyAcademy's 20 weekly calls cover): fewer
// round-trips keep a source inside the engine's 25 s budget despite ~24 KB per
// impegno, with the 250 ms per-host gap shared by every source of the ateneo.
const WINDOW_DAYS = 28;
const MAX_WINDOWS = 5;

/** Monday-aligned 00:00Z windows of `days` covering [from, to], capped. */
export function fetchWindows(
  fromIso: string,
  toIso: string,
  days = WINDOW_DAYS,
  maxWindows = MAX_WINDOWS,
): { start: string; end: string }[] {
  const d = new Date(`${fromIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  const last = new Date(`${toIso}T00:00:00Z`).getTime();
  const out: { start: string; end: string }[] = [];
  while (d.getTime() <= last && out.length < maxWindows) {
    const start = d.toISOString();
    d.setUTCDate(d.getUTCDate() + days);
    out.push({ start, end: d.toISOString() });
  }
  return out;
}

/** The exact request for one calendar window — shared with scripts/probe-cineca-up.ts,
 *  so the live check exercises what production sends. */
export function impegniRequest(
  baseUrl: string,
  clienteId: string,
  linkCalendarioId: string,
  span: { start: string; end: string },
): { url: string; init: RequestInit } {
  return {
    url: `${baseUrl.replace(/\/+$/, "")}${IMPEGNI_PATH}`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        // Cancelled lessons stay out until the "annullato" field is confirmed on a
        // real fixture: a cancelled lesson shown as active would be wrong data.
        mostraImpegniAnnullati: false,
        mostraIndisponibilitaTotali: false,
        linkCalendarioId,
        clienteId,
        pianificazioneTemplate: false,
        dataInizio: span.start,
        dataFine: span.end,
      }),
      // SSRF: a 3xx never bounces past the host allowlist (same as every adapter).
      redirect: "manual",
    },
  };
}

/** POST one calendar window; the raw array as the server sent it. */
async function postImpegni(
  baseUrl: string,
  clienteId: string,
  linkCalendarioId: string,
  span: { start: string; end: string },
  signal: AbortSignal,
): Promise<unknown[]> {
  const { url, init } = impegniRequest(baseUrl, clienteId, linkCalendarioId, span);
  const res = await politeFetch(url, { ...init, signal });
  if (!res.ok) throw new Error(`Cineca UP ${url} responded ${res.status}`);
  const body: unknown = await res.json();
  if (!Array.isArray(body)) throw new Error(`Cineca UP ${url}: risposta inattesa (non è un elenco di impegni)`);
  return body;
}

// Per-year sources of one degree often share a calendar and ask for the same
// calendar window within one sync: a single download serves them all (and any
// sibling request in the next minute) — lighter on the ateneo. Only the slim
// read form is kept, and failures are never cached.
const MEMO_TTL_MS = 60_000;
const MEMO_MAX = 64;
const memo = new Map<string, { at: number; value: Promise<UpImpegno[]> }>();

export function _resetCinecaUpMemo(): void {
  memo.clear();
}

function impegniOfWindow(
  params: CinecaUpParams,
  linkCalendarioId: string,
  span: { start: string; end: string },
  signal: AbortSignal,
): Promise<UpImpegno[]> {
  const key = `${params.baseUrl}|${params.clienteId}|${linkCalendarioId}|${span.start}|${span.end}`;
  const now = Date.now();
  const hit = memo.get(key);
  if (hit && now - hit.at < MEMO_TTL_MS) return hit.value;
  const entry = { at: now, value: Promise.resolve<UpImpegno[]>([]) };
  entry.value = postImpegni(params.baseUrl, params.clienteId, linkCalendarioId, span, signal)
    .then((raw) => raw.map(readImpegno).filter((x): x is UpImpegno => x !== null))
    .catch((err: unknown) => {
      if (memo.get(key) === entry) memo.delete(key);
      throw err;
    });
  if (memo.size >= MEMO_MAX) memo.delete(memo.keys().next().value as string);
  memo.set(key, entry);
  return entry.value;
}

async function fetchTimetable(params: CinecaUpParams, ctx: FetchContext): Promise<ClassEvent[]> {
  const events = new Map<string, ClassEvent>();
  for (const linkCalendarioId of params.linkCalendarioIds) {
    for (const span of fetchWindows(ctx.range.from, ctx.range.to)) {
      for (const imp of await impegniOfWindow(params, linkCalendarioId, span, ctx.signal)) {
        const event = toClassEvent(imp, params);
        if (!event) continue;
        const day = event.start.slice(0, 10);
        if (day < ctx.range.from || day > ctx.range.to) continue;
        events.set(event.id, event); // dedup across windows and calendars
      }
    }
  }
  return [...events.values()];
}

export const cinecaUpProvider: SyncProvider<CinecaUpParams> = {
  id: "cineca-up",
  label: "Cineca University Planner",
  paramsSchema,
  capabilities: ["timetable"],
  fetchTimetable,
};
