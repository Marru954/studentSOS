import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and blocks interaction. */
  loading?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary-gradient text-white font-semibold",
    "shadow-accent hover:opacity-95 active:opacity-100",
  ),
  ghost: cn(
    "border border-line bg-night-800 text-ink",
    "hover:border-line-strong hover:bg-night-700 active:bg-night-700",
  ),
  danger: cn(
    "border border-danger/45 bg-danger-dim text-danger",
    "hover:border-danger/70 active:bg-danger/20",
  ),
};

// Touch target ≥44px su mobile (h-11/min-w-11); da sm in su tornano alle
// dimensioni desktop compatte, così la densità su schermo grande non cambia.
const SIZE: Record<ButtonSize, string> = {
  sm: "h-11 min-w-11 px-3 text-xs gap-1.5 sm:h-7 sm:min-w-0",
  md: "h-11 px-4 text-sm gap-2 sm:h-9",
};

export function Button({
  variant = "ghost",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "btn-press inline-flex select-none items-center justify-center rounded-xl",
        "transition-[filter,background-color,border-color,opacity] duration-150",
        "disabled:pointer-events-none disabled:opacity-45",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {loading && (
        <svg
          className="size-3.5 animate-spin"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}
