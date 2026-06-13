"use client";

/**
 * The predictive dashboard: reads the three stores, runs the urgency engine,
 * and lays the instruments out on a bento grid. All clock-dependent rendering
 * waits for the first client tick (`now !== null`), so the SSR skeleton and
 * the first client render always match.
 */
import { Settings2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/primitives/Button";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { weightedAverage } from "@/lib/domain/libretto";
import { daysFromToday, fmtLongDay, localDayOf, localToday } from "@/lib/format";
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

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cruscotto</h1>
          {now && (
            <p className="mt-1 font-mono text-xs text-ink-mute">
              {fmtLongDay(now)}
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* One-line recap of what matters now. */}
          <SummaryBar
            nextExamDays={summary.nextExamDays}
            examsThisWeek={summary.examsThisWeek}
            average={average}
            className="lg:col-span-12"
          />

          {/* One-tap shortcuts. */}
          <QuickActions className="lg:col-span-12" />

          {/* Today's lessons: a card when there are any, nothing when not. */}
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
