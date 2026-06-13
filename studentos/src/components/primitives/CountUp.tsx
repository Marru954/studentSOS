"use client";

/**
 * Counts a number up to its real value on mount (or when it scrolls into view).
 * SSR renders the final formatted value, so no-JS and screen readers always see
 * the truth; the ramp is applied imperatively to textContent to avoid hydration
 * mismatches. Honours prefers-reduced-motion by skipping the animation.
 */
import { useEffect, useRef } from "react";
import { fmtNum } from "@/lib/format";

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  format,
  durationMs = 750,
  inView = false,
  className,
}: {
  value: number;
  /** Decimal places for the default formatter (Italian comma). */
  decimals?: number;
  /** Appended to the formatted number, e.g. "%". */
  suffix?: string;
  /** Optional custom formatter (client components only — not serialisable). */
  format?: (n: number) => string;
  durationMs?: number;
  /** Start when the element enters the viewport instead of on mount. */
  inView?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = format ?? ((n: number) => `${fmtNum(n, decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    const f =
      format ?? ((n: number) => `${fmtNum(n, decimals)}${suffix}`);
    let raf = 0;
    let cancelled = false;

    const animate = () => {
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = f(value * eased);
        if (t < 1) raf = requestAnimationFrame(step);
        else el.textContent = f(value);
      };
      el.textContent = f(0);
      raf = requestAnimationFrame(step);
    };

    if (!inView) {
      animate();
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          animate();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [value, decimals, suffix, format, durationMs, inView]);

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
