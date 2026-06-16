"use client";

/** Hero panorama: a live snapshot of the Cruscotto — the first thing a new
 *  student wants to see ("come sto messo"): prossimo appello, media e CFU a
 *  colpo d'occhio. Same pure math the app uses (weightedAverage / earnedCfu /
 *  graduationBase), not a mockup. The ateneo selector relabels the preview so
 *  visitors recognise themselves. No projections here — that's a feature
 *  mentioned further down, not the first taste. */
import { CalendarClock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { earnedCfu, graduationBase, weightedAverage } from "@/lib/domain/libretto";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtNum } from "@/lib/format";
import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";

// Mix multi-disciplina (giuridico, umanistico, economico, scientifico) così uno
// studente di qualsiasi corso si riconosce — la landing è multi-ateneo.
const SEED = [
  { name: "Diritto privato", cfu: 9, vote: 28 },
  { name: "Storia contemporanea", cfu: 6, vote: 27 },
  { name: "Economia aziendale", cfu: 9, vote: 25 },
  { name: "Statistica", cfu: 6, vote: 30 },
];
const TOTAL_CFU = 180;
const NEXT_EXAM = { course: "Letteratura italiana", dateLabel: "18 giu", daysAway: 2 };

export function HeroDemo() {
  const atenei = useMemo(() => UNIVERSITY_PRESETS.map((p) => p.shortName), []);
  const [ateneo, setAteneo] = useState(atenei[0]);

  const entries: LibrettoEntry[] = SEED.map((s, i) => ({
    id: String(i),
    courseName: s.name,
    cfu: s.cfu,
    grade: { kind: "numeric", value: s.vote, laude: false },
    date: "2025-01-01",
  }));
  const media = weightedAverage(entries) ?? 0;
  const base = graduationBase(media);
  const cfu = earnedCfu(entries);

  return (
    <div className="glass gradient-ring reveal mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl p-5 text-left shadow-soft sm:p-6">
      {/* intestazione: cruscotto del tuo ateneo, dal vivo */}
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-ink-faint">Cruscotto · {ateneo}</span>
        <div className="flex items-center gap-2">
          <span className="chip chip-signal shrink-0">
            <Sparkles className="size-[0.8rem]" aria-hidden="true" />
            dal vivo
          </span>
          <label>
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
      </div>

      {/* prossimo appello — la cosa che conta a colpo d'occhio */}
      <div className="flex items-center gap-3 rounded-xl border border-[color:var(--signal)]/40 bg-[color-mix(in_oklch,var(--signal)_10%,transparent)] p-3.5">
        <span className="grad-fill inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-white">
          <CalendarClock className="size-[20px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="eyebrow text-ink-faint">Prossimo appello</div>
          <div className="truncate text-[1.05rem] font-semibold text-ink">
            {NEXT_EXAM.course}{" "}
            <span className="font-num text-ink-mute">· {NEXT_EXAM.dateLabel}</span>
          </div>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--signal-2)]">
          tra {NEXT_EXAM.daysAway} giorni
        </span>
      </div>

      {/* media + CFU: come sto messo */}
      <div className="flex items-center gap-5">
        <ProgressRing
          value={cfu / TOTAL_CFU}
          label={`${cfu} CFU su ${TOTAL_CFU}`}
          size={96}
          strokeWidth={9}
          tone="signal"
        >
          <span className="font-display text-[1.4rem] font-bold text-ink">{cfu}</span>
          <span className="text-[0.65rem] text-ink-faint">/{TOTAL_CFU}</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <div className="eyebrow text-ink-faint">Media ponderata</div>
          <div className="font-display text-[2.6rem] font-bold leading-none text-ink">
            {fmtNum(media, 2)}
          </div>
          <div className="mt-1.5 text-sm text-ink-mute">
            base laurea{" "}
            <span className="font-num font-semibold text-ink">{fmtNum(base, 1)}</span>
            /110
          </div>
          <Sparkline
            values={SEED.map((s) => s.vote)}
            label="Andamento dei voti registrati"
            width={220}
            height={36}
          />
        </div>
      </div>
    </div>
  );
}
