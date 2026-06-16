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
  /** Extra classes on the body wrapper (e.g. `flex-1` for full-height fill). */
  bodyClassName?: string;
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
  bodyClassName,
  children,
}: PanelProps) {
  const Heading = `h${headingLevel}` as const;
  const titled = Boolean(title || actions);
  return (
    <section className={cn("glass rounded-xl shadow-soft", className)}>
      {titled && (
        <header className="flex min-h-11 items-center justify-between gap-3 px-5 pb-4 pt-5">
          {title && (
            <Heading className="flex items-center gap-2 font-sans text-[0.95rem] font-semibold tracking-normal text-ink">
              {icon && (
                <span
                  aria-hidden="true"
                  className="text-[var(--signal-2)] [&>svg]:size-[1.125rem]"
                >
                  {icon}
                </span>
              )}
              {title}
            </Heading>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div
        className={cn(
          !flush && "px-5 pb-5",
          !flush && !titled && "pt-5",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
