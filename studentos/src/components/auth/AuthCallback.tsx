"use client";

/**
 * Lands here from a Supabase email link — sign-up confirmation or password
 * recovery. The browser client (detectSessionInUrl + PKCE) exchanges the code
 * for a session on init; we wait for auth to settle, then route: recovery →
 * /auth/reset, first-run → /onboarding, otherwise → /panoramica. If Supabase
 * isn't configured we bounce straight to the app.
 */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/supabase/auth";
import { fetchProfile } from "@/lib/supabase/remote";
import { isOnboarded } from "@/lib/supabase/isOnboarded";

export function AuthCallback() {
  const router = useRouter();
  const status = useAuth((s) => s.status);

  useEffect(() => {
    useAuth.getState().hydrate();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;
    (async () => {
      if (status === "offline") {
        router.replace("/panoramica");
        return;
      }
      // Password-recovery links carry ?type=recovery → send the user to set a
      // new password (the screen handles the no-session / expired-link case).
      const isRecovery =
        typeof window !== "undefined" &&
        (new URLSearchParams(window.location.search).get("type") === "recovery" ||
          window.location.hash.includes("type=recovery"));
      if (isRecovery) {
        router.replace("/auth/reset");
        return;
      }
      // The cloud profile is the ONLY source of truth for "already onboarded".
      // Local IndexedDB is never consulted here — it may still hold a previous
      // account's preset. A profile missing preset_id OR programme → always
      // /onboarding; only a complete cloud profile skips to /panoramica.
      const uid = useAuth.getState().user?.id;
      if (!uid) {
        router.replace("/onboarding");
        return;
      }
      const profile = await fetchProfile(uid);
      if (cancelled) return;
      // Shared predicate — same definition as FirstRunGate / PanoramicaTour.
      router.replace(isOnboarded(profile) ? "/panoramica" : "/onboarding");
    })();
    return () => {
      cancelled = true;
    };
  }, [status, router]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <div className="size-8 animate-spin rounded-full border-2 border-line border-t-signal" />
      <p className="text-sm text-ink-mute">Accesso in corso…</p>
    </main>
  );
}
