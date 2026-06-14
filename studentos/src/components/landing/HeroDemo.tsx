"use client";

/** Interactive hero: drag the grades and watch the weighted average, the
 *  graduation base and the live dashboard preview update in real time. Same
 *  pure math the app uses — a real taste of the product, not a mockup. The
 *  university selector relabels the preview so visitors recognise themselves. */
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { earnedCfu, graduationBase, weightedAverage } from "@/lib/domain/libretto";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtNum } from "@/lib/format";
import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";

const SEED = [
  { name: "Analisi I", cfu: 9 },
  { name: "Programmazione", cfu: 12 },
  { name: "Fisica", cfu: 6 },
  { name: "Architetture", cfu: 9 },
];
const SEED_VOTES = [27, 30, 24, 28];
const TOTAL_CFU = 180;

export function HeroDemo() {
  const atenei = useMemo(() => UNIVERSITY_PRESETS.map((p) => p.shortName), []);
  const [ateneo, setAteneo] = useState(atenei[0]);
  const [votes, setVotes] = useState(SEED_VOTES);

  const entries: LibrettoEntry[] = SEED.map((s, i) => ({
    id: String(i),
    courseName: s.name,
    cfu: s.cfu,
    grade: { kind: "numeric", value: votes[i], laude: false },
    date: "2025-01-01",
  }));
  const media = weightedAverage(entries) ?? 0;
  const base = graduationBase(media);
  const cfu = earnedCfu(entries);

  return (
    <div className="glass gradient-ring reveal mx-auto grid w-full max-w-3xl gap-6 rounded-2xl p-5 text-left shadow-soft lg:grid-cols-[1fr_minmax(0,290px)]">
      {/* controlli interattivi */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow text-[var(--signal-2)]">Provalo adesso</span>
          <label className="flex items-center gap-2">
            <span className="sr-only">Scegli il tuo ateneo</span>
            <select
              value={ateneo}
              onChange={(e) => setAteneo(e.target.value)}
              className="max-w-[10rem] rounded-full border border-line bg-[var(--surface)] px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-line-strong"
            >
              {atenei.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm text-ink-mute">
          Trascina i voti — media, base di laurea e andamento si aggiornano dal
          vivo.
        </p>
        <div className="flex flex-col gap-3">
          {SEED.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-sm text-ink">
                {s.name}
              </span>
              <input
                type="range"
                min={18}
                max={30}
                value={votes[i]}
                onChange={(e) => {
                  const next = [...votes];
                  next[i] = Number(e.target.value);
                  setVotes(next);
                }}
                aria-label={`Voto di ${s.name}`}
                className="h-1.5 flex-1 accent-signal"
              />
              <span className="font-num w-7 text-right text-sm font-semibold text-ink">
                {votes[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* preview viva del cruscotto */}
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-[color-mix(in_oklch,var(--surface)_60%,transparent)] p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow truncate text-ink-faint">
            Cruscotto · {ateneo}
          </span>
          <span className="chip chip-signal shrink-0">
            <Sparkles className="size-[0.8rem]" aria-hidden="true" />
            live
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing
            value={cfu / TOTAL_CFU}
            label={`${cfu} CFU su ${TOTAL_CFU}`}
            size={92}
            strokeWidth={8}
            tone="signal"
          >
            <span className="font-display text-[1.3rem] font-bold text-ink">
              {cfu}
            </span>
            <span className="text-[0.65rem] text-ink-faint">/{TOTAL_CFU}</span>
          </ProgressRing>
          <div className="min-w-0">
            <div className="eyebrow text-ink-faint">Media</div>
            <div className="font-display text-[2.1rem] font-bold leading-none text-ink">
              {fmtNum(media, 2)}
            </div>
            <div className="mt-1 text-xs text-ink-mute">
              base{" "}
              <span className="font-num font-semibold text-ink">
                {fmtNum(base, 1)}
              </span>
              /110
            </div>
          </div>
        </div>
        <Sparkline
          values={votes}
          label="Andamento dei voti inseriti"
          width={250}
          height={40}
        />
      </div>
    </div>
  );
}
