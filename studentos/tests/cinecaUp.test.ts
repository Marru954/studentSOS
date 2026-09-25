/**
 * Cineca University Planner adapter (dormant — no preset wired yet).
 *
 * ⚠️ Every payload here is SYNTHETIC, shaped on the fields seen in the
 * 2026-07-02 recon (_recon_cineca-gomp_2026-07-02.md): dataInizio/dataFine,
 * aule[].descrizione, docenti[], evento.dettagliDidattici[].{nome, annoCorso}.
 * They pin the adapter's logic, not the real contract. Before the first preset,
 * a REAL response captured with scripts/probe-cineca-up.ts must be committed
 * under tests/fixtures/cineca-up/ and parsed here.
 *
 * Network is stubbed on globalThis.fetch; ids and hosts are placeholders.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  _resetCinecaUpMemo,
  cinecaUpProvider,
  IMPEGNI_PATH,
  readImpegno,
  toClassEvent,
  upDateTimeToIso,
  weekWindows,
  type CinecaUpParams,
} from "../src/lib/sync/adapters/cineca-up";
import { _resetPoliteFetchCache } from "../src/lib/sync/http";
import { getProvider } from "../src/lib/sync/registry";
import { upProgramSources } from "../src/lib/sync/universities/cineca-up";
import { allowedHostsFor, validateSources } from "../src/lib/sync/validateUrl";
import { yearOfSource } from "../src/lib/domain/sources";

const BASE = "https://up.example.test";
const CLIENTE = "0123456789abcdef01234567";
const CAL_A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const CAL_B = "bbbbbbbbbbbbbbbbbbbbbbbb";

const realFetch = globalThis.fetch;
beforeEach(() => {
  _resetPoliteFetchCache();
  _resetCinecaUpMemo();
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

interface Seen {
  url: string;
  init: RequestInit;
  body: Record<string, unknown>;
}

/** Stub fetch: `reply(body)` decides each response from the parsed JSON request. */
function serve(reply: (body: Record<string, unknown>) => { status?: number; json: unknown }): Seen[] {
  const seen: Seen[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    seen.push({ url: String(input), init, body });
    const { status = 200, json } = reply(body);
    return new Response(JSON.stringify(json), {
      status,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return seen;
}

function impegno(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "imp-1",
    nome: "Lezione",
    dataInizio: "2026-10-12T07:30:00.000Z",
    dataFine: "2026-10-12T09:30:00.000Z",
    aule: [{ descrizione: "Aula A1" }, { descrizione: "Aula A2" }],
    docenti: [{ nome: "Mario", cognome: "Rossi" }, "Anna Bianchi", 42, null],
    evento: { dettagliDidattici: [{ nome: "ANALISI MATEMATICA I", codice: "AM1", annoCorso: 1, cfu: 12 }] },
    ...over,
  };
}

function params(over: Partial<CinecaUpParams> = {}): CinecaUpParams {
  return { kind: "timetable", baseUrl: BASE, clienteId: CLIENTE, linkCalendarioIds: [CAL_A], ...over };
}

const ctx = (from: string, to: string) => ({ range: { from, to }, signal: new AbortController().signal });

// ── dates ────────────────────────────────────────────────────────────────────

test("upDateTimeToIso: zoned strings are taken as-is", () => {
  assert.equal(upDateTimeToIso("2026-03-02T08:30:00.000Z"), "2026-03-02T08:30:00.000Z");
  assert.equal(upDateTimeToIso("2026-03-02T09:30:00+01:00"), "2026-03-02T08:30:00.000Z");
  assert.equal(upDateTimeToIso("2026-10-12T09:30:00+0200"), "2026-10-12T07:30:00.000Z");
});

test("upDateTimeToIso: zone-less strings are Rome time, DST included", () => {
  assert.equal(upDateTimeToIso("2026-03-02T09:30:00"), "2026-03-02T08:30:00.000Z"); // CET
  assert.equal(upDateTimeToIso("2026-10-12T09:30:00"), "2026-10-12T07:30:00.000Z"); // CEST
  assert.equal(upDateTimeToIso("2026-03-30T09:00:00.0000000"), "2026-03-30T07:00:00.000Z"); // after DST start (29/03)
  assert.equal(upDateTimeToIso("2026-10-26T09:00"), "2026-10-26T08:00:00.000Z"); // after DST end (25/10)
});

test("upDateTimeToIso: unreadable → undefined", () => {
  assert.equal(upDateTimeToIso("12/10/2026 09:30"), undefined);
  assert.equal(upDateTimeToIso(""), undefined);
});

test("weekWindows: Monday-to-Monday UTC windows covering the range, capped", () => {
  assert.deepEqual(weekWindows("2026-09-23", "2026-10-05"), [
    { start: "2026-09-21T00:00:00.000Z", end: "2026-09-28T00:00:00.000Z" },
    { start: "2026-09-28T00:00:00.000Z", end: "2026-10-05T00:00:00.000Z" },
    { start: "2026-10-05T00:00:00.000Z", end: "2026-10-12T00:00:00.000Z" },
  ]);
  assert.equal(weekWindows("2026-01-01", "2026-12-31").length, 20);
});

// ── reading one impegno ─────────────────────────────────────────────────────

test("readImpegno keeps only the fields used, tolerating odd nested entries", () => {
  assert.deepEqual(readImpegno(impegno()), {
    upstreamId: "imp-1",
    courseName: "ANALISI MATEMATICA I",
    courseCode: "AM1",
    years: [1],
    start: "2026-10-12T07:30:00.000Z",
    end: "2026-10-12T09:30:00.000Z",
    rooms: ["Aula A1", "Aula A2"],
    teachers: ["Mario Rossi", "Anna Bianchi"],
  });
});

test("readImpegno: no didactic details → the impegno name, no year", () => {
  const imp = readImpegno(impegno({ evento: undefined, nome: "Prova in itinere" }));
  assert.equal(imp?.courseName, "Prova in itinere");
  assert.deepEqual(imp?.years, []);
});

test("readImpegno drops what can't be placed honestly", () => {
  assert.equal(readImpegno(impegno({ evento: undefined, nome: undefined })), null); // no name
  assert.equal(readImpegno(impegno({ dataFine: "2026-10-12T07:30:00.000Z" })), null); // end <= start
  assert.equal(readImpegno(impegno({ dataInizio: undefined })), null);
  assert.equal(readImpegno(impegno({ dataInizio: "domani" })), null);
  assert.equal(readImpegno("not an object"), null);
});

test("readImpegno: string years count, duplicates collapse", () => {
  const imp = readImpegno(
    impegno({ evento: { dettagliDidattici: [{ nome: "X", annoCorso: "2" }, { nome: "X", annoCorso: 2 }, { annoCorso: "II" }] } }),
  );
  assert.deepEqual(imp?.years, [2]);
});

// ── year filter + ids ────────────────────────────────────────────────────────

test("toClassEvent: the year filter keeps matching years and drops undeclared ones", () => {
  const y1 = readImpegno(impegno())!;
  const none = readImpegno(impegno({ evento: undefined }))!;
  assert.ok(toClassEvent(y1, params({ anniCorso: [1] })));
  assert.equal(toClassEvent(y1, params({ anniCorso: [2] })), null);
  assert.equal(toClassEvent(none, params({ anniCorso: [1] })), null);
  assert.ok(toClassEvent(none, params())); // no filter: per-year calendar, keep all
});

test("toClassEvent: ids are stable, and distinct between sibling sources", () => {
  const imp = readImpegno(impegno({ evento: { dettagliDidattici: [{ nome: "X", annoCorso: 1 }, { nome: "X", annoCorso: 2 }] } }))!;
  const a = toClassEvent(imp, params({ anniCorso: [1] }))!;
  const again = toClassEvent(imp, params({ anniCorso: [1] }))!;
  const b = toClassEvent(imp, params({ anniCorso: [2] }))!;
  assert.equal(a.id, again.id);
  assert.notEqual(a.id, b.id); // IndexedDB keys on id across ALL sources
  assert.equal(a.kind, "other");
  assert.equal(a.teacher, "Mario Rossi, Anna Bianchi");
  assert.equal(a.room, "Aula A1, Aula A2");
  assert.equal(a.sourceId, "");
});

// ── fetchTimetable over a stubbed network ───────────────────────────────────

test("fetchTimetable: one JSON POST per calendar-week, cancelled lessons excluded", async () => {
  const seen = serve(() => ({ json: [impegno()] }));
  const events = await cinecaUpProvider.fetchTimetable!(params(), ctx("2026-10-12", "2026-10-18"));
  assert.equal(events.length, 1);
  assert.equal(seen.length, 1);
  const [{ url, init, body }] = seen;
  assert.equal(url, `${BASE}${IMPEGNI_PATH}`);
  assert.equal(init.method, "POST");
  assert.equal(init.redirect, "manual");
  assert.equal(new Headers(init.headers).get("content-type"), "application/json");
  assert.deepEqual(body, {
    mostraImpegniAnnullati: false,
    mostraIndisponibilitaTotali: false,
    linkCalendarioId: CAL_A,
    clienteId: CLIENTE,
    pianificazioneTemplate: false,
    dataInizio: "2026-10-12T00:00:00.000Z",
    dataFine: "2026-10-19T00:00:00.000Z",
  });
});

test("fetchTimetable: dedups across calendars and drops out-of-range impegni", async () => {
  const outside = impegno({ id: "imp-2", dataInizio: "2026-10-20T07:30:00.000Z", dataFine: "2026-10-20T09:30:00.000Z" });
  const seen = serve(() => ({ json: [impegno(), impegno(), outside] }));
  const events = await cinecaUpProvider.fetchTimetable!(
    params({ linkCalendarioIds: [CAL_A, CAL_B] }),
    ctx("2026-10-12", "2026-10-18"),
  );
  assert.equal(seen.length, 2); // one per calendar
  assert.deepEqual(events.map((e) => e.courseName), ["ANALISI MATEMATICA I"]);
});

test("fetchTimetable: sibling year-sources sharing a calendar download it once", async () => {
  const y2 = impegno({ id: "imp-3", evento: { dettagliDidattici: [{ nome: "FISICA II", annoCorso: 2 }] } });
  const seen = serve(() => ({ json: [impegno(), y2] }));
  const window = ctx("2026-10-12", "2026-10-18");
  const [first, second] = await Promise.all([
    cinecaUpProvider.fetchTimetable!(params({ anniCorso: [1] }), window),
    cinecaUpProvider.fetchTimetable!(params({ anniCorso: [2] }), window),
  ]);
  assert.equal(seen.length, 1);
  assert.deepEqual(first.map((e) => e.courseName), ["ANALISI MATEMATICA I"]);
  assert.deepEqual(second.map((e) => e.courseName), ["FISICA II"]);
});

test("fetchTimetable: HTTP errors and non-array bodies fail the source, and are not cached", async () => {
  let calls = 0;
  serve(() => (++calls === 1 ? { status: 500, json: { error: "boom" } } : { json: [impegno()] }));
  const window = ctx("2026-10-12", "2026-10-18");
  await assert.rejects(cinecaUpProvider.fetchTimetable!(params(), window), /responded 500/);
  assert.equal((await cinecaUpProvider.fetchTimetable!(params(), window)).length, 1);

  _resetCinecaUpMemo();
  serve(() => ({ json: { impegni: [] } }));
  await assert.rejects(cinecaUpProvider.fetchTimetable!(params(), window), /risposta inattesa/);
});

// ── wiring ───────────────────────────────────────────────────────────────────

test("params: ids must be captured UP ObjectIds, never free text", () => {
  const schema = cinecaUpProvider.paramsSchema;
  assert.ok(schema.safeParse(params()).success);
  assert.equal(schema.safeParse(params({ clienteId: "unipi" })).success, false);
  assert.equal(schema.safeParse(params({ linkCalendarioIds: ["informatica-triennale"] })).success, false);
  assert.equal(schema.safeParse(params({ linkCalendarioIds: [] })).success, false);
});

test("registry: cineca-up is registered as a timetable provider", () => {
  assert.equal(getProvider("cineca-up"), cinecaUpProvider);
  assert.deepEqual(cinecaUpProvider.capabilities, ["timetable"]);
});

test("dormant: no preset ships a UP host, so /api/sync rejects any UP source", async () => {
  assert.equal(allowedHostsFor("cineca-up").size, 0);
  const [source] = upProgramSources(BASE, CLIENTE, "prova", [{ year: 1, linkCalendarioIds: [CAL_A] }]);
  await assert.rejects(validateSources([source]), /host non consentito/);
});

test("upProgramSources: namespaced per-year sources that pass the provider schema", () => {
  const sources = upProgramSources(BASE, CLIENTE, "informatica", [
    { year: 1, linkCalendarioIds: [CAL_A] },
    { year: 2, linkCalendarioIds: [CAL_A, CAL_B], filterByYear: true },
  ]);
  assert.deepEqual(sources.map((s) => s.id), ["informatica-orario-anno-1", "informatica-orario-anno-2"]);
  assert.deepEqual(sources.map((s) => yearOfSource(s.id)), [1, 2]);
  for (const s of sources) {
    assert.equal(s.providerId, "cineca-up");
    assert.equal(s.capability, "timetable");
    assert.ok(cinecaUpProvider.paramsSchema.safeParse(s.params).success);
  }
  assert.equal((sources[0].params as CinecaUpParams).anniCorso, undefined);
  assert.deepEqual((sources[1].params as CinecaUpParams).anniCorso, [2]);
});
