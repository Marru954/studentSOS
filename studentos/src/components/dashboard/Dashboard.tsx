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
import { computeUrgencies } from "@/lib/domain/urgency";
import { daysFromToday, fmtLongDay, localDayOf, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useUi } from "@/lib/state/ui";
import { CfuPanel, MediaPanel } from "./CareerPanels";
import { ChangeNotices } from "./ChangeNotices";
import { ExamMiniCalendar } from "./ExamMiniCalendar";
import { NewsList } from "./NewsList";
import { NextExam } from "./NextExam";
import { SyncStatus } from "./SyncStatus";
import { TodayTimeline } from "./TodayTimeline";
import { UrgencyList } from "./UrgencyList";

export function Dashboard() {
  const synced = useSynced();
  const settings = useSettings();
  const libretto = useLibretto();
  const now = useNowMinute();

  const ready =
    now !== null && synced.hydrated && settings.hydrated && libretto.hydrated;

  const urgencies = useMemo(
    () =>
      ready ? computeUrgencies(synced.classEvents, synced.examCalls, now) : [],
    [ready, synced.classEvents, synced.examCalls, now],
  );

  // the merged all-years feed narrows to the pinned courses when set
  const todayEvents = useMemo(() => {
    if (!ready) return [];
    const today = localToday(now);
    const pinned = settings.pinnedCourses;
    return synced.classEvents
      .filter((e) => localDayOf(e.start) === today)
      .filter((e) => pinned.length === 0 || pinned.includes(e.courseName));
  }, [ready, synced.classEvents, settings.pinnedCourses, now]);

  // examCalls arrive date-sorted from the repo: first future date wins
  const nextExam = useMemo(() => {
    if (!ready) return undefined;
    return synced.examCalls.find((e) => daysFromToday(e.date, now) >= 0);
  }, [ready, synced.examCalls, now]);

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
        <p role="status" className="text-label font-medium text-ink-mute">
          Caricamento dei dati locali…
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Header stats: the two career instruments, front and centre. */}
          <MediaPanel
            entries={libretto.items}
            targetAverage={settings.degreePlan.targetAverage}
            className="lg:col-span-7"
          />
          <CfuPanel
            entries={libretto.items}
            totalCfu={settings.degreePlan.totalCfu}
            className="lg:col-span-5"
          />

          {/* Left: the urgency radar. Right: countdown + upcoming exams. */}
          <UrgencyList
            urgencies={urgencies}
            now={now}
            className="lg:col-span-8"
          />
          <div className="flex flex-col gap-4 lg:col-span-4">
            <NextExam
              exam={nextExam}
              days={nextExam ? daysFromToday(nextExam.date, now) : 0}
            />
            <ExamMiniCalendar exams={synced.examCalls} now={now} />
          </div>

          <TodayTimeline events={todayEvents} className="lg:col-span-7" />
          <NewsList items={synced.news} className="lg:col-span-5" />
          <ChangeNotices
            notices={synced.notices}
            onDismiss={(ids) => void synced.dismissNotices(ids)}
            className="lg:col-span-12"
          />
        </div>
      )}
    </div>
  );
}
