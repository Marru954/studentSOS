"use client";

/**
 * First-run setup: which university, which year. Opens automatically when
 * no preset is configured (after hydration) and on demand from the
 * dashboard. Enables ALL timetable years (merged view), the chosen year's
 * exams, and the news sources. Public data only — no login.
 */
import { GraduationCap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Field, inputClass } from "@/components/primitives/Field";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useUi } from "@/lib/state/ui";
import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";

const YEARS = [1, 2, 3];

export function OnboardingDialog() {
  const settings = useSettings();
  const open = useUi((s) => s.onboardingOpen);
  const firstRunDismissed = useUi((s) => s.firstRunDismissed);
  const closeOnboarding = useUi((s) => s.closeOnboarding);

  const [presetId, setPresetId] = useState(UNIVERSITY_PRESETS[0].id);
  const [year, setYear] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Block the first run until BOTH university and year are chosen. Requiring
  // yearOfStudy (not just presetId) also re-prompts legacy/incomplete setups
  // that recorded a preset but never captured the year of study.
  const setupComplete =
    Boolean(settings.presetId) && settings.yearOfStudy !== undefined;
  const firstRun = settings.hydrated && !setupComplete && !firstRunDismissed;
  const visible = firstRun || open;

  useEffect(() => {
    if (visible) dialogRef.current?.querySelector("select")?.focus();
  }, [visible]);

  if (!visible) return null;

  const preset =
    UNIVERSITY_PRESETS.find((p) => p.id === presetId) ?? UNIVERSITY_PRESETS[0];

  async function confirm() {
    // merged timetable: every year's lessons sync; exams follow the
    // chosen year; news always on
    const enabledSourceIds = preset.sources
      .filter(
        (s) =>
          s.capability === "timetable" ||
          s.capability === "news" ||
          s.id.endsWith(`-anno-${year}`),
      )
      .map((s) => s.id);
    await settings.update({ presetId: preset.id, yearOfStudy: year, enabledSourceIds });
    closeOnboarding();
    void useSynced.getState().sync();
  }

  function dismiss() {
    closeOnboarding();
  }

  function trapTab(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      dismiss();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      "select, input, button",
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onKeyDown={trapTab}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-titolo"
        className="dialog-in glass w-full max-w-lg rounded-lg border border-line p-6 shadow-[0_24px_60px_-20px_rgba(16,24,40,0.35)]"
      >
        <div className="flex items-center gap-3">
          <span className="bg-primary-gradient flex size-10 items-center justify-center rounded-full shadow-soft">
            <GraduationCap aria-hidden="true" className="size-5 text-white" />
          </span>
          <div>
            <h2 id="onboarding-titolo" className="text-lg font-semibold">
              Benvenuto in StudentOS
            </h2>
            <p className="text-xs text-ink-mute">
              Due domande e il cruscotto si adatta a te.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <Field label="In quale università studi?" htmlFor="onb-ateneo">
            <select
              id="onb-ateneo"
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                — Seleziona ateneo —
              </option>
              {UNIVERSITY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.programme}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-mute">
              Non trovi il tuo ateneo?{" "}
              <a href="mailto:hello@studentos.app" className="underline">
                Segnalacelo
              </a>{" "}
              — stiamo aggiungendo nuovi atenei ogni settimana.
            </p>
          </Field>

          <fieldset>
            <legend className="text-label font-medium text-ink-mute">
              A che anno di corso sei?
            </legend>
            <div className="mt-2 flex gap-2">
              {YEARS.map((y) => (
                <label
                  key={y}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    year === y
                      ? "border-signal/60 bg-signal-dim text-ink"
                      : "border-line bg-night-950 text-ink-mute hover:bg-night-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="onb-anno"
                    checked={year === y}
                    onChange={() => setYear(y)}
                    className="sr-only"
                  />
                  {y}° anno
                </label>
              ))}
            </div>
          </fieldset>

          <p className="text-xs text-ink-mute">
            Sincronizzeremo l&rsquo;orario di tutti gli anni (potrai scegliere
            i corsi che frequenti), gli appelli del tuo anno e gli avvisi del
            dipartimento. Nessun accesso richiesto.
          </p>

          <div className="flex justify-end gap-2">
            <Button onClick={dismiss}>Più tardi</Button>
            <Button variant="primary" onClick={() => void confirm()}>
              Inizia
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
