"use client";

/** "Simulatore voto": what-if a hypothetical graded exam does to the weighted
 *  average and the graduation base. Live — recomputes on every keystroke, no
 *  button. Reads the libretto store directly; pure math from lib/domain. */
import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { CountUp } from "@/components/primitives/CountUp";
import { Panel } from "@/components/primitives/Panel";
import { inputClass } from "@/components/primitives/Field";
import { graduationBase, weightedAverage } from "@/lib/domain/libretto";
import { simulateAverage } from "@/lib/domain/projection";
import { fmtNum } from "@/lib/format";
import { useLibretto } from "@/lib/state/manual";

export function GradeSimulator({ className }: { className?: string }) {
  const entries = useLibretto((s) => s.items);
  const [cfu, setCfu] = useState(6);
  const [voto, setVoto] = useState(28);
  const [lode, setLode] = useState(false);

  const current = weightedAverage(entries);
  const value = lode ? 30 : voto;
  const safeCfu = Number.isFinite(cfu) && cfu > 0 ? cfu : 1;
  const after = simulateAverage(entries, safeCfu, value);
  const currentBase = current === undefined ? undefined : graduationBase(current);
  const afterBase = graduationBase(after);
  const delta = current === undefined ? undefined : after - current;
  const deltaTone =
    delta === undefined ? "text-ink-mute" : delta >= 0 ? "text-ok" : "text-danger";

  return (
    <Panel title="Simulatore voto" icon={<FlaskConical />} className={className}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* controlli */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-cfu" className="text-label font-medium text-ink-mute">
              CFU dell&rsquo;esame
            </label>
            <input
              id="sim-cfu"
              type="number"
              min={1}
              max={15}
              value={cfu}
              onChange={(e) => setCfu(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="sim-voto" className="text-label font-medium text-ink-mute">
                Voto ipotetico
              </label>
              <span className="font-num text-sm font-semibold text-ink">
                {lode ? "30 e lode" : voto}
              </span>
            </div>
            <input
              id="sim-voto"
              type="range"
              min={18}
              max={30}
              value={voto}
              disabled={lode}
              onChange={(e) => setVoto(Number(e.target.value))}
              className="accent-signal disabled:opacity-40"
            />
            <label className="mt-1 inline-flex items-center gap-2 text-sm text-ink-mute">
              <input
                type="checkbox"
                checked={lode}
                onChange={(e) => setLode(e.target.checked)}
                className="accent-signal"
              />
              30 e lode
            </label>
          </div>
        </div>

        {/* esito live */}
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-night-950 p-4">
          <div>
            <div className="eyebrow text-ink-faint">Media ponderata</div>
            <div className="font-num mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-bold text-ink">
              <span>{current === undefined ? "—" : fmtNum(current, 2)}</span>
              <span className="text-ink-faint">→</span>
              <span className="text-[var(--signal-2)]">
                <CountUp value={after} decimals={2} />
              </span>
              {delta !== undefined && (
                <span className={`text-sm font-semibold ${deltaTone}`}>
                  {delta >= 0 ? "+" : ""}
                  {fmtNum(delta, 2)}
                </span>
              )}
            </div>
          </div>
          <div className="border-t border-line pt-4">
            <div className="eyebrow text-ink-faint">Base di laurea</div>
            <div className="font-num mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-bold text-ink">
              <span>{currentBase === undefined ? "—" : fmtNum(currentBase, 1)}</span>
              <span className="text-ink-faint">→</span>
              <span>
                <CountUp value={afterBase} decimals={1} />
              </span>
              <span className="text-sm text-ink-mute">/110</span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
