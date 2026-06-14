/** The libretto ledger, newest first. Deleting goes through ConfirmButton. */
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtPlainDate } from "@/lib/format";

/** The grade chip: 30/lode → ok, ≥28 → signal, else neutral (no tone class). */
function GradeCell({ entry }: { entry: LibrettoEntry }) {
  if (entry.grade.kind === "pass")
    return <span className="chip">Idoneo</span>;

  const tone =
    entry.grade.value >= 30
      ? "chip-ok"
      : entry.grade.value >= 28
        ? "chip-signal"
        : "";

  return (
    <span
      className={`chip ${tone}`}
      style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
    >
      {entry.grade.value}
      {entry.grade.laude && (
        <>
          <span aria-hidden="true">L</span>
          <span className="sr-only"> e lode</span>
        </>
      )}
    </span>
  );
}

export function EntryTable({
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
    <table className="w-full text-sm">
      <thead>
        <tr className="eyebrow text-left">
          {["Data", "Insegnamento", "CFU", "Voto", "Anno", "Note", "Azioni"].map(
            (h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry) => (
          <tr
            key={entry.id}
            className="border-t border-[var(--hairline)]"
          >
            <td className="font-num muted whitespace-nowrap px-4 py-3">
              {fmtPlainDate(entry.date)}
            </td>
            <td className="px-4 py-3">
              {entry.courseName}
              {entry.teacher && (
                <span className="block text-xs text-ink-mute">
                  {entry.teacher}
                </span>
              )}
            </td>
            <td className="font-num muted px-4 py-3">{entry.cfu}</td>
            <td className="whitespace-nowrap px-4 py-3">
              <GradeCell entry={entry} />
            </td>
            <td className="font-num muted whitespace-nowrap px-4 py-3">
              {entry.academicYear ?? "—"}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                {entry.source === "delphi" && (
                  <Badge tone="signal">Delphi</Badge>
                )}
                {entry.excludeFromAverage && (
                  <Badge tone="neutral">fuori media</Badge>
                )}
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              {entry.source === "delphi" ? (
                <span className="text-xs text-ink-mute">sincronizzato</span>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onEdit(entry.id)}>
                    Modifica
                  </Button>
                  <ConfirmButton onConfirm={() => onRemove(entry.id)}>
                    Elimina
                  </ConfirmButton>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
