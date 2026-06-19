"use client";

import { Info, PlusCircle, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Field, inputClass } from "@/components/primitives/Field";
import { cn } from "@/lib/cn";
import type { Insegnamento, TipoInsegnamento } from "@/types/insegnamenti";

type FormField = "nome" | "cfu";

type DraftInsegnamento = Omit<Insegnamento, "id" | "created_at" | "updated_at">;

const SEMESTRE_OPTIONS = [
  { value: "",         label: "— non specificato —" },
  { value: "1",        label: "1° semestre" },
  { value: "2",        label: "2° semestre" },
  { value: "annuale",  label: "Annuale" },
];

const ANNO_OPTIONS = [
  { value: "",  label: "— non specificato —" },
  { value: "1", label: "I Anno" },
  { value: "2", label: "II Anno" },
  { value: "3", label: "III Anno" },
  { value: "4", label: "IV Anno" },
  { value: "5", label: "V Anno" },
];

const TIPO_OPTIONS: { value: TipoInsegnamento; label: string }[] = [
  { value: "obbligatorio", label: "Obbligatorio" },
  { value: "scelta",       label: "A scelta" },
  { value: "altro",        label: "Altro" },
];

export function InsegnamentoManualForm({
  onSubmit,
  onCancel,
  ateneo_id = "",
  corso_id = "",
  initial,
  notice,
  title = "Nuovo insegnamento",
  submitLabel = "Aggiungi",
}: {
  onSubmit: (ins: DraftInsegnamento) => void;
  onCancel: () => void;
  ateneo_id?: string;
  corso_id?: string;
  /** Pre-fill per la modifica di una materia esistente. */
  initial?: Insegnamento;
  /** Avviso mostrato in cima al form (es. modifica di una materia da sync). */
  notice?: string;
  /** Titolo della card form. */
  title?: string;
  /** Etichetta del bottone di conferma. */
  submitLabel?: string;
}) {
  const baseId = useId();

  const [nome, setNome] = useState(initial?.nome ?? "");
  const [codice, setCodice] = useState(initial?.codice ?? "");
  const [cfu, setCfu] = useState(initial ? String(initial.cfu) : "");
  const [anno, setAnno] = useState(initial?.anno ?? "");
  const [semestre, setSemestre] = useState(
    initial?.semestre !== undefined ? String(initial.semestre) : "",
  );
  const [tipo, setTipo] = useState<TipoInsegnamento>(initial?.tipo ?? "obbligatorio");
  const [docente, setDocente] = useState(initial?.docente ?? "");
  const [settore, setSettore] = useState(initial?.settore ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [propedeuticita, setPropedeuticita] = useState<string[]>(
    initial?.propedeuticita ?? [],
  );
  const [propInput, setPropInput] = useState("");

  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);
  const cfuRef  = useRef<HTMLInputElement>(null);

  const cfuNum = Number(cfu);
  const errors: Partial<Record<FormField, string>> = {};
  if (!nome.trim())               errors.nome = "Inserisci il nome dell'insegnamento.";
  if (!cfu || isNaN(cfuNum) || cfuNum < 1 || cfuNum > 30)
    errors.cfu = "CFU deve essere un numero tra 1 e 30.";
  const isValid = Object.keys(errors).length === 0;

  function errorOf(f: FormField) {
    return touched[f] || submitAttempted ? errors[f] : undefined;
  }

  function focusFirst() {
    if (errors.nome) nomeRef.current?.focus();
    else if (errors.cfu) cfuRef.current?.focus();
  }

  function addPropedeuticita() {
    const val = propInput.trim();
    if (!val || propedeuticita.includes(val)) return;
    setPropedeuticita((prev) => [...prev, val]);
    setPropInput("");
  }

  function removePropedeuticita(tag: string) {
    setPropedeuticita((prev) => prev.filter((p) => p !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setSubmitAttempted(true);
      focusFirst();
      return;
    }
    const draft: DraftInsegnamento = {
      ateneo_id: initial?.ateneo_id ?? ateneo_id,
      corso_id: initial?.corso_id ?? corso_id,
      nome: nome.trim(),
      codice: codice.trim() || undefined,
      cfu: cfuNum,
      anno:  anno  || undefined,
      semestre: semestre || undefined,
      tipo,
      docente:  docente.trim()  || undefined,
      settore:  settore.trim()  || undefined,
      propedeuticita: propedeuticita.length ? propedeuticita : undefined,
      note: note.trim() || undefined,
      // Editing a sync row keeps its provenance (`false`); new rows are manual.
      superata: initial?.superata ?? false,
      inserito_manualmente: initial?.inserito_manualmente ?? true,
    };
    onSubmit(draft);
  }

  return (
    <div
      className="glass rounded-lg border border-line p-5"
      role="region"
      aria-label="Modulo insegnamento"
    >
      <h2 className="mb-4 text-base font-semibold text-ink [font-family:var(--font-display)]">
        {title}
      </h2>

      {notice && (
        <p className="mb-4 flex items-start gap-2 rounded-lg border border-signal/30 bg-signal-dim px-3 py-2 text-sm text-signal">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Nome */}
          <Field
            label="Nome"
            htmlFor={`${baseId}-nome`}
            required
            error={errorOf("nome")}
            className="sm:col-span-2"
          >
            <input
              ref={nomeRef}
              id={`${baseId}-nome`}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
              placeholder="es. Algoritmi e Strutture Dati"
              aria-invalid={errorOf("nome") ? true : undefined}
              aria-describedby={errorOf("nome") ? `${baseId}-nome-error` : undefined}
              className={inputClass}
            />
          </Field>

          {/* Codice */}
          <Field label="Codice" htmlFor={`${baseId}-codice`}>
            <input
              id={`${baseId}-codice`}
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="es. 8037488"
              className={inputClass}
            />
          </Field>

          {/* CFU */}
          <Field
            label="CFU"
            htmlFor={`${baseId}-cfu`}
            required
            error={errorOf("cfu")}
          >
            <input
              ref={cfuRef}
              id={`${baseId}-cfu`}
              type="number"
              min={1}
              max={30}
              value={cfu}
              onChange={(e) => setCfu(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, cfu: true }))}
              placeholder="es. 9"
              aria-invalid={errorOf("cfu") ? true : undefined}
              aria-describedby={errorOf("cfu") ? `${baseId}-cfu-error` : undefined}
              className={inputClass}
            />
          </Field>

          {/* Tipo */}
          <Field label="Tipo" htmlFor={`${baseId}-tipo`}>
            <select
              id={`${baseId}-tipo`}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoInsegnamento)}
              className={inputClass}
            >
              {TIPO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Anno */}
          <Field label="Anno di corso" htmlFor={`${baseId}-anno`}>
            <select
              id={`${baseId}-anno`}
              value={anno}
              onChange={(e) => setAnno(e.target.value)}
              className={inputClass}
            >
              {ANNO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Semestre */}
          <Field label="Semestre" htmlFor={`${baseId}-semestre`}>
            <select
              id={`${baseId}-semestre`}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className={inputClass}
            >
              {SEMESTRE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Docente */}
          <Field label="Docente" htmlFor={`${baseId}-docente`}>
            <input
              id={`${baseId}-docente`}
              type="text"
              value={docente}
              onChange={(e) => setDocente(e.target.value)}
              placeholder="Facoltativo"
              className={inputClass}
            />
          </Field>

          {/* Settore SSD */}
          <Field label="Settore (SSD)" htmlFor={`${baseId}-settore`}>
            <input
              id={`${baseId}-settore`}
              type="text"
              value={settore}
              onChange={(e) => setSettore(e.target.value)}
              placeholder="es. INF/01"
              className={inputClass}
            />
          </Field>

          {/* Propedeuticità */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label
              htmlFor={`${baseId}-prop`}
              className="text-label font-medium text-ink-mute"
            >
              Propedeuticità
            </label>
            <div className="flex gap-2">
              <input
                id={`${baseId}-prop`}
                type="text"
                value={propInput}
                onChange={(e) => setPropInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPropedeuticita();
                  }
                }}
                placeholder="Nome prerequisito, poi Invio"
                className={cn(inputClass, "flex-1")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPropedeuticita}
                aria-label="Aggiungi propedeuticità"
              >
                <PlusCircle aria-hidden="true" className="size-4" />
              </Button>
            </div>
            {propedeuticita.length > 0 && (
              <div
                className="mt-2 flex flex-wrap gap-1.5"
                aria-label="Propedeuticità aggiunte"
              >
                {propedeuticita.map((tag) => (
                  <span
                    key={tag}
                    className="chip flex items-center gap-1 pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removePropedeuticita(tag)}
                      aria-label={`Rimuovi propedeuticità ${tag}`}
                      className="rounded-full p-0.5 hover:bg-night-700"
                    >
                      <X aria-hidden="true" className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note personali */}
          <Field
            label="Note personali"
            htmlFor={`${baseId}-note`}
            className="sm:col-span-2"
          >
            <textarea
              id={`${baseId}-note`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Facoltative — restano private, salvate sul dispositivo"
              className={cn(inputClass, "h-auto resize-y py-2")}
            />
          </Field>
        </div>

        {/* Azioni */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annulla
          </Button>
          <div className="relative inline-flex">
            <Button type="submit" variant="primary" disabled={!isValid}>
              <PlusCircle aria-hidden="true" className="size-4" />
              {submitLabel}
            </Button>
            {!isValid && (
              <button
                type="button"
                onClick={() => {
                  setSubmitAttempted(true);
                  focusFirst();
                }}
                aria-label="Mostra errori di validazione"
                className="absolute inset-0 cursor-not-allowed"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
