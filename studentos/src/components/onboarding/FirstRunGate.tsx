"use client";

/**
 * Sends a not-yet-configured user to /onboarding the first time they open an
 * app route. Replaces the old auto-opening modal. The public landing, login,
 * onboarding and auth pages are never gated. Re-prompts legacy setups missing a
 * year of study (presetId alone is not "complete").
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSettings } from "@/lib/state/settings";

const GATED_PREFIXES = [
  "/cruscotto",
  "/orario",
  "/appelli",
  "/libretto",
  "/note",
  "/focus",
];

export function FirstRunGate() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useSettings((s) => s.hydrated);
  const presetId = useSettings((s) => s.presetId);
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  useEffect(() => {
    if (!hydrated) return;
    const complete = Boolean(presetId) && yearOfStudy !== undefined;
    if (complete) return;
    if (GATED_PREFIXES.some((p) => pathname.startsWith(p))) {
      router.replace("/onboarding");
    }
  }, [hydrated, presetId, yearOfStudy, pathname, router]);

  return null;
}
