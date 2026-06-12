/** Study instruments: today/week totals and the ore-vs-voto table. Pure. */
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import { Stat } from "@/components/primitives/Stat";
import { focusByCourse, minutesInRange } from "@/lib/domain/focus";
import type { FocusSession, Grade, LibrettoEntry } from "@/lib/domain/types";
import { fmtMinutes } from "@/lib/format";

function gradeLabel(grade?: Grade): React.ReactNode {
  if (!grade) return <span className="text-ink-mute">—</span>;
  if (grade.kind === "pass") return <Badge tone="neutral">Idoneo</Badge>;
  return (
    <span className="font-mono">
      {grade.value}
      {grade.laude && (
        <>
          <span aria-hidden="true">L</span>
          <span className="sr-only"> e lode</span>
        </>
      )}
    </span>
  );
}

export function FocusStats({
  sessions,
  libretto,
  now,
  className,
}: {
  sessions: FocusSession[];
  libretto: LibrettoEntry[];
  now: Date;
  className?: string;
}) {
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(dayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const end = new Date(dayStart);
  end.setDate(end.getDate() + 1);

  const today = minutesInRange(sessions, dayStart.toISOString(), end.toISOString());
  const week = minutesInRange(sessions, weekStart.toISOString(), end.toISOString());
  const perCourse = focusByCourse(sessions, libretto);

  return (
    <Panel title="Studio" icon={<BarChart3 />} flush className={className}>
      <div className="flex gap-8 p-4">
        <Stat label="oggi" value={fmtMinutes(today)} />
        <Stat label="ultimi 7 giorni" value={fmtMinutes(week)} />
        <Stat label="sessioni" value={String(sessions.length)} />
      </div>
      {perCourse.length > 0 && (
        <table className="w-full border-t border-line text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {["Corso", "Tempo", "Voto"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2 text-label font-medium font-normal text-ink-mute"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {perCourse.map((row) => (
              <tr
                key={row.courseName}
                className="border-b border-line last:border-b-0"
              >
                <td className="px-4 py-2">{row.courseName}</td>
                <td className="px-4 py-2 font-mono">{fmtMinutes(row.minutes)}</td>
                <td className="px-4 py-2">{gradeLabel(row.grade)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
