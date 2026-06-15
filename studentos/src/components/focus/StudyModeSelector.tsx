"use client";

import { cn } from "@/lib/cn";
import { STUDY_MODES, type StudyMode } from "./studyModes";

/** Horizontal mode cards. The active mode is tinted with its accent; switching
 *  is locked while a session is in progress (you don't change horse mid-race). */
export function StudyModeSelector({
  activeId,
  onSelect,
  locked,
}: {
  activeId: StudyMode["id"];
  onSelect: (mode: StudyMode) => void;
  locked: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Modalità di studio"
      className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
    >
      {STUDY_MODES.map((mode) => {
        const active = mode.id === activeId;
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={locked && !active}
            onClick={() => onSelect(mode)}
            className={cn(
              "glass flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-all",
              active
                ? "shadow-soft"
                : "border-line hover:border-ink-faint disabled:opacity-40",
            )}
            style={
              active
                ? {
                    borderColor: mode.accent,
                    background: `color-mix(in srgb, ${mode.accent} 12%, transparent)`,
                  }
                : undefined
            }
          >
            <span
              className="flex size-8 items-center justify-center rounded-lg"
              style={{
                background: `color-mix(in srgb, ${mode.accent} 18%, transparent)`,
                color: mode.accent,
              }}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <span className="text-sm font-semibold text-ink">{mode.label}</span>
            <span className="text-xs leading-snug text-ink-mute">{mode.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
