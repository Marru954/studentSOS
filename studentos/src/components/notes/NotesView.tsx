"use client";

/** /note: knowledge base. Manual territory — notes live only in the local
 *  IndexedDB. Course names from the synced caches feed linking and search. */
import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { extractCourseNames, searchNotes } from "@/lib/domain/notes";
import type { Note } from "@/lib/domain/types";
import { useNotes } from "@/lib/state/manual";
import { useSynced } from "@/lib/state/synced";
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
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Note</h1>
          {ready && (
            <p className="mt-1 font-mono text-xs text-ink-mute">
              {notes.items.length} note · solo su questo dispositivo
            </p>
          )}
        </div>
        <Button variant="primary" onClick={createNote}>
          Nuova nota
        </Button>
      </header>

      {!ready ? (
        <div
          role="status"
          aria-busy="true"
          className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12"
        >
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton className="lg:col-span-4" />
          <PanelSkeleton className="lg:col-span-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-4">
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
            <Panel flush>
              <NoteList
                notes={results}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </Panel>
          </div>

          <div className="lg:col-span-8">
            {selected ? (
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
            ) : (
              <Panel>
                {notes.items.length === 0 ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-ink-mute">
                      Non hai ancora appunti. Crea la tua prima nota: supporta
                      Markdown, codice evidenziato e formule LaTeX.
                    </p>
                    <Button variant="primary" onClick={createNote}>
                      Crea la prima nota
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-ink-mute">
                    Seleziona una nota dall&rsquo;elenco o creane una nuova.
                    Markdown, codice evidenziato e formule LaTeX sono supportati.
                  </p>
                )}
              </Panel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
