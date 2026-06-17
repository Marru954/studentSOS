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

  // Threshold → delegate to the existing toast host, then advance. shift is
  // key-bound so a late timer never advances past the wrong item.
  useEffect(() => {
    if (!item || item.kind !== "toast") return;
    const { key } = item;
    showToast(`Traguardo raggiunto: ${item.title}`, "ok");
    const t = setTimeout(() => shift(key), TOAST_MS);
    return () => clearTimeout(t);
  }, [item, showToast, shift]);

  // Scenic → auto-dismiss after a beat (shorter under reduced motion). A manual
  // close advances the queue too; the key guard makes a late auto-dismiss a
  // no-op, so it can't swallow a toast queued behind this scenic.
  useEffect(() => {
    if (!item || item.kind !== "scenic") return;
    const { key } = item;
    const t = setTimeout(() => shift(key), reduced ? SCENIC_MS_REDUCED : SCENIC_MS);
    return () => clearTimeout(t);
  }, [item, reduced, shift]);

  if (!item || item.kind !== "scenic") return null;
  return (
    <TrophyUnlockOverlay
      key={item.key}
      title={item.title}
      condition={item.condition}
      reducedMotion={reduced}
      onClose={() => shift(item.key)}
    />
  );
}
