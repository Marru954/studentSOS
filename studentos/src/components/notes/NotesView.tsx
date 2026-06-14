"use client";

/** /note: knowledge base. Manual territory — notes live only in the local
 *  IndexedDB. Course names from the synced caches feed linking and search. */
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { inputClass } from "@/components/primitives/Field";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { extractCourseNames, searchNotes } from "@/lib/domain/notes";
import type { Note } from "@/lib/domain/types";
import { useNotes } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";

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

  function createNote() {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    void notes.upsert(note);
    setSelectedId(note.id);
    useToast.getState().show("Nota creata.", "ok");
  }

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
      ) : selected ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="btn self-start"
            style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
          >
            ← Tutte le note
          </button>
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
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="cerca-note" className="sr-only">
              Cerca nelle note
            </label>
            <input
              id="cerca-note"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per titolo, testo, tag, corso…"
              className={inputClass}
            />
          </div>

          {notes.items.length === 0 ? (
            <div className="glass flex flex-col items-start gap-3 rounded-lg p-6">
              <p className="muted text-sm">
                Non hai ancora appunti. Crea la tua prima nota: supporta
                Markdown, codice evidenziato e formule LaTeX.
              </p>
              <button
                type="button"
                onClick={createNote}
                className="btn btn-primary"
                style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
              >
                <Plus size={16} aria-hidden="true" />
                Crea la prima nota
              </button>
            </div>
          ) : (
            <NoteList
              notes={results}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>
      )}
    </div>
  );
}
