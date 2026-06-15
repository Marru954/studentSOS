"use client";

/** Floating "+" button (bottom-right; lifted above the mobile bottom nav) that
 *  opens a small menu of quick-create actions, each navigating to the page that
 *  hosts the relevant form. Navigating to the page is sufficient — deep-linking
 *  into the form is intentionally out of scope.
 *
 *  Shortcut note: OBIETTIVO 11 mentions Cmd+K, but Cmd+K is already claimed by
 *  the global search palette (OBIETTIVO 16). Quick-add is therefore opened by
 *  this button and by Cmd+J. */
import {
  CalendarClock,
  GraduationCap,
  ListChecks,
  NotebookPen,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Overlay } from "@/components/primitives/Overlay";
import { useGlobalKey } from "@/lib/hooks/useGlobalKey";

const ACTIONS = [
  { label: "Nuova nota", href: "/note", Icon: NotebookPen },
  { label: "Nuovo task", href: "/focus", Icon: ListChecks },
  { label: "Aggiungi esame al libretto", href: "/libretto", Icon: GraduationCap },
  { label: "Aggiungi appello", href: "/appelli", Icon: CalendarClock },
] as const;

export function QuickAddFab() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Cmd/Ctrl+J toggles the quick-add menu (Cmd+K belongs to search).
  useGlobalKey("j", (e) => {
    e.preventDefault();
    setOpen((v) => !v);
  });

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Azioni rapide"
        title="Azioni rapide (Cmd+J)"
        className="btn-press no-print fixed bottom-[84px] right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary-gradient text-white shadow-accent transition-opacity hover:opacity-95 sm:bottom-6 sm:right-6"
      >
        <Plus aria-hidden="true" className="size-6" />
      </button>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        label="Azioni rapide"
        align="center"
        className="max-w-xs"
      >
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Azioni rapide</p>
        </div>
        <ul className="p-2">
          {ACTIONS.map(({ label, href, Icon }) => (
            <li key={href}>
              <button
                type="button"
                onClick={() => go(href)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-night-700"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 text-ink-mute" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </Overlay>
    </>
  );
}
