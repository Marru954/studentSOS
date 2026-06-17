/**
 * Add/edit form for a libretto entry. Mount with key={entry.id} (or "new")
 * so editing a different entry remounts with fresh initial state.
 */
import { useRef, useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { DateField } from "@/components/primitives/DateField";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import {
  academicYearOptions,
  currentAcademicYear,
} from "@/lib/domain/academicYear";
import { localToday } from "@/lib/format";
import type { LibrettoEntry } from "@/lib/domain/types";

const YEAR_OPTIONS = academicYearOptions();

/** Which field a validation error belongs to, so it renders inline by it. */
type FieldError = { field: "courseName" | "cfu" | "value" | "date"; message: string };

export function EntryForm({
  initial,
  onSave,
  onCancel,
  className,
}: {
  initial?: LibrettoEntry;
  onSave: (entry: LibrettoEntry) => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [courseName, setCourseName] = useState(initial?.courseName ?? "");
  const [cfu, setCfu] = useState(String(initial?.cfu ?? 6));
  const [isPass, setIsPass] = useState(initial?.grade.kind === "pass");
  const [value, setValue] = useState(
    initial?.grade.kind === "numeric" ? String(initial.grade.value) : "27",
  );
  const [laude, setLaude] = useState(
    initial?.grade.kind === "numeric" ? initial.grade.laude : false,
  );
  // Precompila la data a oggi: il caso comune (esame appena dato) non richiede
  // di compilarla, e l'azione non può più fallire in silenzio per data vuota.
  const [date, setDate] = useState(initial?.date ?? localToday(new Date()));
  const [academicYear, setAcademicYear] = useState(
    initial?.academicYear ?? currentAcademicYear(),
  );
  const [teacher, setTeacher] = useState(initial?.teacher ?? "");
  const [exclude, setExclude] = useState(initial?.excludeFromAverage ?? false);
  const [error, setError] = useState<FieldError | null>(null);
  const [saved, setSaved] = useState(false);

  const courseRef = useRef<HTMLInputElement>(null);
  const cfuRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // l'anno selezionato potrebbe non essere fra le opzioni recenti (esami vecchi)
  const yearOptions = YEAR_OPTIONS.includes(academicYear)
    ? YEAR_OPTIONS
    : [academicYear, ...YEAR_OPTIONS];

  function validate(): FieldError | null {
    if (!courseName.trim())
      return { field: "courseName", message: "Indica il nome del corso." };
    const cfuNum = Number(cfu);
    if (!Number.isInteger(cfuNum) || cfuNum < 1 || cfuNum > 60)
      return { field: "cfu", message: "I CFU devono essere un intero tra 1 e 60." };
    if (!isPass) {
      const v = Number(value);
      if (!Number.isInteger(v) || v < 18 || v > 30)
        return { field: "value", message: "Il voto deve essere un intero tra 18 e 30." };
    }
    if (!date) return { field: "date", message: "Indica la data dell'esame." };
    return null;
  }

  const fieldRefs: Record<FieldError["field"], React.RefObject<HTMLInputElement | null>> = {
    courseName: courseRef,
    cfu: cfuRef,
    value: valueRef,
    date: dateRef,
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) {
      // porta il fuoco sul campo errato: l'errore inline è subito visibile
      // e annunciato, mai nascosto a fondo form sotto la piega
      fieldRefs[problem.field].current?.focus();
      return;
    }
    setSaved(!initial);
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      courseName: courseName.trim(),
      cfu: Number(cfu),
      grade: isPass
        ? { kind: "pass" }
        : { kind: "numeric", value: Number(value), laude: laude && value === "30" },
      date,
      academicYear,
      ...(teacher.trim() ? { teacher: teacher.trim() } : {}),
      ...(exclude ? { excludeFromAverage: true } : {}),
    });
    if (!initial) {
      // l'anno accademico resta selezionato: di solito si aggiungono più esami
      // dello stesso anno di seguito
      setCourseName("");
      setDate(localToday(new Date()));
      setTeacher("");
      setExclude(false);
    }
  }

  return (
    <Panel
      title={initial ? "Modifica esame" : "Registra esame"}
      icon={<PenLine />}
      className={className}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label="Corso"
          htmlFor="lib-corso"
          required
          error={error?.field === "courseName" ? error.message : undefined}
        >
          <input
            ref={courseRef}
            id="lib-corso"
            data-quickadd
            type="text"
            value={courseName}
            onChange={(e) => {
              setCourseName(e.target.value);
              setSaved(false);
            }}
            placeholder="es. Basi di dati"
            required
            aria-invalid={error?.field === "courseName" || undefined}
            aria-describedby={error?.field === "courseName" ? "lib-corso-error" : undefined}
            // scroll-mt: il quick-add/focus scrolla qui; lascia spazio sotto la
            // navbar fissa così il campo non finisce occluso.
            className={`${inputClass} scroll-mt-24`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="CFU"
            htmlFor="lib-cfu"
            required
            error={error?.field === "cfu" ? error.message : undefined}
          >
            <input
              ref={cfuRef}
              id="lib-cfu"
              type="number"
              min={1}
              max={60}
              value={cfu}
              onChange={(e) => setCfu(e.target.value)}
              required
              aria-invalid={error?.field === "cfu" || undefined}
              aria-describedby={error?.field === "cfu" ? "lib-cfu-error" : undefined}
              className={inputClass}
            />
          </Field>
          <Field
            label="Data"
            htmlFor="lib-data"
            required
            error={error?.field === "date" ? error.message : undefined}
          >
            <DateField
              id="lib-data"
              value={date}
              onChange={setDate}
              required
              inputRef={dateRef}
              ariaInvalid={error?.field === "date" || undefined}
              ariaDescribedBy={error?.field === "date" ? "lib-data-error" : undefined}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Anno accademico" htmlFor="lib-anno">
            <select
              id="lib-anno"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={inputClass}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Docente (opzionale)" htmlFor="lib-docente">
            <input
              id="lib-docente"
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="es. Rossi"
              className={inputClass}
            />
          </Field>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-label font-medium text-ink-mute">
            Esito
          </legend>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="esito"
                checked={!isPass}
                onChange={() => setIsPass(false)}
                className="accent-signal"
              />
              Voto
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="esito"
                checked={isPass}
                onChange={() => setIsPass(true)}
                className="accent-signal"
              />
              Idoneità
            </label>
          </div>
          {!isPass && (
            <>
              <div className="flex items-center gap-3">
                <label htmlFor="lib-voto" className="sr-only">
                  Voto (18–30)
                </label>
                <input
                  ref={valueRef}
                  id="lib-voto"
                  type="number"
                  min={18}
                  max={30}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-invalid={error?.field === "value" || undefined}
                  aria-describedby={error?.field === "value" ? "lib-voto-error" : undefined}
                  className={`${inputClass} w-24`}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={laude && value === "30"}
                    disabled={value !== "30"}
                    onChange={(e) => setLaude(e.target.checked)}
                    className="accent-signal"
                  />
                  e lode
                </label>
              </div>
              {error?.field === "value" && (
                <p id="lib-voto-error" role="alert" className="text-xs text-danger">
                  {error.message}
                </p>
              )}
            </>
          )}
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-ink-mute">
          <input
            type="checkbox"
            checked={exclude}
            onChange={(e) => setExclude(e.target.checked)}
            className="accent-signal"
          />
          Escludi dalla media (es. CFU extracurriculari)
        </label>

        {saved && !error && (
          <p role="status" className="text-xs font-medium text-ok">
            Esame aggiunto al libretto. Media e CFU aggiornati.
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            {initial ? "Salva modifiche" : "Aggiungi"}
          </Button>
          {onCancel && (
            <Button type="button" onClick={onCancel}>
              Annulla
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
