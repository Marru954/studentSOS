"use client";

/** /impostazioni: profilo universitario, aspetto, account, dati locali.
 *  Tutto è già persistente altrove — questa pagina è solo una vista unificata
 *  sui controlli sparsi (settings store, tema, auth). */
import { LogOut, Palette, ShieldAlert, University, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSettings } from "@/lib/state/settings";
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

      {/* ── 4. Dati ── */}
      <Panel title="Dati" icon={<ShieldAlert />}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-ink">Reimposta dati locali</p>
            <p className="muted mt-0.5 text-xs">
              Cancella libretto, note, attività, sessioni e impostazioni salvati su
              questo dispositivo. I dati nel cloud non vengono toccati.
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
            Reimposta dati locali
          </ConfirmButton>
        </div>
      </Panel>
    </div>
  );
}
