import { cn } from "@/lib/cn";

/** Shared control styling: clean white inputs with a hairline border. */
export const inputClass = cn(
  "h-9 w-full rounded-sm border border-line bg-night-800 px-3 text-sm text-ink",
  "placeholder:text-ink-faint hover:border-line-strong disabled:opacity-45",
);

/** Instrument-label + control pairing for forms. */
export function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  /** Adds a visible "*" and an sr-only "obbligatorio" to the label. */
  required?: boolean;
  /** Inline validation message rendered under the control (id `${htmlFor}-error`). */
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={htmlFor}
        className="text-label font-medium text-ink-mute"
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
            <span className="sr-only"> (obbligatorio)</span>
          </>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
