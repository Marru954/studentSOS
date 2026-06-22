/**
 * Display models for the trophy vetrina — pure, so the copy (especially the
 * tricky "why is this still locked" media case) is testable without a browser.
 * Splits trophies into unlocked (newest first, with their earned date) and
 * locked (canonical order), and composes the locked threshold sub-text.
 */
import { getTrophy, type ThresholdTrophy, type TrophyLedger, type TrophyStatus } from "./achievements";
import { gradedCount } from "./libretto";
import type { IsoDateTime, LibrettoEntry } from "./types";
import { fmtNum } from "../format";

/** View model for a single trophy card in the vetrina (unlocked or locked). */
export interface TrophyCardModel {
  id: string;
  title: string;
  nature: "event" | "threshold";
  unlocked: boolean;
  /** When first earned (unlocked cards only). */
  unlockedAt?: IsoDateTime;
  /** Italian description of the unlock condition. */
  condition: string;
  /** Locked threshold sub-text, e.g. "sei a 42/60" (events have none). */
  detail?: string;
  /** Locked threshold progress, 0..1 (events have none). */
  bar?: { fraction: number };
}

/** The trophy vetrina split into unlocked (newest first) and locked cards. */
export interface TrophyView {
  unlocked: TrophyCardModel[];
  locked: TrophyCardModel[];
}

function esami(k: number): string {
  return k === 1 ? "esame" : "esami";
}

/** Locked-threshold sub-text. For media it must make the gate explicit, so a
 *  full bar (average reached) with too few exams never looks like a bug. */
function thresholdDetail(
  def: ThresholdTrophy,
  current: number,
  gradedExams: number,
): string {
  if (def.unit === "media") {
    const avg = fmtNum(current, 1);
    const minExams = def.minGradedExams ?? 0;
    const needAvg = current < def.target;
    const needExams = gradedExams < minExams;
    if (needExams && !needAvg) {
      // average is there; only the exam count holds it back — say so plainly
      const gap = minExams - gradedExams;
      const verb = gap === 1 ? "ti manca" : "ti mancano";
      return `media già a ${avg} — ${verb} ${gap} ${esami(gap)} su ${minExams}`;
    }
    return `sei a ${avg} con ${gradedExams} ${esami(gradedExams)}`;
  }
  // CFU and any other counted threshold
  return `sei a ${current}/${def.target}`;
}

/**
 * Build the trophy vetrina view models: unlocked cards (newest first, with their
 * earned date) and locked cards (canonical order, with threshold detail/bar).
 * @param statuses Live unlock statuses for every trophy.
 * @param ledger Append-only record of first-unlock moments, for earned dates.
 * @param entries The libretto entries, used to compute the graded-exam gate copy.
 * @returns The unlocked/locked split ready for the UI.
 */
export function buildTrophyView(
  statuses: TrophyStatus[],
  ledger: TrophyLedger,
  entries: LibrettoEntry[],
): TrophyView {
  const gradedExams = gradedCount(entries);
  const unlocked: TrophyCardModel[] = [];
  const locked: TrophyCardModel[] = [];

  for (const s of statuses) {
    const def = getTrophy(s.id);
    if (!def) continue;
    const base = { id: s.id, title: def.title, nature: s.nature, condition: def.condition };

    if (s.unlocked) {
      unlocked.push({ ...base, unlocked: true, unlockedAt: ledger[s.id]?.firstUnlockedAt });
    } else if (def.nature === "event") {
      locked.push({ ...base, unlocked: false });
    } else {
      const p = s.progress ?? { current: 0, target: def.target, fraction: 0 };
      locked.push({
        ...base,
        unlocked: false,
        detail: thresholdDetail(def, p.current, gradedExams),
        bar: { fraction: p.fraction },
      });
    }
  }

  // Newest first among unlocked; locked stays in canonical (statuses) order.
  unlocked.sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""));
  return { unlocked, locked };
}
