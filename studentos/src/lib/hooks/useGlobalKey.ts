"use client";

/** Fires `handler` on a document-level keydown when the given key is pressed
 *  together with the platform command modifier (⌘ on macOS, Ctrl elsewhere).
 *  The handler decides whether to preventDefault. Used for the global
 *  shortcuts: Cmd+K (search palette) and Cmd+J (quick-add). */
import { useEffect, useRef } from "react";

export function useGlobalKey(
  key: string,
  handler: (e: KeyboardEvent) => void,
): void {
  // Keep the latest handler in a ref so the listener stays stable and we don't
  // re-bind on every render. Written in an effect (not during render) to satisfy
  // the react-hooks rule against ref writes in render.
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const lower = key.toLowerCase();
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === lower) {
        handlerRef.current(e);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key]);
}
