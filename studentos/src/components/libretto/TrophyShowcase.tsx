/** The trophy vetrina: unlocked trophies lit at the top (with their earned
 *  date), locked ones below in a "spento" style. Presentational — the view
 *  model (and the tricky locked-media copy) comes pre-built from
 *  domain/trophyView, so this file only renders. State is conveyed in text, not
 *  colour alone (each card's aria-label says sbloccato / da sbloccare). */
import { Lock, Trophy } from "lucide-react";
import type { TrophyCardModel, TrophyView } from "@/lib/domain/trophyView";
import { fmtPlainDate } from "@/lib/format";

function UnlockedCard({ card }: { card: TrophyCardModel }) {
  const when = card.unlockedAt ? `Sbloccato il ${fmtPlainDate(card.unlockedAt)}` : "Sbloccato";
  return (
    <li
      aria-label={`${card.title}, trofeo sbloccato${card.unlockedAt ? ` il ${fmtPlainDate(card.unlockedAt)}` : ""}`}
      className="glass lift flex flex-col items-center gap-1.5 rounded-xl border-2 border-[color:var(--signal)]/50 p-4 text-center"
    >
      <Trophy aria-hidden="true" className="size-6 text-[var(--signal-2)]" />
      <div className="grad-text font-display text-base font-bold leading-tight">
        {card.title}
      </div>
      <div className="eyebrow mt-auto text-ink-mute">{when}</div>
    </li>
  );
}

function LockedCard({ card }: { card: TrophyCardModel }) {
  const label = `${card.title}, da sbloccare. ${card.condition}${card.detail ? `. ${card.detail}` : ""}`;
  return (
    <li
      aria-label={label}
      className="glass flex flex-col gap-1.5 rounded-xl border border-line/50 p-4 opacity-70"
    >
      <div className="flex items-center gap-2">
        <Lock aria-hidden="true" className="size-4 shrink-0 text-ink-faint" />
        <div className="font-display text-sm font-semibold text-ink-mute">
          {card.title}
        </div>
      </div>
      <p className="text-xs text-ink-faint">{card.condition}</p>
      {card.detail && (
        <p className="text-xs font-medium text-ink-mute">{card.detail}</p>
      )}
      {card.bar && (
        <div
          aria-hidden="true"
          className="mt-1 h-1.5 overflow-hidden rounded-full"
          style={{ background: "var(--hairline)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.round(card.bar.fraction * 100)}%`,
              background: "var(--ink-faint)",
            }}
          />
        </div>
      )}
    </li>
  );
}

export function TrophyShowcase({ view }: { view: TrophyView }) {
  const total = view.unlocked.length + view.locked.length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-ink">
          {view.unlocked.length}
          <span className="text-ink-faint">/{total}</span>
        </span>
        <span className="text-sm text-ink-mute">trofei sbloccati</span>
      </div>

      {view.unlocked.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2 text-[var(--signal-2)]">
            Sbloccati · {view.unlocked.length}
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {view.unlocked.map((card) => (
              <UnlockedCard key={card.id} card={card} />
            ))}
          </ul>
        </section>
      )}

      {view.locked.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2 text-ink-faint">Da sbloccare</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {view.locked.map((card) => (
              <LockedCard key={card.id} card={card} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
