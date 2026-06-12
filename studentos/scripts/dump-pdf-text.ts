/** Estrae il testo di un PDF (stessa logica del componente) e lo scrive su
 *  stdout, per generare le fixture di test. Uso:
 *    tsx scripts/dump-pdf-text.ts <file.pdf> > tests/fixtures/x.txt */
import { readFile } from "node:fs/promises";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

interface PdfTextItem { str: string; width: number; height: number; transform: number[] }

function itemsToLines(items: PdfTextItem[]): string {
  const rows = new Map<number, PdfTextItem[]>();
  for (const it of items) {
    if (!it.str || !it.str.trim() || !it.transform) continue;
    const y = Math.round(it.transform[5] / 3) * 3;
    (rows.get(y) ?? rows.set(y, []).get(y)!).push(it);
  }
  const lines: string[] = [];
  for (const y of [...rows.keys()].sort((a, b) => b - a)) {
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
  const data = new Uint8Array(await readFile(process.argv[2]));
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    pages.push(
      itemsToLines((await (await doc.getPage(p)).getTextContent()).items as PdfTextItem[]),
    );
  }
  process.stdout.write(pages.join("\n"));
}

main();
