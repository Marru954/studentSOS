"use client";

import { CalendarClock, ChevronDown, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import type { ExamCall } from "@/lib/domain/types";
import {
  daysFromToday,
  fmtDayOfMonth,
  fmtMonthAbbr,
  fmtPlainDayMonth,
} from "@/lib/format";

/** Urgency tier from the REAL days left: rosso oggi/domani, arancione entro la
 *  settimana, grigio oltre. */
type Tier = "today" | "week" | "later";

function tierOf(days: number): Tier {
  if (days <= 1) return "today";
  if (days <= 7) return "week";
  return "later";
}

/** Thin, neutral, hover-revealed scrollbar — no resting groove or line.
 *  Webkit (Chrome/Safari) + Firefox `scrollbar-width: thin`. */
const SOFT_SCROLL =
  "[scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--hairline-strong)_transparent] " +
  "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-200 " +
  "hover:[&::-webkit-scrollbar-thumb]:bg-[var(--hairline-strong)]";

/** Reference chip class per urgency tier. */
const CHIP: Record<Tier, string> = {
  // Oggi/settimana = ambra (presto), non rosso: il rosso resta per i conflitti
  // e per l'iscrizione che scade oggi. Il pulse su days<=2 segnala l'urgenza.
  today: "chip chip-warn",
  week: "chip chip-warn",
  later: "chip",
};

function relLabel(days: number): string {
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `tra ${days} giorni`;
}

/** "ore 09:30 · Aula T5" — the date now lives in the row's date block. */
function timeRoom(e: ExamCall): string {
  return [e.time && `ore ${e.time}`, e.room].filter(Boolean).join(" · ");
}

/** One course = one row; multiple future calls of the same course collapse to
 *  the nearest, with the rest behind "+N altre date". */
interface Group {
  course: string;
  nearest: ExamCall;
  extra: ExamCall[];
}

/** Same date+time, different courses → a clash the student must resolve. */
interface Clash {
  when: string;
  courses: string[];
}

function buildGroups(upcoming: ExamCall[]): Group[] {
  const byCourse = new Map<string, ExamCall[]>();
  for (const e of upcoming) {
    byCourse.set(e.courseName, [...(byCourse.get(e.courseName) ?? []), e]);
  }
  const groups = [...byCourse.values()].map((calls) => ({
    course: calls[0].courseName,
    nearest: calls[0],
    extra: calls.slice(1),
  }));
  return groups.sort(
    (a, b) =>
      a.nearest.date.localeCompare(b.nearest.date) ||
      (a.nearest.time ?? "").localeCompare(b.nearest.time ?? ""),
  );
}

function buildClashes(upcoming: ExamCall[]): Clash[] {
  const bySlot = new Map<string, ExamCall[]>();
  for (const e of upcoming) {
    if (!e.time) continue;
    bySlot.set(`${e.date} ${e.time}`, [...(bySlot.get(`${e.date} ${e.time}`) ?? []), e]);
  }
  const out: Clash[] = [];
  for (const group of bySlot.values()) {
    const courses = [...new Set(group.map((e) => e.courseName))];
    if (courses.length < 2) continue;
    out.push({
      when: `${fmtPlainDayMonth(group[0].date)} ${group[0].time}`,
      courses,
    });
  }
  return out;
}

/** Unified, chronological timeline of upcoming exam calls. Conflicts pinned on
 *  top; the full course list lives in a fixed-height internal scroll area so
 *  the dashboard fits one screen and never grows down the page. */
export function ExamTimeline({
  exams,
  now,
  className,
}: {
  exams: ExamCall[];
  now: Date;
  className?: string;
}) {
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const [clashesOpen, setClashesOpen] = useState(false);

  // Memoizzati su [exams, now]: i toggle locali (openDates/clashesOpen) non
  // devono ricostruire gruppi e conflitti su tutti gli appelli a ogni click.
  const upcoming = useMemo(
    () =>
      exams
        .filter((e) => daysFromToday(e.date, now) >= 0)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            (a.time ?? "").localeCompare(b.time ?? ""),
        ),
    [exams, now],
  );
  const groups = useMemo(() => buildGroups(upcoming), [upcoming]);
  const clashes = useMemo(() => buildClashes(upcoming), [upcoming]);

  function toggleDates(course: string) {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(course)) next.delete(course);
      else next.add(course);
      return next;
    });
  }

  return (
    <Panel
      title="Appelli in arrivo"
      icon={<CalendarClock />}
      className={className}
      actions={
        upcoming.length > 0 ? <Badge tone="neutral">{upcoming.length}</Badge> : undefined
      }
    >
      {upcoming.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessun appello in programma. Attiva le fonti del tuo corso per vedere
          il calendario.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Riga di contesto: il counter conta TUTTI gli appelli del corso, non
              solo i propri — chiarirlo evita che il numero alto sembri un carico
              personale. Il filtro per anno/materia vive in /appelli. */}
          <p className="text-xs text-ink-faint">
            Tutti gli appelli del tuo corso ·{" "}
            <Link href="/appelli" className="text-signal hover:underline">
              filtra in /appelli
            </Link>
          </p>

          {/* Conflitti di orario: rosso (pericolo reale) ma collassati in UNA
              riga espandibile, così non impilano N banner rossi in cima. */}
          {clashes.length > 0 && (
            <div className="rounded-md border border-danger/35 bg-danger-dim text-danger">
              <button
                type="button"
                onClick={() => setClashesOpen((o) => !o)}
                aria-expanded={clashesOpen}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium"
              >
                <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="flex-1 text-left">
                  {clashes.length}{" "}
                  {clashes.length === 1
                    ? "conflitto di orario rilevato"
                    : "conflitti di orario rilevati"}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 shrink-0 transition-transform ${clashesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {/* Riga esplicativa, sempre visibile e non allarmistica: i conflitti
                  sono sovrapposizioni nel calendario del corso intero, non errori
                  dello studente. */}
              <p className="px-3 pb-1.5 text-[0.7rem] text-danger/70">
                Sovrapposizioni nel calendario del corso — non dipendono da te
              </p>
              {clashesOpen && (
                <ul className="flex flex-col gap-1 border-t border-danger/25 px-3 py-1.5">
                  {clashes.map((c) => (
                    <li key={c.when} className="truncate text-xs">
                      <span className="font-mono">{c.when}</span> ·{" "}
                      {c.courses.join(" vs ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <ul className={`no-scrollbar stagger-children flex max-h-[360px] flex-col divide-y divide-line overflow-y-auto ${SOFT_SCROLL}`}>
            {groups.map((g) => {
              const days = daysFromToday(g.nearest.date, now);
              const tier = tierOf(days);
              const bookingDays = g.nearest.booking?.closesAt
                ? daysFromToday(g.nearest.booking.closesAt, now)
                : undefined;
              const datesOpen = openDates.has(g.course);
              return (
                <li key={g.course} className="flex items-start gap-3 py-3 first:pt-0">
                  {/* date block — reference ExamRow */}
                  <div className="min-w-[3.25rem] shrink-0 text-center">
                    <div className="font-display text-[1.05rem] font-bold leading-none text-ink">
                      {fmtDayOfMonth(g.nearest.date)}
                    </div>
                    <div className="text-[0.7rem] uppercase text-ink-faint">
                      {fmtMonthAbbr(g.nearest.date)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-ink">
                      {g.course}
                      {bookingDays === 0 && (
                        <span className="chip chip-danger pulse-soft">
                          iscriviti oggi!
                        </span>
                      )}
                    </p>
                    <p className="font-num text-xs text-ink-faint">
                      {timeRoom(g.nearest)}
                    </p>
                    {bookingDays !== undefined &&
                      bookingDays >= 0 &&
                      bookingDays <= 14 && (
                        <p className="mt-1 text-xs text-warn">
                          Iscrizione entro il{" "}
                          {fmtPlainDayMonth(g.nearest.booking!.closesAt!)}
                        </p>
                      )}
                    {g.extra.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleDates(g.course)}
                          className="mt-1 text-xs font-medium text-signal hover:underline"
                        >
                          {datesOpen
                            ? "Nascondi date"
                            : `+${g.extra.length} altre date`}
                        </button>
                        {datesOpen && (
                          <ul className="mt-1 flex flex-col gap-0.5 border-l border-line pl-3">
                            {g.extra.map((x) => (
                              <li key={x.id} className="text-xs text-ink-mute">
                                {fmtPlainDayMonth(x.date)}
                                {timeRoom(x) && ` · ${timeRoom(x)}`} ·{" "}
                                {relLabel(daysFromToday(x.date, now))}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                  <span
                    className={`${CHIP[tier]} mt-0.5 shrink-0${days <= 2 ? " pulse-soft" : ""}`}
                  >
                    {relLabel(days)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}
