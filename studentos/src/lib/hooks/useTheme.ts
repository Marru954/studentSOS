"use client";

/** Tiny external store over the `data-theme` attribute on <html>. Dark by
 *  default; the choice persists in localStorage and is applied pre-paint by the
 *  inline script in the root layout (no flash). */
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "studentos-theme";
const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

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

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => "dark");
}
