import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { easyAcademyProvider } from "@/lib/sync/adapters/easyacademy";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const PARAMS = {
  kind: "exams" as const,
  baseUrl: "https://example.test/agenda",
  scuola: "S",
  cdl: "C1",
  anno2: ["1"],
};
const CTX = () => ({
  range: { from: "2026-10-01", to: "2027-09-30" },
  signal: new AbortController().signal,
});

function mockJson(body: unknown) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(body), { status: 200 })) as typeof fetch;
}

test("test_call con Insegnamenti: [] (array PHP vuoto) → nessun appello, niente errore", async () => {
  mockJson({ Insegnamenti: [] });
  const calls = await easyAcademyProvider.fetchExams!(PARAMS, CTX());
  assert.deepEqual(calls, []);
});

test("test_call con Insegnamenti: {} → nessun appello", async () => {
  mockJson({ Insegnamenti: {} });
  assert.deepEqual(await easyAcademyProvider.fetchExams!(PARAMS, CTX()), []);
});

test("test_call con appelli reali continua a funzionare", async () => {
  mockJson({
    Insegnamenti: {
      a: {
        DatiInsegnamento: { Codice: "X1", Nome: "ANALISI" },
        Appelli: [{ Data: "15-01-2027", OraInizio: "09:00", TipoEsame: "SCR" }],
      },
    },
  });
  const calls = await easyAcademyProvider.fetchExams!(PARAMS, CTX());
  assert.equal(calls.length, 1);
  assert.equal(calls[0].courseName, "ANALISI");
  assert.equal(calls[0].date, "2027-01-15");
});

test("un array NON vuoto resta un errore di schema", async () => {
  mockJson({ Insegnamenti: [1] });
  await assert.rejects(() => easyAcademyProvider.fetchExams!(PARAMS, CTX()));
});
