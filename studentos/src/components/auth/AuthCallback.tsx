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
import { fetchProfile } from "@/lib/supabase/remote";

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
      // The cloud profile is the ONLY source of truth for "already onboarded".
      // Local IndexedDB is never consulted here — it may still hold a previous
      // account's preset. A profile missing preset_id OR programme → always
      // /onboarding; only a complete cloud profile skips to /cruscotto.
      const uid = useAuth.getState().user?.id;
      if (!uid) {
        router.replace("/onboarding");
        return;
      }
      const profile = await fetchProfile(uid);
      if (cancelled) return;
      const complete = Boolean(profile?.preset_id && profile?.programme);
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
