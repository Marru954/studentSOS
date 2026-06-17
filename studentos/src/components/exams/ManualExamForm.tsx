"use client";

/**
 * Manual exam entry for students without a live sync. The new appello is
 * written to the SAME `examCalls` IndexedDB store as synced exams, under a
 * `manual-anno-N` sentinel sourceId. That sentinel is never one of the
 * enabled sync sources, so `repo.replaceSourceData` (which only deletes rows
 * matching an *enabled* source) never touches it; and `yearOfSource()` parses
 * the trailing `anno-N`, so the row still honours the year filter. After the
 * write we call `useSynced.refresh()` because the synced store's `hydrate()`
 * early-returns once hydrated and so wouldn't surface the new row.
 *
 * Native <details> keeps the collapse keyboard-accessible (mirrors CoursePicker).
 */
import { CalendarPlus } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { DateField } from "@/components/primitives/DateField";
import { Field, inputClass } from "@/components/primitives/Field";
import { putExamCall } from "@/lib/storage/repo";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import type { ExamKind } from "@/lib/domain/types";

const KIND_OPTIONS: { value: ExamKind; label: string }[] = [
  { value: "written", label: "Scritto" },
  { value: "oral", label: "Orale" },
  { value: "written+oral", label: "Scritto e orale" },
];

/** Which required field an inline validation message belongs to. */
type ExamField = "courseName" | "date";

export function ManualExamForm({ courses }: { courses: string[] }) {
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  const [courseName, setCourseName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [kind, setKind] = useState<ExamKind>("written");
  const [teacher, setTeacher] = useState("");

  // Un campo mostra l'errore solo dopo che è stato toccato (blur) o dopo un
  // tentativo di submit — non mentre l'utente sta ancora digitando.
  const [touched, setTouched] = useState<Partial<Record<ExamField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const courseRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const baseId = useId();
  const courseListId = `${baseId}-courses`;

  // Errori grezzi per campo (sempre calcolati); la visibilità è decisa sotto.
  const errors: Partial<Record<ExamField, string>> = {};
  if (!courseName.trim()) errors.courseName = "Inserisci il nome dell'esame.";
  if (!date) errors.date = "Inserisci una data valida.";
  const isValid = Object.keys(errors).length === 0;

  const fieldRefs: Record<ExamField, React.RefObject<HTMLInputElement | null>> = {
    courseName: courseRef,
    date: dateRef,
  };

  /** L'errore di un campo si vede solo se toccato o dopo un tentativo di submit. */
  function errorOf(field: ExamField): string | undefined {
    return touched[field] || submitAttempted ? errors[field] : undefined;
  }

  /** Porta il fuoco sul primo campo invalido così l'errore inline è subito visibile. */
  function focusFirstError() {
    const first = (["courseName", "date"] as ExamField[]).find((f) => errors[f]);
    if (first) fieldRefs[first].current?.focus();
  }

  /** Clic sul pulsante disabilitato: rivela gli errori e spiega perché non funziona. */
  function revealErrors() {
    setSubmitAttempted(true);
    focusFirstError();
  }

  function reset() {
    setCourseName("");
    setDate("");
    setTime("");
    setRoom("");
    setKind("written");
    setTeacher("");
    setTouched({});
    setSubmitAttempted(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setSubmitAttempted(true);
      focusFirstError();
      return;
    }
    const name = courseName.trim();
    try {
      await putExamCall({
        id: crypto.randomUUID(),
        courseName: name,
        date,
        time: time || undefined,
        room: room.trim() || undefined,
        kind,
        teacher: teacher.trim() || undefined,
        sourceId: `manual-anno-${yearOfStudy ?? 1}`,
      });
    } catch {
      useToast
        .getState()
        .show("Salvataggio non riuscito. Riprova.", "danger");
      return;
    }
    useSynced.getState().refresh();
    useToast.getState().show("Appello aggiunto.", "ok");
    reset();
  }

  return (
    <details id="aggiungi-appello" className="glass rounded-lg border border-line shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-night-900 [&::-webkit-details-marker]:hidden">
        <CalendarPlus aria-hidden="true" className="size-4 text-signal" />
        Aggiungi un appello
        <span className="ml-auto text-xs font-normal text-ink-mute">
          inserisci manualmente una data d&rsquo;esame
        </span>
      </summary>
      <div className="border-t border-line p-4">
        <form
          onSubmit={handleSubmit}
          aria-label="Aggiungi un appello manualmente"
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Corso"
              htmlFor={`${baseId}-course`}
              required
              error={errorOf("courseName")}
              className="sm:col-span-2"
            >
              <input
                ref={courseRef}
                id={`${baseId}-course`}
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, courseName: true }))}
                list={courseListId}
                autoComplete="off"
                placeholder="Nome dell'insegnamento"
                aria-invalid={errorOf("courseName") ? true : undefined}
                aria-describedby={
                  errorOf("courseName") ? `${baseId}-course-error` : undefined
                }
                className={inputClass}
              />
              {courses.length > 0 && (
                <datalist id={courseListId}>
                  {courses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              )}
            </Field>

            <Field
              label="Data"
              htmlFor={`${baseId}-date`}
              required
              error={errorOf("date")}
            >
              <DateField
                id={`${baseId}-date`}
                required
                value={date}
                onChange={setDate}
                inputRef={dateRef}
                onBlur={() => setTouched((t) => ({ ...t, date: true }))}
                ariaInvalid={errorOf("date") ? true : undefined}
                ariaDescribedBy={errorOf("date") ? `${baseId}-date-error` : undefined}
              />
            </Field>

            <Field label="Ora" htmlFor={`${baseId}-time`}>
              <input
                id={`${baseId}-time`}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Aula" htmlFor={`${baseId}-room`}>
              <input
                id={`${baseId}-room`}
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="es. Aula 3"
                className={inputClass}
              />
            </Field>

            <Field label="Tipo" htmlFor={`${baseId}-kind`}>
              <select
                id={`${baseId}-kind`}
                value={kind}
                onChange={(e) => setKind(e.target.value as ExamKind)}
                className={inputClass}
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Docente" htmlFor={`${baseId}-teacher`} className="sm:col-span-2">
              <input
                id={`${baseId}-teacher`}
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Facoltativo"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex justify-end">
            {/* Pulsante disabilitato finché il form non è valido; l'overlay
                cattura il clic per rivelare gli errori (un <button disabled>
                non emette eventi), così l'utente capisce perché non funziona. */}
            <div className="relative inline-flex">
              <Button type="submit" variant="primary" disabled={!isValid}>
                <CalendarPlus aria-hidden="true" className="size-4" />
                Aggiungi appello
              </Button>
              {!isValid && (
                <button
                  type="button"
                  onClick={revealErrors}
                  aria-label="Mostra perché non puoi aggiungere l'appello"
                  className="absolute inset-0 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </details>
  );
}
