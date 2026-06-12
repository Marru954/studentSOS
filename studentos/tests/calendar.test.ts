import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildMonthGrid,
  examsByDate,
  filterExams,
} from "@/lib/domain/calendar";
import type { ExamCall } from "@/lib/domain/types";

function exam(id: string, date: string): ExamCall {
  return { id, courseName: id, date, kind: "written", sourceId: "s" };
}

// ── buildMonthGrid ────────────────────────────────────────────────────────────

test("June 2026 grid is Monday-first and starts on the right spillover day", () => {
  // 1 June 2026 is a Monday, so the first cell is exactly the 1st, in-month.
  const weeks = buildMonthGrid(2026, 5); // month0 5 = June
  assert.equal(weeks[0][0].date, "2026-06-01");
  assert.equal(weeks[0][0].inMonth, true);
  assert.ok(weeks.every((w) => w.length === 7));
});

test("February 2026 borrows leading days from January", () => {
  // 1 Feb 2026 is a Sunday → Monday-first grid starts on 26 Jan.
  const weeks = buildMonthGrid(2026, 1);
  assert.equal(weeks[0][0].date, "2026-01-26");
  assert.equal(weeks[0][0].inMonth, false);
  const firstFeb = weeks[0].find((d) => d.date === "2026-02-01");
  assert.equal(firstFeb?.inMonth, true);
});

test("grid spans only the weeks needed (no empty trailing row)", () => {
  // June 2026: 30 days, starts Monday → exactly 5 weeks.
  assert.equal(buildMonthGrid(2026, 5).length, 5);
});

// ── examsByDate ───────────────────────────────────────────────────────────────

test("exams group by date, multiple per day preserved", () => {
  const map = examsByDate([
    exam("a", "2026-06-15"),
    exam("b", "2026-06-15"),
    exam("c", "2026-06-19"),
  ]);
  assert.equal(map.get("2026-06-15")?.length, 2);
  assert.equal(map.get("2026-06-19")?.length, 1);
  assert.equal(map.get("2026-06-20"), undefined);
});

// ── filterExams ───────────────────────────────────────────────────────────────

test("filters partition exams around today and the urgent window", () => {
  const today = "2026-06-12";
  const exams = [
    exam("past", "2026-06-01"),
    exam("today", "2026-06-12"),
    exam("soon", "2026-06-17"),
    exam("far", "2026-07-30"),
  ];
  assert.deepEqual(filterExams(exams, "tutti", today).map((e) => e.id), [
    "past",
    "today",
    "soon",
    "far",
  ]);
  assert.deepEqual(filterExams(exams, "futuri", today).map((e) => e.id), [
    "today",
    "soon",
    "far",
  ]);
  assert.deepEqual(filterExams(exams, "passati", today).map((e) => e.id), [
    "past",
  ]);
  assert.deepEqual(filterExams(exams, "urgenti", today).map((e) => e.id), [
    "today",
    "soon",
  ]);
});
