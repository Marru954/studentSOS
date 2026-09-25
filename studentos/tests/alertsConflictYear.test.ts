import assert from "node:assert/strict";
import { test } from "node:test";
import { AlertType } from "@/lib/domain/alerts";
import { detectAlerts } from "@/lib/domain/detectAlerts";
import type { ClassEvent } from "@/lib/domain/types";

const NOW = new Date("2026-06-12T10:00:00.000Z");

function lesson(overrides: Partial<ClassEvent>): ClassEvent {
  return {
    id: "ev",
    courseName: "A",
    start: "2026-06-15T07:00:00.000Z",
    end: "2026-06-15T09:00:00.000Z",
    kind: "lecture",
    sourceId: "orario-anno-1",
    ...overrides,
  };
}

function conflicts(classEvents: ClassEvent[]) {
  return detectAlerts({
    classEvents,
    examCalls: [],
    previousExamIds: [],
    libroEntries: [],
    previousMedia: null,
    syncMeta: [],
    now: NOW,
  }).filter((a) => a.type === AlertType.CONFLITTO_ORARIO);
}

const overlapB = { start: "2026-06-15T08:00:00.000Z", end: "2026-06-15T10:00:00.000Z" };

test("CONFLITTO_ORARIO: anni diversi non generano conflitto", () => {
  const a = lesson({ id: "a", courseName: "A", sourceId: "orario-anno-1" });
  const b = lesson({ id: "b", courseName: "B", sourceId: "orario-anno-3", ...overlapB });
  assert.equal(conflicts([a, b]).length, 0);
});

test("CONFLITTO_ORARIO: stesso anno (anche namespaced) → conflitto", () => {
  const a = lesson({ id: "a", courseName: "A", sourceId: "info-orario-anno-2" });
  const b = lesson({ id: "b", courseName: "B", sourceId: "info-orario-anno-2", ...overlapB });
  assert.equal(conflicts([a, b]).length, 1);
});

test("CONFLITTO_ORARIO: sorgente senza anno (manuale/iCal) resta confrontata", () => {
  const a = lesson({ id: "a", courseName: "A", sourceId: "orario-anno-1" });
  const b = lesson({ id: "b", courseName: "B", sourceId: "manual", ...overlapB });
  assert.equal(conflicts([a, b]).length, 1);
});
