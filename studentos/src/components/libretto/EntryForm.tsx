/**
 * Add/edit form for a libretto entry. Mount with key={entry.id} (or "new")
 * so editing a different entry remounts with fresh initial state.
 */
import { useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { DateField } from "@/components/primitives/DateField";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import {
  academicYearOptions,
  currentAcademicYear,
} from "@/lib/domain/academicYear";
import type { LibrettoEntry } from "@/lib/domain/types";

const YEAR_OPTIONS = academicYearOptions();

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
  const [date, setDate] = useState(initial?.date ?? "");
  const [academicYear, setAcademicYear] = useState(
    initial?.academicYear ?? currentAcademicYear(),
  );
  const [teacher, setTeacher] = useState(initial?.teacher ?? "");
  const [exclude, setExclude] = useState(initial?.excludeFromAverage ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // l'anno selezionato potrebbe non essere fra le opzioni recenti (esami vecchi)
  const yearOptions = YEAR_OPTIONS.includes(academicYear)
    ? YEAR_OPTIONS
    : [academicYear, ...YEAR_OPTIONS];

  function validate(): string | null {
    if (!courseName.trim()) return "Indica il nome del corso.";
    const cfuNum = Number(cfu);
    if (!Number.isInteger(cfuNum) || cfuNum < 1 || cfuNum > 60)
      return "I CFU devono essere un intero tra 1 e 60.";
    if (!isPass) {
      const v = Number(value);
      if (!Number.isInteger(v) || v < 18 || v > 30)
        return "Il voto deve essere un intero tra 18 e 30.";
    }
    if (!date) return "Indica la data dell'esame.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;
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
      setDate("");
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
        <Field label="Corso" htmlFor="lib-corso">
          <input
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
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="CFU" htmlFor="lib-cfu">
            <input
              id="lib-cfu"
              type="number"
              min={1}
              max={60}
              value={cfu}
              onChange={(e) => setCfu(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Data" htmlFor="lib-data">
            <DateField id="lib-data" value={date} onChange={setDate} required />
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
            <div className="flex items-center gap-3">
              <label htmlFor="lib-voto" className="sr-only">
                Voto (18–30)
              </label>
              <input
                id="lib-voto"
                type="number"
                min={18}
                max={30}
                value={value}
                onChange={(e) => setValue(e.target.value)}
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

        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
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
