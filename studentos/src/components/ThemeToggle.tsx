"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/hooks/useTheme";

/** Switches between the immersive dark and light themes. */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
      className="btn-press flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
