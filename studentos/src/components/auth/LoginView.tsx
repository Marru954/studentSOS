"use client";

/**
 * Passwordless login. The student types their institutional email, we validate
 * the domain, preview the detected ateneo, and send a Supabase magic link.
 * No password field — the link in the inbox is the proof of identity.
 */
import { CheckCircle2, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/primitives/Button";
import { useRouter } from "next/navigation";
import { detectAteneo, isUniversityEmail } from "@/lib/domain/emailToAteneo";
import { getPreset } from "@/lib/sync/universities";
import { devLogin, sendMagicLink } from "@/lib/supabase/auth";
import { supabaseConfigured } from "@/lib/supabase/client";

const IS_DEV = process.env.NODE_ENV === "development";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = supabaseConfigured();

  // Live ateneo preview as a reassuring "we recognise you" signal.
  const detected = useMemo(() => {
    if (!isUniversityEmail(email)) return null;
    const id = detectAteneo(email);
    return id ? getPreset(id) : null;
  }, [email]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const r = await sendMagicLink(email);
    setSending(false);
    if (r.ok) setSent(true);
    else setError(r.message);
  }

  return (
    <main
      id="contenuto"
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
    >
      <div className="glass gradient-ring reveal in rounded-2xl border border-line p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Wordmark className="text-2xl" />
          <p className="text-sm text-ink-mute">
            Accedi con la tua email universitaria. Niente password: ti mandiamo
            un link.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-signal/40 bg-signal-dim p-5 text-center">
            <CheckCircle2 aria-hidden="true" className="size-8 text-signal" />
            <p className="text-sm font-medium text-ink">
              Link inviato a <span className="font-num">{email}</span>
            </p>
            <p className="text-xs text-ink-mute">
              Apri il messaggio e tocca il link per entrare. Puoi chiudere questa
              scheda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-xs text-ink-mute underline hover:text-ink"
            >
              Usa un&rsquo;altra email
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
                Accesso online non configurato qui. Puoi comunque usare StudentOS
                in locale —{" "}
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
              loading={sending}
              className="h-11 w-full"
            >
              Invia link di accesso
            </Button>

            <p className="text-center text-xs text-ink-faint">
              Solo email istituzionali. I tuoi dati restano tuoi — RLS per
              utente, nessuna password.
            </p>
          </form>
        )}
      </div>

      {IS_DEV && (
        <div className="mt-4 rounded-xl border border-dashed border-warn/50 bg-warn-dim p-4">
          <p className="mb-2 text-xs font-semibold text-warn">
            Dev · accesso di test (solo development)
          </p>
          <p className="mb-3 text-[0.7rem] text-ink-mute">
            Salta il magic link: entra con qualsiasi email per provare la UX
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
        Preferisci senza account?{" "}
        <Link href="/cruscotto" className="underline hover:text-ink">
          Continua in locale
        </Link>
      </p>
    </main>
  );
}
