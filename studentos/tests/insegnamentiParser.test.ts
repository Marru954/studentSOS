import assert from "node:assert/strict";
import { test } from "node:test";
import {
  annoFromHeader,
  inferTipo,
  parseCfu,
  parseList,
  parseSemestre,
} from "@/lib/insegnamenti/parser";

// parseManifestoHTML usa DOMParser (solo browser) e non e testabile headless:
// qui copriamo gli helper puri di parsing cella, dove vive la logica vera.

// --- parseCfu -------------------------------------------------------------

test("parseCfu: intero semplice", () => {
  assert.equal(parseCfu("6"), 6);
});

test("parseCfu: virgola decimale e suffisso CFU", () => {
  assert.equal(parseCfu("6,0 CFU"), 6);
  assert.equal(parseCfu("7,5"), 7.5);
});

test("parseCfu: prende il primo numero in '6/9'", () => {
  assert.equal(parseCfu("6/9"), 6);
});

test("parseCfu: cella senza numero -> undefined", () => {
  assert.equal(parseCfu("n.d."), undefined);
  assert.equal(parseCfu(""), undefined);
});

// --- parseSemestre --------------------------------------------------------

test("parseSemestre: '1° semestre' -> 1", () => {
  assert.equal(parseSemestre("1° semestre"), 1);
});

test("parseSemestre: secondo periodo -> 2", () => {
  assert.equal(parseSemestre("2 periodo"), 2);
});

test("parseSemestre: 'Annuale' resta stringa", () => {
  assert.equal(parseSemestre("Annuale"), "Annuale");
});

test("parseSemestre: vuoto -> undefined", () => {
  assert.equal(parseSemestre(""), undefined);
});

// --- parseList (propedeuticità) ------------------------------------------

test("parseList: split su virgole, punti e virgola e slash", () => {
  assert.deepEqual(parseList("Analisi 1, Fisica; Algebra/Geometria"), [
    "Analisi 1",
    "Fisica",
    "Algebra",
    "Geometria",
  ]);
});

test("parseList: cella vuota o solo separatori -> undefined", () => {
  assert.equal(parseList(""), undefined);
  assert.equal(parseList(" , ; / "), undefined);
});

// --- inferTipo ------------------------------------------------------------

test("inferTipo: 'a scelta' -> scelta", () => {
  assert.equal(inferTipo("Attività a scelta", "Corso X"), "scelta");
});

test("inferTipo: tirocinio/prova finale/lingua -> altro", () => {
  assert.equal(inferTipo("", "Prova finale"), "altro");
  assert.equal(inferTipo("Tirocinio", "Stage"), "altro");
});

test("inferTipo: caso normale -> obbligatorio", () => {
  assert.equal(inferTipo("Caratterizzante", "Analisi Matematica"), "obbligatorio");
});

// --- annoFromHeader (riga divisoria "I Anno") -----------------------------

test("annoFromHeader: numero romano 'I Anno' -> '1'", () => {
  assert.equal(annoFromHeader("I Anno"), "1");
});

test("annoFromHeader: 'Anno 2' (cifra) -> '2'", () => {
  assert.equal(annoFromHeader("Anno 2"), "2");
});

test("annoFromHeader: 'Secondo anno' (parola) -> '2'", () => {
  assert.equal(annoFromHeader("Secondo anno"), "2");
});

test("annoFromHeader: testo che non è un'intestazione anno -> undefined", () => {
  assert.equal(annoFromHeader("Informatica"), undefined);
});
