import { Gauge, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { ScatterPlot } from "@/components/primitives/ScatterPlot";
import { Stat } from "@/components/primitives/Stat";
import { Term } from "@/components/primitives/Term";
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

  return (
    <Panel title="Media pesata" icon={<TrendingUp />} className={className}>
      {average === undefined ? (
        <p className="text-sm text-ink-mute">
          Registra i voti nel libretto per vedere media, andamento e base di
          laurea. I dati restano solo su questo dispositivo.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <Stat
            label="media"
            value={fmtNum(average, 2)}
            unit="/30"
            hint={
              <>
                <Term title="Voto di partenza per la laurea: la media degli esami (in trentesimi) convertita in centodecimi, cioè media ÷ 30 × 110.">
                  base di laurea
                </Term>{" "}
                ≈ {fmtNum(graduationBase(average), 1)}/110
              </>
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
          {points.length >= 2 && (
            <div className="flex flex-col gap-1.5">
              <ScatterPlot
                points={points}
                label={`Andamento dei voti nel tempo su ${points.length} esami registrati`}
              />
              <p className="flex items-center gap-3 text-xs text-ink-mute">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-signal" /> voto
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full border border-ok" /> con
                  lode
                </span>
              </p>
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

  return (
    <Panel title="Avanzamento CFU" icon={<Gauge />} className={className}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <ProgressRing
            value={ratio}
            label={`${earned} CFU su ${totalCfu}`}
            size={88}
            tone="signal"
          >
            <span className="text-lg font-medium text-ink">{earned}</span>
            <span className="text-label text-ink-mute">CFU</span>
          </ProgressRing>
          <div className="font-mono">
            <p className="text-sm text-ink">
              {fmtNum(Math.min(1, ratio) * 100, 0)}%
            </p>
            <p className="text-xs text-ink-mute">su {totalCfu} CFU previsti</p>
          </div>
        </div>
        {pace !== undefined && eta && (
          <p className="border-t border-line pt-3 text-xs text-ink-mute">
            Al ritmo attuale ({fmtNum(pace, 1)} CFU/mese) → laurea stimata:{" "}
            <span className="font-medium text-ink">{fmtMonthYear(eta)}</span>
          </p>
        )}
      </div>
    </Panel>
  );
}

/** "Obiettivo laurea": editable target average, current average, and the
 *  average still needed on the remaining CFU to reach it. */
export function GoalPanel({
  entries,
  totalCfu,
  targetAverage,
  onTargetChange,
  className,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  targetAverage?: number;
  onTargetChange: (value: number | undefined) => void;
  className?: string;
}) {
  const current = weightedAverage(entries);
  const remaining = Math.max(totalCfu - earnedCfu(entries), 0);

  return (
    <Panel title="Obiettivo laurea" icon={<Target />} className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              onTargetChange(
                e.target.value === "" || Number.isNaN(v) ? undefined : v,
              );
            }}
            className={inputClass}
          />
        </Field>

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
