"use client";

/** Global search palette, opened with Cmd/Ctrl+K (or the search button in
 *  AppNav, via `useSearchPalette`). Searches across note, libretto, appelli and
 *  task; results are grouped by type and a click navigates to the owning page
 *  (deep-linking to the single item is intentionally out of scope). */
import {
  CalendarClock,
  GraduationCap,
  ListChecks,
  NotebookPen,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Overlay } from "@/components/primitives/Overlay";
import { inputClass } from "@/components/primitives/Field";
import { useGlobalKey } from "@/lib/hooks/useGlobalKey";
import { cn } from "@/lib/cn";
import { normalize, searchNotes } from "@/lib/domain/notes";
import { useLibretto, useNotes, useTasks } from "@/lib/state/manual";
import { useSearchPalette } from "@/lib/state/searchPalette";
import { useSynced } from "@/lib/state/synced";

type Result = { id: string; label: string; sub?: string };
type Group = {
  key: string;
  title: string;
  href: string;
  Icon: typeof Search;
  results: Result[];
};

const MAX_PER_GROUP = 6;

export function SearchPalette() {
  const open = useSearchPalette((s) => s.open);
  const openPalette = useSearchPalette((s) => s.openPalette);
  const closePalette = useSearchPalette((s) => s.closePalette);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const notes = useNotes((s) => s.items);
  const libretto = useLibretto((s) => s.items);
  const tasks = useTasks((s) => s.items);
  const examCalls = useSynced((s) => s.examCalls);

  // Cmd/Ctrl+K toggles the palette. Search owns this shortcut (the quick-add FAB
  // is opened by its button / Cmd+J — see QuickAddFab).
  useGlobalKey("k", (e) => {
    e.preventDefault();
    if (open) closePalette();
    else openPalette();
  });

  const groups = useMemo<Group[]>(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    const noteResults = searchNotes(notes, query)
      .slice(0, MAX_PER_GROUP)
      .map((n) => ({ id: n.id, label: n.title || "Senza titolo", sub: n.courseName }));
    const librettoResults = libretto
      .filter((e) => normalize(e.courseName).includes(term))
      .slice(0, MAX_PER_GROUP)
      .map((e) => ({ id: e.id, label: e.courseName, sub: `${e.cfu} CFU` }));
    const examResults = examCalls
      .filter((e) => normalize(e.courseName).includes(term))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, MAX_PER_GROUP)
      .map((e) => ({ id: e.id, label: e.courseName, sub: e.date }));
    const taskResults = tasks
      .filter(
        (t) =>
          normalize(t.title).includes(term) ||
          (t.courseName ? normalize(t.courseName).includes(term) : false),
      )
      .slice(0, MAX_PER_GROUP)
      .map((t) => ({ id: t.id, label: t.title, sub: t.courseName }));

    return [
      { key: "note", title: "Note", href: "/note", Icon: NotebookPen, results: noteResults },
      { key: "libretto", title: "Esami (libretto)", href: "/libretto", Icon: GraduationCap, results: librettoResults },
      { key: "appelli", title: "Appelli", href: "/appelli", Icon: CalendarClock, results: examResults },
      { key: "task", title: "Attività", href: "/focus", Icon: ListChecks, results: taskResults },
    ].filter((g) => g.results.length > 0);
  }, [query, notes, libretto, examCalls, tasks]);

  const hasQuery = query.trim().length > 0;

  function close() {
    closePalette();
    setQuery("");
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  return (
    <Overlay open={open} onClose={close} label="Ricerca globale" align="top" className="max-w-xl">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Search aria-hidden="true" className="size-4 shrink-0 text-ink-mute" />
        <input
          type="text"
          // Focus is moved here by Overlay (first focusable control), so no autoFocus.
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca tra note, esami, appelli e attività…"
          aria-label="Cerca tra note, esami, appelli e attività"
          className={cn(inputClass, "h-8 border-0 bg-transparent px-0 hover:border-0 focus:outline-none")}
        />
      </div>

      <div className="max-h-[55vh] overflow-y-auto p-2">
        {!hasQuery && (
          <p className="px-3 py-6 text-center text-sm text-ink-mute">
            Cerca tra note, esami, appelli e attività.
          </p>
        )}
        {hasQuery && groups.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-mute">Nessun risultato.</p>
        )}
        {groups.map(({ key, title, href, Icon, results }) => (
          <div key={key} className="mb-2 last:mb-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-label font-medium text-ink-mute">
              <Icon aria-hidden="true" className="size-3.5" />
              {title}
            </div>
            <ul>
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => go(href)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-night-700"
                  >
                    <span className="truncate">{r.label}</span>
                    {r.sub && (
                      <span className="shrink-0 text-xs text-ink-faint">{r.sub}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Overlay>
  );
}
