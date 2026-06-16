"use client";

/** Page-aware quick-add. The "+" performs the OBVIOUS add for the current page —
 *  it scrolls to and triggers the element marked `data-quickadd` there — and is
 *  hidden on pages without one. Replaces the old ambiguous 4-action menu.
 *  Also bound to Cmd/Ctrl+J (Cmd+K belongs to the search palette). */
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useGlobalKey } from "@/lib/hooks/useGlobalKey";

/** Routes that own a primary "add", with the FAB's accessible label. */
const ADD_ROUTES: { match: string; label: string }[] = [
  { match: "/note", label: "Nuova nota" },
  { match: "/libretto", label: "Aggiungi un esame" },
  { match: "/focus", label: "Nuova attività" },
  { match: "/appelli", label: "Aggiungi un appello" },
  { match: "/orario", label: "Aggiungi una lezione" },
];

/** Scroll to the page's primary add control and trigger it (open/focus). */
function triggerQuickAdd() {
  const el = document.querySelector<HTMLElement>("[data-quickadd]");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el.tagName === "BUTTON" || el.tagName === "SUMMARY") el.click();
  else el.focus();
}

export function QuickAddFab() {
  const pathname = usePathname();
  const action = ADD_ROUTES.find((a) => pathname.startsWith(a.match));

  // Cmd/Ctrl+J = quick-add, only where the page has one.
  useGlobalKey("j", (e) => {
    if (!action) return;
    e.preventDefault();
    triggerQuickAdd();
  });

  if (!action) return null;

  return (
    <button
      type="button"
      onClick={triggerQuickAdd}
      aria-label={action.label}
      title={`${action.label} (Cmd+J)`}
      className="btn-press no-print fixed bottom-[84px] right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary-gradient text-white shadow-accent transition-opacity hover:opacity-95 sm:bottom-6 sm:right-6"
    >
      <Plus aria-hidden="true" className="size-6" />
    </button>
  );
}
