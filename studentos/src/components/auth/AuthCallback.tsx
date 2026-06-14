"use client";

/**
 * Lands here from the magic link. supabase-js (detectSessionInUrl + PKCE)
 * exchanges the code in the URL for a session on client init; we just wait for
 * the auth state to settle, then route on: first-run → /onboarding, otherwise
 * → /cruscotto. If Supabase isn't configured we bounce straight to the app.
 */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/supabase/auth";
import { useSettings } from "@/lib/state/settings";

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
        router.replace("/cruscotto");
        return;
      }
      // Decide first-run vs returning from persisted settings.
      await useSettings.getState().hydrate();
      if (cancelled) return;
      const s = useSettings.getState();
      const complete = Boolean(s.presetId) && s.yearOfStudy !== undefined;
      router.replace(complete ? "/cruscotto" : "/onboarding");
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
