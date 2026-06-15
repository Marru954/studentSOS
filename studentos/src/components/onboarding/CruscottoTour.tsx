"use client";

/**
 * Tour guidato mostrato UNA volta sola, al primo accesso al cruscotto dopo
 * l'onboarding. Quattro passi che indicano: appelli urgenti, aggiunta di un
 * voto al libretto, avvio di una sessione focus, posizione delle impostazioni.
 *
 * NB / deviazione: la specifica chiedeva un flag su `profiles` (Supabase), ma
 * aggiungere una colonna remota è fuori scope qui — il completamento è quindi
 * persistito SOLO in localStorage ("studentos-tour-done"). Conseguenza: il tour
 * può riapparire su un nuovo dispositivo/browser. Da promuovere a flag di
 * profilo quando si toccherà lo schema cloud.
 */
import { ArrowLeft, ArrowRight, Check, Compass, X } from "lucide-react";
import { useState } from "react";
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

export function CruscottoTour() {
  // Lettura una tantum del flag (inizializzatore lazy: niente setState al mount,
  // così la regola react-hooks resta soddisfatta). `dismissed` chiude il tour
  // nella sessione corrente subito dopo la persistenza.
  const [done, setDone] = useState<boolean>(() => tourDone());
  const [step, setStep] = useState(0);

  const hydrated = useSettings((s) => s.hydrated);
  const presetId = useSettings((s) => s.presetId);
  const status = useAuth((s) => s.status);
  const reconciled = useAuth((s) => s.reconciled);

  // Gating come FirstRunGate: solo a impostazioni pronte e — se l'account è
  // collegato — dopo la riconciliazione del profilo cloud (autorevole).
  const ready =
    hydrated &&
    status !== "loading" &&
    !(status === "signedIn" && !reconciled);
  const onboarded = ready && Boolean(presetId);
  const open = onboarded && !done;

  function close() {
    persistDone();
    setDone(true);
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
