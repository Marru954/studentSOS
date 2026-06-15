"use client";

/** /impostazioni: profilo universitario, aspetto, account, dati locali.
 *  Tutto è già persistente altrove — questa pagina è solo una vista unificata
 *  sui controlli sparsi (settings store, tema, auth). */
import {
  Database,
  Download,
  Info,
  LogOut,
  MessageSquare,
  Palette,
  University,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { exportBackup } from "@/lib/backup";
import {
  useFocusSessions,
  useLibretto,
  useNotes,
  useTasks,
} from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { getPreset } from "@/lib/sync/universities";
import { useAuth } from "@/lib/supabase/auth";
import { resetLocalData } from "@/lib/supabase/sync";

const YEARS = [1, 2, 3, 4, 5, 6];

export function ImpostazioniView() {
  const router = useRouter();
  const settings = useSettings();
  const status = useAuth((s) => s.status);
  const email = useAuth((s) => s.email);
  const librettoCount = useLibretto((s) => s.items.length);
  const notesCount = useNotes((s) => s.items.length);
  const tasksCount = useTasks((s) => s.items.length);
  const focusCount = useFocusSessions((s) => s.items.length);
  const examCount = useSynced((s) => s.examCalls.length);

  if (!settings.hydrated) {
    return (
      <div className="flex flex-col gap-6">
        <header className="reveal">
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Impostazioni</h1>
          <p className="muted mt-1.5">Profilo, aspetto, account e dati locali.</p>
        </header>
        <div role="status" aria-busy="true" className="flex flex-col gap-5">
          <span className="sr-only">Caricamento delle impostazioni…</span>
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
        </div>
      </div>
    );
  }

  const ateneo = settings.presetId ? getPreset(settings.presetId)?.name : undefined;
  const signedIn = status === "signedIn";

  return (
    <div className="flex flex-col gap-6">
      <header className="reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Impostazioni</h1>
        <p className="muted mt-1.5">Profilo, aspetto, account e dati locali.</p>
      </header>

      {/* ── 1. Profilo universitario ── */}
      <Panel title="Profilo universitario" icon={<University />}>
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-label font-medium text-ink-mute">Ateneo</dt>
              <dd className="mt-0.5 text-sm text-ink">{ateneo ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-label font-medium text-ink-mute">Corso</dt>
              <dd className="mt-0.5 text-sm text-ink">{settings.programme ?? "—"}</dd>
            </div>
          </dl>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Anno di corso" htmlFor="imp-anno">
              <select
                id="imp-anno"
                value={settings.yearOfStudy ?? ""}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  void settings.update({
                    yearOfStudy: Number.isInteger(v) && v >= 1 ? v : undefined,
                  });
                }}
                className={inputClass}
              >
                <option value="">—</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}° anno
                  </option>
                ))}
              </select>
            </Field>

            <Field label="CFU del piano" htmlFor="imp-cfu">
              <input
                id="imp-cfu"
                type="number"
                min={1}
                max={600}
                value={settings.degreePlan.totalCfu}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isInteger(v) && v >= 1) {
                    void settings.update({
                      degreePlan: { ...settings.degreePlan, totalCfu: v },
                    });
                  }
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Obiettivo media" htmlFor="imp-obiettivo">
              <input
                id="imp-obiettivo"
                type="number"
                min={18}
                max={30}
                step={0.5}
                value={settings.degreePlan.targetAverage ?? ""}
                placeholder="es. 28"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  void settings.update({
                    degreePlan: {
                      ...settings.degreePlan,
                      targetAverage:
                        e.target.value === "" || Number.isNaN(v) ? undefined : v,
                    },
                  });
                }}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Per cambiare ateneo/corso riusiamo l'intera cascata di onboarding
              (ateneo → corso → anno) invece di duplicarla qui. */}
          <div>
            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-line bg-night-800 px-4 text-sm text-ink transition-colors hover:border-line-strong hover:bg-night-700"
            >
              Cambia ateneo o corso
            </Link>
          </div>
        </div>
      </Panel>

      {/* ── 2. Aspetto ── */}
      <Panel title="Aspetto" icon={<Palette />}>
        {/* Lo stesso ThemeToggle resta anche nella barra di navigazione (AppNav)
            per l'accesso rapido: qui lo mostriamo solo con un'etichetta. */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-ink">Tema chiaro / scuro</p>
            <p className="muted mt-0.5 text-xs">
              Scegli l&apos;aspetto dell&apos;interfaccia.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Panel>

      {/* ── 3. Account ── */}
      <Panel title="Account" icon={<UserRound />}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-label font-medium text-ink-mute">Email</p>
            <p className="mt-0.5 text-sm text-ink">
              {signedIn && email ? email : "Accesso non configurato"}
            </p>
          </div>
          {signedIn && (
            <Button
              variant="ghost"
              onClick={async () => {
                await useAuth.getState().signOut();
                router.replace("/");
              }}
            >
              <LogOut aria-hidden="true" className="size-4" />
              Esci
            </Button>
          )}
        </div>
      </Panel>

      {/* ── 4. Privacy e dati ── */}
      <Panel title="Privacy e dati" icon={<Database />}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Esami libretto", n: librettoCount },
              { label: "Appelli", n: examCount },
              { label: "Note", n: notesCount },
              { label: "Attività", n: tasksCount },
              { label: "Sessioni studio", n: focusCount },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-line bg-night-900/30 p-3 text-center"
              >
                <div className="font-num text-2xl font-bold text-ink">{c.n}</div>
                <div className="muted text-xs">{c.label}</div>
              </div>
            ))}
          </div>
          <p className="muted text-xs">
            Tutti i tuoi dati restano su questo dispositivo (IndexedDB). Niente
            lascia il browser senza il tuo consenso.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-sm text-ink">Esporta i tuoi dati</p>
              <p className="muted mt-0.5 text-xs">
                Scarica libretto, note, attività, sessioni e impostazioni in un
                file JSON.
              </p>
            </div>
            <Button variant="ghost" onClick={() => void exportBackup()}>
              <Download aria-hidden="true" className="size-4" />
              Esporta JSON
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink">Cancella solo le sessioni di studio</p>
              <ConfirmButton
                size="sm"
                onConfirm={async () => {
                  await useFocusSessions.getState().clear();
                  useToast.getState().show("Sessioni di studio cancellate.", "ok");
                }}
              >
                Cancella sessioni
              </ConfirmButton>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink">Cancella solo le note</p>
              <ConfirmButton
                size="sm"
                onConfirm={async () => {
                  await useNotes.getState().clear();
                  useToast.getState().show("Note cancellate.", "ok");
                }}
              >
                Cancella note
              </ConfirmButton>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-ink">Reimposta tutti i dati locali</p>
                <p className="muted mt-0.5 text-xs">
                  Cancella tutto (libretto, note, attività, sessioni,
                  impostazioni). I dati nel cloud non vengono toccati.
                </p>
              </div>
              <ConfirmButton
                size="md"
                onConfirm={async () => {
                  await resetLocalData();
                  useToast.getState().show("Dati locali reimpostati.", "ok");
                  router.replace("/onboarding");
                }}
              >
                Reimposta tutto
              </ConfirmButton>
            </div>
          </div>
        </div>
      </Panel>

      {/* ── 5. Info app ── */}
      <Panel title="Info app" icon={<Info />}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink">Hai un suggerimento o un bug?</p>
              <p className="muted mt-0.5 text-xs">
                Il tuo feedback ci aiuta a migliorare StudentOS.
              </p>
            </div>
            <a
              href="mailto:support@studentos.app?subject=Feedback%20StudentOS"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-night-800 px-4 text-sm text-ink transition-colors hover:border-line-strong hover:bg-night-700"
            >
              <MessageSquare aria-hidden="true" className="size-4" />
              Invia feedback
            </a>
          </div>
          <div className="border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink">Versione</p>
              <span className="font-num text-sm text-ink-mute">v0.1.0</span>
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-ink-mute transition-colors hover:text-ink">
                Novità recenti
              </summary>
              <ul className="muted mt-2 list-disc space-y-1 pl-5 text-xs">
                <li>Assistente AI per la tua carriera universitaria</li>
                <li>Focus: modalità di studio + sessione immersiva</li>
                <li>Calendario unificato (lezioni, appelli, attività)</li>
                <li>Import del libretto da PDF Delphi e CSV</li>
              </ul>
            </details>
          </div>
        </div>
      </Panel>
    </div>
  );
}
