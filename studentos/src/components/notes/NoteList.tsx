/** Note index as an immersive card grid. Selection is a real button per note. */
import type { Note } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

/** Words in a note's Markdown body — derived from the real content. */
function wordCount(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

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
      <p className="muted p-4 text-sm">Nessuna nota trovata.</p>
    );
  }
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      }}
    >
      {notes.map((note, i) => {
        const words = wordCount(note.content);
        return (
          <button
            key={note.id}
            type="button"
            onClick={() => onSelect(note.id)}
            aria-current={note.id === selectedId || undefined}
            className="glass lift reveal flex flex-col gap-3 rounded-lg p-6 text-left text-[color:inherit]"
            style={{
              minHeight: 150,
              ["--d" as string]: `${i * 0.06}s`,
            }}
          >
            <span className="chip chip-signal self-start">
              {note.courseName || note.tags[0] || "Generale"}
            </span>
            <h3
              style={{
                fontSize: "1.05rem",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                letterSpacing: 0,
                lineHeight: 1.3,
              }}
            >
              {note.title.trim() || "Senza titolo"}
            </h3>
            <div className="faint font-num mt-auto flex items-center justify-between text-[0.78rem]">
              <span>{fmtDayMonth(note.updatedAt)}</span>
              <span>{words} parole</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
