"use client";

/**
 * Tour guidato mostrato UNA volta sola, al primo accesso al cruscotto dopo
 * l'onboarding. Quattro passi che indicano: appelli urgenti, aggiunta di un
 * voto al libretto, avvio di una sessione focus, posizione delle impostazioni.
 *
 * Ogni passo è una card CENTRATA a schermo (position: fixed, via il primitivo
 * `Overlay align="center"`) su un velo semitrasparente a tutto schermo: niente
 * ancoraggi agli elementi della pagina, niente frecce/puntatori.
 *
 * Apertura LATCHED: si decide una volta sola, al primo gating utile, se aprire;
 * dopodiché solo la X o "Ho capito" chiudono il tour. Lo stato di auth/sync che
 * si assesta dopo la prima sincronizzazione non può più chiuderlo.
 *
 * NB / deviazione: la specifica chiedeva un flag su `profiles` (Supabase), ma
 * aggiungere una colonna remota è fuori scope qui — il completamento è quindi
 * persistito SOLO in localStorage ("studentos-tour-done"). Conseguenza: il tour
 * può riapparire su un nuovo dispositivo/browser. Da promuovere a flag di
 * profilo quando si toccherà lo schema cloud.
 */
import { ArrowLeft, ArrowRight, Check, Compass, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Overlay } from "@/components/primitives/Overlay";
import { Button } from "@/components/primitives/Button";
import { useSettings } from "@/lib/state/settings";
import { useAuth } from "@/lib/supabase/auth";

const TOUR_DONE_KEY = "studentos-tour-done";

const STEPS = [
  {
    title: "Appelli urgenti",
    body: "In alto trovi gli appelli più vicini e le iscrizioni in scadenza, con un colore che cresce con l'urgenza. La timeline degli esami raccoglie tutte le date in arrivo.",
  },
  {
    title: "Aggiungi un voto",
    body: "Vai su Libretto per registrare un esame superato: inserimento manuale, import CSV o import dal PDF di Delphi. Media e CFU sul cruscotto si aggiornano subito.",
  },
  {
    title: "Avvia una sessione focus",
    body: "Nella sezione Focus trovi il timer pomodoro e la bacheca delle attività: scegli un corso, avvia il timer e tieni traccia delle tue sessioni di studio.",
  },
  {
    title: "Le impostazioni",
    body: "Il pulsante Configura qui nel cruscotto (e la voce Impostazioni nel menu) ti riporta ad ateneo, corso e anno per aggiornare in ogni momento la tua configurazione.",
  },
] as const;

function tourDone(): boolean {
  try {
    return localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistDone() {
  try {
    localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {
    // storage non disponibile (es. navigazione privata) — il tour ricomparirà
  }
}

/**
 * Apertura del tour come external store latched (sul modello di `useNowMinute`
 * / `useTheme`). Lo snapshot lato server è SEMPRE `false` (niente mismatch di
 * idratazione). Lato client ci si sottoscrive a settings+auth: NON appena il
 * gating è soddisfatto la PRIMA volta, `tourOpen` passa a `true`. La decisione
 * è poi CONGELATA (`decided`): i successivi cambi di stato — in particolare la
 * fine della sincronizzazione iniziale — non possono più riaprire né, soprattutto,
 * chiudere il tour. L'unica via di chiusura è `dismissTour()` (X o "Ho capito").
 * Aggiornare lo stato dentro la callback di subscribe (o in un gestore evento) è
 * la forma consentita dalla regola react-hooks (no setState sincrono al mount).
 */
let tourOpen = false;
let decided = false;
const tourListeners = new Set<() => void>();

function emitTour() {
  for (const l of tourListeners) l();
}

/** Il gating, identico nello spirito a FirstRunGate, letto dagli snapshot
 *  correnti degli store: impostazioni idratate e — se loggati — profilo cloud
 *  riconciliato, con un preset scelto, e tour non ancora completato. */
function tourShouldOpen(): boolean {
  const { hydrated, presetId } = useSettings.getState();
  const { status, reconciled } = useAuth.getState();
  const ready =
    hydrated && status !== "loading" && !(status === "signedIn" && !reconciled);
  return ready && Boolean(presetId) && !tourDone();
}

/** Valutata al mount e a ogni cambio di settings/auth, ma SOLO finché la
 *  decisione non è presa: può solo APRIRE, mai chiudere. */
function evaluateTour() {
  if (decided) return;
  if (tourShouldOpen()) {
    tourOpen = true;
    decided = true;
    emitTour();
  }
}

/** Chiusura definitiva per la sessione: persiste il flag e congela la
 *  decisione, così un eventuale rimontaggio del cruscotto non lo riapre. */
function dismissTour() {
  persistDone();
  tourOpen = false;
  decided = true;
  emitTour();
}

function subscribeTour(onChange: () => void): () => void {
  tourListeners.add(onChange);
  // Lo store può essere già pronto al mount (es. modalità offline): valuta subito.
  evaluateTour();
  const unsubSettings = useSettings.subscribe(evaluateTour);
  const unsubAuth = useAuth.subscribe(evaluateTour);
  return () => {
    tourListeners.delete(onChange);
    unsubSettings();
    unsubAuth();
  };
}

function useTourOpen(): boolean {
  return useSyncExternalStore(
    subscribeTour,
    () => tourOpen,
    () => false,
  );
}

export function CruscottoTour() {
  const [step, setStep] = useState(0);
  // Apertura decisa una volta sola e congelata: né la sync né lo stato auth
  // possono chiudere il tour, solo `close()` (X o "Ho capito").
  const open = useTourOpen();

  function close() {
    dismissTour();
  }

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <Overlay open={open} onClose={close} label="Tour del cruscotto" align="center">
      <div className="max-w-md p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <Compass aria-hidden="true" className="size-5 text-[var(--signal-2)]" />
            {current.title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi il tour"
            className="btn-press -m-1 rounded-lg p-1 text-ink-faint hover:text-ink"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-ink-mute">{current.body}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span
            className="text-xs tabular-nums text-ink-faint"
            aria-label={`Passo ${step + 1} di ${STEPS.length}`}
          >
            {step + 1}/{STEPS.length}
          </span>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button size="sm" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                Indietro
              </Button>
            )}
            {isLast ? (
              <Button size="sm" variant="primary" onClick={close}>
                <Check aria-hidden="true" className="size-3.5" />
                Ho capito
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setStep((s) => s + 1)}
              >
                Avanti
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
