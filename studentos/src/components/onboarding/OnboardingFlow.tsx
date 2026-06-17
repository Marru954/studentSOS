"use client";

/**
 * First-run setup as a dedicated 4-step page (replaces the old modal dialog).
 * One decision per step, a progress bar, and a confirm screen that wires the
 * preset sources and kicks the first sync. When the user arrived via the magic
 * link we already know their email → detect the ateneo and skip straight to the
 * course step. Pure public data, no credentials.
 */
import { ArrowLeft, ArrowRight, Check, GraduationCap, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/primitives/Button";
import { detectAteneo, isUniversityEmail } from "@/lib/domain/emailToAteneo";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useAuth } from "@/lib/supabase/auth";
import { pushProfile } from "@/lib/supabase/remote";
import { clearSyncedCaches } from "@/lib/supabase/sync";
import type { UniversityPreset } from "@/lib/sync/provider";
import { UNIVERSITY_PRESETS, getPreset, liveProgramFor } from "@/lib/sync/universities";
import { ATENEO_COURSES, coursesFor } from "@/lib/sync/universities/ateneo-courses";

const YEARS = [1, 2, 3, 4, 5, 6];
const CFU_PRESETS = [
  { label: "Triennale", cfu: 180 },
  { label: "Magistrale", cfu: 120 },
  { label: "Ciclo unico", cfu: 300 },
];
const STEP_TITLES = ["Ateneo", "Corso", "Anno e CFU", "Conferma"];

function programmesOf(p: UniversityPreset | undefined): string[] {
  if (!p) return [];
  // Multi-programme ateneo (Tor Vergata): show the FULL real catalogue; the
  // verified-live degrees are marked in place by isLiveCourse. Any live
  // programme missing from the catalogue is prepended so it's always selectable.
  if (p.livePrograms?.length) {
    const catalogue = ATENEO_COURSES[p.id] ?? [];
    const missing = p.livePrograms
      .map((lp) => lp.programme)
      .filter(
        (n) =>
          !catalogue.some((c) => c.trim().toLowerCase() === n.trim().toLowerCase()),
      );
    return [...missing, ...catalogue];
  }
  // Single-live-programme ateneo: FULL catalogue with the one live course first.
  // Manual atenei fall back to their generic programme list (COMMON_PROGRAMMES).
  if (p.liveSources && p.programme && ATENEO_COURSES[p.id]?.length) {
    return coursesFor(p.id, p.programme);
  }
  return p.programmes ?? (p.programme ? [p.programme] : []);
}

/** True when this course has verified live sources at the ateneo. */
function isLiveCourse(p: UniversityPreset | undefined, course: string): boolean {
  if (p?.livePrograms?.length) return Boolean(liveProgramFor(p, course));
  return (
    Boolean(p?.liveSources) &&
    !!p?.programme &&
    course.trim().toLowerCase() === p.programme.trim().toLowerCase()
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(1);
  const [totalCfu, setTotalCfu] = useState(180);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  // Untouched fields read from derived defaults; once edited they take over.
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const [chosenPreset, setChosenPreset] = useState<string | null>(null);
  const [chosenCorso, setChosenCorso] = useState<string | null>(null);
  const [corsoQuery, setCorsoQuery] = useState("");

  // Ensure the optional auth session is loaded even on a direct /onboarding
  // visit. This only nudges the external store — no React setState in the effect.
  useEffect(() => {
    useAuth.getState().hydrate();
  }, []);

  // Email + ateneo are derived: prefilled from the signed-in address, then
  // overridden the moment the user types / picks (keeps lint happy: no
  // setState-in-effect, the prefill flows through render).
  const authEmail = useAuth((s) => s.email);
  const email = emailInput ?? authEmail ?? "";
  const detected = isUniversityEmail(email) ? detectAteneo(email) : null;
  const presetId = chosenPreset ?? detected ?? "";
  const preset = presetId ? getPreset(presetId) : undefined;
  const corsi = programmesOf(preset);
  const corso = chosenCorso ?? corsi[0] ?? "";
  const corsoLive = isLiveCourse(preset, corso);
  const filteredCorsi = (() => {
    const q = corsoQuery.trim().toLowerCase();
    return q ? corsi.filter((c) => c.toLowerCase().includes(q)) : corsi;
  })();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Before the user searches, float the ateneo detected from the email (or
      // already chosen) to the top, so detection is visibly successful instead
      // of being buried mid-list and looking like it failed.
      if (!presetId) return UNIVERSITY_PRESETS;
      return [...UNIVERSITY_PRESETS].sort((a, b) =>
        a.id === presetId ? -1 : b.id === presetId ? 1 : 0,
      );
    }
    return UNIVERSITY_PRESETS.filter(
      (p) =>
        p.shortName.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.city ?? "").toLowerCase().includes(q),
    );
  }, [query, presetId]);

  function chooseAteneo(id: string) {
    setChosenPreset(id);
    setChosenCorso(null);
    setCorsoQuery("");
  }

  const canNext =
    step === 1 ? Boolean(presetId) : step === 2 ? Boolean(corso.trim()) : true;

  async function finish() {
    if (!preset) return;
    setSaving(true);
    setSaveError(false);
    try {
      await applyOnboarding();
    } catch {
      // A failed local write must never leave the gate spinning forever.
      setSaveError(true);
      setSaving(false);
    }
  }

  async function applyOnboarding() {
    if (!preset) return;
    await useSettings.getState().hydrate();
    // Only the verified live course activates the live sources; any other course
    // at this ateneo is manual (no sources → enabledSources() stays empty and
    // the sync is a no-op for it). For a multi-programme ateneo the sources come
    // from the matched live programme; otherwise from the preset's flat list.
    const liveProg = liveProgramFor(preset, corso);
    const liveList = liveProg ? liveProg.sources : preset.sources;
    const enabledSourceIds = corsoLive
      ? liveList
          .filter(
            (s) =>
              s.capability === "timetable" ||
              s.capability === "news" ||
              s.id.endsWith(`-anno-${year}`),
          )
          .map((s) => s.id)
      : [];
    await useSettings.getState().update({
      presetId: preset.id,
      programme: corso || undefined,
      yearOfStudy: year,
      enabledSourceIds,
      degreePlan: {
        ...useSettings.getState().degreePlan,
        totalCfu,
      },
    });
    // Write the onboarding facts straight to the cloud profile so "already
    // onboarded" is true on every device. Best-effort: local-first is the
    // source of truth and never blocks on the network. (The settings mirror in
    // cloud sync also pushes this; the explicit call covers the case where the
    // mirror isn't attached yet.)
    const user = useAuth.getState().user;
    if (user) {
      const s = useSettings.getState();
      void pushProfile(user.id, user.email ?? null, {
        presetId: s.presetId,
        programme: s.programme,
        yearOfStudy: s.yearOfStudy,
        degreePlan: s.degreePlan,
      });
    }
    // Drop any previous ateneo's cached lessons/exams (the source ids are reused
    // across presets) so the chosen preset's data replaces them cleanly, then
    // sync now → orario e appelli compaiono senza refresh manuale.
    await clearSyncedCaches();
    void useSynced.getState().sync();
    router.replace("/cruscotto");
  }

  return (
    <main
      id="contenuto"
      className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10 sm:px-6"
    >
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Wordmark className="text-xl" />
        <p className="text-sm text-ink-mute">
          Tre domande e il cruscotto si adatta a te.
        </p>
      </div>

      {/* progress */}
      <div className="mb-6 flex items-center gap-2">
        {STEP_TITLES.map((t, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={t} className="flex flex-1 flex-col gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  done || active ? "bg-signal" : "bg-line"
                }`}
              />
              <span
                className={`text-[0.7rem] ${
                  active ? "text-ink" : "text-ink-faint"
                }`}
              >
                {n}. {t}
              </span>
            </div>
          );
        })}
      </div>

      <div className="glass gradient-ring rounded-2xl border border-line p-5 shadow-soft sm:p-6">
        {step === 1 && (
          <section className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">In quale università studi?</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="onb-email" className="text-label font-medium text-ink-mute">
                Email universitaria (rileva l&rsquo;ateneo)
              </label>
              <input
                id="onb-email"
                type="email"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nome@studenti.uniroma2.it"
                aria-describedby="onb-email-hint"
                className="h-10 w-full rounded-xl border border-line bg-night-800 px-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
              />
              <p id="onb-email-hint" className="text-xs text-ink-faint">
                La usiamo solo per trovare il tuo ateneo. Non stai creando un
                account qui.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="onb-search" className="text-label font-medium text-ink-mute">
                …oppure cerca il tuo ateneo
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="onb-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cerca per nome o città…"
                  className="h-10 w-full rounded-xl border border-line bg-night-800 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
                />
              </div>
            </div>

            <div className="no-scrollbar flex max-h-60 flex-col gap-1.5 overflow-y-auto">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => chooseAteneo(p.id)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    presetId === p.id
                      ? "border-signal/60 bg-signal-dim text-ink"
                      : "border-line bg-night-800 text-ink-mute hover:border-line-strong"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">
                      {p.shortName}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">
                      {p.city}
                      {p.liveSources ? " · sync live" : " · inserimento manuale"}
                    </span>
                  </span>
                  {presetId === p.id && (
                    <Check aria-hidden="true" className="size-4 shrink-0 text-signal" />
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-1 py-3 text-xs text-ink-mute">
                  Nessun ateneo trovato. Prova con un altro nome.
                </p>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">Quale corso di laurea?</h1>
            <p className="text-xs text-ink-mute">
              {preset?.shortName}
              {preset?.city ? ` · ${preset.city}` : ""}
            </p>
            {corsi.length > 0 ? (
              <>
                {corsi.length > 8 && (
                  <div className="relative">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
                    />
                    <input
                      type="text"
                      value={corsoQuery}
                      onChange={(e) => setCorsoQuery(e.target.value)}
                      placeholder="Cerca il tuo corso…"
                      aria-label="Cerca corso di laurea"
                      className="h-10 w-full rounded-xl border border-line bg-night-800 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
                    />
                  </div>
                )}
                <div className="no-scrollbar flex max-h-72 flex-col gap-1.5 overflow-y-auto">
                  {filteredCorsi.map((c) => {
                    const live = isLiveCourse(preset, c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setChosenCorso(c)}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                          corso === c
                            ? "border-signal/60 bg-signal-dim text-ink"
                            : "border-line bg-night-800 text-ink-mute hover:border-line-strong"
                        }`}
                      >
                        <span className="min-w-0 truncate">{c}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${
                              live
                                ? "bg-signal-dim text-signal"
                                : "bg-night-900 text-ink-faint"
                            }`}
                          >
                            {live ? "sync live" : "manuale"}
                          </span>
                          {corso === c && (
                            <Check aria-hidden="true" className="size-4 text-signal" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                  {filteredCorsi.length === 0 && (
                    <p className="px-1 py-3 text-xs text-ink-mute">
                      Nessun corso trovato. Prova con un altro nome.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <input
                type="text"
                value={corso}
                onChange={(e) => setChosenCorso(e.target.value)}
                placeholder="es. Informatica"
                className="h-10 w-full rounded-xl border border-line bg-night-800 px-3 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-signal focus:outline-none"
              />
            )}
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-col gap-5">
            <div>
              <h1 className="text-lg font-semibold">A che anno di corso sei?</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      year === y
                        ? "border-signal/60 bg-signal-dim text-ink"
                        : "border-line bg-night-800 text-ink-mute hover:border-line-strong"
                    }`}
                  >
                    {y}° anno
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-ink-mute">
                CFU totali del piano di studi
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {CFU_PRESETS.map((c) => (
                  <button
                    key={c.cfu}
                    type="button"
                    onClick={() => setTotalCfu(c.cfu)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      totalCfu === c.cfu
                        ? "border-signal/60 bg-signal-dim text-ink"
                        : "border-line bg-night-800 text-ink-mute hover:border-line-strong"
                    }`}
                  >
                    {c.label} · {c.cfu}
                  </button>
                ))}
                <input
                  type="number"
                  min={60}
                  max={400}
                  value={totalCfu}
                  onChange={(e) => setTotalCfu(Number(e.target.value) || 0)}
                  aria-label="CFU totali"
                  className="font-num h-9 w-24 rounded-xl border border-line bg-night-800 px-3 text-sm text-ink hover:border-line-strong focus:border-signal focus:outline-none"
                />
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">Tutto pronto?</h1>
            <dl className="flex flex-col gap-2 text-sm">
              <Row label="Ateneo" value={`${preset?.shortName ?? "—"}`} />
              <Row label="Corso" value={corso || "—"} />
              <Row label="Anno" value={`${year}° anno`} />
              <Row label="CFU piano" value={String(totalCfu)} />
            </dl>
            <p className="rounded-lg border border-line bg-night-800 px-3 py-2 text-xs text-ink-mute">
              {corsoLive ? (
                <>
                  <GraduationCap aria-hidden="true" className="mr-1 inline size-3.5 text-signal" />
                  Sincronizzeremo orario, appelli e avvisi per {corso}. Nessun
                  accesso al portale richiesto.
                </>
              ) : (
                <>
                  La sincronizzazione automatica non è ancora disponibile per
                  questo corso — puoi inserire libretto, orari e appelli
                  manualmente. Tutto il resto di StudentOS funziona e i tuoi dati
                  restano tuoi.
                </>
              )}
            </p>
          </section>
        )}

        {/* nav */}
        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Indietro
          </Button>
          {step < 4 ? (
            <Button
              variant="primary"
              disabled={!canNext}
              onClick={() => setStep((s) => Math.min(4, s + 1))}
            >
              Continua
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Button>
          ) : (
            <Button variant="primary" loading={saving} onClick={() => void finish()}>
              Attiva e sincronizza
              <Check aria-hidden="true" className="size-3.5" />
            </Button>
          )}
        </div>
        {saveError && (
          <p role="alert" className="mt-3 text-right text-sm text-danger">
            Attivazione non riuscita. Controlla la connessione e riprova.
          </p>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-ink-faint">
        Puoi cambiare questi dati quando vuoi dal cruscotto.
      </p>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-night-800 px-3 py-2">
      <dt className="text-ink-mute">{label}</dt>
      <dd className="truncate font-medium text-ink">{value}</dd>
    </div>
  );
}
