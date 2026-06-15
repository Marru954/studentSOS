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
import { useAuth } from "@/lib/supabase/auth";

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
  const status = useAuth((s) => s.status);
  const reconciled = useAuth((s) => s.reconciled);

  useEffect(() => {
    if (!hydrated) return;
    if (status === "loading") return;
    // For a signed-in account, wait until the cloud profile has been applied to
    // local settings (reconciled). Otherwise we'd redirect a returning user on
    // a half-reconciled empty state. The cloud profile is authoritative.
    if (status === "signedIn" && !reconciled) return;
    const complete = Boolean(presetId) && yearOfStudy !== undefined;
    if (complete) return;
    if (GATED_PREFIXES.some((p) => pathname.startsWith(p))) {
      router.replace("/onboarding");
    }
  }, [hydrated, status, reconciled, presetId, yearOfStudy, pathname, router]);

  return null;
}
