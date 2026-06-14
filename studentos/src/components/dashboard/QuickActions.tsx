import { ExternalLink, NotebookPen, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const DELPHI_URL = "https://delphi.uniroma2.it/totem/jsp/index.jsp";

const ACTION =
  "glass lift inline-flex items-center gap-2 rounded-xl px-[1.1rem] py-[0.7rem] text-[0.88rem] font-semibold text-ink";
const ICON = "size-[1.06rem] text-[var(--signal-2)]";

/** Three one-tap shortcuts under the summary bar: add a grade, open the
 *  ateneo portal, jot a note. */
export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link href="/libretto" className={ACTION}>
        <Plus aria-hidden="true" className={ICON} />
        Aggiungi voto
      </Link>
      <a href={DELPHI_URL} target="_blank" rel="noreferrer" className={ACTION}>
        <ExternalLink aria-hidden="true" className={ICON} />
        Apri Delphi
        <span className="sr-only"> (si apre in una nuova scheda)</span>
      </a>
      <Link href="/note" className={ACTION}>
        <NotebookPen aria-hidden="true" className={ICON} />
        Nuova nota
      </Link>
    </div>
  );
}
