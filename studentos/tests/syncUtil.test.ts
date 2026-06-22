import assert from "node:assert/strict";
import { test } from "node:test";
import {
  stableId,
  italianDateToIso,
  splitRoomLabel,
  htmlToText,
  minutesBetween,
} from "@/lib/sync/util";

// ── stableId ─────────────────────────────────────────────────────────────────

test("stableId è deterministico: stesso input produce sempre stesso id", () => {
  const a = stableId("corso-1", "lezione", 42);
  const b = stableId("corso-1", "lezione", 42);
  assert.equal(a, b);
});

test("stableId produce id diversi per input diversi", () => {
  const a = stableId("corso-1", "lezione", 1);
  const b = stableId("corso-1", "lezione", 2);
  assert.notEqual(a, b);
});

test("stableId ignora parti undefined e rimane stabile", () => {
  const a = stableId("orario", undefined, "2026");
  const b = stableId("orario", undefined, "2026");
  assert.equal(a, b);
  // input con undefined diverso da input senza quel campo
  const c = stableId("orario", "extra", "2026");
  assert.notEqual(a, c);
});

test("stableId con un solo argomento stringa restituisce una stringa non vuota", () => {
  const id = stableId("unico");
  assert.ok(typeof id === "string" && id.length > 0);
});

// ── italianDateToIso ──────────────────────────────────────────────────────────

test("italianDateToIso converte correttamente '15-06-2026' in '2026-06-15'", () => {
  assert.equal(italianDateToIso("15-06-2026"), "2026-06-15");
});

test("italianDateToIso restituisce undefined per input malformato", () => {
  assert.equal(italianDateToIso("2026-06-15"), undefined); // formato ISO, non italiano
  assert.equal(italianDateToIso("15/06/2026"), undefined); // slash invece di trattini
  assert.equal(italianDateToIso(""), undefined);           // stringa vuota
  assert.equal(italianDateToIso("ab-cd-efgh"), undefined); // caratteri non numerici
});

test("italianDateToIso gestisce spazi iniziali/finali prima di validare", () => {
  assert.equal(italianDateToIso("  01-01-2025  "), "2025-01-01");
});

// ── splitRoomLabel ────────────────────────────────────────────────────────────

test("splitRoomLabel separa aula ed edificio quando c'è '[edificio]'", () => {
  const result = splitRoomLabel("Aula 18 [Macroarea di Scienze MM.FF.NN.]");
  assert.equal(result.room, "Aula 18");
  assert.equal(result.building, "Macroarea di Scienze MM.FF.NN.");
});

test("splitRoomLabel restituisce solo room quando non c'è '[edificio]'", () => {
  const result = splitRoomLabel("Aula T5");
  assert.equal(result.room, "Aula T5");
  assert.equal(result.building, undefined);
});

test("splitRoomLabel restituisce room undefined per stringa vuota", () => {
  const result = splitRoomLabel("");
  assert.equal(result.room, undefined);
  assert.equal(result.building, undefined);
});

test("splitRoomLabel gestisce etichetta con solo edificio (parte room vuota)", () => {
  const result = splitRoomLabel("[Edificio A]");
  // room vuota → undefined, building presente
  assert.equal(result.room, undefined);
  assert.equal(result.building, "Edificio A");
});

// ── htmlToText ────────────────────────────────────────────────────────────────

test("htmlToText rimuove tag HTML e restituisce il testo pulito", () => {
  const html = "<p>Benvenuto <strong>studente</strong>!</p>";
  assert.equal(htmlToText(html), "Benvenuto studente !");
});

test("htmlToText decodifica le entità comuni (&amp; &lt; &gt; &quot;)", () => {
  assert.equal(htmlToText("A &amp; B"), "A & B");
  assert.equal(htmlToText("&lt;script&gt;"), "<script>");
  assert.equal(htmlToText("&quot;citazione&quot;"), '"citazione"');
});

test("htmlToText decodifica entità numeriche (&#160; ecc.)", () => {
  // &#65; = 'A'
  assert.equal(htmlToText("&#65;"), "A");
});

test("htmlToText restituisce stringa vuota per input vuoto", () => {
  assert.equal(htmlToText(""), "");
});

test("htmlToText collassa spazi multipli in uno solo", () => {
  const html = "<p>  testo   con   spazi  </p>";
  assert.equal(htmlToText(html), "testo con spazi");
});

// ── minutesBetween ────────────────────────────────────────────────────────────

test("minutesBetween calcola correttamente la differenza in minuti", () => {
  assert.equal(minutesBetween("08:00", "10:00"), 120);
  assert.equal(minutesBetween("09:30", "11:15"), 105);
});

test("minutesBetween restituisce 0 quando start === end", () => {
  assert.equal(minutesBetween("10:00", "10:00"), 0);
});

test("minutesBetween non è mai negativo (end < start)", () => {
  // Caso in cui l'orario di fine è precedente all'inizio (dati anomali)
  const result = minutesBetween("12:00", "08:00");
  assert.ok(result >= 0, `atteso >= 0, ottenuto ${result}`);
});

test("minutesBetween gestisce correttamente la mezzanotte (00:00)", () => {
  assert.equal(minutesBetween("00:00", "01:00"), 60);
});
