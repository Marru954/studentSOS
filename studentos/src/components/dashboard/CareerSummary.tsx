import { ArrowRight, Gauge, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { cn } from "@/lib/cn";
import { earnedCfu, graduationBase, weightedAverage } from "@/lib/domain/libretto";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtNum } from "@/lib/format";

/**
 * Compact, read-only career summaries for the Cruscotto. The FULL instruments
 * (grade trend, CFU pace + graduation estimate, goal simulator) live only in
 * the Libretto — here we show a one-line glance that links to that master page,
 * so the dashboard stays glanceable and the data isn't duplicated.
 */

/** One-line "Carriera": media + base di laurea → Libretto. When a trophy has
 *  been earned, a second line names the most recent one. */
export function CareerStrip({
  entries,
  lastTrophy,
  className,
}: {
  entries: LibrettoEntry[];
  /** Most recent unlocked trophy, if any. */
  lastTrophy?: { title: string };
  className?: string;
}) {
  const average = weightedAverage(entries);
  return (
    // Container, not a link: the media row and the trophy row deep-link to
    // different libretto tabs, so they are two sibling links (no nested <a>).
    <div className={cn("glass lift flex flex-col gap-1.5 rounded-xl", className)}>
      <Link
        href="/libretto"
        aria-label="Apri il libretto"
        className="group flex items-center gap-3 rounded-xl px-4 pt-3 pb-1.5"
      >
        <TrendingUp
          aria-hidden="true"
          className="size-[1.125rem] shrink-0 text-[var(--signal-2)]"
        />
        <span className="shrink-0 text-[0.95rem] font-semibold text-ink">
          Carriera
        </span>
        {average === undefined ? (
          <span className="text-sm text-ink-mute">— nessun voto</span>
        ) : (
          <span className="font-num flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm text-ink-mute">
            <span>
              Media{" "}
              <strong className="text-[var(--signal-2)]">
                {fmtNum(average, 2)}
              </strong>
            </span>
            <span>
              Base <strong className="text-ink">{fmtNum(graduationBase(average), 1)}</strong>
              <span className="text-ink-faint">/110</span>
            </span>
          </span>
        )}
        <ArrowRight
          aria-hidden="true"
          className="ml-auto size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
        />
      </Link>
      {lastTrophy && (
        <Link
          href="/libretto#trofei"
          aria-label={`Apri i trofei — ultimo traguardo: ${lastTrophy.title}`}
          className="mx-2 mb-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-ink-mute transition-colors hover:bg-night-800"
        >
          <Trophy
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[var(--signal-2)]"
          />
          <span className="truncate">
            Ultimo traguardo:{" "}
            <strong className="font-medium text-ink">{lastTrophy.title}</strong>
          </span>
        </Link>
      )}
    </div>
  );
}

/** Compact CFU mini-ring "earned/total · mancano N" → Libretto. No graduation
 *  estimate (that detail lives in the Libretto's full CFU panel). */
export function CfuMini({
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
  const remaining = Math.max(totalCfu - earned, 0);
  return (
    <Link
      href="/libretto"
      aria-label="Apri il libretto"
      className={cn(
        "glass lift group flex items-center gap-3 rounded-xl px-4 py-3",
        className,
      )}
    >
      <ProgressRing
        value={ratio}
        label={`${earned} CFU su ${totalCfu}`}
        size={56}
        strokeWidth={6}
        tone="signal"
      >
        <span className="font-display text-sm font-bold text-ink">
          <CountUp value={earned} />
        </span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink">
          <Gauge
            aria-hidden="true"
            className="size-[1.125rem] shrink-0 text-[var(--signal-2)]"
          />
          CFU
        </div>
        <p className="font-num mt-0.5 truncate text-sm text-ink-mute">
          {earned}/{totalCfu} ·{" "}
          {remaining === 0 ? "completati" : `mancano ${remaining}`}
        </p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
