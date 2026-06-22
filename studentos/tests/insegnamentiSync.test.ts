import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { __resetDbForTests, getDb } from "@/lib/storage/db";
import {
  isProtected,
  logicalKey,
  persist,
  syncInsegnamenti,
} from "@/lib/insegnamenti/sync";
import type { Insegnamento } from "@/types/insegnamenti";

const ATN = "atn";
const CRS = "crs";

/** Costruisce un Insegnamento valido sovrascrivibile campo per campo. */
function ins(partial: Partial<Insegnamento>): Insegnamento {
  return {
    id: "",
    ateneo_id: ATN,
    corso_id: CRS,
    nome: "Materia",
    cfu: 6,
    tipo: "obbligatorio",
    inserito_manualmente: false,
    created_at: "2019-01-01T00:00:00.000Z",
    updated_at: "2019-01-01T00:00:00.000Z",
    ...partial,
  };
}

/** Scrive righe direttamente nello store (per preparare lo stato pre-sync). */
async function seed(...rows: Insegnamento[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("insegnamenti", "readwrite");
  for (const r of rows) await tx.objectStore("insegnamenti").put(r);
  await tx.done;
}

async function allRows(): Promise<Insegnamento[]> {
  const db = await getDb();
  return (await db.getAllFromIndex("insegnamenti", "by-corso", CRS)).filter(
    (r) => r.ateneo_id === ATN,
  );
}

beforeEach(async () => {
  await __resetDbForTests();
  // __resetDbForTests chiude solo la connessione: con fake-indexeddb i dati
  // restano. Svuotiamo esplicitamente gli store toccati per isolare i test.
  const db = await getDb();
  const tx = db.transaction(["insegnamenti", "manifesti"], "readwrite");
  await tx.objectStore("insegnamenti").clear();
  await tx.objectStore("manifesti").clear();
  await tx.done;
});

// --- logicalKey / isProtected (unità pure) --------------------------------

test("logicalKey: usa il codice quando presente (case-insensitive)", () => {
  assert.equal(logicalKey({ codice: "CS101", nome: "Qualcosa" }), "c:cs101");
});

test("logicalKey: senza codice usa nome normalizzato + anno", () => {
  assert.equal(
    logicalKey({ nome: "Analisi Matemàtica", anno: "1" }),
    "n:analisi matematica|1",
  );
});

test("isProtected: manuale o modificato a mano -> true", () => {
  assert.equal(isProtected(ins({ inserito_manualmente: true })), true);
  assert.equal(isProtected(ins({ modificato_manualmente: true })), true);
  assert.equal(isProtected(ins({ inserito_manualmente: false })), false);
});

// --- persist: scrittura idempotente del bucket synced ---------------------

test("persist: scrive le righe synced su DB vuoto", async () => {
  const n = await persist(
    ATN,
    CRS,
    [ins({ nome: "Analisi", codice: "A1", cfu: 9 })],
    "https://x/manifesto",
  );
  assert.equal(n, 1);
  const rows = await allRows();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].codice, "A1");
  assert.equal(rows[0].inserito_manualmente, false);
  assert.equal(rows[0].modificato_manualmente, false);
  // il manifesto viene timbrato
  const db = await getDb();
  assert.equal((await db.getAll("manifesti")).length, 1);
});

test("persist: una riga MANUALE non viene mai toccata né rimossa", async () => {
  await seed(
    ins({
      id: "m1",
      inserito_manualmente: true,
      nome: "Materia mia",
      codice: "MINE",
      created_at: "2018-05-05T00:00:00.000Z",
    }),
  );
  await persist(ATN, CRS, [ins({ nome: "Nuova", codice: "NEW" })], "https://x");
  const rows = await allRows();
  const manual = rows.find((r) => r.id === "m1");
  assert.ok(manual, "la riga manuale deve sopravvivere");
  assert.equal(manual?.inserito_manualmente, true);
  assert.equal(manual?.created_at, "2018-05-05T00:00:00.000Z");
  assert.ok(rows.some((r) => r.codice === "NEW"));
});

test("persist: una riga in arrivo che collide (logicalKey) con una protetta viene scartata", async () => {
  await seed(
    ins({ id: "m1", inserito_manualmente: true, codice: "DUP", nome: "Originale" }),
  );
  const n = await persist(
    ATN,
    CRS,
    [ins({ codice: "DUP", nome: "Versione ateneo diversa", cfu: 12 })],
    "https://x",
  );
  assert.equal(n, 0, "la riga collidente non deve essere scritta");
  const rows = await allRows();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "m1");
  assert.equal(rows[0].nome, "Originale");
  assert.equal(rows.filter((r) => r.inserito_manualmente === false).length, 0);
});

test("persist: una riga synced MODIFICATA a mano è protetta come una manuale", async () => {
  await seed(
    ins({
      id: "e1",
      inserito_manualmente: false,
      modificato_manualmente: true,
      codice: "ED",
      nome: "Modificata dallo studente",
      created_at: "2018-01-01T00:00:00.000Z",
    }),
  );
  const n = await persist(
    ATN,
    CRS,
    [ins({ codice: "ED", nome: "Sovrascrittura ateneo" })],
    "https://x",
  );
  assert.equal(n, 0);
  const rows = await allRows();
  const edited = rows.find((r) => r.id === "e1");
  assert.equal(edited?.modificato_manualmente, true);
  assert.equal(edited?.nome, "Modificata dallo studente");
  assert.equal(edited?.created_at, "2018-01-01T00:00:00.000Z");
});

test("persist (re-sync): created_at preservato, righe non più elencate rimosse", async () => {
  await persist(
    ATN,
    CRS,
    [ins({ codice: "A1", nome: "A" }), ins({ codice: "B1", nome: "B" })],
    "https://x",
  );
  const first = await allRows();
  const aBefore = first.find((r) => r.codice === "A1");
  assert.ok(aBefore);
  const createdA = aBefore!.created_at;

  // Re-sync: A1 resta, B1 sparisce dall'elenco, C1 è nuovo.
  const n = await persist(
    ATN,
    CRS,
    [ins({ codice: "A1", nome: "A" }), ins({ codice: "C1", nome: "C" })],
    "https://x",
  );
  assert.equal(n, 2);
  const rows = await allRows();
  const codici = rows.map((r) => r.codice).sort();
  assert.deepEqual(codici, ["A1", "C1"]);
  const aAfter = rows.find((r) => r.codice === "A1");
  assert.equal(aAfter?.created_at, createdA, "created_at deve essere preservato");
});

// --- syncInsegnamenti: gestione esiti API (path senza DOMParser) ----------

test("syncInsegnamenti: API status 'manual' -> manual", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ status: "manual" }), { status: 200 });
  try {
    assert.deepEqual(await syncInsegnamenti(ATN, CRS), { status: "manual" });
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("syncInsegnamenti: risposta HTTP non ok -> error", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "boom" }), { status: 500 });
  try {
    const res = await syncInsegnamenti(ATN, CRS);
    assert.equal(res.status, "error");
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("syncInsegnamenti: fetch che lancia -> error (rete non disponibile)", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  try {
    const res = await syncInsegnamenti(ATN, CRS);
    assert.equal(res.status, "error");
  } finally {
    globalThis.fetch = realFetch;
  }
});
