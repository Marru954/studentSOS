import { Gauge, Plus, Share2, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/primitives/Badge";
import { Field, inputClass } from "@/components/primitives/Field";
import { CountUp } from "@/components/primitives/CountUp";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { Stat } from "@/components/primitives/Stat";
import {
  cfuPerMonth,
  earnedCfu,
  graduationBase,
  gradePoints,
  weightedAverage,
} from "@/lib/domain/libretto";
import { estimateGraduation, requiredAverage } from "@/lib/domain/projection";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtMonthYear, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/state/toast";

/** Weighted average instrument with the grades-over-time scatter and base di
 *  laurea projection. */
export function MediaPanel({
  entries,
  targetAverage,
  className,
}: {
  entries: LibrettoEntry[];
  targetAverage?: number;
  className?: string;
}) {
  const average = weightedAverage(entries);
  const points = gradePoints(entries);

  async function share() {
    if (average === undefined) return;
    const text = `La mia media ponderata su StudentOS: ${fmtNum(average, 2)}/30 (base di laurea: ${fmtNum(graduationBase(average), 1)}/110) 🎓 studentos.app`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        useToast.getState().show("Copiato negli appunti!", "ok");
      } else {
        useToast.getState().show("Condivisione non disponibile.", "warn");
      }
    } catch {
      // condivisione annullata dall'utente o permesso negato — ignora
    }
  }

  return (
    <Panel
      title="Carriera"
      icon={<TrendingUp />}
      className={className}
      actions={
        average !== undefined ? (
          <button
            type="button"
            onClick={share}
            className="no-print inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-mute transition-colors hover:border-line-strong hover:text-ink"
          >
            <Share2 aria-hidden="true" className="size-3.5" />
            Condividi
          </button>
        ) : undefined
      }
    >
      {average === undefined ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-ink-mute">
            Registra i voti nel libretto e qui vedrai{" "}
            <span className="text-ink">media ponderata</span>,{" "}
            <span className="text-ink">andamento</span> e{" "}
            <span className="text-ink">base di laurea</span> aggiornarsi a ogni
            esame. I dati restano solo su questo dispositivo.
          </p>
          <Link href="/libretto" className="btn btn-primary">
            <Plus aria-hidden="true" className="size-4" />
            Aggiungi il primo voto
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Stat
            label="Media ponderata"
            value={
              <span className="text-[var(--signal-2)]">
                <CountUp value={average} decimals={2} />
              </span>
            }
            delta={
              targetAverage !== undefined
                ? {
                    text: `${average >= targetAverage ? "+" : ""}${fmtNum(average - targetAverage, 2)} vs obiettivo`,
                    tone: average >= targetAverage ? "ok" : "danger",
                  }
                : undefined
            }
          />
          <Stat
            label="Base di laurea"
            value={fmtNum(graduationBase(average), 1)}
            unit="/110"
          />
          {points.length >= 2 && (
            <div>
              <div className="eyebrow mb-2 text-ink-faint [letter-spacing:0.08em]">
                Andamento voti
              </div>
              <Sparkline
                values={points.map((p) => p.value)}
                label={`Andamento dei voti su ${points.length} esami registrati`}
                width={180}
                height={48}
              />
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/** CFU progression gauge against the degree plan, with a pace-based estimate
 *  of the graduation month. */
export function CfuPanel({
  entries,
  totalCfu,
  now,
  className,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  /** Clock for the graduation estimate; omit to hide it (e.g. SSR skeleton). */
  now?: Date;
  className?: string;
}) {
  const earned = earnedCfu(entries);
  const ratio = totalCfu > 0 ? earned / totalCfu : 0;
  const pace = cfuPerMonth(entries);
  const eta = now ? estimateGraduation(entries, totalCfu, now) : undefined;

  const remaining = Math.max(totalCfu - earned, 0);
  const pct = Math.round(Math.min(1, ratio) * 100);

  return (
    <Panel title="Avanzamento CFU" icon={<Gauge />} className={className}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <ProgressRing
            value={ratio}
            label={`${earned} CFU su ${totalCfu}`}
            size={124}
            strokeWidth={10}
            tone="signal"
          >
            <span className="font-display text-[1.7rem] font-bold text-ink">
              <CountUp value={earned} />
            </span>
            <span className="text-[0.72rem] text-ink-faint">/{totalCfu} CFU</span>
          </ProgressRing>
          {earned === 0 ? (
            <p className="max-w-[22ch] text-sm text-ink-mute">
              Il tuo percorso parte da qui. Registra gli esami già sostenuti e
              guarda la barra salire verso i{" "}
              <strong className="text-ink">{totalCfu} CFU</strong> della laurea.
            </p>
          ) : (
            <p className="max-w-[20ch] text-sm text-ink-mute">
              Mancano <strong className="text-ink">{remaining} CFU</strong> alla
              laurea. Sei al {pct}% del percorso.
            </p>
          )}
        </div>
        {earned === 0 ? (
          <Link href="/libretto" className="btn btn-primary self-start">
            <Plus aria-hidden="true" className="size-4" />
            Aggiungi i tuoi esami
          </Link>
        ) : (
          pace !== undefined &&
          eta && (
            <p className="border-t border-line pt-3 text-xs text-ink-mute">
              Al ritmo attuale ({fmtNum(pace, 1)} CFU/mese) → laurea stimata:{" "}
              <span className="font-medium text-ink">{fmtMonthYear(eta)}</span>
            </p>
          )
        )}
      </div>
    </Panel>
  );
}

/** "Obiettivo laurea" (unificato): media obiettivo + CFU del piano editabili,
 *  media attuale, media ancora necessaria sui CFU rimanenti, CFU mancanti.
 *  Sostituisce il vecchio pannello "Proiezioni" (stesso calcolo, ridondante). */
export function GoalPanel({
  entries,
  totalCfu,
  targetAverage,
  onPlanChange,
  onTargetChange,
  className,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  targetAverage?: number;
  onPlanChange?: (patch: { totalCfu?: number; targetAverage?: number }) => void;
  onTargetChange?: (value: number | undefined) => void;
  className?: string;
}) {
  const current = weightedAverage(entries);
  const remaining = Math.max(totalCfu - earnedCfu(entries), 0);

  return (
    <Panel title="Obiettivo laurea" icon={<Target />} className={className}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Media obiettivo" htmlFor="goal-target">
            <input
              id="goal-target"
              type="number"
              min={18}
              max={30}
              step={0.5}
              value={targetAverage ?? ""}
              placeholder="es. 28"
              onChange={(e) => {
                const v = Number(e.target.value);
                const next =
                  e.target.value === "" || Number.isNaN(v) ? undefined : v;
                onPlanChange?.({ targetAverage: next });
                onTargetChange?.(next);
              }}
              className={inputClass}
            />
          </Field>
          <Field label="CFU del piano" htmlFor="goal-cfu">
            <input
              id="goal-cfu"
              type="number"
              min={1}
              max={600}
              value={totalCfu}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isInteger(v) && v >= 1) onPlanChange?.({ totalCfu: v });
              }}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-label font-medium text-ink-mute">
              Media attuale
            </span>
            <span className="font-mono text-2xl font-medium leading-none text-ink">
              {current === undefined ? "—" : fmtNum(current, 2)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-label font-medium text-ink-mute">
              Serve nei prossimi
            </span>
            <RequiredReadout
              entries={entries}
              remaining={remaining}
              targetAverage={targetAverage}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-label font-medium text-ink-mute">
              CFU mancanti
            </span>
            <span className="font-mono text-2xl font-medium leading-none text-ink">
              {remaining}
              <span className="ml-1 font-sans text-xs font-normal text-ink-mute">
                su {totalCfu}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/** Compact required-average line for the goal card. */
function RequiredReadout({
  entries,
  remaining,
  targetAverage,
}: {
  entries: LibrettoEntry[];
  remaining: number;
  targetAverage?: number;
}) {
  if (targetAverage === undefined) {
    return (
      <span className="text-sm text-ink-mute">Imposta un obiettivo.</span>
    );
  }
  const outcome = requiredAverage(entries, remaining, targetAverage);
  switch (outcome.kind) {
    case "met":
      return <Badge tone="ok">al sicuro</Badge>;
    case "reachable":
      return (
        <span className="font-mono text-2xl font-medium leading-none text-ink">
          {fmtNum(outcome.average, 2)}
          <span className="ml-1 font-sans text-xs font-normal text-ink-mute">
            su {remaining} CFU
          </span>
        </span>
      );
    case "unreachable":
      return (
        <span className="flex items-baseline gap-2">
          <Badge tone="warn">oltre 30</Badge>
          <span className="text-xs text-ink-mute">
            servirebbe {fmtNum(outcome.average, 1)}
          </span>
        </span>
      );
    case "no-remaining":
      return (
        <span className="text-sm text-ink-mute">Piano completato.</span>
      );
  }
}
