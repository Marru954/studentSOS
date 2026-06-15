"use client";

/**
 * /appelli: a month calendar overview on top, then the "Prossimi appelli"
 * exam cards with filter chips. The year filter scopes both the calendar and
 * the cards (applied once, upstream); the tab chips then filter only the card
 * list below.
 */
import {
  CalendarArrowDown,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Plus,
  Ticket,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { EmptyState } from "@/components/primitives/EmptyState";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { CoursePicker } from "@/components/CoursePicker";
import { YearFilter } from "@/components/YearFilter";
import { bookingState } from "@/lib/domain/booking";
import {
  type ExamFilter,
  filterExams,
} from "@/lib/domain/calendar";
import { eventsToIcs, type IcsEvent } from "@/lib/domain/ical";
import { extractCourseNames } from "@/lib/domain/notes";
import { matchesYear } from "@/lib/domain/sources";
import type { ExamCall, ExamKind } from "@/lib/domain/types";
import { daysBetweenIso, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { deleteExamCall } from "@/lib/storage/repo";
import { ExamCards } from "./ExamCards";
import { ManualExamForm } from "./ManualExamForm";
import { MonthCalendar } from "./MonthCalendar";

const FILTERS: { id: ExamFilter; label: string }[] = [
  { id: "tutti", label: "Tutti" },
  { id: "urgenti", label: "Urgenti" },
  { id: "futuri", label: "Futuri" },
];

type GroupId = "urgenti" | "prenotabili" | "futuri" | "passati";

// "passati" is intentionally absent: past appelli are never shown on /appelli
// (groupOf still buckets them, but with no GROUPS entry they drop from view).
const GROUPS: { id: GroupId; label: string; icon: LucideIcon }[] = [
  { id: "urgenti", label: "Urgenti", icon: TriangleAlert },
  { id: "prenotabili", label: "Prenotabili", icon: Ticket },
  { id: "futuri", label: "Futuri", icon: CalendarClock },
];

/** Bucket an exam by its own date/booking state — drives the accordion. */
function groupOf(exam: ExamCall, today: string): GroupId {
  const days = daysBetweenIso(today, exam.date);
  if (days < 0) return "passati";
  if (days <= 2) return "urgenti";
  const b = bookingState(exam.booking, today).kind;
  if (b === "open" || b === "closing" || b === "opens") return "prenotabili";
  return "futuri";
}

/** Cards shown collapsed before "Mostra altri". */
const COLLAPSED_COUNT = 6;

/** Italian label for an exam kind — used in the exported .ics description. */
function kindLabel(kind: ExamKind): string {
  switch (kind) {
    case "written":
      return "Scritto";
    case "oral":
      return "Orale";
    case "written+oral":
      return "Scritto e orale";
    case "practical":
      return "Pratica";
    default:
      return "Esame";
  }
}

export function ExamList() {
  const examCalls = useSynced((s) => s.examCalls);
  const classEvents = useSynced((s) => s.classEvents);
  const librettoEntries = useLibretto((s) => s.items);
  const hydrated = useSynced((s) => s.hydrated);
  const settingsHydrated = useSettings((s) => s.hydrated);
  const hasSources = useSettings((s) => s.enabledSourceIds.length > 0);
  const pinnedCourses = useSettings((s) => s.pinnedCourses);
  const updateSettings = useSettings((s) => s.update);
  const now = useNowMinute();

  const [filter, setFilter] = useState<ExamFilter>("futuri");
  // Default "all" on purpose: a 1st-year sees every year's appelli and can
  // anticipate later exams. Year first, then optional per-course refinement.
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [monthOffset, setMonthOffset] = useState(0);

  const ready = now !== null && hydrated && settingsHydrated;
  const today = ready ? localToday(now) : undefined;

  // One filter pipeline. Year scope (yearScopedCalls) feeds the course picker
  // so it lists the chosen year's courses; the full year+course scope
  // (scopedCalls) is the SINGLE set passed to BOTH the calendar and the cards/
  // counts/summary, so the two always show exactly the same exams.
  const yearScopedCalls = useMemo(
    () => examCalls.filter((e) => matchesYear(e.sourceId, yearFilter)),
    [examCalls, yearFilter],
  );
  const courseOptions = useMemo(
    () => extractCourseNames([], yearScopedCalls),
    [yearScopedCalls],
  );
  const scopedCalls = useMemo(
    () =>
      yearScopedCalls.filter(
        (e) =>
          pinnedCourses.length === 0 || pinnedCourses.includes(e.courseName),
      ),
    [yearScopedCalls, pinnedCourses],
  );

  // Known course names for the manual-exam datalist: every synced course
  // (timetable + appelli) plus the libretto, deduped. Year-agnostic on
  // purpose — a free-text suggestion list, not a filter.
  const knownCourses = useMemo(() => {
    const names = new Set(extractCourseNames(classEvents, examCalls));
    for (const e of librettoEntries) names.add(e.courseName);
    return [...names].sort((a, b) => a.localeCompare(b, "it"));
  }, [classEvents, examCalls, librettoEntries]);

  // Manual appelli (sourceId starts with "manual") are deletable; synced ones
  // are not. Drop the row, then re-read the synced store so the cards update.
  async function handleDelete(id: string) {
    await deleteExamCall(id);
    useSynced.getState().refresh();
    useToast.getState().show("Appello eliminato.", "ok");
  }

  // Export the visible future appelli to an .ics file that opens in
  // Google/Apple/Outlook. Uses the full examCalls (not the year-scoped subset)
  // on purpose, so a future exam is never silently dropped by an active filter.
  function exportIcs() {
    if (!today) return;
    const future = examCalls.filter((e) => e.date >= today);
    if (future.length === 0) {
      useToast.getState().show("Nessun appello futuro da esportare.", "warn");
      return;
    }
    const events: IcsEvent[] = future.map((exam) => {
      const start = new Date(`${exam.date}T${exam.time ?? "09:00"}:00`);
      return {
        uid: `${exam.id}@studentos`,
        summary: exam.courseName,
        start: start.toISOString(),
        end: new Date(start.getTime() + 3_600_000).toISOString(),
        location: exam.room,
        description: [exam.teacher, kindLabel(exam.kind)]
          .filter(Boolean)
          .join(" · "),
      };
    });
    const ics = eventsToIcs(events, { calName: "Appelli — StudentOS" });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appelli-studentos.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    useToast.getState().show(`${events.length} appelli esportati.`, "ok");
  }

  // displayed month derives from now + offset, so it needs no init-time clock
  const displayed = useMemo(() => {
    const base = now ?? new Date();
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [now, monthOffset]);

  const cards = useMemo(() => {
    if (!today) return [];
    const list = filterExams(scopedCalls, filter, today);
    // upcoming ascending (soonest first); past descending (most recent first)
    return [...list].sort((a, b) =>
      filter === "passati"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  }, [scopedCalls, filter, today]);

  const counts = useMemo(() => {
    if (!today) return {} as Record<ExamFilter, number>;
    return Object.fromEntries(
      FILTERS.map((f) => [f.id, filterExams(scopedCalls, f.id, today).length]),
    ) as Record<ExamFilter, number>;
  }, [scopedCalls, today]);

  // the filtered cards, bucketed into the accordion groups (empty groups drop)
  const grouped = useMemo(() => {
    if (!today) return [];
    const buckets: Record<GroupId, ExamCall[]> = {
      urgenti: [],
      prenotabili: [],
      futuri: [],
      passati: [],
    };
    for (const e of cards) buckets[groupOf(e, today)].push(e);
    return GROUPS.map((g) => ({ ...g, items: buckets[g.id] })).filter(
      (g) => g.items.length > 0,
    );
  }, [cards, today]);

  // Urgenti open by default; others closed. "Mostra altri" expands per group.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    urgenti: true,
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const toggleOpen = (id: GroupId) =>
    setOpenGroups((s) => ({ ...s, [id]: !(s[id] ?? false) }));
  const toggleExpanded = (id: GroupId) =>
    setExpandedGroups((s) => ({ ...s, [id]: !(s[id] ?? false) }));

  return (
    <div className="flex flex-col gap-5">
      <header className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Appelli</h1>
          {ready && (
            <p className="muted mt-1.5">
              Sessione estiva 2026 · {examCalls.length} appelli tracciati
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportIcs}
            disabled={!ready}
            aria-label="Esporta gli appelli futuri in un file per il calendario"
            className="btn disabled:pointer-events-none disabled:opacity-45"
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
          >
            <CalendarArrowDown aria-hidden="true" className="size-4" />
            Esporta in Calendario
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(
                "aggiungi-appello",
              ) as HTMLDetailsElement | null;
              if (!el) return;
              el.open = true;
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              el.querySelector<HTMLInputElement>("input")?.focus({
                preventScroll: true,
              });
            }}
            disabled={!ready}
            aria-label="Aggiungi un appello manualmente"
            className="btn btn-primary disabled:pointer-events-none disabled:opacity-45"
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
          >
            <Plus aria-hidden="true" className="size-4" />
            Aggiungi
          </button>
        </div>
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
      ) : (
        <>
          {!hasSources && (
            <Panel>
              <p className="text-sm text-ink-mute">
                Nessuna fonte attiva.{" "}
                <Link href="/" className="text-signal underline underline-offset-2">
                  Configura il tuo ateneo dal cruscotto
                </Link>{" "}
                per sincronizzare gli appelli d&rsquo;esame, oppure aggiungine
                uno manualmente qui sotto.
              </p>
            </Panel>
          )}
          <Panel title="Calendario" icon={<CalendarDays />} className="accent-top">
            <MonthCalendar
              year={displayed.getFullYear()}
              month0={displayed.getMonth()}
              exams={scopedCalls}
              today={today!}
              onPrev={() => setMonthOffset((o) => o - 1)}
              onNext={() => setMonthOffset((o) => o + 1)}
            />
          </Panel>

          <ManualExamForm courses={knownCourses} />

          <div className="flex flex-col gap-3">
            <YearFilter value={yearFilter} onChange={setYearFilter} />
            <CoursePicker
              courses={courseOptions}
              pinned={pinnedCourses}
              onChange={(p) => void updateSettings({ pinnedCourses: p })}
            />
          </div>

          <section className="flex flex-col gap-3">
            {/* Sticky filter tabs — stay reachable while the list scrolls. */}
            <div className="glass sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2 shadow-soft">
              <h2 className="pl-1 text-lg font-semibold">Prossimi appelli</h2>
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
                          ? "grad-fill rounded-full px-3 py-1 text-xs font-semibold text-white shadow-soft transition-colors"
                          : "chip transition-colors hover:border-line-strong"
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

            {grouped.length === 0 ? (
              pinnedCourses.length > 0 ? (
                <EmptyState
                  compact
                  icon={<CalendarDays />}
                  title="Nessun appello per i corsi scelti"
                  description="Stai filtrando per «I miei esami». Allarga la selezione qui sopra per vedere tutti gli appelli del tuo corso di laurea."
                />
              ) : (
                <EmptyState
                  compact
                  icon={<CalendarClock />}
                  title="Nessun appello in vista"
                  description="Appena il tuo corso pubblica nuove date compaiono qui, ordinate per urgenza. Intanto puoi aggiungere un appello a mano qui sopra e tenerlo d'occhio."
                />
              )
            ) : (
              <div className="flex flex-col gap-3">
                {grouped.map((g) => {
                  const open = openGroups[g.id] ?? false;
                  const expanded = expandedGroups[g.id] ?? false;
                  const shown = expanded
                    ? g.items
                    : g.items.slice(0, COLLAPSED_COUNT);
                  const Icon = g.icon;
                  const extra = g.items.length - COLLAPSED_COUNT;
                  return (
                    <section
                      key={g.id}
                      className="glass reveal overflow-hidden rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => toggleOpen(g.id)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-night-900"
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-[1.1rem] text-[var(--signal-2)]"
                        />
                        <span className="font-semibold">{g.label}</span>
                        <span className="chip ml-1">{g.items.length}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`ml-auto size-4 text-ink-mute transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-[max-height] duration-300 ease-out ${open ? "max-h-[6000px]" : "max-h-0"}`}
                      >
                        <div className="px-4 pb-4 pt-1">
                          <ExamCards
                            exams={shown}
                            today={today!}
                            onDelete={handleDelete}
                          />
                          {extra > 0 && (
                            <div className="mt-3 flex justify-center">
                              <button
                                type="button"
                                onClick={() => toggleExpanded(g.id)}
                                className="chip transition-colors hover:border-line-strong"
                              >
                                {expanded
                                  ? "Mostra meno"
                                  : `Mostra altri ${extra} appelli`}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>

          {/* Hide the summary entirely when there's nothing in scope: three
              zeros are noise, not information. */}
          {((counts.urgenti ?? 0) > 0 ||
            (counts.futuri ?? 0) > 0 ||
            scopedCalls.length > 0) && (
            <div className="glass card-glow reveal rounded-xl p-5">
              <p className="eyebrow mb-3 text-ink-mute">Riepilogo sessione</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-ink">
                    <CountUp value={counts.urgenti ?? 0} />
                  </div>
                  <div className="eyebrow text-danger">Urgenti</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-ink">
                    <CountUp value={counts.futuri ?? 0} />
                  </div>
                  <div className="eyebrow text-ink-mute">Futuri</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-ink">
                    <CountUp value={scopedCalls.length} />
                  </div>
                  <div className="eyebrow text-ink-mute">Totali</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
