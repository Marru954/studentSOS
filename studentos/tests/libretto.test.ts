/**
 * Test della logica pura del libretto universitario.
 * Copre: earnedCfu, gradedCount, gradedTotals, weightedAverage,
 *        graduationBase, baseToAverage, gradePoints, cfuPerMonth, averageSeries.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  earnedCfu,
  gradedCount,
  gradedTotals,
  weightedAverage,
  graduationBase,
  baseToAverage,
  gradePoints,
  cfuPerMonth,
  averageSeries,
} from "@/lib/domain/libretto";
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

// ── earnedCfu ────────────────────────────────────────────────────────────────

test("earnedCfu: somma tutti i CFU inclusi idoneità ed esclusi", () => {
  // arrange
  const entries = [
    entry({ id: "a", cfu: 9 }),
    entry({ id: "b", cfu: 3, grade: { kind: "pass" } }),
    entry({ id: "c", cfu: 6, excludeFromAverage: true }),
  ];
  // act
  const result = earnedCfu(entries);
  // assert
  assert.equal(result, 18);
});

test("earnedCfu: array vuoto restituisce 0", () => {
  assert.equal(earnedCfu([]), 0);
});

test("earnedCfu: singolo esame restituisce i suoi CFU", () => {
  assert.equal(earnedCfu([entry({ id: "x", cfu: 12 })]), 12);
});

// ── gradedCount ──────────────────────────────────────────────────────────────

test("gradedCount: conta solo esami numerici non esclusi", () => {
  // arrange
  const entries = [
    entry({ id: "a" }),                                               // conta
    entry({ id: "b", grade: { kind: "pass" } }),                     // non conta (idoneità)
    entry({ id: "c", excludeFromAverage: true }),                     // non conta (escluso)
    entry({ id: "d", grade: { kind: "numeric", value: 28, laude: false } }), // conta
  ];
  // act & assert
  assert.equal(gradedCount(entries), 2);
});

test("gradedCount: array vuoto restituisce 0", () => {
  assert.equal(gradedCount([]), 0);
});

test("gradedCount: solo idoneità restituisce 0", () => {
  const entries = [
    entry({ id: "a", grade: { kind: "pass" } }),
    entry({ id: "b", grade: { kind: "pass" } }),
  ];
  assert.equal(gradedCount(entries), 0);
});

// ── gradedTotals ─────────────────────────────────────────────────────────────

test("gradedTotals: calcola CFU e punti solo degli esami che contano", () => {
  // arrange: 12 CFU × 30 + 6 CFU × 24 = 504 punti, 18 CFU totali
  const entries = [
    entry({ id: "a", cfu: 12, grade: { kind: "numeric", value: 30, laude: true } }),
    entry({ id: "b", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
    entry({ id: "c", cfu: 3, grade: { kind: "pass" } }),             // escluso
  ];
  // act
  const { cfu, points } = gradedTotals(entries);
  // assert
  assert.equal(cfu, 18);
  assert.equal(points, 504);
});

test("gradedTotals: array vuoto restituisce cfu=0 e points=0", () => {
  const { cfu, points } = gradedTotals([]);
  assert.equal(cfu, 0);
  assert.equal(points, 0);
});

test("gradedTotals: la lode (30L) vale 30 nella somma dei punti", () => {
  // arrange: 6 CFU × 30 = 180 punti (la lode non aggiunge punti extra)
  const entries = [
    entry({ id: "a", cfu: 6, grade: { kind: "numeric", value: 30, laude: true } }),
  ];
  const { cfu, points } = gradedTotals(entries);
  assert.equal(cfu, 6);
  assert.equal(points, 180);
});

// ── weightedAverage ──────────────────────────────────────────────────────────

test("weightedAverage: media pesata sui CFU con 30 e lode", () => {
  // arrange: (12×30 + 6×24) / 18 = 504/18 = 28
  const entries = [
    entry({ id: "a", cfu: 12, grade: { kind: "numeric", value: 30, laude: true } }),
    entry({ id: "b", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
  ];
  // act & assert
  assert.equal(weightedAverage(entries), 28);
});

test("weightedAverage: esami esclusi e idoneità non entrano nella media", () => {
  // arrange: solo il voto 27 su 9 CFU deve contare → media = 27
  const entries = [
    entry({ id: "a", cfu: 9, grade: { kind: "numeric", value: 27, laude: false } }),
    entry({ id: "b", cfu: 3, grade: { kind: "pass" } }),
    entry({ id: "c", cfu: 6, grade: { kind: "numeric", value: 18, laude: false }, excludeFromAverage: true }),
  ];
  assert.equal(weightedAverage(entries), 27);
});

test("weightedAverage: array vuoto restituisce undefined", () => {
  assert.equal(weightedAverage([]), undefined);
});

test("weightedAverage: solo idoneità restituisce undefined", () => {
  const entries = [
    entry({ id: "a", grade: { kind: "pass" } }),
    entry({ id: "b", grade: { kind: "pass" } }),
  ];
  assert.equal(weightedAverage(entries), undefined);
});

test("weightedAverage: solo esami esclusi restituisce undefined", () => {
  const entries = [
    entry({ id: "a", grade: { kind: "numeric", value: 28, laude: false }, excludeFromAverage: true }),
  ];
  assert.equal(weightedAverage(entries), undefined);
});

test("weightedAverage: un solo esame restituisce il suo voto", () => {
  const entries = [entry({ id: "a", cfu: 6, grade: { kind: "numeric", value: 22, laude: false } })];
  assert.equal(weightedAverage(entries), 22);
});

// ── graduationBase e baseToAverage ──────────────────────────────────────────

test("graduationBase: media 27 → base 99 (arrotondata)", () => {
  assert.equal(graduationBase(27), 99);
});

test("graduationBase: media 30 → base 110 (massimo)", () => {
  assert.equal(graduationBase(30), 110);
});

test("baseToAverage: inverso di graduationBase (round-trip)", () => {
  // arrange
  const average = 28.5;
  // act
  const base = graduationBase(average);
  const recovered = baseToAverage(base);
  // assert: il round-trip deve tornare al valore originale (con tolleranza floating-point)
  assert.ok(
    Math.abs(recovered - average) < 1e-10,
    `round-trip fallito: ${recovered} != ${average}`,
  );
});

test("baseToAverage: base 99 → media 27", () => {
  assert.equal(baseToAverage(99), 27);
});

// ── gradePoints ──────────────────────────────────────────────────────────────

test("gradePoints: restituisce solo esami numerici, ordinati per data", () => {
  // arrange: esame recente prima nell'array, idoneità mescolata
  const entries = [
    entry({ id: "b", courseName: "FISICA", date: "2025-09-10", grade: { kind: "numeric", value: 24, laude: false } }),
    entry({ id: "c", courseName: "INGLESE", date: "2025-03-15", grade: { kind: "pass" } }),
    entry({ id: "a", courseName: "ANALISI I", date: "2025-06-20", grade: { kind: "numeric", value: 30, laude: true } }),
  ];
  // act
  const points = gradePoints(entries);
  // assert: solo i numerici, ordinati per data crescente
  assert.equal(points.length, 2);
  assert.equal(points[0].courseName, "ANALISI I");
  assert.equal(points[0].date, "2025-06-20");
  assert.equal(points[0].value, 30);
  assert.equal(points[0].laude, true);
  assert.equal(points[1].courseName, "FISICA");
  assert.equal(points[1].date, "2025-09-10");
  assert.equal(points[1].value, 24);
  assert.equal(points[1].laude, false);
});

test("gradePoints: array vuoto restituisce array vuoto", () => {
  assert.deepEqual(gradePoints([]), []);
});

test("gradePoints: solo idoneità restituisce array vuoto", () => {
  const entries = [
    entry({ id: "a", grade: { kind: "pass" } }),
    entry({ id: "b", grade: { kind: "pass" } }),
  ];
  assert.deepEqual(gradePoints(entries), []);
});

// ── cfuPerMonth ──────────────────────────────────────────────────────────────

test("cfuPerMonth: array vuoto restituisce undefined", () => {
  assert.equal(cfuPerMonth([]), undefined);
});

test("cfuPerMonth: singolo esame vale almeno 1 mese (non divide per 0)", () => {
  // arrange: un solo esame → span 0 giorni → clampato a 1 mese
  const entries = [entry({ id: "a", cfu: 9, date: "2025-06-20" })];
  // act
  const result = cfuPerMonth(entries);
  // assert: deve essere un numero finito positivo, non infinito
  assert.ok(result !== undefined && Number.isFinite(result) && result > 0);
  assert.equal(result, 9); // 9 CFU / 1 mese
});

test("cfuPerMonth: span maggiore di 1 mese divide i CFU per i mesi reali", () => {
  // arrange: due esami separati da ~30.44 giorni (1 mese) e 12 CFU totali
  const entries = [
    entry({ id: "a", cfu: 6, date: "2025-01-01" }),
    entry({ id: "b", cfu: 6, date: "2025-12-31" }),
  ];
  const result = cfuPerMonth(entries);
  // 12 CFU in circa 12 mesi → circa 1 CFU/mese (verifichiamo la ragionevolezza)
  assert.ok(result !== undefined && result > 0 && result < 2);
});

// ── averageSeries ────────────────────────────────────────────────────────────

test("averageSeries: serie cumulativa ordinata per data", () => {
  // arrange: esame a settembre inserito prima di quello di giugno
  const entries = [
    entry({ id: "b", date: "2025-09-10", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
    entry({ id: "a", date: "2025-06-20", cfu: 6, grade: { kind: "numeric", value: 30, laude: false } }),
    entry({ id: "c", date: "2026-01-15", cfu: 12, grade: { kind: "pass" } }), // idoneità: non entra
  ];
  // act
  const series = averageSeries(entries);
  // assert: primo punto = 30, secondo punto = (30×6 + 24×6)/12 = 27
  assert.deepEqual(series, [30, 27]);
});

test("averageSeries: array vuoto restituisce array vuoto", () => {
  assert.deepEqual(averageSeries([]), []);
});

test("averageSeries: solo idoneità restituisce array vuoto", () => {
  const entries = [
    entry({ id: "a", grade: { kind: "pass" } }),
    entry({ id: "b", grade: { kind: "pass" } }),
  ];
  assert.deepEqual(averageSeries(entries), []);
});

test("averageSeries: esami esclusi non entrano nella serie", () => {
  // arrange: un esame esclude, uno normale
  const entries = [
    entry({ id: "a", date: "2025-06-01", cfu: 6, grade: { kind: "numeric", value: 18, laude: false }, excludeFromAverage: true }),
    entry({ id: "b", date: "2025-09-01", cfu: 6, grade: { kind: "numeric", value: 30, laude: false } }),
  ];
  const series = averageSeries(entries);
  // solo l'esame non escluso contribuisce → un solo punto = 30
  assert.deepEqual(series, [30]);
});

test("averageSeries: aggiornamento corretto dopo tre esami con pesi diversi", () => {
  // arrange: 4 CFU × 18, 6 CFU × 24, 2 CFU × 30
  // dopo 1°: 18
  // dopo 2°: (4×18 + 6×24) / 10 = (72 + 144) / 10 = 21.6
  // dopo 3°: (72 + 144 + 60) / 12 = 276 / 12 = 23
  const entries = [
    entry({ id: "a", date: "2025-01-10", cfu: 4, grade: { kind: "numeric", value: 18, laude: false } }),
    entry({ id: "b", date: "2025-03-15", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
    entry({ id: "c", date: "2025-06-20", cfu: 2, grade: { kind: "numeric", value: 30, laude: false } }),
  ];
  const series = averageSeries(entries);
  assert.equal(series.length, 3);
  assert.equal(series[0], 18);
  assert.ok(Math.abs(series[1] - 21.6) < 1e-10, `atteso 21.6, ottenuto ${series[1]}`);
  assert.equal(series[2], 23);
});
