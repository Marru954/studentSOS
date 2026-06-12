import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchConfig, startLogin } from "../api";

const ERRORS: Record<string, string> = {
  saml: "Avvio dell'autenticazione non riuscito. Riprova.",
  acs: "La risposta dell'Identity Provider non è stata validata.",
  slo: "Il messaggio di logout non è risultato valido.",
};

export function Login() {
  const [params] = useSearchParams();
  const error = params.get("error");
  const loggedOut = params.get("logout") === "1";
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    fetchConfig().then((c) => setDevMode(c.devMode)).catch(() => {});
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(16,24,40,0.12)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 font-semibold text-white">
            U
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">UniPortal</h1>
            <p className="text-xs text-gray-500">Università di Roma Tor Vergata</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold tracking-tight">Accedi al portale</h2>
        <p className="mt-2 text-sm text-gray-500">
          Usa le credenziali istituzionali tramite Single Sign-On (federazione
          IDEM&nbsp;GARR).
        </p>

        {loggedOut && (
          <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Sei uscito correttamente.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {ERRORS[error] ?? "Errore di autenticazione."}
          </p>
        )}

        <button
          type="button"
          onClick={startLogin}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Accedi con SSO Tor Vergata
        </button>

        {devMode && (
          <a
            href="/saml/dev-login"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Accesso demo (sviluppo, senza IdP)
          </a>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Verrai reindirizzato all'Identity Provider dell'ateneo.
        </p>
      </div>
    </main>
  );
}
