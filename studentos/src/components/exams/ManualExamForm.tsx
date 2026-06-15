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
import { useId, useState } from "react";
import { Button } from "@/components/primitives/Button";
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

export function ManualExamForm({ courses }: { courses: string[] }) {
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  const [courseName, setCourseName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [kind, setKind] = useState<ExamKind>("written");
  const [teacher, setTeacher] = useState("");

  const baseId = useId();
  const courseListId = `${baseId}-courses`;

  function reset() {
    setCourseName("");
    setDate("");
    setTime("");
    setRoom("");
    setKind("written");
    setTeacher("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = courseName.trim();
    if (!name || !date) return;
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
            <Field label="Corso" htmlFor={`${baseId}-course`} className="sm:col-span-2">
              <input
                id={`${baseId}-course`}
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                list={courseListId}
                autoComplete="off"
                placeholder="Nome dell'insegnamento"
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

            <Field label="Data" htmlFor={`${baseId}-date`}>
              <input
                id={`${baseId}-date`}
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
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
            <Button type="submit" variant="primary" disabled={!courseName.trim() || !date}>
              <CalendarPlus aria-hidden="true" className="size-4" />
              Aggiungi appello
            </Button>
          </div>
        </form>
      </div>
    </details>
  );
}
