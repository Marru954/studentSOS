import assert from "node:assert/strict";
import { test } from "node:test";
import { focusByCourse, minutesInRange, NO_COURSE } from "@/lib/domain/focus";
import type { FocusSession, LibrettoEntry } from "@/lib/domain/types";
import { fmtMinutes } from "@/lib/format";

function session(startedAt: string, minutes: number, courseName?: string): FocusSession {
  return { id: `${startedAt}-${minutes}`, startedAt, minutes, courseName };
}

test("minutes are summed only inside the half-open range", () => {
  const sessions = [
    session("2026-06-12T08:00:00.000Z", 25),
    session("2026-06-12T21:00:00.000Z", 25),
    session("2026-06-11T23:59:00.000Z", 50), // before
    session("2026-06-13T00:00:00.000Z", 50), // at end → excluded
  ];
  assert.equal(
    minutesInRange(sessions, "2026-06-12T00:00:00.000Z", "2026-06-13T00:00:00.000Z"),
    50,
  );
});

test("focus aggregates per course, most-studied first, no-course bucketed", () => {
  const got = focusByCourse(
    [
      session("2026-06-10T08:00:00.000Z", 25, "BASI DI DATI"),
      session("2026-06-11T08:00:00.000Z", 50, "BASI DI DATI"),
      session("2026-06-11T09:00:00.000Z", 25, "ANALISI I"),
      session("2026-06-11T10:00:00.000Z", 10),
    ],
    [],
  );
  assert.deepEqual(
    got.map((r) => [r.courseName, r.minutes]),
    [
      ["BASI DI DATI", 75],
      ["ANALISI I", 25],
      [NO_COURSE, 10],
    ],
  );
});

test("libretto grades join case- and accent-insensitively", () => {
  const libretto: LibrettoEntry[] = [
    {
      id: "l1",
      courseName: "Basi di dati",
      cfu: 9,
      grade: { kind: "numeric", value: 28, laude: false },
      date: "2026-02-10",
    },
  ];
  const got = focusByCourse(
    [session("2026-06-10T08:00:00.000Z", 25, "BASI DI DATI")],
    libretto,
  );
  assert.deepEqual(got[0].grade, { kind: "numeric", value: 28, laude: false });
});

test("minutes format as hours and minutes", () => {
  assert.equal(fmtMinutes(45), "45m");
  assert.equal(fmtMinutes(85), "1h 25m");
  assert.equal(fmtMinutes(120), "2h 00m");
});
