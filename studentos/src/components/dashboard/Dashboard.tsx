"use client";

/**
 * The predictive dashboard: reads the three stores, runs the urgency engine,
 * and lays the instruments out on a bento grid. All clock-dependent rendering
 * waits for the first client tick (`now !== null`), so the SSR skeleton and
 * the first client render always match.
 */
import { CalendarClock, CheckCircle2, Settings2, Timer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import type { ExamCall } from "@/lib/domain/types";
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
import { CruscottoTour } from "@/components/onboarding/CruscottoTour";
import { BackupNudge } from "./BackupNudge";
import { BookingDeadlines } from "./BookingDeadlines";
import { BookingReminders } from "./BookingReminders";
import { CareerStrip, CfuMini } from "./CareerSummary";
import { ChangeNotices } from "./ChangeNotices";
import { ExamTimeline } from "./ExamTimeline";
import { LinksPanel } from "./LinksPanel";
import { QuickActions } from "./QuickActions";
import { WeeklyGoalCard } from "./WeeklyGoalCard";
import { SyncStatus } from "./SyncStatus";
import { TodayTimeline } from "./TodayTimeline";

/** Bento hero: the soonest exam with a big countdown, tone-graded by proximity
 *  (rosso < 7 giorni, arancione < 14). */
function NextExamHero({
  exam,
  days,
  examsThisWeek,
  className,
}: {
  exam: ExamCall;
  days: number;
  examsThisWeek: number;
  className?: string;
}) {
  // Viola = primario; ambra = imminente (≤2 gg). Mai rosso: il rosso resta
  // riservato al pericolo reale (conflitto / iscrizione che scade oggi).
  const accent = days <= 2 ? "var(--warn)" : "var(--signal)";
  const barWidth = days < 0 ? 100 : Math.max(8, 100 - days * 2.5);
  return (
    <section
      className={cn(
        "glass panel-hero accent-top relative flex flex-col gap-5 overflow-hidden rounded-lg p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(70% 60% at 85% 0%, ${accent}, transparent 60%)`,
          opacity: 0.12,
        }}
      />
      <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">
        <CalendarClock aria-hidden="true" className="size-4" />
        Prossimo esame
      </div>
      <div className="relative flex flex-1 flex-col justify-center">
        <div className="flex items-baseline gap-3">
          <span
            className="font-num text-[clamp(3rem,9vw,5.2rem)] font-extrabold leading-none [font-family:var(--font-display)]"
            style={{ color: "var(--signal-2)" }}
          >
            {days === 0 ? "Oggi" : days}
          </span>
          {days > 0 && (
            <span className="muted text-xl font-semibold">
              {days === 1 ? "giorno" : "giorni"}
            </span>
          )}
          {days <= 2 && (
            <span
              aria-hidden="true"
              className="pulse-soft size-2.5 self-center rounded-full"
              style={{ background: accent }}
            />
          )}
        </div>
        <h2 className="mt-3 text-xl font-semibold text-ink">{exam.courseName}</h2>
        <p className="muted mt-1 text-sm">
          {fmtDayOfMonth(exam.date)} {fmtMonthAbbr(exam.date)}
          {exam.time ? ` · ore ${exam.time}` : ""}
          {exam.room ? ` · ${exam.room}` : ""}
        </p>
        {exam.teacher && (
          <p className="muted mt-1 text-sm">{exam.teacher}</p>
        )}
      </div>
      <div className="relative flex flex-col gap-3">
        <div
          className="h-1.5 overflow-hidden rounded-full"
          style={{ background: "var(--hairline)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${barWidth}%`, background: accent }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="muted text-sm">
            {examsThisWeek > 0
              ? `${examsThisWeek} ${examsThisWeek === 1 ? "appello" : "appelli"} questa settimana`
              : "Nessun altro appello nei prossimi 7 giorni"}
          </p>
          <Link
            href={`/focus?course=${encodeURIComponent(exam.courseName)}`}
            className="btn btn-primary shrink-0"
          >
            <Timer aria-hidden="true" className="size-4" />
            Studia per questo esame
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Hero fallback when no exam is ahead. */
function NoExamHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "glass panel-hero flex flex-col items-center justify-center gap-3 rounded-lg p-6 text-center",
        className,
      )}
    >
      <CheckCircle2 aria-hidden="true" className="size-10 text-ok" />
      <p className="text-lg font-semibold text-ink">Nessun esame in programma</p>
      <p className="muted text-sm">
        Nessun appello in vista — un buon momento per portarti avanti.
      </p>
    </section>
  );
}

export function Dashboard() {
  const synced = useSynced();
  const settings = useSettings();
  const libretto = useLibretto();
  const now = useNowMinute();
  const router = useRouter();

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

  // the student's own exams: the merged feed narrowed to the pinned courses
  // ("I miei esami"), so the hero + timeline match /appelli and /calendario.
  const myExamCalls = useMemo(() => {
    if (!ready) return [];
    const pinned = settings.pinnedCourses;
    return synced.examCalls.filter(
      (e) => pinned.length === 0 || pinned.includes(e.courseName),
    );
  }, [ready, synced.examCalls, settings.pinnedCourses]);

  // exams within the next 7 days, for the hero sub-stat
  const examsThisWeek = useMemo(() => {
    if (!ready) return 0;
    return myExamCalls.filter((e) => {
      const d = daysFromToday(e.date, now);
      return d >= 0 && d <= 7;
    }).length;
  }, [ready, myExamCalls, now]);

  // soonest upcoming exam, for the header banner
  const nextExam = useMemo<{ exam: ExamCall; days: number } | null>(() => {
    if (!ready || now === null) return null;
    const exam = myExamCalls
      .filter((e) => daysFromToday(e.date, now) >= 0)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (a.time ?? "").localeCompare(b.time ?? ""),
      )[0];
    return exam ? { exam, days: daysFromToday(exam.date, now) } : null;
  }, [ready, myExamCalls, now]);

  return (
    <div className="flex flex-col gap-5">
      {/* Tour guidato al primo accesso (si auto-gestisce: gating + localStorage). */}
      <CruscottoTour />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Cruscotto</h1>
          {now && (
            <p className="mt-1 text-sm text-ink-mute">
              {now.getHours() < 12
                ? "Buongiorno"
                : now.getHours() < 18
                  ? "Buon pomeriggio"
                  : "Buonasera"}
              {" · "}
              <span className="first-letter:uppercase">{fmtLongDay(now)}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => router.push("/onboarding")}>
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
        <div className="stagger-children grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Banner a tutta larghezza (condizionali) + scorciatoie. Il promemoria
              appelli rispetta l'interruttore «Notifiche» nelle impostazioni. */}
          {(settings.examReminders ?? true) && (
            <BookingReminders className="lg:col-span-6" />
          )}
          <QuickActions className="lg:col-span-6" />
          <BackupNudge className="lg:col-span-6" />

          {/* HERO bento: prossimo esame + countdown (2/3, alto due righe) con
              media e CFU impilati accanto (1/3). */}
          {nextExam ? (
            <NextExamHero
              exam={nextExam.exam}
              days={nextExam.days}
              examsThisWeek={examsThisWeek}
              className="lg:col-span-4"
            />
          ) : (
            <NoExamHero className="lg:col-span-4" />
          )}
          {/* Riassunti compatti read-only: i dati pieni (andamento voti,
              stima laurea, simulatore) vivono SOLO nel Libretto; qui una riga
              che ci linka, così il Cruscotto resta glanceable e non duplica. */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-2">
            <CareerStrip entries={libretto.items} />
            <CfuMini
              entries={libretto.items}
              totalCfu={settings.degreePlan.totalCfu}
            />
          </div>

          {/* Riga media: oggi + appelli in arrivo. */}
          <TodayTimeline events={todayEvents} className="lg:col-span-3" />
          <ExamTimeline
            exams={myExamCalls}
            now={now}
            className="panel-hero accent-top lg:col-span-3"
          />

          {synced.notices.length > 0 && (
            <ChangeNotices
              notices={synced.notices}
              onDismiss={(ids) => void synced.dismissNotices(ids)}
              className="lg:col-span-6"
            />
          )}

          {/* Riga piccola: obiettivo settimana, scadenze, link utili. */}
          <WeeklyGoalCard className="lg:col-span-2" />
          <BookingDeadlines className="lg:col-span-2" />
          <LinksPanel className="h-full lg:col-span-2" />
        </div>
      )}
    </div>
  );
}
