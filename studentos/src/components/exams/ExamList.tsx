"use client";

/**
 * /appelli: a month calendar overview on top, then the "Prossimi appelli"
 * exam cards with filter chips. The calendar always shows the whole visible
 * month; the chips filter only the card list below.
 */
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { SourceStatus } from "@/components/SourceStatus";
import {
  type ExamFilter,
  filterExams,
} from "@/lib/domain/calendar";
import { localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { ExamCards } from "./ExamCards";
import { MonthCalendar } from "./MonthCalendar";

const FILTERS: { id: ExamFilter; label: string }[] = [
  { id: "tutti", label: "Tutti" },
  { id: "urgenti", label: "Urgenti" },
  { id: "futuri", label: "Futuri" },
  { id: "passati", label: "Passati" },
];

export function ExamList() {
  const examCalls = useSynced((s) => s.examCalls);
  const hydrated = useSynced((s) => s.hydrated);
  const settingsHydrated = useSettings((s) => s.hydrated);
  const hasSources = useSettings((s) => s.enabledSourceIds.length > 0);
  const now = useNowMinute();

  const [filter, setFilter] = useState<ExamFilter>("futuri");
  const [monthOffset, setMonthOffset] = useState(0);

  const ready = now !== null && hydrated && settingsHydrated;
  const today = ready ? localToday(now) : undefined;

  // displayed month derives from now + offset, so it needs no init-time clock
  const displayed = useMemo(() => {
    const base = now ?? new Date();
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [now, monthOffset]);

  const cards = useMemo(() => {
    if (!today) return [];
    const list = filterExams(examCalls, filter, today);
    // upcoming ascending (soonest first); past descending (most recent first)
    return [...list].sort((a, b) =>
      filter === "passati"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  }, [examCalls, filter, today]);

  const counts = useMemo(() => {
    if (!today) return {} as Record<ExamFilter, number>;
    return Object.fromEntries(
      FILTERS.map((f) => [f.id, filterExams(examCalls, f.id, today).length]),
    ) as Record<ExamFilter, number>;
  }, [examCalls, today]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold">Appelli</h1>
        {ready && (
          <p className="mt-1 font-mono text-xs text-ink-mute">
            {examCalls.length} appelli sincronizzati
          </p>
        )}
      </header>

      {!ready ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-4">
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <PanelSkeleton />
            <PanelSkeleton />
            <PanelSkeleton />
          </div>
        </div>
      ) : !hasSources ? (
        <Panel>
          <p className="text-sm text-ink-mute">
            Nessuna fonte attiva.{" "}
            <Link href="/" className="text-signal underline underline-offset-2">
              Configura il tuo ateneo dal cruscotto
            </Link>{" "}
            per sincronizzare gli appelli d&rsquo;esame.
          </p>
        </Panel>
      ) : (
        <>
          <Panel title="Calendario" icon={<CalendarDays />}>
            <MonthCalendar
              year={displayed.getFullYear()}
              month0={displayed.getMonth()}
              exams={examCalls}
              today={today!}
              onPrev={() => setMonthOffset((o) => o - 1)}
              onNext={() => setMonthOffset((o) => o + 1)}
            />
          </Panel>

          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Prossimi appelli</h2>
              <div
                role="group"
                aria-label="Filtra gli appelli"
                className="flex flex-wrap gap-1.5"
              >
                {FILTERS.map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f.id)}
                      className={
                        active
                          ? "bg-primary-gradient rounded-full px-3 py-1 text-xs font-semibold text-white shadow-soft transition-colors"
                          : "rounded-full bg-night-950 px-3 py-1 text-xs font-medium text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
                      }
                    >
                      {f.label}
                      <span
                        className={`ml-1.5 font-mono ${active ? "text-white/75" : "text-ink-mute"}`}
                      >
                        {counts[f.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <ExamCards exams={cards} today={today!} />
          </section>
        </>
      )}

      <SourceStatus />
    </div>
  );
}
