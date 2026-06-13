import { ExternalLink, NotebookPen, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const DELPHI_URL = "https://delphi.uniroma2.it/totem/jsp/index.jsp";

const ACTION =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-night-800 px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-line-strong hover:bg-night-700";

/** Three one-tap shortcuts under the summary bar: add a grade, open the
 *  ateneo portal, jot a note. */
export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Link href="/libretto" className={ACTION}>
        <Plus aria-hidden="true" className="size-3.5 text-signal" />
        Aggiungi voto
      </Link>
      <a
        href={DELPHI_URL}
        target="_blank"
        rel="noreferrer"
        className={ACTION}
      >
        <ExternalLink aria-hidden="true" className="size-3.5 text-signal" />
        Apri Delphi
        <span className="sr-only"> (si apre in una nuova scheda)</span>
      </a>
      <Link href="/note" className={ACTION}>
        <NotebookPen aria-hidden="true" className="size-3.5 text-signal" />
        Nuova nota
      </Link>
    </div>
  );
}
