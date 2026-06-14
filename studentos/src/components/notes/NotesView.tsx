"use client";

/** /note: knowledge base. Manual territory — notes live only in the local
 *  IndexedDB. Course names from the synced caches feed linking and search.
 *  Desktop (lg+) is a permanent split-pane (sidebar + editor); mobile keeps the
 *  list → full-screen editor flow. */
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { inputClass } from "@/components/primitives/Field";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { extractCourseNames, searchNotes } from "@/lib/domain/notes";
import type { Note } from "@/lib/domain/types";
import { useNotes } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { EmptyNoteState } from "./EmptyNoteState";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";

const TEMPLATES = [
  {
    label: "📋 Appunti lezione",
    content: "# Lezione — [data]\n\n## Argomenti\n\n## Domande\n\n## Todo\n- [ ] ",
  },
  {
    label: "📝 Riassunto",
    content: "# Riassunto — [titolo]\n\n## Concetti chiave\n\n## Formule\n\n## Esempi\n",
  },
  {
    label: "🃏 Flashcard",
    content:
      "# Flashcard\n\n**Domanda:** \n\n**Risposta:** \n\n---\n\n**Domanda:** \n\n**Risposta:** \n",
  },
];

/** Quick-start template chips. */
function TemplateButtons({ onPick }: { onPick: (content: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => onPick(t.content)}
          className="chip transition-colors hover:border-line-strong"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Search box — distinct id per pane (both render in the DOM at once). */
function NoteSearch({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Cerca nelle note
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cerca per titolo, testo, tag, corso…"
        className={inputClass}
      />
    </div>
  );
}

export function NotesView() {
  const notes = useNotes();
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const syncedHydrated = useSynced((s) => s.hydrated);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const ready = notes.hydrated && syncedHydrated;
  const courses = useMemo(
    () => extractCourseNames(classEvents, examCalls),
    [classEvents, examCalls],
  );
  const results = useMemo(
    () => searchNotes(notes.items, query),
    [notes.items, query],
  );
  const selected = selectedId
    ? notes.items.find((n) => n.id === selectedId)
    : undefined;

  function createFromTemplate(content: string) {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      content,
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    void notes.upsert(note);
    setSelectedId(note.id);
    useToast.getState().show("Nota creata.", "ok");
  }

  const createNote = () => createFromTemplate("");

  const editor = selected ? (
    <NoteEditor
      key={selected.id}
      note={selected}
      courses={courses}
      onSave={(n) => void notes.upsert(n)}
      onDelete={(id) => {
        setSelectedId(null);
        void notes.remove(id);
      }}
    />
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="grad-text text-3xl">Note</h1>
          <p className="muted mt-1 text-sm">Appunti organizzati per materia</p>
        </div>
        <button
          type="button"
          onClick={createNote}
          className="btn btn-primary"
          style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
        >
          <Plus size={16} aria-hidden="true" />
          Nuova nota
        </button>
      </header>

      {!ready ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-4">
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton />
          <PanelSkeleton />
        </div>
      ) : (
        // Un solo albero (un solo NoteEditor montato): desktop = split-pane
        // sempre visibile; mobile = lista oppure editor a tutta pagina.
        <div className="lg:grid lg:min-h-[70vh] lg:grid-cols-[280px_1fr] lg:gap-4">
          {/* sidebar: sempre su desktop, su mobile solo quando nessuna nota è aperta */}
          <div
            className={cn(
              "flex-col gap-3 lg:flex lg:border-r lg:border-line lg:pr-4",
              selected ? "hidden lg:flex" : "flex",
            )}
          >
            <TemplateButtons onPick={createFromTemplate} />
            <NoteSearch id="cerca-note" value={query} onChange={setQuery} />
            {notes.items.length === 0 ? (
              <p className="muted text-sm">
                Nessuna nota. Usa un template o crea da zero.
              </p>
            ) : (
              <NoteList
                notes={results}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* editor: su mobile compare solo con una nota selezionata */}
          <div className={cn("lg:block lg:pl-2", selected ? "block" : "hidden")}>
            {selected ? (
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="btn self-start lg:hidden"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                >
                  ← Tutte le note
                </button>
                {editor}
              </div>
            ) : (
              <EmptyNoteState onNew={createNote} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
