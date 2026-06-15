"use client";

import { CalendarDays, ExternalLink, NotebookPen, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useSettings } from "@/lib/state/settings";
import { getPreset } from "@/lib/sync/universities";

const ACTION =
  "glass lift inline-flex items-center gap-2 rounded-xl px-[1.1rem] py-[0.7rem] text-[0.88rem] font-semibold text-ink";
const ICON = "size-[1.06rem] text-[var(--signal-2)]";

/** Three one-tap shortcuts under the summary bar: add a grade, reach the ateneo
 *  portal (or the in-app calendar when no portal is known), jot a note. The
 *  portal shortcut is ateneo-aware — Delphi is Tor Vergata-only, so other atenei
 *  get their own portal/links[0] or, failing that, a useful in-app fallback. */
export function QuickActions({ className }: { className?: string }) {
  const presetId = useSettings((s) => s.presetId);
  const preset = getPreset(presetId ?? "");
  const portal = preset?.portalUrl ?? preset?.links?.[0]?.url;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link href="/libretto" className={ACTION}>
        <Plus aria-hidden="true" className={ICON} />
        Aggiungi voto
      </Link>
      {portal ? (
        <a href={portal} target="_blank" rel="noopener noreferrer" className={ACTION}>
          <ExternalLink aria-hidden="true" className={ICON} />
          Vai al portale
          <span className="sr-only"> (si apre in una nuova scheda)</span>
        </a>
      ) : (
        <Link href="/calendario" className={ACTION}>
          <CalendarDays aria-hidden="true" className={ICON} />
          Apri calendario
        </Link>
      )}
      <Link href="/note" className={ACTION}>
        <NotebookPen aria-hidden="true" className={ICON} />
        Nuova nota
      </Link>
    </div>
  );
}
