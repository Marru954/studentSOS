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

export function useScrolled(threshold = 8): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
