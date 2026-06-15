"use client";

/**
 * Course-year filter chips (Tutti / 1° / 2° / 3°…), shared by /orario and
 * /appelli so both pages filter identically. Controlled — the parent owns the
 * value. Default option set is years 1–3; pass `years` to extend.
 */
export function YearFilter({
  value,
  onChange,
  years = [1, 2, 3],
  label = "Anno:",
}: {
  value: number | "all";
  onChange: (year: number | "all") => void;
  years?: number[];
  label?: string;
}) {
  const options: (number | "all")[] = ["all", ...years];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow text-ink-mute">{label}</span>
      {options.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => onChange(y)}
          aria-pressed={value === y}
          className={
            value === y
              ? "grad-fill rounded-full px-3 py-1 text-xs font-semibold text-white shadow-soft"
              : "chip transition-colors hover:border-line-strong"
          }
        >
          {y === "all" ? "Tutti" : `${y}° anno`}
        </button>
      ))}
    </div>
  );
}
