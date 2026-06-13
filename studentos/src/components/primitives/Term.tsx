import { cn } from "@/lib/cn";

/** Inline jargon gloss: a dotted-underlined term that reveals a plain-language
 *  explanation on hover/focus via the native title tooltip. Keeps copy short
 *  while making university shorthand (CFU, base di laurea, lode…) discoverable. */
export function Term({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  /** Plain-Italian explanation shown on hover/focus. */
  title: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      tabIndex={0}
      className={cn(
        "cursor-help underline decoration-dotted decoration-line-strong underline-offset-2 outline-none focus-visible:decoration-signal",
        className,
      )}
    >
      {children}
    </span>
  );
}
