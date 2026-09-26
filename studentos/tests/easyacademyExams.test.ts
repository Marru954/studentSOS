/**
 * EasyAcademy `test_call.php` — the shapes "Insegnamenti" can take.
 *
 * PHP's json_encode serialises an EMPTY associative array as `[]`, not `{}`:
 * test_call.php answers `"Insegnamenti": []` when the window holds no exam call
 * (e.g. a brand-new course code whose sessions are not published yet). The zod
 * record rejected the array, so the whole exams source failed ("expected record,
 * received array") instead of returning 0 calls. A list keyed 0..n-1 is also
 * encoded as an array, so a non-empty array must map like the record form.
 * Anything else malformed (e.g. `null`) must stay a source failure: a failed
 * source keeps its previous cache, while a successful empty one would replace it.
 *
 * Network is stubbed on globalThis.fetch; params are placeholders, not real codes.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { easyAcademyProvider, type EasyAcademyParams } from "../src/lib/sync/adapters/easyacademy";
import { _resetPoliteFetchCache } from "../src/lib/sync/http";

const realFetch = globalThis.fetch;
beforeEach(() => _resetPoliteFetchCache());
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Every POST answers `body` as JSON; returns the list of requested URLs. */
function answer(body: unknown): string[] {
  const urls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    urls.push(String(input));
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return urls;
}

const params: EasyAcademyParams = {
  kind: "exams",
  baseUrl: "https://easyacademy.example.test",
  scuola: "SCUOLA-TEST",
  cdl: "CDL-TEST",
  anno2: ["1"],
};

function fetchExams() {
  return easyAcademyProvider.fetchExams!(params, {
    range: { from: "2026-09-01", to: "2027-02-28" },
    signal: new AbortController().signal,
  });
}

const course = {
  DatiInsegnamento: { Codice: "C1", Nome: "ANALISI MATEMATICA I" },
  Appelli: [
    { Data: "15-01-2027", OraInizio: "09:00", Aula: "Aula 1", TipoEsame: "Scritto", docenti_associati: ["Rossi"] },
    { Data: "20-01-2027", OraInizio: "10:00", TipoEsame: "Orale", event_Annullato: "1" },
    { Data: "15-06-2027", OraInizio: "09:00", TipoEsame: "Scritto" }, // out of range
  ],
};

test("Insegnamenti: [] (PHP empty array) → 0 calls, not a failed source", async () => {
  const urls = answer({ Insegnamenti: [] });
  assert.deepEqual(await fetchExams(), []);
  assert.deepEqual(urls, ["https://easyacademy.example.test/test_call.php"]);
});

test("Insegnamenti missing → 0 calls", async () => {
  answer({});
  assert.deepEqual(await fetchExams(), []);
});

test("record form maps in-range, non-cancelled calls", async () => {
  answer({ Insegnamenti: { C1: course } });
  const calls = await fetchExams();
  assert.equal(calls.length, 1);
  const [call] = calls;
  assert.equal(call.courseName, "ANALISI MATEMATICA I");
  assert.equal(call.courseCode, "C1");
  assert.equal(call.date, "2027-01-15");
  assert.equal(call.time, "09:00");
  assert.equal(call.kind, "written");
  assert.equal(call.teacher, "Rossi");
});

test("non-empty array form (PHP list) maps exactly like the record form", async () => {
  answer({ Insegnamenti: { C1: course } });
  const fromRecord = await fetchExams();
  _resetPoliteFetchCache();
  answer({ Insegnamenti: [course] });
  assert.deepEqual(await fetchExams(), fromRecord);
});

test("Insegnamenti: null stays a source failure (previous cache must survive)", async () => {
  answer({ Insegnamenti: null });
  await assert.rejects(fetchExams());
});
