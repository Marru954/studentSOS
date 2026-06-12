/**
 * Verifica end-to-end dell'import PDF Delphi su un file reale, senza browser:
 * estrae il testo con pdfjs (build legacy, gira in Node) usando la STESSA
 * logica del componente (itemsToLines), poi passa al parser puro.
 *
 *   ./node_modules/.bin/tsx scripts/verify-delphi-pdf.ts "<path/al.pdf>"
 */
import { readFile } from "node:fs/promises";
// build legacy: funziona in Node (niente DOM/worker del browser)
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { parseDelphiPdfText } from "../src/lib/domain/delphiPdf";
import { earnedCfu, gradedTotals, weightedAverage } from "../src/lib/domain/libretto";

interface PdfTextItem {
  str: string;
  width: number;
  height: number;
  transform: number[];
}

// Copia 1:1 di components/libretto/ImportDelphiPdf.tsx → itemsToLines.
function itemsToLines(items: PdfTextItem[]): string {
  const rows = new Map<number, PdfTextItem[]>();
  for (const it of items) {
    if (!it.str || !it.str.trim() || !it.transform) continue;
    const y = Math.round(it.transform[5] / 3) * 3;
    (rows.get(y) ?? rows.set(y, []).get(y)!).push(it);
  }
  const ys = [...rows.keys()].sort((a, b) => b - a);
  const lines: string[] = [];
  for (const y of ys) {
    const cells = rows.get(y)!.sort((a, b) => a.transform[4] - b.transform[4]);
    let line = "";
    let prevEnd: number | null = null;
    for (const c of cells) {
      const x = c.transform[4];
      if (prevEnd !== null) {
        const gap = x - prevEnd;
        const big = Math.max(8, c.height * 0.6);
        line += gap > big ? "\t" : gap > c.height * 0.15 ? " " : "";
      }
      line += c.str;
      prevEnd = x + c.width;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

async function main() {
  const path = process.argv[2];
  if (!path) throw new Error("Uso: tsx scripts/verify-delphi-pdf.ts <file.pdf>");

  const data = new Uint8Array(await readFile(path));
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    pages.push(itemsToLines(content.items as PdfTextItem[]));
  }
  const text = pages.join("\n");

  const r = parseDelphiPdfText(text);
  console.log(`\n=== ${path} (${doc.numPages} pagine) ===\n`);
  console.log("Esami estratti:", r.imported);
  for (const e of [...r.entries].sort((a, b) => a.date.localeCompare(b.date))) {
    const voto =
      e.grade.kind === "pass"
        ? "Idoneo"
        : `${e.grade.value}${e.grade.laude ? "L" : ""}`;
    console.log(
      `  ${e.date}  ${String(e.cfu).padStart(2)}CFU  ${voto.padEnd(7)} ${e.academicYear}  ${e.courseName}`,
    );
  }
  if (r.rejected.length) {
    console.log("\nScartati (non superati):");
    for (const x of r.rejected) console.log(`  - ${x.courseName}`);
  }
  if (r.errors.length) console.log("\nErrori:", r.errors);

  const avg = weightedAverage(r.entries);
  console.log("\n--- Totali ---");
  console.log("CFU validi (pesano sulla media):", gradedTotals(r.entries).cfu);
  console.log("CFU totali (incl. idoneità):", earnedCfu(r.entries));
  console.log("Media ponderata:", avg?.toFixed(2));

  const ok =
    r.imported === 9 &&
    gradedTotals(r.entries).cfu === 45 &&
    avg?.toFixed(2) === "20.87";
  console.log(`\nATTESO 9 esami / 45 CFU / 20.87 → ${ok ? "OK ✅" : "NO ❌"}\n`);
  if (!ok) {
    console.log("--- testo grezzo estratto (per taratura) ---\n");
    console.log(text);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
