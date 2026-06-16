/**
 * Tests for the pure PDF-import normalization layer (src/lib/domain/pdfImport.ts).
 * The AI (Groq) returns loosely-shaped JSON rows extracted from a timetable or
 * exam PDF; these functions coerce them into the app's ClassEvent/ExamCall
 * vocabulary (ISO weekday, "HH:MM", "YYYY-MM-DD", typed `kind`) and drop rows
 * that can't be trusted. Framework-free, deterministic — run with:
 *   ./node_modules/.bin/tsx tests/pdfImport.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  normalizeExams,
  normalizeLessons,
  pdfImportSourceId,
} from "../src/lib/domain/pdfImport";

test("pdfImportSourceId: starts with manual, carries pdf-import provenance and the year", () => {
  assert.equal(pdfImportSourceId(2), "manual-pdf-import-anno-2");
  // default year 1 when unknown (mirrors ManualExamForm)
  assert.equal(pdfImportSourceId(undefined), "manual-pdf-import-anno-1");
  const id = pdfImportSourceId(3);
  // must keep working with every existing "manual…" code path for free
  assert.ok(id.startsWith("manual"), "year filter / delete gating key on this");
  assert.ok(id.includes("pdf-import"), "distinct provenance for the badge");
  assert.match(id, /anno-\d+$/, "yearOfSource() parses the trailing anno-N");
});

test("normalizeLessons: maps Italian + English day names to ISO weekday", () => {
  const rows = [
    { corso: "Analisi", giorno: "lun", oraInizio: "9:00", oraFine: "11:00" },
    { corso: "Fisica", giorno: "Martedì", oraInizio: "14:00", oraFine: "16:00" },
    { corso: "Chimica", giorno: "mercoledi", oraInizio: "10:00", oraFine: "12:00" },
    { corso: "Inglese", giorno: "friday", oraInizio: "08:00", oraFine: "10:00" },
    { corso: "Lab", giorno: "domenica", oraInizio: "09:00", oraFine: "13:00" },
  ];
  const out = normalizeLessons(rows);
  assert.deepEqual(
    out.map((l) => [l.courseName, l.weekday]),
    [
      ["Analisi", 1],
      ["Fisica", 2],
      ["Chimica", 3],
      ["Inglese", 5],
      ["Lab", 7],
    ],
  );
});

test("normalizeLessons: pads/normalizes times and reads dotted times", () => {
  const out = normalizeLessons([
    { corso: "A", giorno: "lun", oraInizio: "9:5", oraFine: "11" },
    { corso: "B", giorno: "lun", oraInizio: "14.30", oraFine: "16.00" },
  ]);
  assert.equal(out[0].startTime, "09:05");
  assert.equal(out[0].endTime, "11:00");
  assert.equal(out[1].startTime, "14:30");
  assert.equal(out[1].endTime, "16:00");
});

test("normalizeLessons: maps tipo to ClassEventKind, defaulting to lecture", () => {
  const out = normalizeLessons([
    { corso: "A", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", tipo: "laboratorio" },
    { corso: "B", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", tipo: "Esercitazione" },
    { corso: "C", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", tipo: "seminario" },
    { corso: "D", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", tipo: "" },
    { corso: "E", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", tipo: "lezione frontale" },
  ]);
  assert.deepEqual(
    out.map((l) => l.kind),
    ["lab", "exercise", "seminar", "lecture", "lecture"],
  );
});

test("normalizeLessons: drops rows missing course, day, or times; trims room", () => {
  const out = normalizeLessons([
    { corso: "", giorno: "lun", oraInizio: "9:00", oraFine: "11:00" }, // no course
    { corso: "X", giorno: "qux", oraInizio: "9:00", oraFine: "11:00" }, // bad day
    { corso: "Y", giorno: "lun", oraInizio: "", oraFine: "11:00" }, // no start
    { corso: "Z", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", aula: "  Aula 3 " },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].courseName, "Z");
  assert.equal(out[0].room, "Aula 3");
});

test("normalizeLessons: empty room becomes undefined; non-array input is []", () => {
  const out = normalizeLessons([
    { corso: "Z", giorno: "lun", oraInizio: "9:00", oraFine: "11:00", aula: "   " },
  ]);
  assert.equal(out[0].room, undefined);
  assert.deepEqual(normalizeLessons(null), []);
  assert.deepEqual(normalizeLessons("nope"), []);
});

test("normalizeExams: accepts ISO and European date formats, normalizes to YYYY-MM-DD", () => {
  const out = normalizeExams([
    { corso: "Analisi", data: "2026-06-20" },
    { corso: "Fisica", data: "03/07/2026" },
    { corso: "Chimica", data: "9-1-2027" },
    { corso: "Reti", data: "15.02.2026" },
  ]);
  assert.deepEqual(
    out.map((e) => [e.courseName, e.date]),
    [
      ["Analisi", "2026-06-20"],
      ["Fisica", "2026-07-03"],
      ["Chimica", "2027-01-09"],
      ["Reti", "2026-02-15"],
    ],
  );
});

test("normalizeExams: maps tipo to ExamKind; written+oral when both present", () => {
  const out = normalizeExams([
    { corso: "A", data: "2026-06-20", tipo: "scritto" },
    { corso: "B", data: "2026-06-20", tipo: "Orale" },
    { corso: "C", data: "2026-06-20", tipo: "scritto e orale" },
    { corso: "D", data: "2026-06-20", tipo: "prova pratica" },
    { corso: "E", data: "2026-06-20", tipo: "" },
  ]);
  assert.deepEqual(
    out.map((e) => e.kind),
    ["written", "oral", "written+oral", "practical", "unknown"],
  );
});

test("normalizeExams: drops rows missing course or with an invalid date", () => {
  const out = normalizeExams([
    { corso: "", data: "2026-06-20" }, // no course
    { corso: "X", data: "31/31/2026" }, // impossible date
    { corso: "Y", data: "not a date" },
    { corso: "Z", data: "2026-06-20" },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].courseName, "Z");
});

test("normalizeExams: optional time/room/teacher trimmed, empty → undefined", () => {
  const out = normalizeExams([
    {
      corso: "Analisi",
      data: "2026-06-20",
      ora: "9:30",
      aula: "  B12 ",
      docente: "  Rossi ",
    },
    { corso: "Fisica", data: "2026-06-21", ora: "", aula: "", docente: "" },
  ]);
  assert.equal(out[0].time, "09:30");
  assert.equal(out[0].room, "B12");
  assert.equal(out[0].teacher, "Rossi");
  assert.equal(out[1].time, undefined);
  assert.equal(out[1].room, undefined);
  assert.equal(out[1].teacher, undefined);
});
