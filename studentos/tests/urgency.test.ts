import assert from "node:assert/strict";
import { test } from "node:test";
import {
  averageSeries,
  earnedCfu,
  graduationBase,
  weightedAverage,
} from "@/lib/domain/libretto";
import type { ClassEvent, ExamCall, LibrettoEntry } from "@/lib/domain/types";
import { computeUrgencies } from "@/lib/domain/urgency";

// Friday 2026-06-12, 10:00 UTC — all assertions use timeZone: "UTC".
const NOW = new Date("2026-06-12T10:00:00.000Z");
const TZ = { timeZone: "UTC" };

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

function entry(overrides: Partial<LibrettoEntry>): LibrettoEntry {
  return {
    id: "lib-1",
    courseName: "ANALISI I",
    cfu: 9,
    grade: { kind: "numeric", value: 27, laude: false },
    date: "2025-06-20",
    ...overrides,
  };
}

// ── urgency: exam-imminent ──────────────────────────────────────────────────

test("imminent exam escalates: today critical, 3 days warning, 6 days info", () => {
  const calls = [
    exam({ id: "a", date: "2026-06-12" }),
    exam({ id: "b", date: "2026-06-15", courseName: "FISICA" }),
    exam({ id: "c", date: "2026-06-18", courseName: "LOGICA" }),
  ];
  const got = computeUrgencies([], calls, NOW, TZ).filter(
    (u) => u.kind === "exam-imminent",
  );
  assert.deepEqual(
    got.map((u) => u.severity),
    ["critical", "warning", "info"],
  );
  assert.match(got[0].message, /oggi/);
  assert.match(got[0].message, /ore 10:00/);
  assert.match(got[1].message, /tra 3 giorni/);
});

test("exams outside the 7-day window or in the past produce nothing", () => {
  const calls = [
    exam({ id: "far", date: "2026-06-25" }),
    exam({ id: "past", date: "2026-06-10" }),
  ];
  assert.equal(computeUrgencies([], calls, NOW, TZ).length, 0);
});

// ── urgency: booking-deadline ───────────────────────────────────────────────

test("booking deadline: critical within 2 days, warning within 7, silent after", () => {
  const calls = [
    exam({ id: "a", date: "2026-07-01", booking: { closesAt: "2026-06-13" } }),
    exam({
      id: "b",
      date: "2026-07-01",
      courseName: "FISICA",
      booking: { closesAt: "2026-06-18" },
    }),
    exam({
      id: "c",
      date: "2026-07-01",
      courseName: "LOGICA",
      booking: { closesAt: "2026-06-11" },
    }),
  ];
  const got = computeUrgencies([], calls, NOW, TZ).filter(
    (u) => u.kind === "booking-deadline",
  );
  assert.equal(got.length, 2);
  assert.equal(got[0].severity, "critical");
  assert.match(got[0].message, /chiude domani/);
  assert.equal(got[1].severity, "warning");
});

// ── urgency: exam-overlap ───────────────────────────────────────────────────

test("two exams same day is a warning; same declared time is critical", () => {
  const sameDay = [
    exam({ id: "a", date: "2026-06-30", time: "09:00" }),
    exam({ id: "b", date: "2026-06-30", time: "14:00", courseName: "FISICA" }),
  ];
  const warn = computeUrgencies([], sameDay, NOW, TZ);
  assert.equal(warn.length, 1);
  assert.equal(warn[0].kind, "exam-overlap");
  assert.equal(warn[0].severity, "warning");

  const sameTime = [
    exam({ id: "a", date: "2026-06-30", time: "09:00" }),
    exam({ id: "b", date: "2026-06-30", time: "09:00", courseName: "FISICA" }),
  ];
  const crit = computeUrgencies([], sameTime, NOW, TZ);
  assert.equal(crit[0].severity, "critical");
  assert.match(crit[0].message, /stessa ora \(09:00\)/);
});

// ── urgency: class-overlap ──────────────────────────────────────────────────

test("overlapping future lessons of different courses are flagged once", () => {
  const events = [
    lesson({}),
    lesson({
      id: "ev-2",
      courseName: "SISTEMI OPERATIVI",
      start: "2026-06-15T08:00:00.000Z",
      end: "2026-06-15T10:00:00.000Z",
    }),
    // back-to-back, not overlapping
    lesson({
      id: "ev-3",
      courseName: "RETI",
      start: "2026-06-15T10:00:00.000Z",
      end: "2026-06-15T12:00:00.000Z",
    }),
  ];
  const got = computeUrgencies(events, [], NOW, TZ);
  assert.equal(got.length, 1);
  assert.equal(got[0].kind, "class-overlap");
  assert.match(got[0].message, /15\/06/);
  assert.match(got[0].message, /alle 08:00/);
  assert.deepEqual(got[0].relatedIds.sort(), ["ev-1", "ev-2"]);
});

test("cancelled and past lessons never overlap", () => {
  const events = [
    lesson({ change: { field: "cancelled" } }),
    lesson({
      id: "ev-2",
      courseName: "SISTEMI OPERATIVI",
      start: "2026-06-15T08:00:00.000Z",
      end: "2026-06-15T10:00:00.000Z",
    }),
    lesson({ id: "old-a", start: "2026-06-10T07:00:00.000Z", end: "2026-06-10T09:00:00.000Z" }),
    lesson({
      id: "old-b",
      courseName: "RETI",
      start: "2026-06-10T08:00:00.000Z",
      end: "2026-06-10T09:00:00.000Z",
    }),
  ];
  assert.equal(computeUrgencies(events, [], NOW, TZ).length, 0);
});

// ── urgency: room-change ────────────────────────────────────────────────────

test("room change on a future lesson is a warning naming the new room", () => {
  const events = [
    lesson({ change: { field: "room", previous: "Aula 18" }, room: "Aula T5" }),
  ];
  const got = computeUrgencies(events, [], NOW, TZ);
  assert.equal(got.length, 1);
  assert.equal(got[0].kind, "room-change");
  assert.match(got[0].message, /si tiene in Aula T5/);
});

test("room change on a past lesson is dropped", () => {
  const events = [
    lesson({
      change: { field: "room" },
      start: "2026-06-10T07:00:00.000Z",
      end: "2026-06-10T09:00:00.000Z",
    }),
  ];
  assert.equal(computeUrgencies(events, [], NOW, TZ).length, 0);
});

// ── urgency: ordering ───────────────────────────────────────────────────────

test("urgencies sort by severity, then by soonest expiry", () => {
  const calls = [
    exam({ id: "info", date: "2026-06-18" }),
    exam({ id: "crit", date: "2026-06-13", courseName: "FISICA" }),
    exam({ id: "warn", date: "2026-06-15", courseName: "LOGICA" }),
  ];
  const got = computeUrgencies([], calls, NOW, TZ);
  assert.deepEqual(
    got.map((u) => u.severity),
    ["critical", "warning", "info"],
  );
});

// ── libretto math ───────────────────────────────────────────────────────────

test("weighted average weights by CFU and counts lode as 30", () => {
  const entries = [
    entry({ id: "a", cfu: 12, grade: { kind: "numeric", value: 30, laude: true } }),
    entry({ id: "b", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
  ];
  assert.equal(weightedAverage(entries), 28);
});

test("pass grades and excluded entries earn CFU but skip the average", () => {
  const entries = [
    entry({ id: "a", cfu: 9, grade: { kind: "numeric", value: 27, laude: false } }),
    entry({ id: "b", cfu: 3, grade: { kind: "pass" } }),
    entry({
      id: "c",
      cfu: 6,
      grade: { kind: "numeric", value: 18, laude: false },
      excludeFromAverage: true,
    }),
  ];
  assert.equal(weightedAverage(entries), 27);
  assert.equal(earnedCfu(entries), 18);
});

test("empty libretto has no average; base di laurea rescales to /110", () => {
  assert.equal(weightedAverage([]), undefined);
  assert.equal(graduationBase(27), 99);
  assert.equal(graduationBase(30), 110);
});

test("average series is chronological and cumulative", () => {
  const entries = [
    entry({ id: "b", date: "2025-09-10", cfu: 6, grade: { kind: "numeric", value: 24, laude: false } }),
    entry({ id: "a", date: "2025-06-20", cfu: 6, grade: { kind: "numeric", value: 30, laude: false } }),
    entry({ id: "c", date: "2026-01-15", cfu: 12, grade: { kind: "pass" } }),
  ];
  assert.deepEqual(averageSeries(entries), [30, 27]);
});
