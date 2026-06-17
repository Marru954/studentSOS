"use client";

/** Floating assistant launcher: a life-buoy bubble pinned bottom-right on every
 *  app page. Toggles a non-modal chat panel that reuses <AssistantChat compact>.
 *  Hidden on the public/auth routes and on the full /assistente page (redundant
 *  there). Keyboard: Enter/Space toggles, Esc closes and returns focus to the
 *  launcher; the panel is announced via role="dialog" + aria-label. */
import { LifeBuoy, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AssistantChat } from "@/components/assistente/AssistantChat";
import { cn } from "@/lib/cn";

/** Routes where the bubble must NOT appear (public shell + the standalone page). */
const HIDDEN_PREFIXES = ["/login", "/onboarding", "/auth", "/assistente"];

export function AssistantBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  // Esc closes from anywhere while open; focus returns to the launcher.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel when it opens so keyboard users land inside it.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const hidden =
    pathname === "/" ||
    HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          id="assistant-panel"
          role="dialog"
          aria-label="Assistente"
          tabIndex={-1}
          className={cn(
            "glass no-print fixed z-50 flex flex-col overflow-hidden rounded-2xl shadow-accent outline-none",
            "left-3 right-3 top-[14vh] bottom-[152px]",
            "sm:inset-auto sm:right-6 sm:bottom-[6rem] sm:h-[min(560px,calc(100dvh-9rem))] sm:w-[380px]",
          )}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi l'assistente"
            className="btn-press absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
          <div className="flex min-h-0 flex-1 flex-col px-4">
            <AssistantChat compact />
          </div>
        </div>
      )}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? "Chiudi l'assistente" : "Apri l'assistente"}
        title="Assistente"
        className={cn(
          "btn-press no-print fixed z-40 flex size-14 items-center justify-center rounded-full bg-primary-gradient text-white shadow-accent transition-opacity hover:opacity-95",
          "bottom-[84px] right-4 sm:bottom-6 sm:right-6",
        )}
      >
        <LifeBuoy aria-hidden="true" className="size-6 buoy-spin" />
      </button>
    </>
  );
}
