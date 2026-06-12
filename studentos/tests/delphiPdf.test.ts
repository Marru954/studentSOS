import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { parseDelphiPdfText } from "../src/lib/domain/delphiPdf";
import {
  earnedCfu,
  gradedTotals,
  weightedAverage,
} from "../src/lib/domain/libretto";

// Testo REALE estratto da un PDF "Esami verbalizzati" di Delphi (Tor Vergata)
// con la stessa logica del componente (scripts/dump-pdf-text.ts). È la stampa
// di una tabella HTML: nomi spezzati su più righe, AA/data/crediti incollati,
// e righe RESPINTO/RITIRATO da scartare. Nome/matricola dello studente redatti.
const REAL = readFileSync(
  fileURLToPath(new URL("./fixtures/delphi-esami-verbalizzati.txt", import.meta.url)),
  "utf8",
);

// Atteso (confermato dal piè di pagina del PDF: 6 esami validi 45 CFU,
// 3 idoneità, media ponderata 20.87). Ordinati per data.
const EXPECTED: [string, number, number | "idoneo", string, string][] = [
  ["Logica e Reti Logiche", 6, 24, "2025-02-20", "2024/2025"],
  ["Matematica Discreta", 9, 22, "2025-02-25", "2024/2025"],
  ["Lingua Inglese (Livello B2)", 3, "idoneo", "2025-06-09", "2024/2025"],
  ["Architettura dei Sistemi di Elaborazione", 6, 21, "2025-07-17", "2024/2025"],
  ["Altre Attivita' Formative di Tipo D", 1, "idoneo", "2025-07-23", "2024/2025"],
  ["Programmazione dei Calcolatori con Laboratorio", 9, 18, "2025-09-27", "2024/2025"],
  ["AAS Tipo D", 2, "idoneo", "2026-01-28", "2024/2025"],
  ["Analisi Matematica", 9, 19, "2026-02-16", "2025/2026"],
  ["Ricerca Operativa", 6, 23, "2026-05-19", "2025/2026"],
];

test("real Delphi PDF → exactly 9 exams (RESPINTO/RITIRATO dropped)", () => {
  const r = parseDelphiPdfText(REAL);
  assert.equal(r.imported, 9);

  const byDate = [...r.entries].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 0; i < EXPECTED.length; i++) {
    const [name, cfu, voto, date, aa] = EXPECTED[i];
    const e = byDate[i];
    assert.equal(e.courseName, name, `nome riga ${i + 1}`);
    assert.equal(e.cfu, cfu, `cfu ${name}`);
    assert.equal(e.date, date, `data ${name}`);
    assert.equal(e.academicYear, aa, `anno ${name}`);
    assert.equal(e.source, "manual");
    if (voto === "idoneo") {
      assert.deepEqual(e.grade, { kind: "pass" }, `idoneo ${name}`);
      assert.equal(e.excludeFromAverage, true, `idoneo escluso ${name}`);
    } else {
      assert.deepEqual(
        e.grade,
        { kind: "numeric", value: voto, laude: false },
        `voto ${name}`,
      );
    }
  }
});

test("real Delphi PDF → 6 graded exams, 45 valid CFU, average 20.87", () => {
  const { entries } = parseDelphiPdfText(REAL);
  assert.equal(entries.filter((e) => e.grade.kind === "numeric").length, 6);
  assert.equal(gradedTotals(entries).cfu, 45);
  assert.equal(earnedCfu(entries), 51); // incl. 6 CFU di idoneità
  assert.equal(weightedAverage(entries)?.toFixed(2), "20.87");
});

test("30L and '30 e lode' become 30 with lode", () => {
  const a = parseDelphiPdfText(
    "8000001 Fisica SMFN- 1 FIS/01 2024/202510/06/20259.0 30L 0049999",
  );
  assert.deepEqual(a.entries[0].grade, { kind: "numeric", value: 30, laude: true });
});

test("junk text without a valid course-code window is ignored", () => {
  const r = parseDelphiPdfText(
    "Pagina 1 di 2 — stampato il 12/06/2026 — riepilogo carriera",
  );
  assert.equal(r.imported, 0);
});
