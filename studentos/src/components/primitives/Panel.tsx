import { cn } from "@/lib/cn";

interface PanelProps {
  title?: string;
  /** Small leading icon (lucide), rendered in the accent tint. */
  icon?: React.ReactNode;
  /** Right side of the header band: badges, buttons, live indicators. */
  actions?: React.ReactNode;
  /** Heading level of the title — keep the page outline honest. */
  headingLevel?: 2 | 3;
  /** Remove body padding (full-bleed tables, grids). */
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Floating glass card: translucent blur over the app gradient, soft
 *  indigo ambient shadow, generous radius. */
export function Panel({
  title,
  icon,
  actions,
  headingLevel = 2,
  flush = false,
  className,
  children,
}: PanelProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      className={cn(
        "glass rounded-md border border-line shadow-soft",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-line px-4 py-1.5">
          {title && (
            <Heading className="flex items-center gap-2 text-sm font-semibold text-ink">
              {icon && (
                <span aria-hidden="true" className="text-signal [&>svg]:size-4">
                  {icon}
                </span>
              )}
              {title}
            </Heading>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={flush ? undefined : "p-4"}>{children}</div>
    </section>
  );
}
