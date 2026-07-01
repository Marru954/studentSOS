/**
 * EasyAcademy / agendaweb adapter (EasyStaff) — used by many Italian
 * universities (easyutv.uniroma2.it, easystaff.unitn.it, …).
 *
 * The public web UI is backed by two JSON endpoints, verified live:
 *   POST {baseUrl}/grid_call.php  → one week of lessons ("celle")
 *   POST {baseUrl}/test_call.php  → exam calls per course ("Insegnamenti")
 * No authentication, no HTML parsing.
 */
import { z } from "zod";
import type { ClassEvent, ClassEventKind, ExamCall, ExamKind } from "@/lib/domain/types";
import type { FetchContext, SyncProvider } from "../provider";
import { italianDateToIso, minutesBetween, splitRoomLabel, stableId } from "../util";

const timetableParams = z.object({
  kind: z.literal("timetable"),
  baseUrl: z.string().url(),
  /** Academic year start, e.g. "2025" for 2025/26. */
  anno: z.string(),
  scuola: z.string(),
  /** Degree course code, e.g. "H02". */
  corso: z.string(),
  /** agendaweb `anno2[]` values, e.g. ["comune|2"] = 2nd year, common track. */
  anno2: z.array(z.string()).min(1),
});

const examsParams = z.object({
  kind: z.literal("exams"),
  baseUrl: z.string().url(),
  scuola: z.string(),
  /** Degree course code for easytest (`esami_cdl`), e.g. "H02". */
  cdl: z.string(),
  /** Plain year numbers for easytest `anno2[]`, e.g. ["2"]. */
  anno2: z.array(z.string()).min(1),
});

const paramsSchema = z.discriminatedUnion("kind", [timetableParams, examsParams]);
export type EasyAcademyParams = z.infer<typeof paramsSchema>;

// Only the fields we consume — the endpoints return far more.
const gridCell = z.object({
  nome_insegnamento: z.string(),
  codice_insegnamento: z.string().optional(),
  data: z.string(), // DD-MM-YYYY
  ora_inizio: z.string(),
  ora_fine: z.string(),
  timestamp: z.number(), // unix start, already timezone-correct
  aula: z.string().optional().default(""),
  docente: z.string().optional().default(""),
  codice_tipo: z.string().optional().default(""),
  Annullato: z.union([z.string(), z.number()]).optional(),
});

const gridResponse = z.object({
  first_day: z.string(),
  last_day: z.string(),
  celle: z.array(z.unknown()).optional().default([]),
});

const examEntry = z.object({
  Data: z.string(), // DD-MM-YYYY
  OraInizio: z.string().optional().default(""),
  OraFine: z.string().optional().default(""),
  Aula: z.string().optional().default(""),
  TipoEsame: z.string().optional().default(""),
  Notes: z.string().optional().default(""),
  event_Annullato: z.union([z.string(), z.number()]).optional(),
  docenti_associati: z.array(z.string()).optional().default([]),
});

const examsResponse = z.object({
  Insegnamenti: z
    .record(
      z.string(),
      z.object({
        DatiInsegnamento: z.object({
          Codice: z.string().optional(),
          Nome: z.string(),
        }),
        Appelli: z.array(z.unknown()).optional().default([]),
      }),
    )
    .optional()
    .default({}),
});

const LESSON_KINDS: Record<string, ClassEventKind> = {
  LEZ: "lecture",
  LAB: "lab",
  ESE: "exercise",
  ESER: "exercise",
  SEM: "seminar",
};

function examKind(tipoEsame: string): ExamKind {
  const t = tipoEsame.toLowerCase();
  const written = t.includes("scritt");
  const oral = t.includes("oral");
  if (written && oral) return "written+oral";
  if (written) return "written";
  if (oral) return "oral";
  if (t.includes("pratic")) return "practical";
  return "unknown";
}

async function postForm(
  url: string,
  form: Record<string, string | string[]>,
  signal: AbortSignal,
): Promise<unknown> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    if (Array.isArray(value)) for (const v of value) body.append(key, v);
    else body.append(key, value);
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal,
    // SSRF: non seguire i 3xx. La guardia host/DNS/IP a monte (validateSources)
    // valida solo l'URL dichiarato; un redirect verso un IP interno lo scavalcherebbe.
    // `redirect: "manual"` → un 3xx arriva con res.ok=false e viene trattato come
    // fallimento della sorgente, stesso pattern degli altri adapter (ical, news).
    redirect: "manual",
  });
  if (!res.ok) throw new Error(`EasyAcademy ${url} responded ${res.status}`);
  return res.json();
}

/** Mondays (DD-MM-YYYY) covering [from, to], capped to avoid hammering. */
function weekStarts(fromIso: string, toIso: string, maxWeeks = 20): string[] {
  const start = new Date(`${fromIso}T12:00:00Z`);
  const end = new Date(`${toIso}T12:00:00Z`);
  // back up to Monday
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const out: string[] = [];
  for (let d = new Date(start); d <= end && out.length < maxWeeks; d.setUTCDate(d.getUTCDate() + 7)) {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    out.push(`${dd}-${mm}-${d.getUTCFullYear()}`);
  }
  return out;
}

async function fetchTimetable(params: EasyAcademyParams, ctx: FetchContext): Promise<ClassEvent[]> {
  if (params.kind !== "timetable") throw new Error("source params are not timetable params");
  const events = new Map<string, ClassEvent>();

  for (const weekDate of weekStarts(ctx.range.from, ctx.range.to)) {
    const raw = await postForm(
      `${params.baseUrl}/grid_call.php`,
      {
        view: "easycourse",
        "form-type": "corso",
        include: "corso",
        anno: params.anno,
        scuola: params.scuola,
        corso: params.corso,
        "anno2[]": params.anno2,
        date: weekDate,
        _lang: "it",
        all_events: "0",
      },
      ctx.signal,
    );
    const week = gridResponse.parse(raw);

    for (const rawCell of week.celle) {
      const parsed = gridCell.safeParse(rawCell);
      if (!parsed.success) continue; // tolerate notice/decoration cells
      const cell = parsed.data;

      const date = italianDateToIso(cell.data);
      if (!date || date < ctx.range.from || date > ctx.range.to) continue;

      const start = new Date(cell.timestamp * 1000).toISOString();
      const end = new Date(
        cell.timestamp * 1000 + minutesBetween(cell.ora_inizio, cell.ora_fine) * 60_000,
      ).toISOString();
      const { room, building } = splitRoomLabel(cell.aula ?? "");
      const cancelled = String(cell.Annullato ?? "0") === "1";

      const event: ClassEvent = {
        id: stableId("ea", params.corso, cell.codice_insegnamento ?? cell.nome_insegnamento, cell.data, cell.ora_inizio),
        courseName: cell.nome_insegnamento,
        courseCode: cell.codice_insegnamento || undefined,
        teacher: cell.docente || undefined,
        start,
        end,
        room,
        building,
        kind: LESSON_KINDS[cell.codice_tipo] ?? "other",
        ...(cancelled ? { change: { field: "cancelled" as const } } : {}),
        sourceId: "", // stamped by the engine
      };
      events.set(event.id, event); // dedup overlapping week windows
    }
  }
  return [...events.values()];
}

async function fetchExams(params: EasyAcademyParams, ctx: FetchContext): Promise<ExamCall[]> {
  if (params.kind !== "exams") throw new Error("source params are not exams params");
  const toItalian = (iso: string) => iso.split("-").reverse().join("-");

  const raw = await postForm(
    `${params.baseUrl}/test_call.php`,
    {
      view: "easytest",
      "form-type": "et_cdl",
      include: "et_cdl",
      et_er: "1",
      scuola: params.scuola,
      esami_cdl: params.cdl,
      "anno2[]": params.anno2,
      datefrom: toItalian(ctx.range.from),
      dateto: toItalian(ctx.range.to),
      _lang: "it",
    },
    ctx.signal,
  );
  const data = examsResponse.parse(raw);

  const calls: ExamCall[] = [];
  for (const course of Object.values(data.Insegnamenti)) {
    for (const rawCall of course.Appelli) {
      const parsed = examEntry.safeParse(rawCall);
      if (!parsed.success) continue;
      const a = parsed.data;

      const date = italianDateToIso(a.Data);
      if (!date || date < ctx.range.from || date > ctx.range.to) continue;
      if (String(a.event_Annullato ?? "0") === "1") continue;

      const { room } = splitRoomLabel(a.Aula);
      calls.push({
        id: stableId("ea-exam", params.cdl, course.DatiInsegnamento.Nome, a.Data, a.OraInizio),
        courseName: course.DatiInsegnamento.Nome,
        courseCode: course.DatiInsegnamento.Codice,
        date,
        time: a.OraInizio || undefined,
        room,
        kind: examKind(a.TipoEsame),
        teacher: a.docenti_associati.join(", ") || undefined,
        notes: a.Notes || undefined,
        sourceId: "",
      });
    }
  }
  return calls;
}

export const easyAcademyProvider: SyncProvider<EasyAcademyParams> = {
  id: "easyacademy",
  label: "EasyAcademy / agendaweb",
  paramsSchema,
  capabilities: ["timetable", "exams"],
  fetchTimetable,
  fetchExams,
};
