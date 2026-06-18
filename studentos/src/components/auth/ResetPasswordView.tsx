"use client";

/**
 * Set a new password using the recovery session created by the reset link
 * (reached via /auth/callback?type=recovery). If there's no session — the link
 * was opened on another device or has expired — we ask for a fresh reset.
 */
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/primitives/Button";
import { MIN_PASSWORD, updatePassword, useAuth } from "@/lib/supabase/auth";

export function ResetPasswordView() {
  const router = useRouter();
  const status = useAuth((s) => s.status);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    useAuth.getState().hydrate();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Le due password non coincidono.");
      return;
    }
    setBusy(true);
    const r = await updatePassword(password);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/panoramica"), 1200);
  }

  return (
    <main
      id="contenuto"
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
    >
      <div className="glass gradient-ring reveal in rounded-2xl border border-line p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Wordmark className="text-2xl" />
          <p className="text-sm text-ink-mute">Scegli una nuova password.</p>
        </div>

        {status === "loading" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="size-8 animate-spin rounded-full border-2 border-line border-t-signal" />
            <p className="text-sm text-ink-mute">Verifica del link…</p>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-signal/40 bg-signal-dim p-5 text-center">
            <CheckCircle2 aria-hidden="true" className="size-8 text-signal" />
            <p className="text-sm font-medium text-ink">Password aggiornata.</p>
            <p className="text-xs text-ink-mute">Ti porto al panoramica…</p>
          </div>
        ) : status === "signedOut" || status === "offline" ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-warn/40 bg-warn-dim p-5 text-center">
            <p className="text-sm font-medium text-ink">
              Link non valido o scaduto
            </p>
            <p className="text-xs text-ink-mute">
              Apri il link di reset sullo stesso dispositivo, oppure richiedine
              uno nuovo.
            </p>
            <Link
              href="/login"
              className="text-xs text-signal underline hover:text-ink"
            >
              Richiedi un nuovo link
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="reset-password"
                className="text-label font-medium text-ink-mute"
              >
                Nuova password
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="reset-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  autoFocus
                  required
                  minLength={MIN_PASSWORD}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Almeno ${MIN_PASSWORD} caratteri`}
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
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="reset-confirm"
                className="text-label font-medium text-ink-mute"
              >
                Conferma password
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="reset-confirm"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ripeti la password"
                  className="h-11 w-full rounded-xl border border-line bg-night-800 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-danger/40 bg-danger-dim px-3 py-2 text-xs text-danger"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={busy}
              className="h-11 w-full"
            >
              Aggiorna password
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
