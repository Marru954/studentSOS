/** The libretto as a wall of trophies: each passed exam is an achievement card,
 *  bordered by how good the grade is. Same props as EntryTable (which survives
 *  for the print export). Newest first. */
import { Award, GraduationCap, Pencil, Trash2, Trophy } from "lucide-react";
import type { Grade, LibrettoEntry } from "@/lib/domain/types";
import { fmtPlainDate } from "@/lib/format";

type Tier = "gold" | "signal" | "good" | "plain" | "pass";

interface Look {
  tier: Tier;
  /** Big readout under the icon. */
  value: string;
  laude: boolean;
  border: string;
  big: string;
  Icon: typeof Trophy;
  iconColor: string;
}

function lookOf(grade: Grade): Look {
  if (grade.kind === "pass") {
    return {
      tier: "pass",
      value: "Idoneo",
      laude: false,
      border: "border-line/60",
      big: "text-xl font-bold text-ink-mute",
      Icon: GraduationCap,
      iconColor: "text-ink-mute",
    };
  }
  const v = grade.value;
  const gold = v === 30 && grade.laude;
  if (gold)
    return {
      tier: "gold",
      value: "30",
      laude: true,
      border: "border-yellow-400/60",
      big: "grad-text text-4xl font-bold",
      Icon: Trophy,
      iconColor: "text-yellow-400",
    };
  if (v >= 28)
    return {
      tier: "signal",
      value: String(v),
      laude: false,
      border: "border-[color:var(--signal)]/50",
      big: "grad-text text-4xl font-bold",
      Icon: Trophy,
      iconColor: "text-[var(--signal-2)]",
    };
  if (v >= 24)
    return {
      tier: "good",
      value: String(v),
      laude: false,
      border: "border-line",
      big: "text-4xl font-bold text-ink",
      Icon: Award,
      iconColor: "text-ink-mute",
    };
  return {
    tier: "plain",
    value: String(v),
    laude: false,
    border: "border-line/40",
    big: "text-4xl font-bold text-ink",
    Icon: Award,
    iconColor: "text-ink-faint",
  };
}

export function TrophyGrid({
  entries,
  onEdit,
  onRemove,
}: {
  entries: LibrettoEntry[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {sorted.map((entry) => {
        const look = lookOf(entry.grade);
        const synced = entry.source === "delphi";
        const Icon = look.Icon;
        return (
          <li
            key={entry.id}
            className={`glass lift group relative flex flex-col items-center gap-2 rounded-xl border-2 ${look.border} p-4 text-center`}
          >
            <Icon aria-hidden="true" className={`size-5 ${look.iconColor}`} />
            <div className={`font-display leading-none ${look.big}`}>
              {look.value}
              {look.laude && (
                <span aria-hidden="true" className="ml-0.5 text-base align-top">
                  ⭐
                </span>
              )}
              {look.laude && <span className="sr-only"> e lode</span>}
            </div>
            <div className="line-clamp-2 text-sm font-semibold text-ink">
              {entry.courseName}
            </div>
            <div className="eyebrow mt-auto text-ink-mute">
              {entry.cfu} CFU · {fmtPlainDate(entry.date)}
            </div>

            {/* azioni: appaiono al hover (gli esami sincronizzati non si toccano) */}
            {!synced && (
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEdit(entry.id)}
                  aria-label={`Modifica ${entry.courseName}`}
                  className="glass-2 rounded-full p-1.5 text-ink-mute transition-colors hover:text-ink"
                >
                  <Pencil aria-hidden="true" className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`Elimina ${entry.courseName}`}
                  className="glass-2 rounded-full p-1.5 text-ink-mute transition-colors hover:text-danger"
                >
                  <Trash2 aria-hidden="true" className="size-3.5" />
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
