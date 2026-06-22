"use client";

/** True once the page has scrolled past `threshold` px. External-store based,
 *  so SSR and the first client paint agree (server snapshot is always false). */
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  // useSyncExternalStore non chiama subscribe in SSR, ma teniamo il guard per
  // coerenza con usePrefersReducedMotion e per robustezza in contesti non-DOM.
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Reactive hook that turns true once the page has scrolled past `threshold` px.
 *  @param threshold scroll distance in px past which the result is true (default 8).
 *  @returns true once scrolled past the threshold (false on the server snapshot). */
export function useScrolled(threshold = 8): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
