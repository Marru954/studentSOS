"use client";

/** Plays the celebration queue one item at a time: events render the scenic
 *  overlay, thresholds fire the existing corner toast. Mounted once in the
 *  layout; reads the zustand stores directly. */
import { useEffect } from "react";
import { useCelebration } from "@/lib/state/celebration";
import { useToast } from "@/lib/state/toast";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { TrophyUnlockOverlay } from "./TrophyUnlockOverlay";

const SCENIC_MS = 4500;
const SCENIC_MS_REDUCED = 2500;
const TOAST_MS = 3200;

export function CelebrationHost() {
  const item = useCelebration((s) => s.queue[0] ?? null);
  const shift = useCelebration((s) => s.shift);
  const showToast = useToast((s) => s.show);
  const reduced = usePrefersReducedMotion();

  // Threshold → delegate to the existing toast host, then advance.
  useEffect(() => {
    if (!item || item.kind !== "toast") return;
    showToast(`Traguardo raggiunto: ${item.title}`, "ok");
    const t = setTimeout(shift, TOAST_MS);
    return () => clearTimeout(t);
  }, [item, showToast, shift]);

  // Scenic → auto-dismiss after a beat (shorter under reduced motion). A manual
  // close advances the queue too, which clears this timer via the cleanup.
  useEffect(() => {
    if (!item || item.kind !== "scenic") return;
    const t = setTimeout(shift, reduced ? SCENIC_MS_REDUCED : SCENIC_MS);
    return () => clearTimeout(t);
  }, [item, reduced, shift]);

  if (!item || item.kind !== "scenic") return null;
  return (
    <TrophyUnlockOverlay
      key={item.key}
      title={item.title}
      condition={item.condition}
      reducedMotion={reduced}
      onClose={shift}
    />
  );
}
