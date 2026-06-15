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
import { resetLocalData } from "./sync";

type AuthStatus = "loading" | "signedIn" | "signedOut" | "offline";

/** localStorage key holding the id of the account whose data is in IndexedDB,
 *  so a sign-in with a different id is detected as an account switch. */
export const UID_STORAGE_KEY = "studentos-uid";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  email: string | null;
  hydrated: boolean;
  /** True once auth+cloud have settled so local settings can be trusted by the
   *  onboarding gate. False while a signed-in reconcile is still in flight —
   *  set by StoreProvider around startCloudSync. */
  reconciled: boolean;
  hydrate(): void;
  signOut(): Promise<void>;
}

export const useAuth = create<AuthState>()((set, get) => ({
  status: "loading",
  user: null,
  email: null,
  hydrated: false,
  reconciled: false,

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
    sb.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      set({
        user,
        email: user?.email ?? null,
        status: user ? "signedIn" : "signedOut",
      });
      // Account changed → wipe the previous user's local data so nothing leaks
      // into the next session, and the next sign-in can't migrate it upward.
      // (Switching to a *different* account without an explicit sign-out is
      // handled in StoreProvider via the stored uid.)
      if (event === "SIGNED_OUT") {
        if (typeof window !== "undefined") {
          localStorage.removeItem(UID_STORAGE_KEY);
        }
        void resetLocalData();
      }
    });
  },

  async signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    set({ user: null, email: null, status: "signedOut" });
  },
}));

/**
 * DEV ONLY. Fakes a signed-in session for any email so the logged-in UX can be
 * tested locally without a magic link. No real Supabase auth happens — the
 * synthetic user has no JWT, so any cloud write is silently rejected by RLS
 * (best-effort, harmless). The whole branch is stripped from production builds
 * by the static NODE_ENV check.
 */
export function devLogin(emailRaw: string): void {
  if (process.env.NODE_ENV !== "development") return;
  const email = emailRaw.trim().toLowerCase() || "test@studenti.uniroma2.it";
  const user = {
    id: "00000000-0000-0000-0000-000000000000",
    email,
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { provider: "dev" },
    user_metadata: {},
    created_at: "1970-01-01T00:00:00.000Z",
  } as unknown as User;
  useAuth.setState({ user, email, status: "signedIn", hydrated: true });
}

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
