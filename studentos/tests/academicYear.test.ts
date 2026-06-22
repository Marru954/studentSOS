import assert from "node:assert/strict";
import { test } from "node:test";
import {
  academicYearOptions,
  currentAcademicYear,
  normalizeAcademicYear,
} from "@/lib/domain/academicYear";

// ── currentAcademicYear ─────────────────────────────────────────────────────

test("data in primavera (gennaio) restituisce l'anno accademico dell'inverno corrente", () => {
  // 15 gennaio 2026 → mese 0 (< 8) → anno accademico 2025/2026
  const now = new Date("2026-01-15T12:00:00.000Z");
  assert.equal(currentAcademicYear(now), "2025/2026");
});

test("data in estate (luglio) restituisce l'anno accademico dell'estate corrente", () => {
  // 10 luglio 2025 → mese 6 (< 8) → anno accademico 2024/2025
  const now = new Date("2025-07-10T12:00:00.000Z");
  assert.equal(currentAcademicYear(now), "2024/2025");
});

test("data in autunno (settembre) apre il nuovo anno accademico", () => {
  // 1 settembre 2025 → mese 8 (>= 8) → anno accademico 2025/2026
  const now = new Date("2025-09-01T12:00:00.000Z");
  assert.equal(currentAcademicYear(now), "2025/2026");
});

test("confine esatto: agosto ancora nell'anno vecchio, settembre nel nuovo", () => {
  // Usiamo il 15 di ogni mese per evitare ambiguità di fuso orario
  const agosto = new Date("2025-08-15T12:00:00.000Z");
  const settembre = new Date("2025-09-15T12:00:00.000Z");
  assert.equal(currentAcademicYear(agosto), "2024/2025");
  assert.equal(currentAcademicYear(settembre), "2025/2026");
});

test("data in dicembre restituisce l'anno accademico appena aperto in autunno", () => {
  // 20 dicembre 2024 → mese 11 (>= 8) → anno accademico 2024/2025
  const now = new Date("2024-12-20T12:00:00.000Z");
  assert.equal(currentAcademicYear(now), "2024/2025");
});

// ── academicYearOptions ─────────────────────────────────────────────────────

test("academicYearOptions ritorna il numero corretto di voci con l'anno corrente in cima (primavera)", () => {
  // gennaio 2026 → corrente è 2025/2026
  const now = new Date("2026-01-15T12:00:00.000Z");
  const opts = academicYearOptions(now, 5);
  assert.equal(opts.length, 5);
  assert.equal(opts[0], "2025/2026");
});

test("academicYearOptions con data autunnale: anno corrente 2025/2026 in cima", () => {
  // ottobre 2025 → corrente è 2025/2026
  const now = new Date("2025-10-10T12:00:00.000Z");
  const opts = academicYearOptions(now, 3);
  assert.equal(opts.length, 3);
  assert.equal(opts[0], "2025/2026");
  assert.equal(opts[1], "2024/2025");
  assert.equal(opts[2], "2023/2024");
});

test("academicYearOptions ritorna voci in ordine strettamente decrescente", () => {
  const now = new Date("2026-06-22T12:00:00.000Z");
  const opts = academicYearOptions(now, 9);
  for (let i = 0; i < opts.length - 1; i++) {
    const startA = Number(opts[i].slice(0, 4));
    const startB = Number(opts[i + 1].slice(0, 4));
    assert.ok(startA > startB, `${opts[i]} dovrebbe precedere ${opts[i + 1]}`);
  }
});

test("academicYearOptions con count=1 ritorna solo l'anno corrente", () => {
  const now = new Date("2025-03-01T12:00:00.000Z");
  const opts = academicYearOptions(now, 1);
  assert.equal(opts.length, 1);
  assert.equal(opts[0], "2024/2025");
});

// ── normalizeAcademicYear ───────────────────────────────────────────────────

test("normalizeAcademicYear: formato slash pieno '2023/2024' → '2023/2024'", () => {
  assert.equal(normalizeAcademicYear("2023/2024"), "2023/2024");
});

test("normalizeAcademicYear: formato trattino '2023-2024' → '2023/2024'", () => {
  assert.equal(normalizeAcademicYear("2023-2024"), "2023/2024");
});

test("normalizeAcademicYear: formato anno breve '2023/24' → '2023/2024'", () => {
  assert.equal(normalizeAcademicYear("2023/24"), "2023/2024");
});

test("normalizeAcademicYear: anno singolo '2023' → '2023/2024'", () => {
  assert.equal(normalizeAcademicYear("2023"), "2023/2024");
});

test("normalizeAcademicYear: stringa vuota → undefined", () => {
  assert.equal(normalizeAcademicYear(""), undefined);
});

test("normalizeAcademicYear: stringa malformata senza cifre → undefined", () => {
  assert.equal(normalizeAcademicYear("anno accademico"), undefined);
});

test("normalizeAcademicYear: formato parzialmente errato '23/2024' → undefined", () => {
  // Il primo gruppo richiede esattamente 4 cifre
  assert.equal(normalizeAcademicYear("23/2024"), undefined);
});

test("normalizeAcademicYear: spazi attorno vengono ignorati", () => {
  assert.equal(normalizeAcademicYear("  2022/2023  "), "2022/2023");
});

test("normalizeAcademicYear: spazi attorno al separatore '2022 / 2023' → '2022/2023'", () => {
  assert.equal(normalizeAcademicYear("2022 / 2023"), "2022/2023");
});
