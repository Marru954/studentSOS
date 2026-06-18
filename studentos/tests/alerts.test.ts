import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { type Alert, AlertType, isAlertActive } from "@/lib/domain/alerts";
import { detectAlerts } from "@/lib/domain/detectAlerts";
import { useAlerts } from "@/lib/state/alerts";
import { __resetDbForTests } from "@/lib/storage/db";
import type { ClassEvent, ExamCall, LibrettoEntry } from "@/lib/domain/types";
import type { SyncMeta } from "@/lib/storage/types";

const NOW = new Date("2026-06-12T10:00:00.000Z");

function lesson(overrides: Partial<ClassEvent>): ClassEvent {
  return {
    id: "ev-1",
    courseName: "BASI DI DATI",
    start: "2026-06-15T07:00:00.000Z",
    end: "2026-06-15T09:00:00.000Z",
    kind: "lecture",
    sourceId: "orario-anno-2",
    ...overrides,
  };
}

function exam(overrides: Partial<ExamCall>): ExamCall {
  return {
    id: "ex-1",
    courseName: "CALCOLO",
    date: "2026-06-25",
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

function syncMeta(overrides: Partial<SyncMeta>): SyncMeta {
  return {
    sourceId: "orario-anno-2",
    capability: "timetable",
    lastAttemptAt: "2026-06-12T10:00:00.000Z",
    ok: true,
    itemCount: 10,
    ...overrides,
  };
}

function base(overrides: Partial<Parameters<typeof detectAlerts>[0]> = {}) {
  return {
    classEvents: [],
    examCalls: [],
    previousExamIds: [],
    libroEntries: [],
    previousMedia: null,
    syncMeta: [],
    now: NOW,
    ...overrides,
  };
}

// ── isAlertActive ─────────────────────────────────────────────────────────

test("isAlertActive: dismissed → false, expired → false, otherwise true", () => {
  const live: Alert = {
    id: "a",
    type: AlertType.NUOVO_ESAME,
    title: "t",
    message: "m",
    expiresAt: new Date(NOW.getTime() + 1000),
    createdAt: NOW,
  };
  assert.equal(isAlertActive(live, NOW), true);
  assert.equal(isAlertActive({ ...live, dismissedAt: NOW }, NOW), false);
  assert.equal(
    isAlertActive({ ...live, expiresAt: new Date(NOW.getTime() - 1000) }, NOW),
    false,
  );
});

// ── SCADENZA_APPELLO ──────────────────────────────────────────────────────

test("SCADENZA_APPELLO: fires only inside the 48h window before close", () => {
  const within = exam({ id: "a", booking: { closesAt: "2026-06-13" } }); // ~38h
  const far = exam({ id: "b", booking: { closesAt: "2026-06-30" } });
  const past = exam({ id: "c", booking: { closesAt: "2026-06-10" } });
  const noBooking = exam({ id: "d" });
  const got = detectAlerts(
    base({ examCalls: [within, far, past, noBooking] }),
  ).filter((a) => a.type === AlertType.SCADENZA_APPELLO);
  assert.equal(got.length, 1);
  assert.equal(got[0].sourceId, "a");
  assert.match(got[0].message, /scade tra \d+ ore/);
  assert.equal(got[0].title, "Scadenza prenotazione");
});

// ── CONFLITTO_ORARIO ──────────────────────────────────────────────────────

test("CONFLITTO_ORARIO: one alert per overlapping same-day pair, deduped", () => {
  const a = lesson({ id: "x", courseName: "A", start: "2026-06-15T07:00:00.000Z", end: "2026-06-15T09:00:00.000Z" });
  const b = lesson({ id: "y", courseName: "B", start: "2026-06-15T08:00:00.000Z", end: "2026-06-15T10:00:00.000Z" });
  const got = detectAlerts(base({ classEvents: [a, b] })).filter(
    (al) => al.type === AlertType.CONFLITTO_ORARIO,
  );
  assert.equal(got.length, 1);
  assert.match(got[0].message, /A e B si sovrappongono/);
});

test("CONFLITTO_ORARIO: same course or no overlap → nothing", () => {
  const a = lesson({ id: "x", courseName: "A", start: "2026-06-15T07:00:00.000Z", end: "2026-06-15T09:00:00.000Z" });
  const sameCourse = lesson({ id: "y", courseName: "A", start: "2026-06-15T08:00:00.000Z", end: "2026-06-15T10:00:00.000Z" });
  const noOverlap = lesson({ id: "z", courseName: "B", start: "2026-06-15T10:00:00.000Z", end: "2026-06-15T12:00:00.000Z" });
  const got = detectAlerts(base({ classEvents: [a, sameCourse, noOverlap] })).filter(
    (al) => al.type === AlertType.CONFLITTO_ORARIO,
  );
  assert.equal(got.length, 0);
});

// ── NUOVO_ESAME ───────────────────────────────────────────────────────────

test("NUOVO_ESAME: only exams absent from previousExamIds", () => {
  const got = detectAlerts(
    base({
      examCalls: [exam({ id: "old" }), exam({ id: "new", courseName: "FISICA" })],
      previousExamIds: ["old"],
    }),
  ).filter((a) => a.type === AlertType.NUOVO_ESAME);
  assert.equal(got.length, 1);
  assert.equal(got[0].sourceId, "new");
  assert.match(got[0].message, /FISICA — 25\/06\/2026/);
});

test("NUOVO_ESAME: first sync (no previous ids) stays silent", () => {
  const got = detectAlerts(
    base({ examCalls: [exam({ id: "a" })], previousExamIds: [] }),
  ).filter((a) => a.type === AlertType.NUOVO_ESAME);
  assert.equal(got.length, 0);
});

// ── MEDIA_CAMBIATA ────────────────────────────────────────────────────────

test("MEDIA_CAMBIATA: fires when the weighted average moves", () => {
  const got = detectAlerts(
    base({
      libroEntries: [entry({ grade: { kind: "numeric", value: 30, laude: false } })],
      previousMedia: 27,
    }),
  ).filter((a) => a.type === AlertType.MEDIA_CAMBIATA);
  assert.equal(got.length, 1);
  assert.match(got[0].message, /da 27,00 a 30,00/);
});

test("MEDIA_CAMBIATA: silent when null baseline or unchanged", () => {
  const noBaseline = detectAlerts(
    base({ libroEntries: [entry({})], previousMedia: null }),
  ).filter((a) => a.type === AlertType.MEDIA_CAMBIATA);
  assert.equal(noBaseline.length, 0);
  const unchanged = detectAlerts(
    base({ libroEntries: [entry({})], previousMedia: 27 }),
  ).filter((a) => a.type === AlertType.MEDIA_CAMBIATA);
  assert.equal(unchanged.length, 0);
});

// ── SYNC_FALLITO ──────────────────────────────────────────────────────────

test("SYNC_FALLITO: all failed sources collapse into one alert", () => {
  const got = detectAlerts(
    base({
      syncMeta: [
        syncMeta({ sourceId: "orario-anno-1", ok: false }),
        syncMeta({ sourceId: "esami-anno-1", ok: false }),
        syncMeta({ sourceId: "news", ok: true }),
      ],
    }),
  ).filter((a) => a.type === AlertType.SYNC_FALLITO);
  assert.equal(got.length, 1);
  assert.match(got[0].message, /esami-anno-1/);
  assert.match(got[0].message, /orario-anno-1/);
});

test("ids are stable across runs (no duplicates accumulate)", () => {
  const params = base({
    examCalls: [exam({ id: "new", courseName: "FISICA" })],
    previousExamIds: ["seed"],
  });
  const first = detectAlerts(params);
  const second = detectAlerts(params);
  assert.deepEqual(
    first.map((a) => a.id),
    second.map((a) => a.id),
  );
});

// ── store ─────────────────────────────────────────────────────────────────

function mkAlert(overrides: Partial<Alert>): Alert {
  return {
    id: "s1",
    type: AlertType.NUOVO_ESAME,
    title: "t",
    message: "m",
    expiresAt: new Date(NOW.getTime() + 60_000),
    createdAt: NOW,
    ...overrides,
  };
}

beforeEach(async () => {
  await __resetDbForTests();
  useAlerts.setState({ alerts: [], lastCheckedAt: null, hydrated: false });
});

test("store: setAlerts then activeAlerts returns the active set", () => {
  useAlerts.getState().setAlerts([mkAlert({ id: "a" }), mkAlert({ id: "b" })]);
  assert.equal(useAlerts.getState().activeAlerts(NOW).length, 2);
  assert.notEqual(useAlerts.getState().lastCheckedAt, null);
});

test("store: setAlerts preserves a manual dismissal across re-detection", () => {
  useAlerts.getState().setAlerts([mkAlert({ id: "a" })]);
  useAlerts.getState().dismiss("a");
  // detection re-emits the same id with no dismissedAt — must stay dismissed
  useAlerts.getState().setAlerts([mkAlert({ id: "a" })]);
  assert.equal(useAlerts.getState().activeAlerts(NOW).length, 0);
});

test("store: clearExpired drops expired and dismissed alerts", () => {
  useAlerts.getState().setAlerts([
    mkAlert({ id: "live" }),
    mkAlert({ id: "old", expiresAt: new Date(NOW.getTime() - 1) }),
  ]);
  useAlerts.getState().clearExpired(NOW);
  const remaining = useAlerts.getState().alerts.map((a) => a.id);
  assert.deepEqual(remaining, ["live"]);
});

test("store: activeByType filters by type", () => {
  useAlerts.getState().setAlerts([
    mkAlert({ id: "a", type: AlertType.NUOVO_ESAME }),
    mkAlert({ id: "b", type: AlertType.SYNC_FALLITO }),
  ]);
  assert.equal(useAlerts.getState().activeByType(AlertType.NUOVO_ESAME, NOW).length, 1);
  assert.equal(useAlerts.getState().activeByType(AlertType.SYNC_FALLITO, NOW).length, 1);
  assert.equal(useAlerts.getState().activeByType(AlertType.CONFLITTO_ORARIO, NOW).length, 0);
});
