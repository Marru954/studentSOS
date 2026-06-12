import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingState } from "@/lib/domain/booking";
import type { ClassEvent } from "@/lib/domain/types";
import { layoutDayLanes } from "@/lib/domain/week";

function ev(id: string, start: string, end: string): ClassEvent {
  return {
    id,
    courseName: id.toUpperCase(),
    start: `2026-06-15T${start}:00.000Z`,
    end: `2026-06-15T${end}:00.000Z`,
    kind: "lecture",
    sourceId: "s",
  };
}

// ── lane layout ─────────────────────────────────────────────────────────────

test("non-overlapping lessons all get the full column", () => {
  const got = layoutDayLanes([ev("a", "09:00", "11:00"), ev("b", "11:00", "13:00")]);
  assert.deepEqual(
    got.map((g) => [g.event.id, g.lane, g.laneCount]),
    [
      ["a", 0, 1],
      ["b", 0, 1],
    ],
  );
});

test("two overlapping lessons split the column in half", () => {
  const got = layoutDayLanes([ev("a", "09:00", "11:00"), ev("b", "10:00", "12:00")]);
  assert.deepEqual(
    got.map((g) => [g.event.id, g.lane, g.laneCount]),
    [
      ["a", 0, 2],
      ["b", 1, 2],
    ],
  );
});

test("a chain reuses freed lanes but shares the cluster's lane count", () => {
  // a(9-11) ∩ b(10-12), c(11-13) ∩ b only → one cluster, c reuses lane 0
  const got = layoutDayLanes([
    ev("a", "09:00", "11:00"),
    ev("b", "10:00", "12:00"),
    ev("c", "11:00", "13:00"),
  ]);
  assert.deepEqual(
    got.map((g) => [g.event.id, g.lane, g.laneCount]),
    [
      ["a", 0, 2],
      ["b", 1, 2],
      ["c", 0, 2],
    ],
  );
});

test("separate clusters reset the lane count", () => {
  const got = layoutDayLanes([
    ev("a", "09:00", "11:00"),
    ev("b", "09:30", "10:30"),
    ev("c", "14:00", "16:00"),
  ]);
  const c = got.find((g) => g.event.id === "c");
  assert.deepEqual([c?.lane, c?.laneCount], [0, 1]);
});

// ── booking state ───────────────────────────────────────────────────────────

const TODAY = "2026-06-12";

test("no booking info resolves to none", () => {
  assert.deepEqual(bookingState(undefined, TODAY), { kind: "none" });
  assert.deepEqual(bookingState({}, TODAY), { kind: "none" });
});

test("window not yet open", () => {
  assert.deepEqual(
    bookingState({ opensAt: "2026-06-20", closesAt: "2026-06-28" }, TODAY),
    { kind: "opens", opensAt: "2026-06-20" },
  );
});

test("open, then closing within 3 days, then closed", () => {
  assert.deepEqual(bookingState({ closesAt: "2026-06-25" }, TODAY), {
    kind: "open",
    closesAt: "2026-06-25",
    daysLeft: 13,
  });
  assert.deepEqual(bookingState({ closesAt: "2026-06-14" }, TODAY), {
    kind: "closing",
    closesAt: "2026-06-14",
    daysLeft: 2,
  });
  assert.deepEqual(bookingState({ closesAt: "2026-06-12" }, TODAY), {
    kind: "closing",
    closesAt: "2026-06-12",
    daysLeft: 0,
  });
  assert.deepEqual(bookingState({ closesAt: "2026-06-10" }, TODAY), {
    kind: "closed",
    closesAt: "2026-06-10",
  });
});

test("open with no declared close date", () => {
  assert.deepEqual(bookingState({ opensAt: "2026-06-01" }, TODAY), {
    kind: "open",
  });
});
