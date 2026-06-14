/**
 * Layout reconstruction for pdfjs text content. Pure, framework-free: turns the
 * positioned text items of a PDF page back into newline-separated lines with
 * TABs at column boundaries, so a column-aware parser (e.g. lib/domain/delphiPdf)
 * can read it. Shared by the in-browser importer (components/libretto/
 * ImportDelphiPdf.tsx) and the headless verify script (scripts/verify-delphi-pdf.ts).
 */

/** Item di testo restituito da pdfjs (sottoinsieme che ci serve). */
export interface PdfTextItem {
  str: string;
  width: number;
  height: number;
  transform: number[];
}

/** Ricostruisce le righe di una pagina: raggruppa per coordinata Y, ordina per
 *  X, e inserisce un TAB dove il salto orizzontale è ampio (confine di colonna)
 *  e uno spazio per i salti piccoli — così il nome del corso resta unito. */
export function itemsToLines(items: PdfTextItem[]): string {
  const rows = new Map<number, PdfTextItem[]>();
  for (const it of items) {
    // pdfjs intercala "marked content" senza testo né transform: ignorali.
    if (!it.str || !it.str.trim() || !it.transform) continue;
    const y = Math.round(it.transform[5] / 3) * 3; // tolleranza ~3pt
    (rows.get(y) ?? rows.set(y, []).get(y)!).push(it);
  }
  const ys = [...rows.keys()].sort((a, b) => b - a); // PDF: Y cresce verso l'alto
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
