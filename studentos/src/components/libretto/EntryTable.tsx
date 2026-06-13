/** The libretto ledger, newest first. Deleting goes through ConfirmButton. */
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import type { LibrettoEntry } from "@/lib/domain/types";
import { fmtPlainDate } from "@/lib/format";

function GradeCell({ entry }: { entry: LibrettoEntry }) {
  if (entry.grade.kind === "pass") return <Badge tone="neutral">Idoneo</Badge>;
  return (
    <span className="font-mono">
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
        <tr className="border-b border-line text-left">
          {["Data", "Corso", "CFU", "Voto", "Anno", "Note", "Azioni"].map((h) => (
            <th
              key={h}
              scope="col"
              className="px-4 py-2 text-label font-medium text-ink-mute"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry) => (
          <tr key={entry.id} className="border-b border-line last:border-b-0">
            <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-mute">
              {fmtPlainDate(entry.date)}
            </td>
            <td className="px-4 py-2.5">
              {entry.courseName}
              {entry.teacher && (
                <span className="block text-xs text-ink-mute">{entry.teacher}</span>
              )}
            </td>
            <td className="px-4 py-2.5 font-mono">{entry.cfu}</td>
            <td className="whitespace-nowrap px-4 py-2.5">
              <GradeCell entry={entry} />
            </td>
            <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-mute">
              {entry.academicYear ?? "—"}
            </td>
            <td className="px-4 py-2.5">
              <div className="flex flex-wrap gap-1.5">
                {entry.source === "delphi" && (
                  <Badge tone="signal">Delphi</Badge>
                )}
                {entry.excludeFromAverage && (
                  <Badge tone="neutral">fuori media</Badge>
                )}
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2.5">
              {entry.source === "delphi" ? (
                <span className="text-xs text-ink-mute">
                  sincronizzato
                </span>
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
