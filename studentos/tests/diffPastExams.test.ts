/**
 * Regressione review 2026-07-02 (finding #3): diffExamCalls non deve emettere
 * notice "new-exam" per appelli con data già passata. La finestra di sync
 * scorre col tempo (LOOKBACK ~15 settimane) e una sorgente può rientrare dopo
 * un errore: appelli vecchi "mai visti" non sono una novità per lo studente.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ExamCall } from "@/lib/domain/types";
import { diffExamCalls } from "@/lib/storage/diff";

const NOW = "2026-07-02T09:00:00.000Z";

function exam(overrides: Partial<ExamCall> = {}): ExamCall {
  return {
    id: "ex-1",
    courseName: "FISICA",
    date: "2026-07-21",
    time: "09:30",
    kind: "written",
    sourceId: "esami-anno-2",
    ...overrides,
  };
}

test("appello nuovo con data passata non produce notice", () => {
  const known = exam({ id: "ex-known" });
  const vecchio = exam({ id: "ex-past", date: "2026-05-21", time: "09:00" });
  const notices = diffExamCalls([known], [known, vecchio], NOW);
  assert.equal(notices.length, 0);
});

test("appello nuovo di oggi produce notice (oggi non è passato)", () => {
  const known = exam({ id: "ex-known" });
  const oggi = exam({ id: "ex-today", date: "2026-07-02", time: "15:00" });
  const notices = diffExamCalls([known], [known, oggi], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "new-exam");
});

test("mix passato/futuro: solo i futuri producono notice", () => {
  const known = exam({ id: "ex-known" });
  const past1 = exam({ id: "ex-p1", date: "2026-05-21" });
  const past2 = exam({ id: "ex-p2", date: "2026-06-22" });
  const future = exam({ id: "ex-f1", date: "2026-07-28" });
  const notices = diffExamCalls([known], [known, past1, past2, future], NOW);
  assert.equal(notices.length, 1);
  assert.match(notices[0].detail, /28\/07\/2026/);
});

test("primo sync (prev vuoto) resta silenzioso anche con date future", () => {
  assert.equal(diffExamCalls([], [exam({ date: "2026-08-10" })], NOW).length, 0);
});
