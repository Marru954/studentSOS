/**
 * Test unitari per src/lib/storage/diff.ts
 * Logica pura: niente IndexedDB, niente rete.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ClassEvent, ExamCall } from "@/lib/domain/types";
import { diffClassEvents, diffExamCalls } from "@/lib/storage/diff";

const NOW = "2026-06-22T10:00:00.000Z";

// ── Fixture helpers ──────────────────────────────────────────────────────────

function lesson(overrides: Partial<ClassEvent> = {}): ClassEvent {
  return {
    id: "ev-1",
    courseName: "BASI DI DATI",
    start: "2026-06-25T07:00:00.000Z",
    end: "2026-06-25T09:00:00.000Z",
    room: "Aula 18",
    kind: "lecture",
    sourceId: "orario-anno-2",
    ...overrides,
  };
}

function exam(overrides: Partial<ExamCall> = {}): ExamCall {
  return {
    id: "ex-1",
    courseName: "CALCOLO DELLE PROBABILITA'",
    date: "2026-07-10",
    time: "10:00",
    kind: "written",
    sourceId: "esami-anno-2",
    ...overrides,
  };
}

// ── diffClassEvents: happy path ──────────────────────────────────────────────

test("nessuna differenza tra prev e next non produce ChangeNotice", () => {
  const event = lesson();
  const notices = diffClassEvents([event], [event], NOW);
  assert.equal(notices.length, 0);
});

test("cambio aula per lo stesso evento produce un notice room-change", () => {
  const prev = lesson({ room: "Aula 18" });
  const next = lesson({ room: "Aula T5" });
  const notices = diffClassEvents([prev], [next], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "room-change");
  assert.equal(notices[0].detail, "Aula 18 → Aula T5");
  assert.equal(notices[0].courseName, "BASI DI DATI");
  assert.equal(notices[0].seen, false);
});

test("lezione spostata di orario (nuovo id, stesso giorno) produce time-change", () => {
  // il vecchio evento scompare, arriva un evento con id diverso ma stesso corso+giorno
  const prev = lesson({ id: "ev-old", start: "2026-06-25T07:00:00.000Z", end: "2026-06-25T09:00:00.000Z" });
  const next = lesson({ id: "ev-new", start: "2026-06-25T12:00:00.000Z", end: "2026-06-25T14:00:00.000Z" });
  const notices = diffClassEvents([prev], [next], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "time-change");
  assert.equal(notices[0].detail, "07:00 → 12:00");
});

test("flag di cancellazione su evento esistente produce notice cancelled", () => {
  const prev = lesson();
  const next = lesson({ change: { field: "cancelled" } });
  const notices = diffClassEvents([prev], [next], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "cancelled");
  assert.match(notices[0].detail, /2026-06-25/);
});

// ── diffClassEvents: edge case ───────────────────────────────────────────────

test("lista vuota in input non produce errori né notice", () => {
  assert.equal(diffClassEvents([], [], NOW).length, 0);
  assert.equal(diffClassEvents([], [lesson()], NOW).length, 0);
  assert.equal(diffClassEvents([lesson()], [], NOW).length, 0);
});

test("cambio aula non viene rilevato se manca l'aula nel prev o nel next", () => {
  // prev senza aula → non può emettere room-change
  const noRoomPrev = lesson({ room: undefined });
  const withRoom = lesson({ room: "Aula T5" });
  assert.equal(diffClassEvents([noRoomPrev], [withRoom], NOW).length, 0);

  // next senza aula → non può emettere room-change
  const noRoomNext = lesson({ room: undefined });
  const withRoomPrev = lesson({ room: "Aula 18" });
  assert.equal(diffClassEvents([withRoomPrev], [noRoomNext], NOW).length, 0);
});

test("flag cancelled già presente in prev non ripete la notice", () => {
  // lo stesso evento già annullato: prev e next entrambi cancelled → nessun notice
  const cancelled = lesson({ change: { field: "cancelled" } });
  assert.equal(diffClassEvents([cancelled], [cancelled], NOW).length, 0);
});

test("evento con nuovo id e stesso corso+giorno non è un time-change se il vecchio è ancora presente in next", () => {
  // il vecchio persiste in next, quindi il "sibling" non genera time-change
  const old = lesson({ id: "ev-old" });
  const newEvent = lesson({ id: "ev-new", start: "2026-06-25T12:00:00.000Z", end: "2026-06-25T14:00:00.000Z" });
  // next contiene ENTRAMBI: il vecchio sopravvive, il nuovo è un'aggiunta
  const notices = diffClassEvents([old], [old, newEvent], NOW);
  // il vecchio ev-old è in prevById → salta; ev-new è nuovo ma il sibling (ev-old) è ancora in next → no time-change
  assert.equal(notices.length, 0);
});

test("più eventi nello stesso sync: solo quello con cambio aula emette notice", () => {
  const unchanged = lesson({ id: "ev-a", courseName: "ANALISI I", room: "Aula 5" });
  const prevChanged = lesson({ id: "ev-b", room: "Aula 18" });
  const nextChanged = lesson({ id: "ev-b", room: "Aula T5" });
  const notices = diffClassEvents([unchanged, prevChanged], [unchanged, nextChanged], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "room-change");
});

// ── diffExamCalls: happy path ────────────────────────────────────────────────

test("primo sync con prev vuoto non produce notice new-exam", () => {
  // prev vuoto = primo sync: silenzioso per design
  const notices = diffExamCalls([], [exam()], NOW);
  assert.equal(notices.length, 0);
});

test("nuovo appello aggiunto rispetto al sync precedente produce notice new-exam", () => {
  const known = exam({ id: "ex-1" });
  const nuovoAppello = exam({ id: "ex-2", date: "2026-07-25", time: "11:00" });
  const notices = diffExamCalls([known], [known, nuovoAppello], NOW);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, "new-exam");
  assert.match(notices[0].detail, /25\/07\/2026/);
  assert.match(notices[0].detail, /alle 11:00/);
  assert.equal(notices[0].courseName, "CALCOLO DELLE PROBABILITA'");
  assert.equal(notices[0].seen, false);
});

test("appello senza orario produce detail senza 'alle'", () => {
  const known = exam({ id: "ex-1" });
  const senzaOrario = exam({ id: "ex-2", date: "2026-08-05", time: undefined });
  const notices = diffExamCalls([known], [known, senzaOrario], NOW);
  assert.equal(notices.length, 1);
  assert.match(notices[0].detail, /05\/08\/2026/);
  // nessun riferimento all'orario
  assert.doesNotMatch(notices[0].detail, /alle/);
});

// ── diffExamCalls: edge case ─────────────────────────────────────────────────

test("appelli invariati tra prev e next non producono notice", () => {
  const e = exam();
  const notices = diffExamCalls([e], [e], NOW);
  assert.equal(notices.length, 0);
});

test("appello scomparso da next non produce notice (disappearance is not cancellation)", () => {
  const a = exam({ id: "ex-1" });
  const b = exam({ id: "ex-2", date: "2026-08-01" });
  // secondo sync: b scompare, rimane solo a
  const notices = diffExamCalls([a, b], [a], NOW);
  assert.equal(notices.length, 0);
});

test("due nuovi appelli nello stesso sync producono due notice distinti", () => {
  const base = exam({ id: "ex-base" });
  const nuovo1 = exam({ id: "ex-n1", date: "2026-08-10" });
  const nuovo2 = exam({ id: "ex-n2", date: "2026-08-20", courseName: "FISICA I" });
  const notices = diffExamCalls([base], [base, nuovo1, nuovo2], NOW);
  assert.equal(notices.length, 2);
  const kinds = notices.map((n) => n.kind);
  assert.ok(kinds.every((k) => k === "new-exam"));
  // id notice è deterministico: lo stesso cambio riproduce lo stesso id
  const noticesAgain = diffExamCalls([base], [base, nuovo1, nuovo2], NOW);
  assert.equal(notices[0].id, noticesAgain[0].id);
  assert.equal(notices[1].id, noticesAgain[1].id);
});

test("notice id è deterministico: stesso cambio produce stesso id", () => {
  const prev = lesson({ room: "Aula 18" });
  const next = lesson({ room: "Aula T5" });
  const run1 = diffClassEvents([prev], [next], NOW);
  const run2 = diffClassEvents([prev], [next], "2026-06-23T08:00:00.000Z"); // now diverso
  // l'id non dipende da detectedAt ma da kind+entityId+detail
  assert.equal(run1[0].id, run2[0].id);
});
