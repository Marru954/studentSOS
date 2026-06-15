"use client";

/** Minimal accessible modal overlay. No external dep (no headless-ui): a fixed
 *  backdrop above the Toast/AppNav z-ladder (z-50+), a centered glass panel with
 *  role="dialog" aria-modal. Handles Esc to close, backdrop-click to close,
 *  moves focus into the panel on open and restores it to the previously focused
 *  element on close, and traps Tab within the panel. Pure-CSS entrance reuses
 *  the existing `overlay-in`/`dialog-in` classes (reduced-motion safe). */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface OverlayProps {
  open: boolean;
  onClose(): void;
  /** Accessible name for the dialog (aria-label). */
  label: string;
  /** Vertical placement of the panel within the viewport. */
  align?: "center" | "top";
  className?: string;
  children: React.ReactNode;
}

export function Overlay({
  open,
  onClose,
  label,
  align = "center",
  className,
  children,
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // On open: remember the active element, move focus into the panel. On close:
  // restore focus. Keyed on `open` so it's not a forbidden mount-only effect.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    // Prefer the first focusable control (e.g. the search input); fall back to
    // the panel itself (it carries tabIndex={-1}).
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();
    return () => {
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Esc to close + Tab focus trap, scoped to while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "no-print overlay-in fixed inset-0 z-50 flex justify-center bg-black/50 px-4 backdrop-blur-sm",
        align === "top" ? "items-start pt-[12vh]" : "items-center",
      )}
      // Backdrop click closes; clicks inside the panel stop here.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "glass dialog-in w-full rounded-2xl border border-line shadow-soft outline-none",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
