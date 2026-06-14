"use client";

/**
 * Auth state for the optional online layer. A thin Zustand mirror over the
 * Supabase session: `hydrate()` reads the current session and subscribes to
 * changes; when Supabase is not configured the store sits in "offline" and the
 * app behaves exactly as the local-only build.
 *
 * Magic-link only — the user proves they own a university inbox, no password
 * ever travels. The institutional-domain gate lives in `emailToAteneo`.
 */
import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { isUniversityEmail } from "@/lib/domain/emailToAteneo";
import { getSupabase } from "./client";

type AuthStatus = "loading" | "signedIn" | "signedOut" | "offline";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  email: string | null;
  hydrated: boolean;
  hydrate(): void;
  signOut(): Promise<void>;
}

export const useAuth = create<AuthState>()((set, get) => ({
  status: "loading",
  user: null,
  email: null,
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ hydrated: true });
    const sb = getSupabase();
    if (!sb) {
      set({ status: "offline" });
      return;
    }
    void sb.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      set({
        user,
        email: user?.email ?? null,
        status: user ? "signedIn" : "signedOut",
      });
    });
    sb.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      set({
        user,
        email: user?.email ?? null,
        status: user ? "signedIn" : "signedOut",
      });
    });
  },

  async signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    set({ user: null, email: null, status: "signedOut" });
  },
}));

export interface MagicLinkResult {
  ok: boolean;
  /** Localised message to surface to the user. */
  message: string;
}

/** Send a passwordless magic link, but only to a valid institutional address. */
export async function sendMagicLink(emailRaw: string): Promise<MagicLinkResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return { ok: false, message: "Inserisci la tua email." };
  if (!isUniversityEmail(email)) {
    return {
      ok: false,
      message:
        "Usa la tua email universitaria istituzionale (es. nome@studenti.uniroma2.it).",
    };
  }
  const sb = getSupabase();
  if (!sb) {
    return {
      ok: false,
      message:
        "Accesso online non configurato su questa installazione. StudentOS funziona comunque in locale.",
    };
  }
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  });
  if (error) {
    return { ok: false, message: "Invio non riuscito. Riprova tra poco." };
  }
  return {
    ok: true,
    message: "Link inviato! Controlla la tua casella e apri il link di accesso.",
  };
}
