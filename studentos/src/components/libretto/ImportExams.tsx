"use client";

/**
 * Import in blocco degli esami da file CSV (Excel: "Salva come CSV").
 * Colonne: corso, cfu, voto, data, anno_accademico. Il parsing è puro
 * (lib/domain/csv); qui gestiamo file, scrittura in IndexedDB e feedback.
 */
import { FileDown, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { parseLibrettoCsv } from "@/lib/domain/csv";
import { useLibretto } from "@/lib/state/manual";

const TEMPLATE = `# Formati accettati: voto da 18 a 30, "30L" per la lode, "Idoneo" per le idoneità, data in formato gg/mm/aaaa. Sostituisci le righe di esempio con i tuoi esami.
corso,cfu,voto,data,anno_accademico
Analisi Matematica,9,28,16/02/2026,2025/2026
Ricerca Operativa,6,Idoneo,19/05/2026,2025/2026
Programmazione,9,30L,27/09/2025,2024/2025
`;

interface Feedback {
  ok: boolean;
  text: string;
  errors: string[];
}

export function ImportExams() {
  const upsertMany = useLibretto((s) => s.upsertMany);
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permette di re-importare lo stesso file
    if (!file) return;
    const text = await file.text();
    const result = parseLibrettoCsv(text);
    if (result.entries.length > 0) await upsertMany(result.entries);
    setFeedback({
      ok: result.imported > 0,
      text:
        result.imported > 0
          ? `${result.imported} esami importati${result.skipped ? `, ${result.skipped} saltati` : ""}.`
          : "Nessun esame importato.",
      errors: result.errors.slice(0, 6),
    });
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([TEMPLATE], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "modello-libretto.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id="import-csv"
          type="file"
          accept=".csv,text/csv,text/plain"
          aria-label="Importa esami da file CSV"
          className="sr-only"
          onChange={onFile}
        />
        <Button onClick={() => inputRef.current?.click()}>
          <Upload aria-hidden="true" className="size-3.5" />
          Importa da CSV
        </Button>
        <Button size="sm" onClick={downloadTemplate}>
          <FileDown aria-hidden="true" className="size-3.5" />
          Scarica modello
        </Button>
      </div>
      <p className="text-xs text-ink-mute">
        Carica un file CSV con i tuoi esami (utile se tieni già un foglio Excel
        o vuoi aggiungere esami non ancora su Delphi). Scarica prima il modello
        qui sopra per avere il formato corretto delle colonne.
      </p>
      {feedback && (
        <div role="status" className="text-xs">
          <p className={feedback.ok ? "text-ok" : "text-danger"}>{feedback.text}</p>
          {feedback.errors.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-ink-mute">
              {feedback.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
