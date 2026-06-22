/**
 * Test dello store Zustand delle territorie manuali (src/lib/state/manual.ts).
 * Verifica i field selector dopo hydrate(), upsert(), remove() e upsert-update.
 * IndexedDB reale (fake-indexeddb in Node) — niente mock di repo.
 */
import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { useLibretto } from "@/lib/state/manual";
import { __resetDbForTests } from "@/lib/storage/db";
import type { LibrettoEntry } from "@/lib/domain/types";

// ── Helper factory ───────────────────────────────────────────────────────────

function entry(overrides: Partial<LibrettoEntry> & { id: string }): LibrettoEntry {
  return {
    courseName: "ANALISI I",
    cfu: 9,
    grade: { kind: "numeric", value: 27, laude: false },
    date: "2025-06-20",
    ...overrides,
  };
}

// ── Reset tra i test ─────────────────────────────────────────────────────────

beforeEach(async () => {
  await __resetDbForTests();
  // Cancella il DB reale per isolare i test tra loro
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase("studentos");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  // Resetta lo stato in-memory dello store
  useLibretto.setState({ items: [], hydrated: false });
});

// ── Happy path ────────────────────────────────────────────────────────────────

test("hydrate: selector (s)=>s.hydrated è true e items è [] dopo hydrate su DB vuoto", async () => {
  // arrange: DB vuoto, store non idratato (vedi beforeEach)

  // act
  await useLibretto.getState().hydrate();

  // assert
  assert.equal(useLibretto.getState().hydrated, true);
  assert.deepEqual(useLibretto.getState().items, []);
});

test("upsert: selector (s)=>s.items contiene l'entry inserita (1 elemento col giusto id)", async () => {
  // arrange
  await useLibretto.getState().hydrate();
  const nuovoEsame = entry({ id: "esame-1", courseName: "BASI DI DATI", cfu: 6 });

  // act
  await useLibretto.getState().upsert(nuovoEsame);

  // assert
  const items = useLibretto.getState().items;
  assert.equal(items.length, 1);
  assert.equal(items[0].id, "esame-1");
  assert.equal(items[0].courseName, "BASI DI DATI");
  assert.equal(items[0].cfu, 6);
});

test("remove: dopo remove(id) lo store torna vuoto", async () => {
  // arrange
  await useLibretto.getState().hydrate();
  const esame = entry({ id: "da-rimuovere" });
  await useLibretto.getState().upsert(esame);
  assert.equal(useLibretto.getState().items.length, 1);

  // act
  await useLibretto.getState().remove("da-rimuovere");

  // assert
  assert.deepEqual(useLibretto.getState().items, []);
});

test("upsert con stesso id sostituisce in posizione (nessun duplicato)", async () => {
  // arrange: un primo upsert
  await useLibretto.getState().hydrate();
  const originale = entry({ id: "esame-dup", courseName: "FISICA", cfu: 6 });
  await useLibretto.getState().upsert(originale);
  assert.equal(useLibretto.getState().items.length, 1);

  // act: secondo upsert con stesso id ma dati aggiornati
  const aggiornato = entry({ id: "esame-dup", courseName: "FISICA AGGIORNATA", cfu: 9 });
  await useLibretto.getState().upsert(aggiornato);

  // assert: lista ancora con 1 solo elemento, aggiornato in posizione
  const items = useLibretto.getState().items;
  assert.equal(items.length, 1, "non deve esserci duplicato");
  assert.equal(items[0].id, "esame-dup");
  assert.equal(items[0].courseName, "FISICA AGGIORNATA");
  assert.equal(items[0].cfu, 9);
});

// ── Edge case ─────────────────────────────────────────────────────────────────

test("hydrate è idempotente: seconda chiamata non ricarica se già hydrated", async () => {
  // arrange
  await useLibretto.getState().hydrate();
  const esame = entry({ id: "idempotente" });
  await useLibretto.getState().upsert(esame);
  assert.equal(useLibretto.getState().hydrated, true);
  assert.equal(useLibretto.getState().items.length, 1);

  // act: seconda hydrate NON deve sovrascrivere lo stato in-memory
  await useLibretto.getState().hydrate();

  // assert: l'item inserito resta (hydrate skippata perché già hydrated)
  assert.equal(useLibretto.getState().items.length, 1);
  assert.equal(useLibretto.getState().items[0].id, "idempotente");
});

test("reload rilegge da IndexedDB e sovrascrive lo stato in-memory", async () => {
  // arrange: idra e inserisci un esame, poi corrompi lo stato in-memory a mano
  await useLibretto.getState().hydrate();
  const esame = entry({ id: "reload-test", courseName: "CHIMICA" });
  await useLibretto.getState().upsert(esame);
  // simula discrepanza: svuota solo lo stato Zustand (non il DB)
  useLibretto.setState({ items: [] });
  assert.equal(useLibretto.getState().items.length, 0);

  // act
  await useLibretto.getState().reload();

  // assert: torna a leggere dal DB, recupera l'entry
  assert.equal(useLibretto.getState().items.length, 1);
  assert.equal(useLibretto.getState().items[0].id, "reload-test");
  assert.equal(useLibretto.getState().items[0].courseName, "CHIMICA");
});

test("upsert su store non ancora hydrated inserisce comunque l'item", async () => {
  // arrange: lo store è nel suo stato iniziale (hydrated=false, items=[])
  assert.equal(useLibretto.getState().hydrated, false);
  const esame = entry({ id: "no-hydrate", courseName: "MATEMATICA" });

  // act: upsert senza hydrate preventivo
  await useLibretto.getState().upsert(esame);

  // assert: l'item è in memoria (ottimistico) anche senza hydrate
  const items = useLibretto.getState().items;
  assert.equal(items.length, 1);
  assert.equal(items[0].id, "no-hydrate");
});

test("clear svuota tutto lo store e le persistenza su IndexedDB", async () => {
  // arrange: due esami inseriti
  await useLibretto.getState().hydrate();
  await useLibretto.getState().upsert(entry({ id: "c1" }));
  await useLibretto.getState().upsert(entry({ id: "c2" }));
  assert.equal(useLibretto.getState().items.length, 2);

  // act
  await useLibretto.getState().clear();

  // assert: items vuoto in memoria
  assert.deepEqual(useLibretto.getState().items, []);

  // e anche su DB: reload deve restituire array vuoto
  await useLibretto.getState().reload();
  assert.deepEqual(useLibretto.getState().items, []);
});

test("upsertMany inserisce più entry in un solo aggiornamento di stato", async () => {
  // arrange
  await useLibretto.getState().hydrate();
  const batch = [
    entry({ id: "b1", courseName: "ALGEBRA", cfu: 6 }),
    entry({ id: "b2", courseName: "GEOMETRIA", cfu: 6 }),
    entry({ id: "b3", courseName: "PROBABILITA", cfu: 9 }),
  ];

  // act
  await useLibretto.getState().upsertMany(batch);

  // assert
  const items = useLibretto.getState().items;
  assert.equal(items.length, 3);
  const ids = items.map((i) => i.id).sort();
  assert.deepEqual(ids, ["b1", "b2", "b3"]);
});

test("remove su id inesistente non causa errori e non modifica lo store", async () => {
  // arrange
  await useLibretto.getState().hydrate();
  await useLibretto.getState().upsert(entry({ id: "sopravvissuto" }));

  // act: rimuove un id che non esiste
  await useLibretto.getState().remove("id-fantasma");

  // assert: l'item esistente rimane intatto
  const items = useLibretto.getState().items;
  assert.equal(items.length, 1);
  assert.equal(items[0].id, "sopravvissuto");
});
