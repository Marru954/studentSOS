"use client";

/**
 * The predictive dashboard: reads the three stores, runs the urgency engine,
 * and lays the instruments out on a bento grid. All clock-dependent rendering
 * waits for the first client tick (`now !== null`), so the SSR skeleton and
 * the first client render always match.
 */
import { CalendarClock, Settings2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/primitives/Button";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import type { ExamCall } from "@/lib/domain/types";
import { weightedAverage } from "@/lib/domain/libretto";
import {
  daysFromToday,
  fmtDayOfMonth,
  fmtLongDay,
  fmtMonthAbbr,
  localDayOf,
  localToday,
} from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useUi } from "@/lib/state/ui";
import { CfuPanel, MediaPanel } from "./CareerPanels";
import { ChangeNotices } from "./ChangeNotices";
import { ExamTimeline } from "./ExamTimeline";
import { NewsList } from "./NewsList";
import { QuickActions } from "./QuickActions";
import { SummaryBar } from "./SummaryBar";
import { SyncStatus } from "./SyncStatus";
import { TodayTimeline } from "./TodayTimeline";

/** Compact banner for the soonest upcoming exam, tone-graded by how close it is
 *  (rosso < 7 giorni, arancione < 14, neutro oltre). Hidden when none ahead. */
function NextExamBanner({ exam, days }: { exam: ExamCall; days: number }) {
  const tone =
    days < 7
      ? { border: "var(--danger)", text: "text-danger" }
      : days < 14
        ? { border: "var(--warn)", text: "text-warn" }
        : { border: "var(--signal-2)", text: "text-ink-mute" };
  const rel = days === 0 ? "oggi" : days === 1 ? "domani" : `tra ${days} giorni`;
  return (
    <div
      className="glass flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg px-4 py-2.5 text-sm lg:col-span-12"
      style={{ borderLeft: `3px solid ${tone.border}` }}
    >
      <CalendarClock aria-hidden="true" className={`size-4 shrink-0 ${tone.text}`} />
      <span className="text-ink-mute">Prossimo esame:</span>
      <span className="font-medium text-ink">{exam.courseName}</span>
      <span className="text-ink-faint">
        — {fmtDayOfMonth(exam.date)} {fmtMonthAbbr(exam.date)} · {rel}
      </span>
    </div>
  );
}

export function Dashboard() {
  const synced = useSynced();
  const settings = useSettings();
  const libretto = useLibretto();
  const now = useNowMinute();

  const ready =
    now !== null && synced.hydrated && settings.hydrated && libretto.hydrated;

  // the merged all-years feed narrows to the pinned courses when set
  const todayEvents = useMemo(() => {
    if (!ready) return [];
    const today = localToday(now);
    const pinned = settings.pinnedCourses;
    return synced.classEvents
      .filter((e) => localDayOf(e.start) === today)
      .filter((e) => pinned.length === 0 || pinned.includes(e.courseName));
  }, [ready, synced.classEvents, settings.pinnedCourses, now]);

  // summary-bar figures: next exam, exams within 7 days, weighted average
  const summary = useMemo(() => {
    if (!ready)
      return { nextExamDays: null as number | null, examsThisWeek: 0 };
    const upcoming = synced.examCalls
      .map((e) => daysFromToday(e.date, now))
      .filter((d) => d >= 0)
      .sort((a, b) => a - b);
    return {
      nextExamDays: upcoming.length ? upcoming[0] : null,
      examsThisWeek: upcoming.filter((d) => d <= 7).length,
    };
  }, [ready, synced.examCalls, now]);

  const average = useMemo(
    () => (ready ? weightedAverage(libretto.items) : undefined),
    [ready, libretto.items],
  );

  // soonest upcoming exam, for the header banner
  const nextExam = useMemo<{ exam: ExamCall; days: number } | null>(() => {
    if (!ready || now === null) return null;
    const exam = synced.examCalls
      .filter((e) => daysFromToday(e.date, now) >= 0)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (a.time ?? "").localeCompare(b.time ?? ""),
      )[0];
    return exam ? { exam, days: daysFromToday(exam.date, now) } : null;
  }, [ready, synced.examCalls, now]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold">Cruscotto</h1>
          {now && (
            <p className="mt-1 text-sm text-ink-mute first-letter:uppercase">
              {fmtLongDay(now)} · tutto ciò che conta, adesso
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => useUi.getState().openOnboarding()}>
            <Settings2 aria-hidden="true" className="size-3.5" />
            Configura
          </Button>
          <SyncStatus
            syncing={synced.syncing}
            lastSyncError={synced.lastSyncError}
            syncMeta={synced.syncMeta}
            canSync={ready && settings.enabledSources().length > 0}
            onSync={() => void useSynced.getState().sync()}
          />
        </div>
      </header>

      {!ready ? (
        <div
          role="status"
          aria-busy="true"
          className="grid grid-cols-1 gap-4 lg:grid-cols-12"
        >
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton className="lg:col-span-7" />
          <PanelSkeleton className="lg:col-span-5" />
          <PanelSkeleton className="lg:col-span-8" />
          <PanelSkeleton className="lg:col-span-4" />
        </div>
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* One-line recap of what matters now. */}
          <SummaryBar
            nextExamDays={summary.nextExamDays}
            examsThisWeek={summary.examsThisWeek}
            average={average}
            className="lg:col-span-12"
          />

          {/* One-tap shortcuts. */}
          <QuickActions className="lg:col-span-12" />

          {/* The next exam, front and centre. */}
          {nextExam && (
            <NextExamBanner exam={nextExam.exam} days={nextExam.days} />
          )}

          {/* Today's lessons. */}
          <TodayTimeline events={todayEvents} className="lg:col-span-12" />

          {/* Header stats: the two career instruments, front and centre. */}
          <MediaPanel
            entries={libretto.items}
            targetAverage={settings.degreePlan.targetAverage}
            className="lg:col-span-7"
          />
          <CfuPanel
            entries={libretto.items}
            totalCfu={settings.degreePlan.totalCfu}
            now={now}
            className="lg:col-span-5"
          />

          {/* Unified, colour-tiered exam timeline (urgenze + appelli merged). */}
          <ExamTimeline
            exams={synced.examCalls}
            now={now}
            className="lg:col-span-8"
          />
          <NewsList items={synced.news} className="lg:col-span-4" />

          {synced.notices.length > 0 && (
            <ChangeNotices
              notices={synced.notices}
              onDismiss={(ids) => void synced.dismissNotices(ids)}
              className="lg:col-span-12"
            />
          )}
        </div>
      )}
    </div>
  );
}
