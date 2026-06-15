"use client";

/** Applies the saved UI density to <html data-density>. Compact mode shrinks the
 *  root font-size, and since all spacing/typography is rem-based it scales the
 *  whole interface down proportionally. Plain DOM sync effect (no setState). */
import { useEffect } from "react";
import { useSettings } from "@/lib/state/settings";

export function DensityApplier() {
  const density = useSettings((s) => s.density);
  const hydrated = useSettings((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.density = density ?? "comfortable";
  }, [density, hydrated]);
  return null;
}
