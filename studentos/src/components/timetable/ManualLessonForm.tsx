"use client";

/**
 * Manual lesson entry for students without a live sync. A lesson is a *weekly
 * series*: the WeekView filters `classEvents` to the visible week, so a single
 * recurring lesson must be materialized as one ClassEvent row per week. We
 * generate rows from 4 weeks before the current Monday through 20 weeks after,
 * so both back- and forward-navigation surface the lesson.
 *
 * Storage layout — the same sentinel trick as ManualExamForm:
 *  - seriesId = crypto.randomUUID(); each instance id = `manual:${seriesId}:${isoDate}`
 *    (isoDate = YYYY-MM-DD of that week's occurrence), so a whole series is
 *    deletable by id prefix.
 *  - sourceId = `manual-anno-${yearOfStudy ?? 1}`. `replaceSourceData` only
 *    deletes rows whose sourceId matches an *enabled* sync source, so manual
 *    rows survive every sync; and `yearOfSource()` parses the trailing
 *    `anno-N`, so the row passes WeekView's year filter (which defaults to the
 *    student's year).
 *
 * Edit semantics: editing deletes the existing series and writes a fresh one
 * from the edited values — the simplest correct approach (no in-place mutation
 * of individual occurrences).
 *
 * Native <details> keeps the collapse keyboard-accessible (mirrors CoursePicker).
 */
import { CalendarPlus } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Field, inputClass } from "@/components/primitives/Field";
import type { ClassEvent, ClassEventKind } from "@/lib/domain/types";
import { addDays, localToday, mondayOf } from "@/lib/format";
import {
  deleteClassEventSeries,
  putClassEvents,
} from "@/lib/storage/repo";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";

/** A manual weekly lesson, as the form holds it. `seriesId` is present only
 *  when editing an existing series (so submit can replace it first). */
export interface ManualLessonDraft {
  seriesId?: string;
  courseName: string;
  /** 1 = Lunedì … 7 = Domenica (ISO weekday). */
  weekday: number;
  /** "HH:MM" local start. */
  startTime: string;
  /** "HH:MM" local end. */
  endTime: string;
  room?: string;
  kind: ClassEventKind;
}

/** Only the three kinds a manual entry can pick (lab/lecture/exercise). */
const KIND_OPTIONS: { value: ClassEventKind; label: string }[] = [
  { value: "lecture", label: "Lezione" },
  { value: "lab", label: "Laboratorio" },
  { value: "exercise", label: "Esercitazione" },
];

const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Lunedì" },
  { value: 2, label: "Martedì" },
  { value: 3, label: "Mercoledì" },
  { value: 4, label: "Giovedì" },
  { value: 5, label: "Venerdì" },
  { value: 6, label: "Sabato" },
  { value: 7, label: "Domenica" },
];

/** Weeks of occurrences to materialize around "today". */
const WEEKS_BEFORE = 4;
const WEEKS_AFTER = 20;

/** "HH:MM" → [hours, minutes]. */
function parseTime(value: string): [number, number] {
  const [h, m] = value.split(":");
  return [Number(h), Number(m)];
}

/**
 * Build a manual weekly series as concrete ClassEvent rows. For every week
 * from `WEEKS_BEFORE` before the current Monday through `WEEKS_AFTER` after, we
 * place the lesson on the chosen weekday and build start/end ISO datetimes from
 * the local wall-clock time via `new Date(y, m, d, hh, mm)` (local → UTC).
 */
export function buildManualLessonSeries(
  draft: ManualLessonDraft,
  seriesId: string,
  yearOfStudy: number | undefined,
  now: Date,
): ClassEvent[] {
  const [sh, sm] = parseTime(draft.startTime);
  const [eh, em] = parseTime(draft.endTime);
  const sourceId = `manual-anno-${yearOfStudy ?? 1}`;
  const courseName = draft.courseName.trim();
  const room = draft.room?.trim() || undefined;
  const firstMonday = mondayOf(now);
  // weekday is ISO (1=Mon..7=Sun); offset from Monday is weekday-1.
  const dayOffset = draft.weekday - 1;

  const events: ClassEvent[] = [];
  for (let w = -WEEKS_BEFORE; w <= WEEKS_AFTER; w++) {
    const day = addDays(firstMonday, w * 7 + dayOffset);
    const y = day.getFullYear();
    const mo = day.getMonth();
    const d = day.getDate();
    const isoDate = localToday(day); // YYYY-MM-DD of this occurrence
    events.push({
      id: `manual:${seriesId}:${isoDate}`,
      courseName,
      start: new Date(y, mo, d, sh, sm).toISOString(),
      end: new Date(y, mo, d, eh, em).toISOString(),
      room,
      kind: draft.kind,
      sourceId,
    });
  }
  return events;
}

export function ManualLessonForm({
  courses,
  initial,
  onDone,
}: {
  /** Every course name present in the feed, for the datalist. */
  courses: string[];
  /** When editing, prefilled values of the series being replaced. */
  initial?: ManualLessonDraft;
  /** Called after a successful submit (e.g. to close an edit row). */
  onDone?: () => void;
}) {
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  const [courseName, setCourseName] = useState(initial?.courseName ?? "");
  const [weekday, setWeekday] = useState(initial?.weekday ?? 1);
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [kind, setKind] = useState<ClassEventKind>(initial?.kind ?? "lecture");

  const baseId = useId();
  const courseListId = `${baseId}-courses`;
  const editing = Boolean(initial?.seriesId);

  function reset() {
    setCourseName("");
    setWeekday(1);
    setStartTime("");
    setEndTime("");
    setRoom("");
    setKind("lecture");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = courseName.trim();
    if (!name || !startTime || !endTime) return;

    // Edit = delete the old series, then write a fresh one (simplest correct).
    if (initial?.seriesId) await deleteClassEventSeries(initial.seriesId);

    const seriesId = crypto.randomUUID();
    const series = buildManualLessonSeries(
      { courseName: name, weekday, startTime, endTime, room, kind },
      seriesId,
      yearOfStudy,
      new Date(),
    );
    await putClassEvents(series);
    useSynced.getState().refresh();
    useToast.getState().show(
      editing ? "Lezione aggiornata (ogni settimana)." : "Lezione aggiunta (ogni settimana).",
      "ok",
    );
    if (!editing) reset();
    onDone?.();
  }

  const form = (
    <form
      onSubmit={handleSubmit}
      aria-label={editing ? "Modifica la lezione" : "Aggiungi una lezione manualmente"}
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

        <Field label="Giorno della settimana" htmlFor={`${baseId}-weekday`}>
          <select
            id={`${baseId}-weekday`}
            value={weekday}
            onChange={(e) => setWeekday(Number(e.target.value))}
            className={inputClass}
          >
            {WEEKDAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tipo" htmlFor={`${baseId}-kind`}>
          <select
            id={`${baseId}-kind`}
            value={kind}
            onChange={(e) => setKind(e.target.value as ClassEventKind)}
            className={inputClass}
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ora inizio" htmlFor={`${baseId}-start`}>
          <input
            id={`${baseId}-start`}
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Ora fine" htmlFor={`${baseId}-end`}>
          <input
            id={`${baseId}-end`}
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Aula" htmlFor={`${baseId}-room`} className="sm:col-span-2">
          <input
            id={`${baseId}-room`}
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="es. Aula 3 (facoltativo)"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        {editing && onDone && (
          <Button type="button" onClick={onDone}>
            Annulla
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!courseName.trim() || !startTime || !endTime}
        >
          <CalendarPlus aria-hidden="true" className="size-4" />
          {editing ? "Salva modifiche" : "Aggiungi lezione"}
        </Button>
      </div>
    </form>
  );

  // Edit mode renders the bare form inline (it sits inside a series row);
  // create mode wraps it in the collapsible <details> panel.
  if (editing) return <div className="mt-3">{form}</div>;

  return (
    <details className="glass rounded-lg border border-line shadow-soft">
      <summary
        data-quickadd
        className="flex cursor-pointer list-none items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-night-900 [&::-webkit-details-marker]:hidden"
      >
        <CalendarPlus aria-hidden="true" className="size-4 text-signal" />
        Aggiungi una lezione
        <span className="ml-auto text-xs font-normal text-ink-mute">
          si ripete ogni settimana
        </span>
      </summary>
      <div className="border-t border-line p-4">{form}</div>
    </details>
  );
}
