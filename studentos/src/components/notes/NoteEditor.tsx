/**
 * Editor for one note. Mount with key={note.id}: switching notes remounts
 * with fresh state. Saves are debounced (800 ms) and flushed on unmount,
 * so switching or leaving never loses keystrokes.
 */
import { NotebookPen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { cn } from "@/lib/cn";
import { suggestCourse } from "@/lib/domain/notes";
import type { Note } from "@/lib/domain/types";
import { NotePreview } from "./NotePreview";

const AUTOSAVE_MS = 800;

export function NoteEditor({
  note,
  courses,
  onSave,
  onDelete,
}: {
  note: Note;
  /** Synced course names for linking and suggestions. */
  courses: string[];
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsText, setTagsText] = useState(note.tags.join(", "));
  const [courseName, setCourseName] = useState(note.courseName ?? "");
  const [saved, setSaved] = useState(true);
  const [mobilePane, setMobilePane] = useState<"scrivi" | "anteprima">("scrivi");

  // the draft awaiting its debounce; written only from event handlers
  const pending = useRef<Note | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  /** Current state + the just-typed value (state is one keystroke behind). */
  function buildDraft(over: {
    title?: string;
    content?: string;
    tagsText?: string;
    courseName?: string;
  }): Note {
    return {
      ...note,
      title: over.title ?? title,
      content: over.content ?? content,
      tags: (over.tagsText ?? tagsText)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      courseName: (over.courseName ?? courseName) || undefined,
    };
  }

  function scheduleSave(over: Parameters<typeof buildDraft>[0]) {
    pending.current = buildDraft(over);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (pending.current) {
        onSaveRef.current({
          ...pending.current,
          updatedAt: new Date().toISOString(),
        });
        pending.current = null;
      }
      setSaved(true);
    }, AUTOSAVE_MS);
  }

  // flush pending edits when the editor unmounts (note switch, navigation)
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (pending.current) {
        onSaveRef.current({
          ...pending.current,
          updatedAt: new Date().toISOString(),
        });
        pending.current = null;
      }
    },
    [],
  );

  const suggestion = useMemo(() => {
    const found = suggestCourse(`${title}\n${content}`, courses);
    return found && found !== courseName ? found : undefined;
  }, [title, content, courses, courseName]);

  return (
    <Panel
      title={saved ? "Nota · salvata" : "Nota · modifiche in corso…"}
      icon={<NotebookPen />}
      actions={
        <ConfirmButton onConfirm={() => onDelete(note.id)}>
          Elimina
        </ConfirmButton>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Lo stato salvataggio vive nel titolo del Panel (non in live region):
            qui lo annunciamo a salvataggio avvenuto, una volta sola. */}
        <div aria-live="polite" className="sr-only">
          {saved ? "Nota salvata" : ""}
        </div>
        <Field label="Titolo" htmlFor="nota-titolo">
          <input
            id="nota-titolo"
            type="text"
            value={title}
            placeholder="es. Normalizzazione — Basi di dati"
            onChange={(e) => {
              setTitle(e.target.value);
              scheduleSave({ title: e.target.value });
            }}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Corso collegato" htmlFor="nota-corso">
            <select
              id="nota-corso"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                scheduleSave({ courseName: e.target.value });
              }}
              className={inputClass}
            >
              <option value="">— nessuno —</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              {courseName && !courses.includes(courseName) && (
                <option value={courseName}>{courseName}</option>
              )}
            </select>
          </Field>
          <Field label="Tag (separati da virgola)" htmlFor="nota-tag">
            <input
              id="nota-tag"
              type="text"
              value={tagsText}
              placeholder="es. teoria, esercizi"
              onChange={(e) => {
                setTagsText(e.target.value);
                scheduleSave({ tagsText: e.target.value });
              }}
              className={inputClass}
            />
          </Field>
        </div>

        {suggestion && (
          <p className="text-xs text-ink-mute">
            Sembra riguardare{" "}
            <Button
              size="sm"
              onClick={() => {
                setCourseName(suggestion);
                scheduleSave({ courseName: suggestion });
              }}
            >
              Collega a «{suggestion}»
            </Button>
          </p>
        )}

        <div
          role="tablist"
          aria-label="Modalità editor"
          className="flex gap-1 lg:hidden"
        >
          {(["scrivi", "anteprima"] as const).map((pane) => (
            <button
              key={pane}
              type="button"
              role="tab"
              aria-selected={mobilePane === pane}
              onClick={() => setMobilePane(pane)}
              className={cn(
                "border-b-2 px-3 py-3 text-label font-medium transition-colors",
                mobilePane === pane
                  ? "border-signal text-ink"
                  : "border-transparent text-ink-mute hover:text-ink",
              )}
            >
              {pane === "scrivi" ? "Scrivi" : "Anteprima"}
            </button>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className={cn(mobilePane !== "scrivi" && "hidden lg:block")}>
            <label htmlFor="nota-contenuto" className="sr-only">
              Contenuto in Markdown
            </label>
            <textarea
              id="nota-contenuto"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                scheduleSave({ content: e.target.value });
              }}
              rows={18}
              spellCheck={false}
              placeholder={"# Titolo\n\nTesto, `codice`, $E = mc^2$ …"}
              className={cn(
                inputClass,
                "h-auto min-h-96 resize-y py-2 font-mono text-[0.8125rem] leading-relaxed",
              )}
            />
          </div>
          <div
            className={cn(
              "glass-2 min-h-96 overflow-x-auto rounded-md border border-line p-4",
              mobilePane !== "anteprima" && "hidden lg:block",
            )}
          >
            <NotePreview content={content} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
