import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingState, examsClosingWithin } from "@/lib/domain/booking";
import type { ExamCall } from "@/lib/domain/types";

// Data di riferimento fissa per determinismo
const TODAY = "2026-06-22";

// ── Helper ──────────────────────────────────────────────────────────────────

function exam(overrides: Partial<ExamCall> & { id: string }): ExamCall {
  return {
    courseName: "ANALISI I",
    date: "2026-07-10",
    kind: "written",
    sourceId: "esami-anno-1",
    ...overrides,
  };
}

// ── bookingState: nessuna finestra di prenotazione ──────────────────────────

test("bookingState restituisce 'none' quando booking è assente", () => {
  const stato = bookingState(undefined, TODAY);
  assert.equal(stato.kind, "none");
});

test("bookingState restituisce 'none' quando booking ha entrambi i campi assenti", () => {
  const stato = bookingState({}, TODAY);
  assert.equal(stato.kind, "none");
});

// ── bookingState: non ancora aperta ────────────────────────────────────────

test("bookingState restituisce 'opens' quando opensAt è nel futuro", () => {
  const stato = bookingState({ opensAt: "2026-06-25" }, TODAY);
  assert.equal(stato.kind, "opens");
  assert.equal((stato as { kind: "opens"; opensAt: string }).opensAt, "2026-06-25");
});

// ── bookingState: aperta senza data di chiusura ─────────────────────────────

test("bookingState restituisce 'open' quando opensAt è passata e closesAt assente", () => {
  const stato = bookingState({ opensAt: "2026-06-20" }, TODAY);
  assert.equal(stato.kind, "open");
});

// ── bookingState: aperta con data di chiusura lontana ──────────────────────

test("bookingState restituisce 'open' con daysLeft quando chiusura è lontana (>3 gg)", () => {
  // chiude tra 7 giorni → 'open'
  const stato = bookingState({ closesAt: "2026-06-29" }, TODAY);
  assert.equal(stato.kind, "open");
  const s = stato as { kind: "open"; daysLeft?: number };
  assert.ok(typeof s.daysLeft === "number" && s.daysLeft > 3, "daysLeft deve essere > 3");
});

// ── bookingState: in chiusura imminente (≤3 giorni) ────────────────────────

test("bookingState restituisce 'closing' quando chiude tra 1 giorno", () => {
  const stato = bookingState({ closesAt: "2026-06-23" }, TODAY);
  assert.equal(stato.kind, "closing");
  const s = stato as { kind: "closing"; daysLeft: number };
  assert.equal(s.daysLeft, 1);
});

test("bookingState restituisce 'closing' con daysLeft=0 quando chiude oggi", () => {
  const stato = bookingState({ closesAt: TODAY }, TODAY);
  assert.equal(stato.kind, "closing");
  const s = stato as { kind: "closing"; daysLeft: number };
  assert.equal(s.daysLeft, 0);
});

test("bookingState restituisce 'closing' quando chiude esattamente tra 3 giorni (confine)", () => {
  const stato = bookingState({ closesAt: "2026-06-25" }, TODAY);
  assert.equal(stato.kind, "closing");
});

// ── bookingState: chiusa ────────────────────────────────────────────────────

test("bookingState restituisce 'closed' quando closesAt è nel passato", () => {
  const stato = bookingState({ closesAt: "2026-06-20" }, TODAY);
  assert.equal(stato.kind, "closed");
  const s = stato as { kind: "closed"; closesAt: string };
  assert.equal(s.closesAt, "2026-06-20");
});

// ── bookingState: opensAt passata + closesAt futura ────────────────────────

test("bookingState ignora opensAt quando è già passata e usa closesAt per lo stato", () => {
  // Aperta il 18, chiude il 28 (lontana): deve risultare 'open'
  const stato = bookingState({ opensAt: "2026-06-18", closesAt: "2026-06-28" }, TODAY);
  assert.equal(stato.kind, "open");
});

// ── examsClosingWithin: lista vuota ────────────────────────────────────────

test("examsClosingWithin restituisce [] su lista vuota", () => {
  const risultato = examsClosingWithin([], TODAY, 48);
  assert.deepEqual(risultato, []);
});

// ── examsClosingWithin: happy path ─────────────────────────────────────────

test("examsClosingWithin include esame che chiude entro la finestra temporale", () => {
  // finestra 48h → 2 giorni → chiude oggi o domani (2026-06-22 / 2026-06-23)
  const esami = [
    exam({ id: "a", courseName: "FISICA", booking: { closesAt: "2026-06-23" } }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 48);
  assert.equal(risultato.length, 1);
  assert.equal(risultato[0].id, "a");
});

// ── examsClosingWithin: esame fuori finestra escluso ─────────────────────────

test("examsClosingWithin esclude esame che chiude oltre la finestra", () => {
  // finestra 24h → 1 giorno → solo oggi; esame chiude fra 3 giorni
  const esami = [
    exam({ id: "b", courseName: "CHIMICA", booking: { closesAt: "2026-06-25" } }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 24);
  assert.deepEqual(risultato, []);
});

// ── examsClosingWithin: esame già chiuso escluso ────────────────────────────

test("examsClosingWithin esclude esame con finestra già scaduta", () => {
  const esami = [
    exam({ id: "c", courseName: "STORIA", booking: { closesAt: "2026-06-20" } }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 72);
  assert.deepEqual(risultato, []);
});

// ── examsClosingWithin: ordinamento per data di chiusura ─────────────────────

test("examsClosingWithin ordina per data di chiusura crescente", () => {
  // finestra 72h → 3 giorni → 2026-06-22, 2026-06-23, 2026-06-24 e 2026-06-25 (confine)
  const esami = [
    exam({ id: "tardi", courseName: "LOGICA", booking: { closesAt: "2026-06-24" } }),
    exam({ id: "presto", courseName: "FISICA", booking: { closesAt: "2026-06-22" } }),
    exam({ id: "medio", courseName: "CHIMICA", booking: { closesAt: "2026-06-23" } }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 72);
  assert.equal(risultato.length, 3);
  assert.deepEqual(
    risultato.map((e) => e.id),
    ["presto", "medio", "tardi"],
  );
});

// ── examsClosingWithin: esame senza booking escluso ──────────────────────────

test("examsClosingWithin esclude esami senza finestra di prenotazione", () => {
  const esami = [
    exam({ id: "no-booking", courseName: "MATEMATICA" }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 72);
  assert.deepEqual(risultato, []);
});

// ── examsClosingWithin: mix di esami inclusi ed esclusi ──────────────────────

test("examsClosingWithin filtra correttamente in lista mista", () => {
  const esami = [
    exam({ id: "dentro", courseName: "FISICA", booking: { closesAt: "2026-06-23" } }),
    exam({ id: "fuori", courseName: "CHIMICA", booking: { closesAt: "2026-06-30" } }),
    exam({ id: "passato", courseName: "STORIA", booking: { closesAt: "2026-06-21" } }),
    exam({ id: "no-bk", courseName: "ARTE" }),
  ];
  const risultato = examsClosingWithin(esami, TODAY, 48);
  assert.equal(risultato.length, 1);
  assert.equal(risultato[0].id, "dentro");
});
