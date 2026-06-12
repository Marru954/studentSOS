import assert from "node:assert/strict";
import { test } from "node:test";
import {
  extractCourseNames,
  searchNotes,
  suggestCourse,
} from "@/lib/domain/notes";
import type { ClassEvent, ExamCall, Note } from "@/lib/domain/types";

function note(overrides: Partial<Note>): Note {
  return {
    id: Math.random().toString(36).slice(2),
    title: "",
    content: "",
    tags: [],
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-06-01T10:00:00.000Z",
    ...overrides,
  };
}

test("empty query returns notes by recency", () => {
  const old = note({ id: "old", updatedAt: "2026-06-01T10:00:00.000Z" });
  const recent = note({ id: "recent", updatedAt: "2026-06-10T10:00:00.000Z" });
  assert.deepEqual(
    searchNotes([old, recent], "  ").map((n) => n.id),
    ["recent", "old"],
  );
});

test("every term must match somewhere (AND semantics)", () => {
  const both = note({ id: "both", title: "Join in SQL", content: "indici" });
  const one = note({ id: "one", title: "Join", content: "alberi B+" });
  assert.deepEqual(
    searchNotes([one, both], "join indici").map((n) => n.id),
    ["both"],
  );
});

test("title matches outrank content matches", () => {
  const inContent = note({ id: "content", content: "il teorema di Bayes" });
  const inTitle = note({ id: "title", title: "Bayes" });
  assert.deepEqual(
    searchNotes([inContent, inTitle], "bayes").map((n) => n.id),
    ["title", "content"],
  );
});

test("search is accent-insensitive in both directions", () => {
  const n = note({ id: "acc", title: "Perché gli indici sono B+ tree" });
  assert.equal(searchNotes([n], "perche").length, 1);
  assert.equal(searchNotes([n], "perché").length, 1);
});

test("tags and linked course are searchable", () => {
  const n = note({
    id: "t",
    tags: ["normalizzazione"],
    courseName: "BASI DI DATI",
  });
  assert.equal(searchNotes([n], "normalizzazione").length, 1);
  assert.equal(searchNotes([n], "basi di dati").length, 1);
});

test("course names are extracted unique and sorted", () => {
  const ev = (courseName: string): ClassEvent => ({
    id: courseName,
    courseName,
    start: "2026-06-15T07:00:00.000Z",
    end: "2026-06-15T09:00:00.000Z",
    kind: "lecture",
    sourceId: "s",
  });
  const ex: ExamCall = {
    id: "x",
    courseName: "ANALISI I",
    date: "2026-06-19",
    kind: "written",
    sourceId: "s",
  };
  assert.deepEqual(
    extractCourseNames([ev("BASI DI DATI"), ev("ANALISI I")], [ex]),
    ["ANALISI I", "BASI DI DATI"],
  );
});

test("the longest mentioned course wins the suggestion", () => {
  const courses = ["RETI", "RETI DI CALCOLATORI"];
  assert.equal(
    suggestCourse("Appunti di reti di calcolatori, lezione 3", courses),
    "RETI DI CALCOLATORI",
  );
  assert.equal(suggestCourse("Appunti di fisica", courses), undefined);
});
