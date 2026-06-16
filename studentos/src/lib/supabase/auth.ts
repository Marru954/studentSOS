"use client";

/**
 * Auth state for the optional online layer. A thin Zustand mirror over the
 * Supabase session: `hydrate()` reads the current session and subscribes to
 * changes; when Supabase is not configured the store sits in "offline" and the
 * app behaves exactly as the local-only build.
 *
 * Email + password — the single sign-in for every ateneo. Sign-up is gated to
 * institutional inboxes (`isUniversityEmail`, in `emailToAteneo`) and confirmed
 * by email; the session lives in cookies (see `client.ts`). Authorization is
 * enforced server-side by Supabase RLS, never by the client.
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

export interface AuthResult {
  ok: boolean;
  /** Localised message to surface to the user. */
  message: string;
}

/** Minimum password length we accept (Supabase's own minimum is 6). */
export const MIN_PASSWORD = 8;

function gateEmail(email: string): AuthResult | null {
  if (!email) return { ok: false, message: "Inserisci la tua email." };
  if (!isUniversityEmail(email)) {
    return {
      ok: false,
      message:
        "Usa la tua email universitaria istituzionale (es. nome@studenti.uniroma2.it).",
    };
  }
  return null;
}

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  message: "Accesso online non configurato su questa installazione.",
};

/** Where Supabase email links (confirm / recovery) come back to. */
function callbackUrl(suffix = ""): string | undefined {
  return typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback${suffix}`
    : undefined;
}

/** Map the common Supabase auth errors to a friendly Italian message — never
 *  echo the raw provider string to the UI. */
function localizeAuthError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("invalid login")) return "Email o password non corretti.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "Esiste già un account con questa email: accedi o reimposta la password.";
  if (m.includes("email not confirmed"))
    return "Conferma prima la tua email: apri il link che ti abbiamo inviato.";
  if (m.includes("password should be") || m.includes("weak password"))
    return `La password deve avere almeno ${MIN_PASSWORD} caratteri.`;
  if (m.includes("rate limit") || m.includes("too many") || m.includes("for security purposes"))
    return "Troppi tentativi. Riprova tra qualche minuto.";
  return "Operazione non riuscita. Riprova tra poco.";
}

/** Create an account (institutional email only). With email confirmation on,
 *  no session is returned until the user opens the link sent to their inbox. */
export async function signUpWithPassword(
  emailRaw: string,
  password: string,
): Promise<AuthResult> {
  const email = emailRaw.trim().toLowerCase();
  const gate = gateEmail(email);
  if (gate) return gate;
  if (password.length < MIN_PASSWORD) {
    return {
      ok: false,
      message: `La password deve avere almeno ${MIN_PASSWORD} caratteri.`,
    };
  }
  const sb = getSupabase();
  if (!sb) return NOT_CONFIGURED;
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl() },
  });
  if (error) return { ok: false, message: localizeAuthError(error.message) };
  if (data.session) return { ok: true, message: "Account creato. Accesso in corso…" };
  return {
    ok: true,
    message:
      "Ti abbiamo inviato un'email di conferma. Aprila per attivare l'account.",
  };
}

/** Sign in with an existing account. */
export async function signInWithPassword(
  emailRaw: string,
  password: string,
): Promise<AuthResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !password)
    return { ok: false, message: "Inserisci email e password." };
  const sb = getSupabase();
  if (!sb) return NOT_CONFIGURED;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: localizeAuthError(error.message) };
  return { ok: true, message: "Accesso effettuato." };
}

/** Send a password-reset email; the link lands on /auth/callback?type=recovery.
 *  Also the path for legacy passwordless accounts to set their first password. */
export async function requestPasswordReset(emailRaw: string): Promise<AuthResult> {
  const email = emailRaw.trim().toLowerCase();
  const gate = gateEmail(email);
  if (gate) return gate;
  const sb = getSupabase();
  if (!sb) return NOT_CONFIGURED;
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl("?type=recovery"),
  });
  // Don't leak whether the address exists.
  if (error) return { ok: false, message: localizeAuthError(error.message) };
  return {
    ok: true,
    message:
      "Se esiste un account con questa email, riceverai un link per reimpostare la password.",
  };
}

/** Set a new password for the user in the current (recovery) session. */
export async function updatePassword(password: string): Promise<AuthResult> {
  if (password.length < MIN_PASSWORD) {
    return {
      ok: false,
      message: `La password deve avere almeno ${MIN_PASSWORD} caratteri.`,
    };
  }
  const sb = getSupabase();
  if (!sb) return NOT_CONFIGURED;
  const { error } = await sb.auth.updateUser({ password });
  if (error) return { ok: false, message: localizeAuthError(error.message) };
  return { ok: true, message: "Password aggiornata." };
}
