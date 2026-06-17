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
        <span className="text-ink-mute">
          I tuoi dati restano su questo dispositivo
        </span>
      </div>
    </footer>
  );
}
