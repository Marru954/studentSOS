"use client";

/** Tiny external store over the `data-theme` attribute on <html>. Dark by
 *  default; the choice persists in localStorage and is applied pre-paint by the
 *  inline script in the root layout (no flash). */
import { useSyncExternalStore } from "react";

/** The two themes the app supports: `"dark"` (default) or `"light"`. */
export type Theme = "dark" | "light";
const STORAGE_KEY = "studentos-theme";
const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Applies a theme: writes the `data-theme` attribute on <html>, persists the
 *  choice in localStorage (best-effort), and notifies all subscribers.
 *  @param theme the theme to switch to. */
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode / storage disabled — the attribute still applies for now
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** Reactive hook returning the current theme; re-renders on theme changes.
 *  @returns the active theme (`"dark"` on the server snapshot). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => "dark");
}
