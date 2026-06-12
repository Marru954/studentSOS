import { Gauge, TrendingUp } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { Stat } from "@/components/primitives/Stat";
import {
  averageSeries,
  earnedCfu,
  graduationBase,
  weightedAverage,
} from "@/lib/domain/libretto";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtNum } from "@/lib/format";

/** Weighted average instrument with trend and base di laurea projection. */
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
  const series = averageSeries(entries);

  return (
    <Panel title="Media pesata" icon={<TrendingUp />} className={className}>
      {average === undefined ? (
        <p className="text-sm text-ink-mute">
          Registra i voti nel libretto per vedere media, andamento e base di
          laurea. I dati restano solo su questo dispositivo.
        </p>
      ) : (
        <div className="flex items-end justify-between gap-4">
          <Stat
            label="media"
            value={fmtNum(average, 2)}
            unit="/30"
            hint={`base di laurea ≈ ${fmtNum(graduationBase(average), 1)}/110`}
            delta={
              targetAverage !== undefined
                ? {
                    text: `${average >= targetAverage ? "+" : ""}${fmtNum(average - targetAverage, 2)} vs obiettivo`,
                    tone: average >= targetAverage ? "ok" : "danger",
                  }
                : undefined
            }
          />
          {series.length >= 2 && (
            <Sparkline
              values={series}
              label={`Andamento della media su ${series.length} esami registrati`}
              tone={
                targetAverage === undefined || average >= targetAverage
                  ? "signal"
                  : "warn"
              }
            />
          )}
        </div>
      )}
    </Panel>
  );
}

/** CFU progression gauge against the degree plan. */
export function CfuPanel({
  entries,
  totalCfu,
  className,
}: {
  entries: LibrettoEntry[];
  totalCfu: number;
  className?: string;
}) {
  const earned = earnedCfu(entries);
  const ratio = totalCfu > 0 ? earned / totalCfu : 0;

  return (
    <Panel title="Avanzamento CFU" icon={<Gauge />} className={className}>
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
    </Panel>
  );
}
