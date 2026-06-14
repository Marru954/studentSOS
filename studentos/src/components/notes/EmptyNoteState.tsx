/** Placeholder shown in the editor pane when no note is selected. */
import { Plus } from "lucide-react";

export function EmptyNoteState({ onNew }: { onNew: () => void }) {
  return (
    <div className="glass flex h-full flex-col items-center justify-center gap-4 rounded-lg p-10 text-center">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="size-16 text-[var(--signal-2)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="14" y="10" width="30" height="44" rx="3" />
        <path d="M14 18h30M14 26h22M14 34h22M14 42h16" opacity={0.5} />
        <path d="M46 30l8-8a3 3 0 0 0-4-4l-8 8-2 6z" />
      </svg>
      <p className="muted max-w-[28ch] text-sm">
        Seleziona una nota o creane una nuova.
      </p>
      <button
        type="button"
        onClick={onNew}
        className="btn btn-primary"
        style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
      >
        <Plus size={16} aria-hidden="true" />
        Nuova nota
      </button>
    </div>
  );
}
