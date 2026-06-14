/** Study instruments: today/week totals and the ore-vs-voto table. Pure. */
import { Flame, Layers, Timer } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import { focusByCourse, minutesInRange } from "@/lib/domain/focus";
import type { FocusSession, Grade, LibrettoEntry } from "@/lib/domain/types";
import { fmtMinutes, localToday } from "@/lib/format";

/** Consecutive days (ending today, or yesterday as grace) with ≥1 session.
 *  0 when neither today nor yesterday has a session. */
function studyStreak(sessions: FocusSession[], now: Date): number {
  const days = new Set(sessions.map((s) => localToday(new Date(s.startedAt))));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  // allow the streak to anchor on yesterday if nothing's logged today yet
  if (!days.has(localToday(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localToday(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

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
  const streak = studyStreak(sessions, now);
  const streakLabel =
    streak === 0
      ? "Inizia oggi"
      : streak === 1
        ? "🔥 1 giorno"
        : `🔥 ${streak} giorni di fila`;

  const cells = [
    { value: fmtMinutes(today), label: "Tempo oggi", Icon: Flame },
    { value: fmtMinutes(week), label: "Ultimi 7 giorni", Icon: Timer },
    { value: String(sessions.length), label: "Sessioni", Icon: Layers },
  ];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="reveal flex items-center gap-2">
        <span
          className={cn(
            "chip",
            streak > 0 ? "chip-warn font-semibold" : "text-ink-mute",
          )}
        >
          {streakLabel}
        </span>
        <span className="text-[0.8rem] text-ink-faint">
          {streak > 0
            ? "Continua così: ogni giorno conta."
            : "Avvia una sessione per accendere la streak."}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cells.map(({ value, label, Icon }) => (
          <div
            key={label}
            className="glass reveal rounded-lg p-[1.1rem] text-center"
          >
            <span className="inline-flex text-[color:var(--signal-2)]">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="font-num mt-1 text-[1.7rem] font-extrabold leading-tight [font-family:var(--font-display)]">
              {value}
            </div>
            <div className="faint text-[0.74rem]">{label}</div>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <p className="glass reveal muted rounded-lg p-4 text-sm">
          Nessuna sessione ancora registrata. Avvia un timer Pomodoro qui
          accanto per iniziare a tracciare lo studio.
        </p>
      ) : (
        perCourse.length > 0 && (
          <div className="glass reveal overflow-hidden rounded-lg">
            <h3 className="border-b border-line px-4 py-3 text-sm font-semibold [font-family:var(--font-sans)] [letter-spacing:0]">
              Ore per corso
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Corso", "Tempo", "Voto"].map((h) => (
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
                {perCourse.map((row) => (
                  <tr
                    key={row.courseName}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="px-4 py-2">{row.courseName}</td>
                    <td className="font-num px-4 py-2">
                      {fmtMinutes(row.minutes)}
                    </td>
                    <td className="px-4 py-2">{gradeLabel(row.grade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
