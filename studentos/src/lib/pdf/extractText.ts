/**
 * Client-side PDF → plain text. Same approach as the Delphi libretto importer
 * (components/libretto/ImportDelphiPdf.tsx): pdfjs runs entirely in the browser
 * — no byte ever leaves the device — and every page's positioned text is
 * reflowed into TAB/newline-separated lines via the shared `itemsToLines`
 * (lib/domain/pdfLayout), so a downstream parser (here, an AI) reads readable,
 * column-aware text instead of a jumble.
 *
 * Imported only from "use client" components, so it lands in the client bundle;
 * the worker URL is resolved the Turbopack-friendly `new URL(...)` way.
 */
import { itemsToLines, type PdfTextItem } from "@/lib/domain/pdfLayout";

/** Extract the full text of an uploaded PDF, pages joined by newlines. */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const pages: string[] = [];
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      pages.push(itemsToLines(content.items as PdfTextItem[]));
    }
  } finally {
    await loadingTask.destroy();
  }
  return pages.join("\n");
}
