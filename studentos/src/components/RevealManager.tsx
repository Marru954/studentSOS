"use client";

/**
 * Arms scroll-reveal animations: adds `.anim-ready` to <html> (so `.reveal`
 * elements start hidden) and reveals each with `.in` as it enters the viewport.
 * Re-scans on navigation. No-op under prefers-reduced-motion — content stays
 * visible. Renders nothing.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("anim-ready");

    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    if (targets.length === 0) return;

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
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
