/**
 * Celebration decisions: which trophy unlocks deserve a visual reaction, and
 * which kind. This is the *show* layer on top of the trophy engine — it never
 * touches the ledger's `firstUnlockedAt` (the permanent record), it only
 * governs whether an animation plays.
 *
 * Two reactions, by nature:
 *  - event  → a full-screen scenic (first 30, first 30 e lode, …) — rare, big.
 *  - threshold → a discreet corner toast (CFU, media) — repeatable, quiet.
 *
 * Anti-repeat for the scenic: deleting and re-adding the *same* event within an
 * hour is treated as an input-error correction (no replay); re-earning it more
 * than an hour after the relock is a genuine new event (replay). The relock
 * moment is tracked in `CelebrationState.relockedAt`, persisted by the trophy
 * store — it drives only this 1h window, never the data.
 */
import type { TrophyLedger, TrophyStatus } from "./achievements";
import type { IsoDateTime } from "./types";

/** Re-add within this window of a relock = error correction, not a new event. */
export const RELOCK_WINDOW_MS = 60 * 60 * 1000;

export interface CelebrationState {
  /** Per event-trophy: when it last went unlocked→locked. Empty once unlocked. */
  relockedAt: Record<string, IsoDateTime>;
}

export interface CelebrationDecision {
  /** Event trophy ids to play the scenic for. */
  scenic: string[];
  /** Threshold trophy ids to toast. */
  toast: string[];
  /** The relock log after this transition — persist it. */
  state: CelebrationState;
}

/**
 * Diff previous vs current trophy statuses and decide what to celebrate.
 *  - `ledger`: the engine's permanent record; presence of an id means the
 *    trophy was earned before (so a fresh unlock is a *re*-unlock, not a first).
 *  - `state`: the relock log, used for the 1h replay window.
 *  - `now`: the clock, passed in (pure).
 */
export function decideCelebrations(
  prev: TrophyStatus[],
  next: TrophyStatus[],
  ledger: TrophyLedger,
  state: CelebrationState,
  now: IsoDateTime,
  windowMs: number = RELOCK_WINDOW_MS,
): CelebrationDecision {
  const prevById = new Map(prev.map((s) => [s.id, s]));
  const relockedAt = { ...state.relockedAt };
  const scenic: string[] = [];
  const toast: string[] = [];
  const nowMs = Date.parse(now);

  for (const s of next) {
    const wasUnlocked = prevById.get(s.id)?.unlocked ?? false;
    const isUnlocked = s.unlocked;

    if (isUnlocked && !wasUnlocked) {
      // lock → unlock
      if (s.nature === "threshold") {
        toast.push(s.id);
      } else if (!ledger[s.id]) {
        scenic.push(s.id); // first time ever earned
      } else {
        // earned before → this is a re-unlock. Replay only if a recorded relock
        // is older than the window (a genuine new event); otherwise stay silent.
        const relock = relockedAt[s.id];
        if (relock && nowMs - Date.parse(relock) > windowMs) {
          scenic.push(s.id);
        }
      }
      // unlocked now → no pending relock clock
      delete relockedAt[s.id];
    } else if (!isUnlocked && wasUnlocked && s.nature === "event") {
      // unlock → lock: start the 1h clock for a possible later re-add
      relockedAt[s.id] = now;
    }
  }

  return { scenic, toast, state: { relockedAt } };
}
