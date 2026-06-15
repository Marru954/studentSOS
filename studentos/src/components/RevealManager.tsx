"use client";

/**
 * Arms scroll-reveal animations: adds `.anim-ready` to <html> (so `.reveal`
 * elements start hidden) and reveals each with `.in` as it enters the viewport.
 * Re-scans on navigation AND watches for `.reveal` nodes added later via a
 * MutationObserver — panels gated on async hydration (e.g. the /orario week
 * grid, /appelli cards) mount AFTER this effect runs, so a one-time scan left
 * them stuck at opacity 0 forever. No-op under prefers-reduced-motion — content
 * stays visible. Renders nothing.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("anim-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const observeAll = () => {
      for (const el of document.querySelectorAll<HTMLElement>(".reveal:not(.in)")) {
        io.observe(el);
      }
    };
    observeAll();

    // Panels that render after async hydration/sync aren't in the DOM when this
    // effect first runs; observe them as they appear so they don't stay hidden.
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
