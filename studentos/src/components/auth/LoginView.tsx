"use client";

/**
 * Email + password sign-in — the single entry for every ateneo. Three modes:
 * accedi (sign in), registrati (sign up, gated to institutional emails and
 * confirmed by email), and "password dimenticata" (reset). No password ever
 * reaches our code beyond the Supabase client call; RLS guards the data.
 */
import { CheckCircle2, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/primitives/Button";
import { detectAteneo, isUniversityEmail } from "@/lib/domain/emailToAteneo";
import { getPreset } from "@/lib/sync/universities";
import {
  devLogin,
  MIN_PASSWORD,
  requestPasswordReset,
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/supabase/auth";
import { supabaseConfigured } from "@/lib/supabase/client";

const IS_DEV = process.env.NODE_ENV === "development";

type Mode = "signin" | "signup" | "reset";

const COPY: Record<Mode, { subtitle: string; submit: string }> = {
  signin: { subtitle: "Accedi con la tua email universitaria.", submit: "Accedi" },
  signup: {
    subtitle: "Crea il tuo account con l'email universitaria.",
    submit: "Crea account",
  },
  reset: {
    subtitle: "Reimposta la password del tuo account.",
    submit: "Invia link di reset",
  },
};

export function LoginView() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const configured = supabaseConfigured();

  // Live ateneo preview as a reassuring "we recognise you" signal.
  const detected = useMemo(() => {
    if (!isUniversityEmail(email)) return null;
    const id = detectAteneo(email);
    return id ? getPreset(id) : null;
  }, [email]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setSent(null);
    setPassword("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const r =
      mode === "signin"
        ? await signInWithPassword(email, password)
        : mode === "signup"
          ? await signUpWithPassword(email, password)
          : await requestPasswordReset(email);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    if (mode === "signin") {
      // Session is live; FirstRunGate routes to onboarding if not configured.
      router.push("/cruscotto");
      return;
    }
    setSent(r.message);
  }

  return (
    <main
      id="contenuto"
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
    >
      <div className="glass gradient-ring reveal in rounded-2xl border border-line p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Wordmark className="text-2xl" />
          <p className="text-sm text-ink-mute">{COPY[mode].subtitle}</p>
          {mode !== "reset" && (
            <p className="text-xs text-ink-faint">
              Metti al sicuro i tuoi dati e ritrovali su altri dispositivi. L&rsquo;app
              funziona benissimo anche senza.
            </p>
          )}
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-signal/40 bg-signal-dim p-5 text-center">
            <CheckCircle2 aria-hidden="true" className="size-8 text-signal" />
            <p className="text-sm font-medium text-ink">{sent}</p>
            {email && (
              <p className="text-xs text-ink-mute">
                Inviata a <span className="font-num">{email}</span>. Puoi chiudere
                questa scheda.
              </p>
            )}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="text-xs text-ink-mute underline hover:text-ink"
            >
              Torna all&rsquo;accesso
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-email"
                className="text-label font-medium text-ink-mute"
              >
                Email universitaria
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.cognome@studenti.uniroma2.it"
                  className="h-11 w-full rounded-xl border border-line bg-night-800 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
                />
              </div>
              {detected && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-signal">
                  <GraduationCap aria-hidden="true" className="size-3.5" />
                  Riconosciuto: {detected.shortName}
                </p>
              )}
            </div>

            {mode !== "reset" && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="login-password"
                  className="text-label font-medium text-ink-mute"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                  />
                  <input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    required
                    minLength={MIN_PASSWORD}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "signup"
                        ? `Almeno ${MIN_PASSWORD} caratteri`
                        : "La tua password"
                    }
                    className="h-11 w-full rounded-xl border border-line bg-night-800 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Nascondi password" : "Mostra password"}
                    aria-pressed={showPw}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-faint hover:text-ink focus:text-ink focus:outline-none"
                  >
                    {showPw ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="mt-1 self-end text-xs text-ink-mute underline hover:text-ink"
                  >
                    Password dimenticata?
                  </button>
                )}
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-danger/40 bg-danger-dim px-3 py-2 text-xs text-danger"
              >
                {error}
              </p>
            )}

            {!configured && (
              <p className="rounded-lg border border-warn/40 bg-warn-dim px-3 py-2 text-xs text-warn">
                Accesso online non configurato su questa installazione.{" "}
                <Link href="/cruscotto" className="underline">
                  vai al cruscotto
                </Link>
                .
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={busy}
              className="h-11 w-full"
            >
              {COPY[mode].submit}
            </Button>

            <div className="flex flex-col items-center gap-1 text-center text-xs text-ink-mute">
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="underline hover:text-ink"
                >
                  Non hai un account? Registrati
                </button>
              )}
              {mode === "signup" && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="underline hover:text-ink"
                >
                  Hai già un account? Accedi
                </button>
              )}
              {mode === "reset" && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="underline hover:text-ink"
                >
                  Torna all&rsquo;accesso
                </button>
              )}
              <span className="text-ink-faint">
                Solo email istituzionali. I tuoi dati restano privati: nessun
                altro pu&ograve; vederli.
              </span>
            </div>
          </form>
        )}
      </div>

      {IS_DEV && (
        <div className="mt-4 rounded-xl border border-dashed border-warn/50 bg-warn-dim p-4">
          <p className="mb-2 text-xs font-semibold text-warn">
            Dev · accesso di test (solo development)
          </p>
          <p className="mb-3 text-[0.7rem] text-ink-mute">
            Salta l&rsquo;auth: entra con qualsiasi email per provare la UX
            loggata. Sessione finta, nessuna auth reale.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@studenti.uniroma2.it"
              aria-label="Email utente di test"
              className="h-9 flex-1 rounded-lg border border-line bg-night-800 px-3 text-sm text-ink placeholder:text-ink-faint focus:border-warn focus:outline-none"
            />
            <Button
              type="button"
              onClick={() => {
                devLogin(email);
                router.push("/cruscotto");
              }}
            >
              Accedi come test
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-ink-mute">
        Vuoi prima dare un&rsquo;occhiata?{" "}
        <Link href="/cruscotto" className="underline hover:text-ink">
          Esplora StudentOS
        </Link>
      </p>
    </main>
  );
}
