import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGrade, parseLibretto } from "@/lib/sync/delphi/parse";

// ── parseGrade ──────────────────────────────────────────────────────────────

test("parseGrade reads numbers, lode, idoneità, and rejects noise", () => {
  assert.deepEqual(parseGrade("28"), { kind: "numeric", value: 28, laude: false });
  assert.deepEqual(parseGrade("30 e lode"), { kind: "numeric", value: 30, laude: true });
  assert.deepEqual(parseGrade("30L"), { kind: "numeric", value: 30, laude: true });
  assert.deepEqual(parseGrade("18"), { kind: "numeric", value: 18, laude: false });
  assert.deepEqual(parseGrade("IDONEO"), { kind: "pass" });
  assert.deepEqual(parseGrade("Approvato"), { kind: "pass" });
  assert.equal(parseGrade(""), undefined);
  assert.equal(parseGrade("—"), undefined);
  assert.equal(parseGrade("12"), undefined); // below 18, not a valid Italian grade
});

// ── parseLibretto ─────────────────────────────────────────────────────────────

// Legacy Delphi-style table soup: a header row, three graded rows, and a
// decorative row that must be ignored.
const FIXTURE = `
<html><body>
<table>
  <tr><th>Insegnamento</th><th>CFU</th><th>Voto</th><th>Data</th></tr>
  <tr><td>BASI DI DATI</td><td>9</td><td>30 e lode</td><td>12/06/2025</td></tr>
  <tr><td>ANALISI MATEMATICA I</td><td>12</td><td>27</td><td>20/02/2025</td></tr>
  <tr><td>PROVA DI INGLESE</td><td>3</td><td>IDONEO</td><td>05/09/2024</td></tr>
  <tr><td colspan="4">Totale CFU acquisiti: 24</td></tr>
</table>
</body></html>`;

test("parseLibretto extracts graded rows with course, cfu, grade, date", () => {
  const entries = parseLibretto(FIXTURE);
  assert.equal(entries.length, 3);

  const bd = entries.find((e) => e.courseName === "BASI DI DATI");
  assert.deepEqual(
    { cfu: bd?.cfu, grade: bd?.grade, date: bd?.date, source: bd?.source },
    {
      cfu: 9,
      grade: { kind: "numeric", value: 30, laude: true },
      date: "2025-06-12",
      source: "delphi",
    },
  );

  const ing = entries.find((e) => e.courseName === "PROVA DI INGLESE");
  assert.deepEqual(ing?.grade, { kind: "pass" });
  assert.equal(ing?.cfu, 3);
});

test("parseLibretto ignores non-grade rows and empty tables", () => {
  assert.deepEqual(parseLibretto("<table><tr><td>nessun voto</td></tr></table>"), []);
  assert.deepEqual(parseLibretto("<p>pagina senza tabelle</p>"), []);
});

test("parseLibretto ids are stable across re-scrapes", () => {
  const a = parseLibretto(FIXTURE);
  const b = parseLibretto(FIXTURE);
  assert.deepEqual(
    a.map((e) => e.id).sort(),
    b.map((e) => e.id).sort(),
  );
});
