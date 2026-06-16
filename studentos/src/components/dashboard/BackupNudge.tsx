"use client";

/** Discreet, dismissible reminder that data is local and signing in is the way
 *  to back it up / reach it from other devices. Informativo, mai un muro: si
 *  mostra solo quando l'accesso online e configurato ma l'utente non e loggato
 *  (status "signedOut"), e sparisce per sempre una volta chiuso. */
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useAuth } from "@/lib/supabase/auth";

const STORAGE_KEY = "studentos-backup-nudge-dismissed";
const listeners = new Set<() => void>();

function dismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function dismiss(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // private mode / storage disabled — hide for this session anyway
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** SSR snapshot = true (dismissed) so the strip never flashes before hydration. */
function useDismissed(): boolean {
  return useSyncExternalStore(subscribe, dismissed, () => true);
}

export function BackupNudge({ className }: { className?: string }) {
  const status = useAuth((s) => s.status);
  const isDismissed = useDismissed();

  // Solo se l'accesso e disponibile (status risolto) ma l'utente non e entrato.
  if (status !== "signedOut" || isDismissed) return null;

  return (
    <aside
      role="note"
      className={`glass flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm ${className ?? ""}`}
    >
      <ShieldCheck
        aria-hidden="true"
        className="size-4 shrink-0 text-signal"
      />
      <p className="flex-1 text-ink-mute">
        I tuoi dati sono su questo dispositivo.{" "}
        <Link href="/login" className="font-medium text-ink underline hover:text-signal">
          Accedi
        </Link>{" "}
        per non perderli e ritrovarli su altri dispositivi.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Nascondi questo promemoria"
        className="shrink-0 rounded-md p-1 text-ink-faint transition-colors hover:text-ink focus:text-ink focus:outline-none"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </aside>
  );
}
