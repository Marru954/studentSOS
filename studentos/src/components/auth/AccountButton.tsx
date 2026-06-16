"use client";

/** Compact account control for the navbar. Hidden when the online layer isn't
 *  configured (pure local build). Signed out → "Accedi"; signed in → an initial
 *  avatar that signs out. */
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth";

export function AccountButton() {
  const router = useRouter();
  const status = useAuth((s) => s.status);
  const email = useAuth((s) => s.email);

  if (status === "offline" || status === "loading") return null;

  if (status === "signedIn") {
    const initial = (email?.[0] ?? "?").toUpperCase();
    return (
      <button
        type="button"
        title={`${email} — esci`}
        onClick={async () => {
          await useAuth.getState().signOut();
          router.push("/");
        }}
        className="group flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-2 text-xs text-ink-mute transition-colors hover:border-line-strong hover:text-ink"
      >
        <span className="bg-primary-gradient flex size-6 items-center justify-center rounded-full text-[0.7rem] font-semibold text-white">
          {initial}
        </span>
        <LogOut aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Esci ({email})</span>
      </button>
    );
  }

  return (
    <Link
      href="/login"
      title="Accedi o registrati per salvare i tuoi dati su più dispositivi"
      aria-label="Accedi o registrati per salvare i tuoi dati su più dispositivi"
      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors hover:border-line-strong hover:text-ink"
    >
      <LogIn aria-hidden="true" className="size-3.5" />
      Accedi
    </Link>
  );
}
