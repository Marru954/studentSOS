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
      // Onboarding is mandatory until the cloud profile carries the ateneo +
      // course. The Supabase profile is the cross-device source of truth: a
      // brand-new account has an empty profile → /onboarding; a user who set up
      // on another device is recognised here and skips straight to /cruscotto.
      // We fall back to local settings when the cloud is unreachable.
      await useSettings.getState().hydrate();
      if (cancelled) return;
      const local = useSettings.getState();
      const localComplete =
        Boolean(local.presetId) && local.yearOfStudy !== undefined;

      const uid = useAuth.getState().user?.id;
      let remoteComplete = false;
      if (uid) {
        const profile = await fetchProfile(uid);
        if (cancelled) return;
        remoteComplete = Boolean(profile?.preset_id && profile?.programme);
      }

      const complete = remoteComplete || localComplete;
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
