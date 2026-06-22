/**
 * Academic trophies: a pure, declarative unlock engine over the libretto.
 *
 * Trophies are a *consequence* of the data already in the libretto — this
 * module never stores grades or CFU of its own. Status (locked/unlocked, and
 * for thresholds a 0..1 progress fraction) is always recomputed live from the
 * entries passed in, so deleting a mis-entered exam honestly relocks a trophy.
 *
 * The only thing worth persisting is *when* a trophy was first earned: the
 * `TrophyLedger` records a `firstUnlockedAt` per id, append-only — it never
 * relocks a date once stamped (a trophy you earned stays earned in the record,
 * even if its triggering exam is later removed). `applyUnlocks` is the seam the
 * persistence layer (and, later, the celebration UI) builds on.
 *
 * Two natures:
 *  - "event"     — a one-shot fact ("prendi un 30 e lode"): unlocked or not.
 *  - "threshold" — a measured value vs a target ("60 CFU", "media ≥ 27"):
 *                  carries current/target/fraction so a bar can be drawn.
 */
import { earnedCfu, gradedCount, weightedAverage } from "./libretto";
import type { Grade, IsoDateTime, LibrettoEntry } from "./types";

/** Whether a trophy is a one-shot fact ("event") or a measured milestone ("threshold"). */
export type TrophyNature = "event" | "threshold";

interface BaseTrophy {
  id: string;
  /** Short italian title shown on the trophy, e.g. "Primo 30 e lode". */
  title: string;
  /** Italian description of the unlock condition, e.g. "Prendi un 30 e lode". */
  condition: string;
  nature: TrophyNature;
}

/** A one-shot achievement: it happened, or it hasn't. */
export interface EventTrophy extends BaseTrophy {
  nature: "event";
  achieved(entries: LibrettoEntry[]): boolean;
}

/** A measured milestone: a current value climbing toward a target. */
export interface ThresholdTrophy extends BaseTrophy {
  nature: "threshold";
  /** The value to reach to unlock (unlock is `>=` target). */
  target: number;
  /** Unit label for the UI, e.g. "CFU" or "media". */
  unit: string;
  /** The current value derived from the libretto. */
  measure(entries: LibrettoEntry[]): number;
  /** Minimum number of *graded* exams (numeric, not excluded) required before
   *  the trophy can unlock — guards average trophies from firing on a single
   *  lucky grade, so a media trophy rewards consistency. Omit for CFU-style
   *  trophies, where the target alone is the achievement. */
  minGradedExams?: number;
}

/** Any trophy definition — an event or a threshold. */
export type TrophyDef = EventTrophy | ThresholdTrophy;

/** Progress of a threshold trophy toward its target, with a drawable fraction. */
export interface TrophyProgress {
  current: number;
  target: number;
  /** current/target, clamped to [0, 1]. */
  fraction: number;
}

/** Live status of a single trophy: locked/unlocked, plus progress for thresholds. */
export interface TrophyStatus {
  id: string;
  nature: TrophyNature;
  unlocked: boolean;
  /** Present only for threshold trophies. */
  progress?: TrophyProgress;
}

// ── helpers over a Grade ──────────────────────────────────────────────────────

function isThirty(grade: Grade): boolean {
  return grade.kind === "numeric" && grade.value === 30;
}

function isThirtyLode(grade: Grade): boolean {
  return grade.kind === "numeric" && grade.value === 30 && grade.laude;
}

// ── the declarative catalogue ────────────────────────────────────────────────

/** The declarative catalogue of every trophy, in canonical display order. */
export const TROPHIES: TrophyDef[] = [
  {
    id: "first-exam",
    title: "Primo esame",
    condition: "Supera il primo esame",
    nature: "event",
    // The libretto only ever holds verbalised (passed) exams, so any entry —
    // voto or idoneità — is a passed exam.
    achieved: (entries) => entries.length >= 1,
  },
  {
    id: "first-30",
    title: "Primo 30",
    condition: "Prendi un 30",
    nature: "event",
    achieved: (entries) => entries.some((e) => isThirty(e.grade)),
  },
  {
    id: "first-30-lode",
    title: "Primo 30 e lode",
    condition: "Prendi un 30 e lode",
    nature: "event",
    achieved: (entries) => entries.some((e) => isThirtyLode(e.grade)),
  },
  {
    id: "cfu-30",
    title: "30 CFU",
    condition: "Raggiungi 30 CFU",
    nature: "threshold",
    target: 30,
    unit: "CFU",
    measure: earnedCfu,
  },
  {
    id: "cfu-60",
    title: "60 CFU",
    condition: "Raggiungi 60 CFU",
    nature: "threshold",
    target: 60,
    unit: "CFU",
    measure: earnedCfu,
  },
  {
    id: "cfu-120",
    title: "120 CFU",
    condition: "Raggiungi 120 CFU",
    nature: "threshold",
    target: 120,
    unit: "CFU",
    measure: earnedCfu,
  },
  {
    id: "media-27",
    title: "Media 27",
    condition: "Media ponderata di almeno 27 su almeno 3 esami",
    nature: "threshold",
    target: 27,
    unit: "media",
    // A media trophy rewards consistency, not the first high grade: it needs
    // the average AND at least three exams behind it.
    minGradedExams: 3,
    // No graded exams → average is undefined; report 0 so the fraction is a
    // real number, never NaN.
    measure: (entries) => weightedAverage(entries) ?? 0,
  },
];

const BY_ID = new Map(TROPHIES.map((t) => [t.id, t]));

/** Look up a trophy definition by id (for titles/conditions in the UI). */
export function getTrophy(id: string): TrophyDef | undefined {
  return BY_ID.get(id);
}

// ── evaluation (pure, live from the libretto) ────────────────────────────────

/**
 * Compute the live status of a single trophy from the libretto entries.
 * @param def The trophy definition to evaluate.
 * @param entries The libretto entries to measure against.
 * @returns The locked/unlocked status, with progress for threshold trophies.
 */
export function evaluateTrophy(
  def: TrophyDef,
  entries: LibrettoEntry[],
): TrophyStatus {
  if (def.nature === "event") {
    return { id: def.id, nature: "event", unlocked: def.achieved(entries) };
  }
  const current = def.measure(entries);
  const fraction =
    def.target === 0 ? 1 : Math.min(Math.max(current / def.target, 0), 1);
  // Progress always tracks the measure vs its target (the bar fills with the
  // average/CFU). An optional exam-count gate is a *separate* unlock condition,
  // so a media bar can read full while the trophy is still locked for too few
  // exams — the UI explains the gate from the condition text.
  const meetsMinExams =
    def.minGradedExams === undefined ||
    gradedCount(entries) >= def.minGradedExams;
  return {
    id: def.id,
    nature: "threshold",
    unlocked: current >= def.target && meetsMinExams,
    progress: { current, target: def.target, fraction },
  };
}

/**
 * Evaluate every trophy in the catalogue against the libretto entries.
 * @param entries The libretto entries to measure against.
 * @returns One status per trophy, in canonical order.
 */
export function evaluateAll(entries: LibrettoEntry[]): TrophyStatus[] {
  return TROPHIES.map((def) => evaluateTrophy(def, entries));
}

// ── ledger: append-only record of first-unlock moments ───────────────────────

/** Append-only record of when each trophy was first unlocked, keyed by id. */
export type TrophyLedger = Record<string, { firstUnlockedAt: IsoDateTime }>;

/** Outcome of stamping newly unlocked trophies into the ledger. */
export interface ApplyResult {
  /** The ledger after stamping (a new object; the input is never mutated). */
  ledger: TrophyLedger;
  /** True when at least one new first-unlock was stamped. */
  changed: boolean;
  /** Ids unlocked for the very first time in this call — the celebration cue. */
  newlyUnlocked: string[];
}

/**
 * Stamp `firstUnlockedAt = now` for every trophy that is currently unlocked but
 * not yet in the ledger. Trophies already recorded keep their original date,
 * and a trophy that has since relocked (its exam was deleted) is left in the
 * ledger untouched — the record only ever grows.
 */
export function applyUnlocks(
  ledger: TrophyLedger,
  statuses: TrophyStatus[],
  now: IsoDateTime,
): ApplyResult {
  const next: TrophyLedger = { ...ledger };
  const newlyUnlocked: string[] = [];
  for (const s of statuses) {
    if (s.unlocked && !next[s.id]) {
      next[s.id] = { firstUnlockedAt: now };
      newlyUnlocked.push(s.id);
    }
  }
  return {
    ledger: newlyUnlocked.length > 0 ? next : ledger,
    changed: newlyUnlocked.length > 0,
    newlyUnlocked,
  };
}
