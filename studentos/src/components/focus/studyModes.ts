import { Brain, Timer, Waves, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** A study mode = a timer recipe. `countUp` modes ignore focus/break and tick
 *  upward until the user stops (Flow). The `accent` color tints the selector
 *  card and the ring glow so each mode feels distinct. */
export interface StudyMode {
  id: "pomodoro" | "deep_work" | "flow" | "sprint";
  label: string;
  desc: string;
  /** Focus minutes (0 for count-up modes). */
  focus: number;
  /** Break minutes after a focus block (0 = none / count-up). */
  break: number;
  countUp: boolean;
  /** CSS color for the active card + ring glow. */
  accent: string;
  icon: LucideIcon;
}

export const STUDY_MODES: StudyMode[] = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    desc: "25 min focus, 5 pausa — il classico",
    focus: 25,
    break: 5,
    countUp: false,
    accent: "var(--signal)",
    icon: Timer,
  },
  {
    id: "deep_work",
    label: "Deep Work",
    desc: "90 min senza interruzioni — per argomenti difficili",
    focus: 90,
    break: 15,
    countUp: false,
    accent: "#a78bfa",
    icon: Brain,
  },
  {
    id: "flow",
    label: "Flow",
    desc: "Timer che conta in su — studia quanto vuoi",
    focus: 0,
    break: 0,
    countUp: true,
    accent: "#22d3ee",
    icon: Waves,
  },
  {
    id: "sprint",
    label: "Sprint",
    desc: "10 min intensi, 2 pausa — per quando hai poco tempo",
    focus: 10,
    break: 2,
    countUp: false,
    accent: "var(--warn)",
    icon: Zap,
  },
];
