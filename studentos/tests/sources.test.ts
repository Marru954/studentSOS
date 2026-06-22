import assert from "node:assert/strict";
import { test } from "node:test";
import { yearOfSource, matchesYear } from "@/lib/domain/sources";

// ── yearOfSource ─────────────────────────────────────────────────────────────

test("yearOfSource: estrae l'anno dal suffisso semplice 'orario-anno-2'", () => {
  const got = yearOfSource("orario-anno-2");
  assert.equal(got, 2);
});

test("yearOfSource: estrae l'anno da un sourceId con namespace di programma", () => {
  assert.equal(yearOfSource("informatica-orario-anno-2"), 2);
  assert.equal(yearOfSource("matematica-esami-anno-3"), 3);
  assert.equal(yearOfSource("ingegneria-civile-orario-anno-1"), 1);
});

test("yearOfSource: restituisce null quando non c'è suffisso anno", () => {
  assert.equal(yearOfSource("news-ateneo"), null);
  assert.equal(yearOfSource("manual-libretto"), null);
  assert.equal(yearOfSource("ical-personale"), null);
  assert.equal(yearOfSource(""), null);
});

test("yearOfSource: restituisce null per sourceId malformato senza numero finale", () => {
  // 'anno-' senza cifra non deve dare match
  assert.equal(yearOfSource("orario-anno-"), null);
  assert.equal(yearOfSource("anno-X"), null);
});

test("yearOfSource: anno 1 e 3 estratti correttamente (confine)", () => {
  assert.equal(yearOfSource("fisica-esami-anno-1"), 1);
  assert.equal(yearOfSource("chimica-orario-anno-3"), 3);
});

// ── matchesYear ──────────────────────────────────────────────────────────────

test("matchesYear: 'all' matcha sempre, qualsiasi sourceId", () => {
  assert.equal(matchesYear("informatica-orario-anno-2", "all"), true);
  assert.equal(matchesYear("news-ateneo", "all"), true);
  assert.equal(matchesYear("manual-esame", "all"), true);
  assert.equal(matchesYear("", "all"), true);
});

test("matchesYear: anno corrispondente restituisce true", () => {
  assert.equal(matchesYear("informatica-orario-anno-2", 2), true);
  assert.equal(matchesYear("matematica-esami-anno-1", 1), true);
  assert.equal(matchesYear("orario-anno-3", 3), true);
});

test("matchesYear: anno diverso restituisce false", () => {
  assert.equal(matchesYear("informatica-orario-anno-2", 1), false);
  assert.equal(matchesYear("informatica-orario-anno-2", 3), false);
  assert.equal(matchesYear("orario-anno-1", 2), false);
});

test("matchesYear: sourceId 'manual' non viene mai filtrato dall'anno", () => {
  assert.equal(matchesYear("manual-anno-1", 2), true);
  assert.equal(matchesYear("manual-esame-personalizzato", 3), true);
  assert.equal(matchesYear("manual", 1), true);
});

test("matchesYear: sourceId 'ical' non viene mai filtrato dall'anno", () => {
  assert.equal(matchesYear("ical-google-calendar", 2), true);
  assert.equal(matchesYear("ical-personale-anno-1", 3), true);
});

test("matchesYear: sourceId senza suffisso anno restituisce false per qualsiasi numero", () => {
  assert.equal(matchesYear("news-ateneo", 1), false);
  assert.equal(matchesYear("news-ateneo", 2), false);
  assert.equal(matchesYear("", 1), false);
});
