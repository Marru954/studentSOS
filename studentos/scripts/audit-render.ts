/** Renders every dashboard panel with seeded data to static HTML, for
 *  markup-level accessibility audits in environments without a browser.
 *  Run: ./node_modules/.bin/tsx scripts/audit-render.ts */
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CfuPanel, GoalPanel, MediaPanel } from "@/components/dashboard/CareerPanels";
import { ChangeNotices } from "@/components/dashboard/ChangeNotices";
import { ExamTimeline } from "@/components/dashboard/ExamTimeline";
import { NewsList } from "@/components/dashboard/NewsList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SummaryBar } from "@/components/dashboard/SummaryBar";
import { SyncStatus } from "@/components/dashboard/SyncStatus";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { ExamCards } from "@/components/exams/ExamCards";
import { MonthCalendar } from "@/components/exams/MonthCalendar";
import { DelphiConnect } from "@/components/libretto/DelphiConnect";
import { EntryForm } from "@/components/libretto/EntryForm";
import { EntryTable } from "@/components/libretto/EntryTable";
import { ProjectionPanel } from "@/components/libretto/ProjectionPanel";
import { FocusStats } from "@/components/focus/FocusStats";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { TaskBoard } from "@/components/focus/TaskBoard";
import { NoteList } from "@/components/notes/NoteList";
import { NotePreview } from "@/components/notes/NotePreview";
import { SourceStatusTable } from "@/components/SourceStatus";
import { WeekGrid } from "@/components/timetable/WeekGrid";
import type { ClassEvent, ExamCall, LibrettoEntry } from "@/lib/domain/types";

const NOW = new Date("2026-06-12T10:00:00.000Z");

const events: ClassEvent[] = [
  {
    id: "ev-1",
    courseName: "BASI DI DATI",
    start: "2026-06-12T11:30:00.000Z",
    end: "2026-06-12T13:30:00.000Z",
    room: "Aula 18",
    building: "Macroarea di Scienze",
    teacher: "Rossi",
    kind: "lecture",
    sourceId: "orario-anno-2",
  },
  {
    id: "ev-2",
    courseName: "SISTEMI OPERATIVI",
    start: "2026-06-12T12:30:00.000Z",
    end: "2026-06-12T14:30:00.000Z",
    room: "Aula T5",
    kind: "lab",
    change: { field: "room", previous: "Aula 12" },
    sourceId: "orario-anno-2",
  },
  {
    id: "ev-3",
    courseName: "RETI DI CALCOLATORI",
    start: "2026-06-12T15:00:00.000Z",
    end: "2026-06-12T17:00:00.000Z",
    kind: "lecture",
    change: { field: "cancelled" },
    sourceId: "orario-anno-2",
  },
];

const exams: ExamCall[] = [
  {
    id: "ex-1",
    courseName: "CALCOLO DELLE PROBABILITA'",
    date: "2026-06-15",
    time: "10:00",
    room: "Aula 1",
    kind: "written",
    booking: { closesAt: "2026-06-13" },
    sourceId: "esami-anno-2",
  },
  {
    id: "ex-2",
    courseName: "FISICA",
    date: "2026-06-15",
    time: "10:00",
    kind: "oral",
    sourceId: "esami-anno-2",
  },
];

const libretto: LibrettoEntry[] = [
  { id: "l1", courseName: "ANALISI I", cfu: 9, grade: { kind: "numeric", value: 28, laude: false }, date: "2025-02-10" },
  { id: "l2", courseName: "PROGRAMMAZIONE", cfu: 12, grade: { kind: "numeric", value: 30, laude: true }, date: "2025-06-20" },
  { id: "l3", courseName: "INGLESE", cfu: 3, grade: { kind: "pass" }, date: "2025-09-05" },
];

const sections: [string, React.ReactElement][] = [
  [
    "SummaryBar",
    h(SummaryBar, { nextExamDays: 2, examsThisWeek: 3, average: 20.87 }),
  ],
  ["QuickActions", h(QuickActions, {})],
  ["ExamTimeline", h(ExamTimeline, { exams, now: NOW })],
  ["TodayTimeline", h(TodayTimeline, { events })],
  ["TodayTimeline (vuoto)", h(TodayTimeline, { events: [] })],
  ["MediaPanel", h(MediaPanel, { entries: libretto, targetAverage: 28 })],
  ["CfuPanel", h(CfuPanel, { entries: libretto, totalCfu: 180, now: NOW })],
  [
    "GoalPanel",
    h(GoalPanel, {
      entries: libretto,
      totalCfu: 180,
      targetAverage: 28,
      onTargetChange: () => {},
    }),
  ],
  ["NewsList", h(NewsList, { items: [{ id: "n1", title: "Calendario sessione estiva", url: "https://informatica.uniroma2.it/x", publishedAt: "2026-06-10T08:00:00.000Z", excerpt: "Pubblicato il calendario.", sourceId: "avvisi-dipartimento" }] })],
  ["ChangeNotices", h(ChangeNotices, { notices: [{ id: "c1", kind: "room-change", courseName: "SISTEMI OPERATIVI", detail: "Aula 12 → Aula T5", entityId: "ev-2", detectedAt: "2026-06-12T09:00:00.000Z", seen: false }], onDismiss: () => {} })],
  ["SyncStatus", h(SyncStatus, { syncing: false, syncMeta: [{ sourceId: "s", capability: "timetable", lastAttemptAt: "2026-06-12T09:00:00.000Z", lastSuccessAt: "2026-06-12T09:00:00.000Z", ok: true, itemCount: 10 }], canSync: true, onSync: () => {} })],
  [
    "WeekGrid",
    h(WeekGrid, {
      events,
      weekStart: new Date("2026-06-08T00:00:00"),
      now: NOW,
    }),
  ],
  [
    "MonthCalendar",
    h(MonthCalendar, {
      year: 2026,
      month0: 5,
      exams,
      today: "2026-06-12",
      onPrev: () => {},
      onNext: () => {},
    }),
  ],
  [
    "ExamCards",
    h(ExamCards, {
      exams: [
        ...exams,
        { id: "ex-3", courseName: "LOGICA", date: "2026-07-10", kind: "unknown", booking: { closesAt: "2026-06-13" }, sourceId: "esami-anno-2" },
      ],
      today: "2026-06-12",
    }),
  ],
  ["DelphiConnect", h(DelphiConnect, {})],
  ["EntryForm", h(EntryForm, { onSave: () => {} })],
  [
    "EntryTable",
    h(EntryTable, { entries: libretto, onEdit: () => {}, onRemove: () => {} }),
  ],
  [
    "ProjectionPanel",
    h(ProjectionPanel, {
      entries: libretto,
      totalCfu: 180,
      targetAverage: 28,
      onPlanChange: () => {},
    }),
  ],
  [
    "NotePreview",
    h(NotePreview, {
      content:
        "# Normalizzazione\n\nForma normale di **Boyce-Codd**: per ogni dipendenza $X \\to Y$, $X$ è superchiave.\n\n$$R(A,B,C),\\ F=\\{A \\to B\\}$$\n\n```sql\nSELECT nome FROM studenti WHERE media >= 28; -- top\n```\n\n- [ ] esercizi cap. 9\n",
    }),
  ],
  [
    "NoteList",
    h(NoteList, {
      notes: [
        { id: "n1", title: "Normalizzazione", content: "", tags: ["teoria", "sql"], courseName: "BASI DI DATI", createdAt: "2026-06-10T08:00:00.000Z", updatedAt: "2026-06-11T08:00:00.000Z" },
        { id: "n2", title: "", content: "appunti sparsi", tags: [], createdAt: "2026-06-09T08:00:00.000Z", updatedAt: "2026-06-09T08:00:00.000Z" },
      ],
      selectedId: "n1",
      onSelect: () => {},
    }),
  ],
  [
    "PomodoroTimer",
    h(PomodoroTimer, {
      courses: ["BASI DI DATI"],
      examCalls: exams,
      now: NOW,
      onRecord: () => {},
    }),
  ],
  [
    "FocusStats",
    h(FocusStats, {
      sessions: [
        { id: "f1", courseName: "BASI DI DATI", startedAt: "2026-06-12T08:00:00.000Z", minutes: 50 },
        { id: "f2", startedAt: "2026-06-10T08:00:00.000Z", minutes: 25 },
      ],
      libretto,
      now: NOW,
    }),
  ],
  [
    "TaskBoard",
    h(TaskBoard, {
      tasks: [
        { id: "t1", title: "Esercizi capitolo 9", status: "doing", courseName: "BASI DI DATI", due: "2026-06-13", createdAt: "2026-06-10T08:00:00.000Z" },
        { id: "t2", title: "Ripasso teoria", status: "todo", due: "2026-06-11", createdAt: "2026-06-10T09:00:00.000Z" },
        { id: "t3", title: "Iscrizione appello", status: "done", createdAt: "2026-06-09T08:00:00.000Z" },
      ],
      courses: ["BASI DI DATI"],
      today: "2026-06-12",
      onUpsert: () => {},
      onRemove: () => {},
    }),
  ],
  [
    "SourceStatusTable",
    h(SourceStatusTable, {
      rows: [
        {
          source: { id: "orario-anno-2", label: "Orario lezioni — 2° anno", capability: "timetable", providerId: "easyacademy", params: {} },
          meta: { sourceId: "orario-anno-2", capability: "timetable", lastAttemptAt: "2026-06-12T09:00:00.000Z", lastSuccessAt: "2026-06-12T09:00:00.000Z", ok: true, itemCount: 10 },
        },
        {
          source: { id: "esami-anno-2", label: "Appelli d'esame — 2° anno", capability: "exams", providerId: "easyacademy", params: {} },
          meta: { sourceId: "esami-anno-2", capability: "exams", lastAttemptAt: "2026-06-12T09:00:00.000Z", ok: false, error: "timeout", itemCount: 0 },
        },
      ],
    }),
  ],
];

for (const [name, el] of sections) {
  console.log(`\n===== ${name} =====`);
  console.log(renderToStaticMarkup(el));
}
