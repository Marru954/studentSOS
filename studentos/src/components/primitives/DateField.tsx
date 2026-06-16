"use client";

/**
 * Masked Italian date field (gg/mm/aaaa). Native `<input type="date">` renders
 * in the BROWSER/OS locale (en-US → mm/dd/yyyy) and Chrome ignores the page
 * `lang`, so this is a plain text input that displays gg/mm/aaaa and stores an
 * ISO "YYYY-MM-DD" value. The display string is local state (so partial typing
 * isn't clobbered by the ISO round-trip) and only resyncs when `value` changes
 * externally — React's guarded "adjust state on prop change" pattern, no effect.
 */
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatItDate, parseItDate } from "@/lib/format";
import { inputClass } from "./Field";

/** Keep only digits and auto-insert the slashes → "20/06/2026". Lets the user
 *  type digits only, so the numeric mobile keyboard (no "/") works. */
function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join("/");
}

export function DateField({
  id,
  value,
  onChange,
  required,
  className,
}: {
  id?: string;
  /** ISO date "YYYY-MM-DD", or "" when empty. */
  value: string;
  /** Emits a valid ISO date, or "" while empty/incomplete. */
  onChange: (iso: string) => void;
  required?: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => formatItDate(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== (parseItDate(display) ?? "")) setDisplay(formatItDate(value));
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="gg/mm/aaaa"
      maxLength={10}
      value={display}
      required={required}
      onChange={(e) => {
        const masked = maskDate(e.target.value);
        setDisplay(masked);
        onChange(parseItDate(masked) ?? "");
      }}
      className={cn(inputClass, className)}
    />
  );
}
