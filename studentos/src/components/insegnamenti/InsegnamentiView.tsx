"use client";

/** /insegnamenti — the corso's piano di studi.
 *
 *  Integration glue (FASE 3): the synced/manual insegnamenti come from
 *  `useInsegnamenti`; "superata ✓" is cross-referenced against the libretto —
 *  any insegnamento whose name matches a recorded voto is flagged passed. We
 *  match on a normalised name (the libretto keys on `courseName`, the manifesto
 *  on `nome`), then hand `InsegnamentoList` the Set of *insegnamento ids* it
 *  expects. The onboarded ateneo/corso (`presetId`/`programme`) parametrise both
 *  the load and the sync. */
import { BookOpen, PlusCircle, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  InsegnamentoList,
  InsegnamentoManualForm,
} from "@/components/insegnamenti";
import { Button } from "@/components/primitives/Button";
import { EmptyState } from "@/components/primitives/EmptyState";
import {
  type DraftInsegnamento,
  useInsegnamenti,
} from "@/lib/state/insegnamenti";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";

/** Fold a course name to a comparison key: drop accents/case/punctuation so
 *  "Analisi Matematica I" ↔ "analisi matematica i" still match. */
function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function InsegnamentiView() {
  // Onboarded ateneo + corso drive both the load and the sync.
  const ateneo = useSettings((s) => s.presetId);
  const corso = useSettings((s) => s.programme);
  const settingsHydrated = useSettings((s) => s.hydrated);

  const insegnamenti = useInsegnamenti((s) => s.insegnamenti);
  const manifesto = useInsegnamenti((s) => s.manifesto);
  const hydrated = useInsegnamenti((s) => s.hydrated);
  const syncStatus = useInsegnamenti((s) => s.syncStatus);
  const error = useInsegnamenti((s) => s.error);
  const loadInsegnamenti = useInsegnamenti((s) => s.loadInsegnamenti);
  const syncInsegnamenti = useInsegnamenti((s) => s.syncInsegnamenti);
  const addInsegnamentoManuale = useInsegnamenti((s) => s.addInsegnamentoManuale);

  const librettoItems = useLibretto((s) => s.items);

  const [showForm, setShowForm] = useState(false);

  // Load once the onboarded corso is known (this store isn't hydrated by
  // StoreProvider). Re-runs if the account/corso changes.
  useEffect(() => {
    if (!settingsHydrated) return;
    void loadInsegnamenti(ateneo, corso);
  }, [settingsHydrated, ateneo, corso, loadInsegnamenti]);

  // INTEGRAZIONE SUPERATA ✓ — ids of insegnamenti whose name matches a voto.
  const materieSuperate = useMemo(() => {
    const passed = new Set(librettoItems.map((e) => normalizeName(e.courseName)));
    const ids = new Set<string>();
    for (const ins of insegnamenti) {
      if (passed.has(normalizeName(ins.nome))) ids.add(ins.id);
    }
    return ids;
  }, [librettoItems, insegnamenti]);

  const canSync = Boolean(ateneo && corso);
  const syncing = syncStatus === "syncing";

  async function handleSync() {
    if (!canSync || !ateneo || !corso) return;
    const res = await syncInsegnamenti(ateneo, corso);
    // No manifesto → land the student straight on the manual form (see banner).
    if (res.status === "manual") setShowForm(true);
  }

  async function handleAdd(draft: DraftInsegnamento) {
    await addInsegnamentoManuale(draft);
    setShowForm(false);
  }

  const lastSync = manifesto?.last_sync
    ? new Date(manifesto.last_sync).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // ── Loading (initial) ─────────────────────────────────────────────────────
  if (!settingsHydrated || !hydrated) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-24"
        role="status"
        aria-live="polite"
      >
        <div className="size-8 animate-spin rounded-full border-2 border-line border-t-signal" />
        <p className="text-sm text-ink-mute">Caricamento insegnamenti…</p>
      </div>
    );
  }

  // ── Manual form ───────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-ink">Aggiungi un insegnamento</h1>
          {syncStatus === "manual" && (
            <p className="muted text-sm">
              Non troviamo il manifesto del tuo corso automaticamente. Inserisci
              le materie a mano: restano salvate sul dispositivo.
            </p>
          )}
        </header>
        <InsegnamentoManualForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          ateneo_id={ateneo}
          corso_id={corso}
        />
      </div>
    );
  }

  // ── With data ─────────────────────────────────────────────────────────────
  if (insegnamenti.length > 0) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-ink">Insegnamenti</h1>
            <p className="muted text-sm">
              {insegnamenti.length}{" "}
              {insegnamenti.length === 1 ? "insegnamento" : "insegnamenti"} nel
              piano di studi
              {lastSync && <> · aggiornato il {lastSync}</>}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleSync}
              loading={syncing}
              disabled={!canSync}
              title={
                canSync
                  ? "Risincronizza dal manifesto"
                  : "Completa l'onboarding per la sincronizzazione"
              }
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Aggiorna
            </Button>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <PlusCircle aria-hidden="true" className="size-4" />
              Aggiungi materia
            </Button>
          </div>
        </header>

        {syncStatus === "error" && error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/45 bg-danger-dim px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <InsegnamentoList
          insegnamenti={insegnamenti}
          materieSuperate={materieSuperate}
          onAggiungiManuale={() => setShowForm(true)}
        />
      </div>
    );
  }

  // ── Empty (nothing loaded yet) ────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <EmptyState
        icon={<BookOpen aria-hidden="true" />}
        title="Carica gli insegnamenti del tuo corso"
        description={
          syncStatus === "manual"
            ? "Non abbiamo trovato il manifesto del tuo corso. Aggiungi le materie a mano: restano salvate sul dispositivo."
            : "Sincronizza il manifesto degli studi del tuo corso, oppure inserisci le materie a mano. Tutto resta sul dispositivo."
        }
      >
        <Button
          variant="primary"
          onClick={handleSync}
          loading={syncing}
          disabled={!canSync}
          title={
            canSync ? undefined : "Completa l'onboarding per la sincronizzazione"
          }
        >
          <Sparkles aria-hidden="true" className="size-4" />
          Sincronizza automaticamente
        </Button>
        <Button variant="ghost" onClick={() => setShowForm(true)}>
          <PlusCircle aria-hidden="true" className="size-4" />
          Aggiungi manualmente
        </Button>
      </EmptyState>

      {syncStatus === "error" && error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/45 bg-danger-dim px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
