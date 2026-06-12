"use client";

/**
 * Import del libretto da un PDF scaricato dal portale Delphi (Tor Vergata).
 * Il PDF viene letto INTERAMENTE nel browser con pdfjs-dist: nessun byte lascia
 * il dispositivo. Estraiamo il testo preservando le colonne (un TAB dove c'è un
 * ampio salto orizzontale), lo passiamo al parser puro (lib/domain/delphiPdf),
 * mostriamo un'anteprima con checkbox e — alla conferma — scriviamo in
 * IndexedDB. Media e CFU si aggiornano in tempo reale (store reattivo).
 */
import { FileUp, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { parseDelphiPdfText, type DelphiPdfResult } from "@/lib/domain/delphiPdf";
import type { Grade } from "@/lib/domain/types";
import { useLibretto } from "@/lib/state/manual";

/** Item di testo restituito da pdfjs (sottoinsieme che ci serve). */
interface PdfTextItem {
  str: string;
  width: number;
  height: number;
  transform: number[];
}

/** Ricostruisce le righe di una pagina: raggruppa per coordinata Y, ordina per
 *  X, e inserisce un TAB dove il salto orizzontale è ampio (confine di colonna)
 *  e uno spazio per i salti piccoli — così il nome del corso resta unito. */
function itemsToLines(items: PdfTextItem[]): string {
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

/** Estrae tutto il testo del PDF lato client. Lazy-import di pdfjs: pesa, e non
 *  deve entrare nel bundle finché l'utente non importa davvero un PDF. */
async function extractDelphiPdfText(file: File): Promise<string> {
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

function gradeLabel(grade: Grade): string {
  if (grade.kind === "pass") return "Idoneo";
  return grade.laude ? "30 e lode" : String(grade.value);
}

export function ImportDelphiPdf() {
  const upsertMany = useLibretto((s) => s.upsertMany);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DelphiPdfResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permette di re-importare lo stesso file
    if (!file) return;
    setBusy(true);
    setError(null);
    setDone(null);
    setResult(null);
    try {
      const text = await extractDelphiPdfText(file);
      const parsed = parseDelphiPdfText(text);
      if (parsed.imported === 0) {
        setError(
          "Nessun esame superato riconosciuto nel PDF. Assicurati di aver " +
            "caricato il libretto/autocertificazione esami di Delphi.",
        );
      } else {
        setResult(parsed);
        setSelected(new Set(parsed.entries.map((en) => en.id)));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `Impossibile leggere il PDF: ${err.message}`
          : "Impossibile leggere il PDF.",
      );
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function confirmImport() {
    if (!result) return;
    const chosen = result.entries.filter((en) => selected.has(en.id));
    await upsertMany(chosen);
    setDone(
      `${chosen.length} ${chosen.length === 1 ? "esame importato" : "esami importati"} dal PDF Delphi.`,
    );
    setResult(null);
    setSelected(new Set());
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Importa il libretto da un PDF di Delphi"
          className="sr-only"
          onChange={onFile}
        />
        <Button
          variant="primary"
          loading={busy}
          onClick={() => inputRef.current?.click()}
        >
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          {busy ? "Lettura del PDF…" : "Importa da PDF Delphi"}
        </Button>
      </div>
      <p className="text-xs text-ink-mute">
        Carica il PDF del libretto scaricato da Delphi (Area Studenti → Esami →
        Esami verbalizzati → stampa/salva come PDF). Il sistema legge
        automaticamente esami, voti, CFU e date. La lettura avviene solo sul tuo
        dispositivo, nessun dato viene caricato online.
      </p>

      {error && (
        <p role="status" className="text-xs text-danger">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="text-xs text-ok">
          {done}
        </p>
      )}

      {result && (
        <div className="mt-1 rounded-md border border-line bg-night-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <FileUp aria-hidden="true" className="size-4 text-ink-mute" />
              <span className="font-medium">
                {result.entries.length} esami superati trovati
              </span>
              {result.rejected.length > 0 && (
                <Badge tone="neutral">
                  {result.rejected.length} non superati ignorati
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  setSelected(new Set(result.entries.map((en) => en.id)))
                }
              >
                Seleziona tutti
              </Button>
              <Button size="sm" onClick={() => setSelected(new Set())}>
                Deseleziona
              </Button>
            </div>
          </div>

          <ul className="max-h-72 divide-y divide-line overflow-y-auto">
            {result.entries.map((en) => {
              const checked = selected.has(en.id);
              return (
                <li key={en.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-night-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(en.id)}
                      className="accent-signal"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {en.courseName}
                    </span>
                    {en.academicYear && (
                      <span className="hidden font-mono text-xs text-ink-mute sm:inline">
                        {en.academicYear}
                      </span>
                    )}
                    <span className="w-10 text-right font-mono text-xs text-ink-mute">
                      {en.cfu} CFU
                    </span>
                    <span className="w-20 text-right">
                      {en.grade.kind === "pass" ? (
                        <Badge tone="neutral">Idoneo</Badge>
                      ) : (
                        <span className="font-mono text-sm">
                          {gradeLabel(en.grade)}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2">
            <span className="text-xs text-ink-mute">
              {selected.size} selezionati. Gli esami idonei vengono salvati ma
              esclusi dalla media.
            </span>
            <div className="flex gap-2">
              <Button onClick={() => setResult(null)}>Annulla</Button>
              <Button
                variant="primary"
                disabled={selected.size === 0}
                onClick={confirmImport}
              >
                Importa {selected.size}{" "}
                {selected.size === 1 ? "esame" : "esami"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
