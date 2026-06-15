/**
 * Shared "selling" empty state. A glass card with a signal-tinted icon chip, a
 * title, an optional description, and an optional CTA slot (`children`). Every
 * page starts empty for a brand-new user, so an empty state should make them
 * think "I want to fill this", never "it's broken".
 *
 * Pure / server-safe: callers pass a <Link> or a client <Button> as children.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
  compact = false,
}: {
  /** A lucide icon element (sized down to 24px inside the chip). */
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  /** Call-to-action slot, e.g. a styled <Link> or <Button>. */
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center gap-3 rounded-lg text-center",
        compact ? "p-6" : "p-8 sm:p-10",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl bg-[color:var(--signal)]/12 text-[var(--signal-2)] [&_svg]:size-6"
      >
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="muted max-w-[44ch] text-sm leading-relaxed">{description}</p>
      )}
      {children && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
