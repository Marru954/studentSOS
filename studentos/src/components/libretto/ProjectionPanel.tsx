/**
 * What-if instruments: degree-plan settings, required average to hit the
 * target, and a next-exam simulator. All math from lib/domain/projection;
 * the "remaining CFU assumed graded" simplification is stated in the copy.
 */
import { useState } from "react";
import { Target } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { Term } from "@/components/primitives/Term";
import { earnedCfu, graduationBase, weightedAverage } from "@/lib/domain/libretto";
import { requiredAverage, simulateAverage } from "@/lib/domain/projection";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtNum } from "@/lib/format";

function RequiredReadout({
  entries,
  totalCfu,
  targetAverage,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  targetAverage?: number;
}) {
  if (targetAverage === undefined) {
    return (
      <p className="text-sm text-ink-mute">
        Imposta un obiettivo di media per calcolare il voto richiesto.
      </p>
    );
  }
  const remaining = Math.max(totalCfu - earnedCfu(entries), 0);
  const outcome = requiredAverage(entries, remaining, targetAverage);

  switch (outcome.kind) {
    case "met":
      return (
        <p className="text-sm">
          <Badge tone="ok" className="mr-2">
            al sicuro
          </Badge>
          Con almeno 18 su tutti i CFU rimanenti l&rsquo;obiettivo di{" "}
          {fmtNum(targetAverage, 1)} è raggiunto.
        </p>
      );
    case "reachable":
      return (
        <p className="text-sm">
          Servono in media{" "}
          <span className="font-mono text-lg font-medium text-ink">
            {fmtNum(outcome.average, 2)}
          </span>{" "}
          sui {remaining} CFU rimanenti (ipotizzandoli tutti con voto).
        </p>
      );
    case "unreachable":
      return (
        <p className="text-sm">
          <Badge tone="warn" className="mr-2">
            fuori portata
          </Badge>
          Servirebbe una media di {fmtNum(outcome.average, 1)} sui CFU
          rimanenti: oltre il 30.
        </p>
      );
    case "no-remaining":
      return (
        <p className="text-sm text-ink-mute">
          Piano completato: la media non può più cambiare.
        </p>
      );
  }
}

export function ProjectionPanel({
  entries,
  totalCfu,
  targetAverage,
  onPlanChange,
  className,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  targetAverage?: number;
  onPlanChange: (patch: { totalCfu?: number; targetAverage?: number }) => void;
  className?: string;
}) {
  const [simCfu, setSimCfu] = useState(6);
  const [simValue, setSimValue] = useState(27);

  const current = weightedAverage(entries);
  const simulated = simulateAverage(entries, simCfu, simValue);
  const delta = current === undefined ? undefined : simulated - current;

  return (
    <Panel title="Proiezioni" icon={<Target />} className={className}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="CFU del piano" htmlFor="piano-cfu">
            <input
              id="piano-cfu"
              type="number"
              min={1}
              max={600}
              value={totalCfu}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isInteger(v) && v >= 1) onPlanChange({ totalCfu: v });
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Obiettivo media" htmlFor="piano-obiettivo">
            <input
              id="piano-obiettivo"
              type="number"
              min={18}
              max={30}
              step={0.5}
              value={targetAverage ?? ""}
              placeholder="es. 28"
              onChange={(e) => {
                const v = Number(e.target.value);
                onPlanChange({
                  targetAverage:
                    e.target.value === "" || Number.isNaN(v) ? undefined : v,
                });
              }}
              className={inputClass}
            />
          </Field>
        </div>

        <RequiredReadout
          entries={entries}
          totalCfu={totalCfu}
          targetAverage={targetAverage}
        />

        <div className="border-t border-line pt-4">
          <p className="text-label font-medium text-ink-mute">
            Simulatore prossimo esame
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Field label="CFU" htmlFor="sim-cfu" className="w-20">
              <select
                id="sim-cfu"
                value={simCfu}
                onChange={(e) => setSimCfu(Number(e.target.value))}
                className={inputClass}
              >
                {[3, 6, 9, 12].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={`Voto: ${simValue}`} htmlFor="sim-voto" className="min-w-40 flex-1">
              <input
                id="sim-voto"
                type="range"
                min={18}
                max={30}
                value={simValue}
                onChange={(e) => setSimValue(Number(e.target.value))}
                className="accent-signal"
              />
            </Field>
          </div>
          <p aria-live="polite" className="mt-3 text-sm">
            Nuova media{" "}
            <span className="font-mono text-lg font-medium text-ink">
              {fmtNum(simulated, 2)}
            </span>
            {delta !== undefined && (
              <span
                className={`ml-2 font-mono text-xs ${delta >= 0 ? "text-ok" : "text-danger"}`}
              >
                {delta >= 0 ? "+" : ""}
                {fmtNum(delta, 2)}
              </span>
            )}
            <span className="ml-3 text-xs text-ink-mute">
              <Term title="Voto di partenza per la laurea: la media degli esami (in trentesimi) convertita in centodecimi, cioè media ÷ 30 × 110.">
                base di laurea
              </Term>{" "}
              ≈ {fmtNum(graduationBase(simulated), 1)}/110
            </span>
          </p>
        </div>
      </div>
    </Panel>
  );
}
