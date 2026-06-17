import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

/** Global footer for the internal pages. Minimal: brand + the privacy promise.
 *  Hidden when printing (FEAT export). */
export function AppFooter() {
  return (
    <footer className="no-print mt-8 border-t border-line">
      <div className="wrap flex flex-wrap items-center justify-between gap-3 py-8 text-[0.8rem]">
        <Link
          href="/"
          className="font-display font-bold text-ink transition-opacity hover:opacity-80"
        >
          <Wordmark />
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-mute">
          <Link href="/#faq" className="transition-colors hover:text-ink">
            Domande frequenti
          </Link>
          <a
            href="mailto:support@studentos.app?subject=Feedback%20StudentOS"
            className="transition-colors hover:text-ink"
          >
            Contatto
          </a>
          <span>I tuoi dati restano su questo dispositivo</span>
        </div>
      </div>
    </footer>
  );
}
