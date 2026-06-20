import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterUnpassedExams,
  isExamPassed,
  passedCourseKeys,
} from "@/lib/domain/examStatus";
import type { ExamCall, LibrettoEntry } from "@/lib/domain/types";

function entry(courseName: string): LibrettoEntry {
  return {
    id: courseName,
    courseName,
    cfu: 9,
    grade: { kind: "numeric", value: 27, laude: false },
    date: "2025-01-01",
  };
}

function exam(courseName: string, id = courseName): ExamCall {
  return {
    id,
    courseName,
    date: "2026-06-22",
    sourceId: "esami-anno-1",
    kind: "written",
  };
}

test("exact match (case/accents/punctuation insensitive)", () => {
  const passed = passedCourseKeys([entry("Fisica")]);
  assert.equal(isExamPassed(exam("Fisica"), passed), true);
  assert.equal(isExamPassed(exam("FISICA"), passed), true);
  assert.equal(isExamPassed(exam("física"), passed), true);
});

test("single-word course matches exactly, never fuzzily", () => {
  const passed = passedCourseKeys([entry("Fisica")]);
  // "Fisica" must NOT swallow "Fisica 2" (a different, not-yet-passed exam)
  assert.equal(isExamPassed(exam("Fisica 2"), passed), false);
  assert.equal(isExamPassed(exam("Fisica Generale"), passed), false);
});

test("token-subset matches the 'extra trailing words' case", () => {
  // libretto "Calcolo delle Probabilità" ⊆ appello "...e Statistica"
  const passed = passedCourseKeys([entry("Calcolo delle Probabilità")]);
  assert.equal(
    isExamPassed(exam("Calcolo delle Probabilità e Statistica"), passed),
    true,
  );
});

test("token-subset matches a missing-suffix libretto name", () => {
  // libretto "Analisi Matematica 1" vs appello "Analisi Matematica"
  const passed = passedCourseKeys([entry("Analisi Matematica 1")]);
  assert.equal(isExamPassed(exam("Analisi Matematica"), passed), true);
});

test("different numeric variant does NOT match", () => {
  const passed = passedCourseKeys([entry("Analisi Matematica 1")]);
  assert.equal(isExamPassed(exam("Analisi Matematica 2"), passed), false);
});

test("roman numerals fold to arabic", () => {
  const passed = passedCourseKeys([entry("Analisi Matematica I")]);
  assert.equal(isExamPassed(exam("Analisi Matematica 1"), passed), true);
});

test("unrelated course does not match", () => {
  const passed = passedCourseKeys([entry("Fisica"), entry("Programmazione 1")]);
  assert.equal(isExamPassed(exam("Geometria ed Algebra"), passed), false);
});

test("filterUnpassedExams is identity with an empty libretto", () => {
  const exams = [exam("Fisica"), exam("Geometria")];
  assert.deepEqual(filterUnpassedExams(exams, []), exams);
});

test("filterUnpassedExams drops only the passed ones", () => {
  const exams = [exam("Fisica"), exam("Geometria ed Algebra")];
  const out = filterUnpassedExams(exams, [entry("Fisica")]);
  assert.deepEqual(
    out.map((e) => e.courseName),
    ["Geometria ed Algebra"],
  );
});
