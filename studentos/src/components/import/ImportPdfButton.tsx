"use client";

/**
 * "Importa da PDF": one button + modal, parametrized by `kind` ("orario" |
 * "esami"), reused by /orario and /appelli. The flow is fully client-driven —
 * the PDF text is extracted in the browser (no upload), sent to /api/import-pdf
 * where Groq turns it into rows, normalized here (lib/domain/pdfImport), then
 * shown in an EDITABLE, per-row-selectable preview. On confirm the chosen rows
 * are ADDED to the existing data as the user's own records:
 *   - lessons → a weekly series each (buildManualLessonSeries), via putClassEvents
 *   - exams   → one putExamCall each
 * all tagged with the `manual-pdf-import-anno-N` sentinel sourceId, so they
 * survive every sync, stay deletable, and never collide with synced caches.
 */
import {
  AlertTriangle,
  CheckCheck,
  FileText,
  FileUp,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { DateField } from "@/components/primitives/DateField";
import { inputClass } from "@/components/primitives/Field";
import { Overlay } from "@/components/primitives/Overlay";
import {
  normalizeExams,
  normalizeLessons,
  pdfImportSourceId,
  type ImportKind,
  type ParsedExam,
  type ParsedLesson,
} from "@/lib/domain/pdfImport";
import type { ClassEventKind, ExamKind } from "@/lib/domain/types";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { extractPdfText } from "@/lib/pdf/extractText";
import { putClassEvents, putExamCall } from "@/lib/storage/repo";
import { buildManualLessonSeries } from "@/components/timetable/ManualLessonForm";

type Phase = "pick" | "reading" | "interpreting" | "preview" | "saving" | "error";

type LessonRow = ParsedLesson & { selected: boolean };
type ExamRow = ParsedExam & { selected: boolean };

type ApiResponse =
  | { ok: true; items: unknown[] }
  | { ok: false; error?: string; code?: string };

const WEEKDAYS: [number, string][] = [
  [1, "Lunedì"],
  [2, "Martedì"],
  [3, "Mercoledì"],
  [4, "Giovedì"],
  [5, "Venerdì"],
  [6, "Sabato"],
  [7, "Domenica"],
];

const LESSON_KINDS: [ClassEventKind, string][] = [
  ["lecture", "Lezione"],
  ["lab", "Laboratorio"],
  ["exercise", "Esercitazione"],
  ["seminar", "Seminario"],
];

const EXAM_KINDS: [ExamKind, string][] = [
  ["written", "Scritto"],
  ["oral", "Orale"],
  ["written+oral", "Scritto e orale"],
  ["practical", "Pratico"],
  ["unknown", "Esame"],
];

const TIME_RE = /^\d\d:\d\d$/;
const DATE_RE = /^\d{4}-\d\d-\d\d$/;

function lessonValid(l: LessonRow): boolean {
  return (
    l.courseName.trim().length > 0 &&
    TIME_RE.test(l.startTime) &&
    TIME_RE.test(l.endTime) &&
    l.weekday >= 1 &&
    l.weekday <= 7
  );
}

function examValid(e: ExamRow): boolean {
  return e.courseName.trim().length > 0 && DATE_RE.test(e.date);
}

export function ImportPdfButton({
  kind,
  disabled,
}: {
  kind: ImportKind;
  /** Mirror the neighbouring controls' readiness gate. */
  disabled?: boolean;
}) {
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("pick");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const noun = kind === "orario" ? "lezioni" : "appelli";
  const title =
    kind === "orario" ? "Importa orario da PDF" : "Importa appelli da PDF";

  function reset() {
    setPhase("pick");
    setError(null);
    setDragOver(false);
    setLessons([]);
    setExams([]);
  }

  function close() {
    setOpen(false);
    reset();
  }

  async function start(file: File) {
    setError(null);
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      setPhase("error");
      setError("Questo non sembra un PDF. Carica un file .pdf.");
      return;
    }

    setPhase("reading");
    let text: string;
    try {
      text = await extractPdfText(file);
    } catch {
      setPhase("error");
      setError("Non riesco a leggere questo PDF, prova con un altro file.");
      return;
    }
    if (text.trim().length < 20) {
      setPhase("error");
      setError("Non riesco a leggere questo PDF, prova con un altro file.");
      return;
    }

    setPhase("interpreting");
    let res: Response;
    try {
      res = await fetch("/api/import-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, text }),
      });
    } catch {
      setPhase("error");
      setError("Servizio AI non raggiungibile. Riprova tra poco.");
      return;
    }

    const payload = (await res.json().catch(() => null)) as ApiResponse | null;
    if (!res.ok || !payload || !payload.ok) {
      setPhase("error");
      setError(
        (payload && !payload.ok && payload.error) ||
          "Non sono riuscito a interpretare il PDF. Riprova o inserisci i dati a mano.",
      );
      return;
    }

    if (kind === "orario") {
      const rows = normalizeLessons(payload.items).map((l) => ({
        ...l,
        selected: true,
      }));
      if (rows.length === 0) {
        setPhase("error");
        setError("Non ho trovato lezioni in questo PDF.");
        return;
      }
      setLessons(rows);
    } else {
      const rows = normalizeExams(payload.items).map((e) => ({
        ...e,
        selected: true,
      }));
      if (rows.length === 0) {
        setPhase("error");
        setError("Non ho trovato esami in questo PDF.");
        return;
      }
      setExams(rows);
    }
    setPhase("preview");
  }

  function onPick(file: File | undefined) {
    if (file) void start(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    onPick(e.dataTransfer.files?.[0]);
  }

  function patchLesson(i: number, patch: Partial<LessonRow>) {
    setLessons((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function patchExam(i: number, patch: Partial<ExamRow>) {
    setExams((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  const rows = kind === "orario" ? lessons : exams;
  const allSelected = rows.length > 0 && rows.every((r) => r.selected);
  function toggleAll() {
    const next = !allSelected;
    if (kind === "orario") {
      setLessons((rs) => rs.map((r) => ({ ...r, selected: next })));
    } else {
      setExams((rs) => rs.map((r) => ({ ...r, selected: next })));
    }
  }

  const importable =
    kind === "orario"
      ? lessons.filter((l) => l.selected && lessonValid(l)).length
      : exams.filter((e) => e.selected && examValid(e)).length;

  async function importSelected() {
    setPhase("saving");
    const sourceId = pdfImportSourceId(yearOfStudy);
    let count = 0;
    if (kind === "orario") {
      for (const l of lessons) {
        if (!l.selected || !lessonValid(l)) continue;
        const seriesId = crypto.randomUUID();
        const series = buildManualLessonSeries(
          {
            courseName: l.courseName,
            weekday: l.weekday,
            startTime: l.startTime,
            endTime: l.endTime,
            room: l.room,
            kind: l.kind,
          },
          seriesId,
          yearOfStudy,
          new Date(),
        ).map((ev) => ({ ...ev, sourceId }));
        await putClassEvents(series);
        count++;
      }
    } else {
      for (const e of exams) {
        if (!e.selected || !examValid(e)) continue;
        await putExamCall({
          id: crypto.randomUUID(),
          courseName: e.courseName.trim(),
          date: e.date,
          time: e.time,
          room: e.room?.trim() || undefined,
          kind: e.kind,
          teacher: e.teacher?.trim() || undefined,
          sourceId,
        });
        count++;
      }
    }
    useSynced.getState().refresh();
    useToast
      .getState()
      .show(
        count > 0
          ? `${count} ${kind === "orario" ? "lezioni importate" : "appelli importati"}.`
          : "Nessuna voce valida da importare.",
        count > 0 ? "ok" : "warn",
      );
    close();
  }

  const busy = phase === "reading" || phase === "interpreting" || phase === "saving";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label={`Importa ${kind === "orario" ? "l'orario" : "gli appelli"} da un PDF`}
        className="btn disabled:pointer-events-none disabled:opacity-45"
        style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
      >
        <FileUp aria-hidden="true" className="size-4" />
        Importa PDF
      </button>

      <Overlay
        open={open}
        onClose={close}
        label={title}
        align="top"
        className="w-full max-w-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 id={titleId} className="text-sm font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi"
            className="rounded-sm p-1 text-ink-mute transition-colors hover:bg-night-800 hover:text-ink"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {phase === "pick" && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? "border-signal bg-[color:var(--signal)]/5" : "border-line"
              }`}
            >
              <Upload aria-hidden="true" className="size-8 text-signal" />
              <p className="text-sm font-medium text-ink">
                Trascina qui il PDF {kind === "orario" ? "dell'orario" : "degli appelli"}
              </p>
              <p className="muted text-xs">
                oppure scegli un file dal tuo dispositivo. Niente viene caricato
                online: il PDF è letto nel browser.
              </p>
              <Button type="button" variant="primary" onClick={() => inputRef.current?.click()}>
                <FileText aria-hidden="true" className="size-4" />
                Scegli un PDF
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                aria-label="Scegli un file PDF"
                onChange={(e) => {
                  onPick(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          )}

          {busy && phase !== "saving" && (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <Loader2 aria-hidden="true" className="size-8 animate-spin text-signal" />
              <p className="text-sm font-medium text-ink">
                {phase === "reading"
                  ? `Sto leggendo ${kind === "orario" ? "il tuo orario" : "i tuoi esami"}…`
                  : "L'AI sta interpretando il PDF…"}
              </p>
              <p className="muted text-xs">Ci vuole qualche secondo.</p>
            </div>
          )}

          {phase === "saving" && (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <Loader2 aria-hidden="true" className="size-8 animate-spin text-signal" />
              <p className="text-sm font-medium text-ink">Salvataggio in corso…</p>
            </div>
          )}

          {phase === "error" && (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <AlertTriangle aria-hidden="true" className="size-8 text-warn" />
              <p className="text-sm text-ink">{error}</p>
              <Button type="button" onClick={reset}>
                Riprova con un altro PDF
              </Button>
            </div>
          )}

          {phase === "preview" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="muted text-sm">
                  {rows.length} {rows.length === 1 ? noun.slice(0, -1) : noun} trovate.
                  Controlla, correggi e deseleziona ciò che non vuoi.
                </p>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="chip transition-colors hover:border-line-strong"
                >
                  <CheckCheck aria-hidden="true" className="size-3.5" />
                  {allSelected ? "Deseleziona tutto" : "Seleziona tutto"}
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {kind === "orario"
                  ? lessons.map((l, i) => (
                      <li
                        key={i}
                        className={`rounded-md border p-3 ${
                          l.selected ? "border-line bg-night-800" : "border-line opacity-55"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={l.selected}
                            onChange={() => patchLesson(i, { selected: !l.selected })}
                            aria-label={`Includi ${l.courseName || "questa lezione"}`}
                            className="mt-2 size-4 shrink-0 accent-[color:var(--signal)]"
                          />
                          <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-12">
                            <input
                              type="text"
                              value={l.courseName}
                              onChange={(e) => patchLesson(i, { courseName: e.target.value })}
                              aria-label="Corso"
                              placeholder="Corso"
                              className={`${inputClass} col-span-2 sm:col-span-4`}
                            />
                            <select
                              value={l.weekday}
                              onChange={(e) => patchLesson(i, { weekday: Number(e.target.value) })}
                              aria-label="Giorno"
                              className={`${inputClass} sm:col-span-2`}
                            >
                              {WEEKDAYS.map(([v, lab]) => (
                                <option key={v} value={v}>
                                  {lab}
                                </option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={l.startTime}
                              onChange={(e) => patchLesson(i, { startTime: e.target.value })}
                              aria-label="Ora inizio"
                              className={`${inputClass} sm:col-span-2`}
                            />
                            <input
                              type="time"
                              value={l.endTime}
                              onChange={(e) => patchLesson(i, { endTime: e.target.value })}
                              aria-label="Ora fine"
                              className={`${inputClass} sm:col-span-2`}
                            />
                            <input
                              type="text"
                              value={l.room ?? ""}
                              onChange={(e) => patchLesson(i, { room: e.target.value })}
                              aria-label="Aula"
                              placeholder="Aula"
                              className={`${inputClass} sm:col-span-2`}
                            />
                            <select
                              value={l.kind}
                              onChange={(e) =>
                                patchLesson(i, { kind: e.target.value as ClassEventKind })
                              }
                              aria-label="Tipo"
                              className={`${inputClass} col-span-2 sm:col-span-12`}
                            >
                              {LESSON_KINDS.map(([v, lab]) => (
                                <option key={v} value={v}>
                                  {lab}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </li>
                    ))
                  : exams.map((ex, i) => (
                      <li
                        key={i}
                        className={`rounded-md border p-3 ${
                          ex.selected ? "border-line bg-night-800" : "border-line opacity-55"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={ex.selected}
                            onChange={() => patchExam(i, { selected: !ex.selected })}
                            aria-label={`Includi ${ex.courseName || "questo appello"}`}
                            className="mt-2 size-4 shrink-0 accent-[color:var(--signal)]"
                          />
                          <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-12">
                            <input
                              type="text"
                              value={ex.courseName}
                              onChange={(e) => patchExam(i, { courseName: e.target.value })}
                              aria-label="Corso"
                              placeholder="Corso"
                              className={`${inputClass} col-span-2 sm:col-span-4`}
                            />
                            <DateField
                              value={ex.date}
                              onChange={(date) => patchExam(i, { date })}
                              ariaLabel="Data"
                              className="sm:col-span-3"
                            />
                            <input
                              type="time"
                              value={ex.time ?? ""}
                              onChange={(e) => patchExam(i, { time: e.target.value })}
                              aria-label="Ora"
                              className={`${inputClass} sm:col-span-2`}
                            />
                            <input
                              type="text"
                              value={ex.room ?? ""}
                              onChange={(e) => patchExam(i, { room: e.target.value })}
                              aria-label="Aula"
                              placeholder="Aula"
                              className={`${inputClass} sm:col-span-3`}
                            />
                            <select
                              value={ex.kind}
                              onChange={(e) => patchExam(i, { kind: e.target.value as ExamKind })}
                              aria-label="Tipo"
                              className={`${inputClass} col-span-2 sm:col-span-5`}
                            >
                              {EXAM_KINDS.map(([v, lab]) => (
                                <option key={v} value={v}>
                                  {lab}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={ex.teacher ?? ""}
                              onChange={(e) => patchExam(i, { teacher: e.target.value })}
                              aria-label="Docente"
                              placeholder="Docente"
                              className={`${inputClass} col-span-2 sm:col-span-7`}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
            </div>
          )}
        </div>

        {phase === "preview" && (
          <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5">
            <Button type="button" onClick={close}>
              Annulla
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={importable === 0}
              onClick={() => void importSelected()}
            >
              <FileUp aria-hidden="true" className="size-4" />
              Importa {importable} {importable === 1 ? "voce" : "voci"}
            </Button>
          </div>
        )}
      </Overlay>
    </>
  );
}
