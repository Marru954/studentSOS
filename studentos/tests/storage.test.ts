import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { ClassEvent, ExamCall } from "@/lib/domain/types";
import { __resetDbForTests } from "@/lib/storage/db";
import {
  getChangeNotices,
  getClassEvents,
  getExamCalls,
  getSettings,
  getSyncMeta,
  markNoticesSeen,
  recordSyncFailure,
  replaceSourceData,
  saveSettings,
} from "@/lib/storage/repo";

const NOW = "2026-06-12T10:00:00.000Z";
const LATER = "2026-06-13T10:00:00.000Z";

function lesson(overrides: Partial<ClassEvent>): ClassEvent {
  return {
    id: "ev-1",
    courseName: "BASI DI DATI",
    start: "2026-06-15T07:00:00.000Z",
    end: "2026-06-15T09:00:00.000Z",
    room: "Aula 18",
    kind: "lecture",
    sourceId: "orario-anno-2",
    ...overrides,
  };
}

function exam(overrides: Partial<ExamCall>): ExamCall {
  return {
    id: "ex-1",
    courseName: "CALCOLO DELLE PROBABILITA'",
    date: "2026-06-19",
    time: "10:00",
    kind: "written",
    sourceId: "esami-anno-2",
    ...overrides,
  };
}

beforeEach(async () => {
  await __resetDbForTests();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase("studentos");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
});

test("first sync stores events and produces no notices", async () => {
  const notices = await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  assert.equal(notices.length, 0);
  assert.equal((await getClassEvents()).length, 1);
  const meta = await getSyncMeta();
  assert.deepEqual(
    { ok: meta[0].ok, itemCount: meta[0].itemCount, lastSuccessAt: meta[0].lastSuccessAt },
    { ok: true, itemCount: 1, lastSuccessAt: NOW },
  );
});

test("room change is detected and old cache replaced", async () => {
  await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  const notices = await replaceSourceData(
    "timetable",
    "orario-anno-2",
    [lesson({ room: "Aula T5" })],
    LATER,
  );
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "room-change");
  assert.equal(notices[0].detail, "Aula 18 → Aula T5");
  const events = await getClassEvents();
  assert.equal(events.length, 1);
  assert.equal(events[0].room, "Aula T5");
});

test("moved lesson (new id, same course+day) is a time change", async () => {
  await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  const moved = lesson({
    id: "ev-1-moved",
    start: "2026-06-15T12:00:00.000Z",
    end: "2026-06-15T14:00:00.000Z",
  });
  const notices = await replaceSourceData("timetable", "orario-anno-2", [moved], LATER);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "time-change");
  assert.equal(notices[0].detail, "07:00 → 12:00");
});

test("cancellation flag produces a notice once", async () => {
  await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  const cancelled = lesson({ change: { field: "cancelled" } });
  const first = await replaceSourceData("timetable", "orario-anno-2", [cancelled], LATER);
  assert.equal(first.length, 1);
  assert.equal(first[0].kind, "cancelled");
  // same state re-synced: no duplicate notice
  const second = await replaceSourceData("timetable", "orario-anno-2", [cancelled], LATER);
  assert.equal(second.length, 0);
});

test("new exam call is detected, but not on first sync", async () => {
  const first = await replaceSourceData("exams", "esami-anno-2", [exam({})], NOW);
  assert.equal(first.length, 0);
  const second = await replaceSourceData(
    "exams",
    "esami-anno-2",
    [exam({}), exam({ id: "ex-2", date: "2026-07-10" })],
    LATER,
  );
  assert.equal(second.length, 1);
  assert.equal(second[0].kind, "new-exam");
  assert.match(second[0].detail, /10\/07\/2026/);
  assert.equal((await getExamCalls()).length, 2);
});

test("replace is scoped to the source", async () => {
  await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  await replaceSourceData(
    "timetable",
    "orario-anno-1",
    [lesson({ id: "ev-a1", courseName: "ANALISI I", sourceId: "orario-anno-1" })],
    NOW,
  );
  // re-sync source 2 with empty data: source 1 untouched
  await replaceSourceData("timetable", "orario-anno-2", [], LATER);
  const events = await getClassEvents();
  assert.equal(events.length, 1);
  assert.equal(events[0].sourceId, "orario-anno-1");
});

test("failure records meta but keeps last success and cache", async () => {
  await replaceSourceData("timetable", "orario-anno-2", [lesson({})], NOW);
  await recordSyncFailure("timetable", "orario-anno-2", "timeout", LATER);
  const meta = (await getSyncMeta())[0];
  assert.equal(meta.ok, false);
  assert.equal(meta.error, "timeout");
  assert.equal(meta.lastSuccessAt, NOW);
  assert.equal((await getClassEvents()).length, 1, "cache must survive failures");
});

test("notices can be marked seen; newest first", async () => {
  await replaceSourceData("exams", "esami-anno-2", [exam({})], NOW);
  await replaceSourceData("exams", "esami-anno-2", [exam({}), exam({ id: "ex-2" })], LATER);
  let notices = await getChangeNotices();
  assert.equal(notices.length, 1);
  await markNoticesSeen([notices[0].id]);
  notices = await getChangeNotices();
  assert.equal(notices[0].seen, true);
});

test("settings roundtrip merges over defaults", async () => {
  const defaults = await getSettings();
  assert.equal(defaults.degreePlan.totalCfu, 180);
  await saveSettings({ ...defaults, presetId: "uniroma2-informatica-triennale" });
  const loaded = await getSettings();
  assert.equal(loaded.presetId, "uniroma2-informatica-triennale");
  assert.equal(loaded.syncHorizonDays, 120);
});
