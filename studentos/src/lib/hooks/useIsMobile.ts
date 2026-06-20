"use client";

/** Reactive "viewport is phone-width" boolean, via useSyncExternalStore so it
 *  never writes state in a mount effect (the react-hooks rule rejects that) and
 *  stays correct on resize/rotation. SSR snapshot is false (desktop) — the
 *  client corrects on hydrate. Breakpoint matches Tailwind `md` (768px). */
import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
