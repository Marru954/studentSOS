"use client";

/** The student's chosen timetable channel ("canale"), remembered in
 *  localStorage. `null` = show every channel. Local-only convenience: it never
 *  touches the settings schema or the cloud. Uses useSyncExternalStore (the
 *  react-hooks lint rules reject setState in a mount effect). */
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "studentos-canale";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persist the channel choice (best-effort) and notify subscribers.
 *  @param channel the channel tag to follow, or null for all channels. */
export function setChannelPref(channel: string | null): void {
  try {
    if (channel === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, channel);
  } catch {
    // storage disabled — the choice just won't survive a reload
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** Reactive hook returning the remembered channel (null on the server).
 *  @returns the chosen channel tag, or null for "all". */
export function useChannelPref(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
