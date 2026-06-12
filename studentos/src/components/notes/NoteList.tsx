/** Search results / note index. Selection is a real button per note. */
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import type { Note } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

export function NoteList({
  notes,
  selectedId,
  onSelect,
}: {
  /** Already filtered/ranked by the caller. */
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (notes.length === 0) {
    return (
      <p className="p-4 text-sm text-ink-mute">
        Nessuna nota trovata.
      </p>
    );
  }
  return (
    <ul className="flex flex-col divide-y divide-line">
      {notes.map((note) => (
        <li key={note.id}>
          <button
            type="button"
            onClick={() => onSelect(note.id)}
            aria-current={note.id === selectedId || undefined}
            className={cn(
              "block w-full px-4 py-2.5 text-left hover:bg-night-700/50",
              note.id === selectedId && "bg-night-700",
            )}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm text-ink">
                {note.title.trim() || "Senza titolo"}
              </span>
              <span className="shrink-0 font-mono text-xs text-ink-mute">
                {fmtDayMonth(note.updatedAt)}
              </span>
            </span>
            {(note.courseName || note.tags.length > 0) && (
              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                {note.courseName && (
                  <Badge tone="signal">{note.courseName}</Badge>
                )}
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
