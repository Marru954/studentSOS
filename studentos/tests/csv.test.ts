import assert from "node:assert/strict";
import { test } from "node:test";
import {
  academicYearOptions,
  currentAcademicYear,
  normalizeAcademicYear,
} from "@/lib/domain/academicYear";
import { parseLibrettoCsv } from "@/lib/domain/csv";

// ── anno accademico ───────────────────────────────────────────────────────────

test("anno accademico corrente cambia a settembre", () => {
  assert.equal(currentAcademicYear(new Date("2024-10-01")), "2024/2025");
  assert.equal(currentAcademicYear(new Date("2024-03-01")), "2023/2024");
});

test("normalizeAcademicYear accetta varianti", () => {
  assert.equal(normalizeAcademicYear("2023/2024"), "2023/2024");
  assert.equal(normalizeAcademicYear("2023-2024"), "2023/2024");
  assert.equal(normalizeAcademicYear("2023/24"), "2023/2024");
  assert.equal(normalizeAcademicYear("2023"), "2023/2024");
  assert.equal(normalizeAcademicYear(""), undefined);
});

test("academicYearOptions parte dall'anno corrente, discendente", () => {
  const opts = academicYearOptions(new Date("2024-10-01"), 3);
  assert.deepEqual(opts, ["2024/2025", "2023/2024", "2022/2023"]);
});

// ── import CSV ────────────────────────────────────────────────────────────────

const CSV = `corso,cfu,voto,data,anno_accademico
Basi di Dati,9,30,2024-06-18,2023/2024
Analisi Matematica 1,12,25,20/06/2023,2022/2023
Lingua Inglese,3,idoneo,2023-09-15,2022/2023
Programmazione 2,9,30 e lode,2024-02-12,2023/2024`;

test("import CSV: righe valide mappate, voto/lode/idoneità e date", () => {
  const r = parseLibrettoCsv(CSV);
  assert.equal(r.imported, 4);
  assert.equal(r.skipped, 0);

  const bd = r.entries.find((e) => e.courseName === "Basi di Dati");
  assert.deepEqual(bd?.grade, { kind: "numeric", value: 30, laude: false });
  assert.equal(bd?.cfu, 9);
  assert.equal(bd?.academicYear, "2023/2024");
  assert.equal(bd?.source, "manual");

  const an = r.entries.find((e) => e.courseName === "Analisi Matematica 1");
  assert.equal(an?.date, "2023-06-20"); // dd/mm/yyyy → ISO

  const ing = r.entries.find((e) => e.courseName === "Lingua Inglese");
  assert.deepEqual(ing?.grade, { kind: "pass" });

  const p2 = r.entries.find((e) => e.courseName === "Programmazione 2");
  assert.deepEqual(p2?.grade, { kind: "numeric", value: 30, laude: true });
});

test("import CSV: separatore ; (Excel italiano) e righe non valide scartate", () => {
  const csv = `corso;cfu;voto;data;anno_accademico
Fisica;9;26;2024-01-10;2023/2024
Riga Rotta;abc;30;2024-01-10;2023/2024
;6;28;2024-01-10;2023/2024`;
  const r = parseLibrettoCsv(csv);
  assert.equal(r.imported, 1);
  assert.equal(r.skipped, 2);
  assert.equal(r.errors.length, 2);
  assert.match(r.errors[0], /CFU non valido/);
});

test("import CSV: intestazione mancante → errore esplicito", () => {
  const r = parseLibrettoCsv("foo,bar\n1,2");
  assert.equal(r.imported, 0);
  assert.match(r.errors[0], /Intestazione non valida/);
});

test("import CSV: id stabili → re-import idempotente", () => {
  const a = parseLibrettoCsv(CSV).entries.map((e) => e.id);
  const b = parseLibrettoCsv(CSV).entries.map((e) => e.id);
  assert.deepEqual(a, b);
});

test("import CSV: il modello scaricabile (commento + 30L + Idoneo + gg/mm/aaaa)", () => {
  const template = `# Formati accettati: voto da 18 a 30, "30L" per la lode, "Idoneo" per le idoneità, data in formato gg/mm/aaaa. Sostituisci le righe di esempio con i tuoi esami.
corso,cfu,voto,data,anno_accademico
Analisi Matematica,9,28,16/02/2026,2025/2026
Ricerca Operativa,6,Idoneo,19/05/2026,2025/2026
Programmazione,9,30L,27/09/2025,2024/2025`;
  const r = parseLibrettoCsv(template);
  assert.equal(r.imported, 3, "riga di commento ignorata");
  assert.equal(r.skipped, 0);
  const [analisi, ricerca, prog] = r.entries;
  assert.deepEqual(analisi.grade, { kind: "numeric", value: 28, laude: false });
  assert.equal(analisi.date, "2026-02-16");
  assert.deepEqual(ricerca.grade, { kind: "pass" });
  assert.deepEqual(prog.grade, { kind: "numeric", value: 30, laude: true });
});
