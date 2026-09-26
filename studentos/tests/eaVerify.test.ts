import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { extractArray, parseCombo, valoriForYear, yearOfValore } from "../tools/ea-verify/lib/combo";
import { defaultAcademicYear, defaultExamWindow, defaultWindow, mondaysBetween, septWindow, toItalian } from "../tools/ea-verify/lib/weeks";
import { nameSimilarity, namesMatch, normalizeName, tipoCompatible, tipoOfProgramme } from "../tools/ea-verify/lib/match";
import { classifyWeeks, comboFlags, septOnlyExams, wantExams } from "../tools/ea-verify/lib/flags";
import { diffSnapshots, formatDiff, isEmptyDiff, parseSnapshot, serializeSnapshot } from "../tools/ea-verify/lib/snapshot";
import {
  buildPlan,
  candidatesFor,
  finalizeProgram,
  mergeCoverage,
  pickHit,
  planStats,
  renderCoverageSection,
  renderManualConversion,
  renderPresetPatch,
  restoreConstName,
} from "../tools/ea-verify/lib/patch";
import { clampConcurrency } from "../tools/ea-verify/lib/net";
import type { ComboCourse, Plan, ProgramPlan, Snapshot, SourceRecord, YearModel } from "../tools/ea-verify/lib/types";

/* ------------------------------------------------------------------ fixture */

const COMBO_TEXT = `var elenco_corsi = [{"elenco_anni":[{"label":"1","valore":"GEN|1"},{"label":"2","valore":"GEN|2"}],"label":"INFORMATICA [B1] (a \\"b\\" ] c)","tipo":"Laurea","valore":"B100","scuola":"ScuolaX","facolta_id":"7"},{"elenco_anni":[],"label":"FISICA","tipo":"Laurea Magistrale","valore":"B200","scuola":"","facolta_id":"8"}];\n\nvar elenco_cdl = elenco_corsi;\n`;

const course = (valore: string, label: string, tipo: string, scuola: string, anni: string[], facoltaId = "1"): ComboCourse => ({ valore, label, tipo, scuola, facoltaId, anni });

/* -------------------------------------------------------------------- combo */

test("parseCombo: estrae i corsi anche con parentesi quadre e virgolette nelle etichette", () => {
  const arr = extractArray(COMBO_TEXT);
  assert.equal(arr?.length, 2);
  const c = parseCombo(COMBO_TEXT);
  assert.equal(c.length, 2);
  assert.equal(c[0].valore, "B100");
  assert.equal(c[0].scuola, "ScuolaX");
  assert.deepEqual(c[0].anni, ["GEN|1", "GEN|2"]);
  assert.equal(c[1].scuola, "");
});

test("parseCombo: combo vuoto (sistema senza l'anno) -> nessun corso", () => {
  assert.deepEqual(parseCombo("var elenco_corsi = [];\n\nvar elenco_scuole = [];"), []);
  assert.deepEqual(parseCombo("<html>errore</html>"), []);
});

test("yearOfValore / valoriForYear gestiscono anni negativi e curricula", () => {
  assert.equal(yearOfValore("PDS0-2025|-1"), -1);
  assert.equal(yearOfValore("GEN|2"), 2);
  assert.ok(Number.isNaN(yearOfValore("GEN")));
  const c = course("X", "X", "Laurea", "", ["A|1", "B|1", "A|2", "PDS0-2026|-1"]);
  assert.deepEqual(valoriForYear(c, 1), ["A|1", "B|1"]);
  assert.deepEqual(valoriForYear(c, -1), ["PDS0-2026|-1"]);
});

/* -------------------------------------------------------------------- weeks */

test("mondaysBetween: 10 lunedi' dal 28-09 al 30-11-2026", () => {
  const w = mondaysBetween("2026-09-28", "2026-11-30");
  assert.equal(w.length, 10);
  assert.equal(w[0], "28-09-2026");
  assert.equal(w[9], "30-11-2026");
});

test("mondaysBetween: se from non e' lunedi' parte dal primo lunedi' successivo", () => {
  assert.equal(mondaysBetween("2026-09-29", "2026-10-13")[0], "05-10-2026");
});

test("anno accademico di default e finestre", () => {
  assert.equal(defaultAcademicYear(new Date("2026-09-25T10:00:00Z")), "2026");
  assert.equal(defaultAcademicYear(new Date("2026-03-01T10:00:00Z")), "2025");
  assert.deepEqual(defaultWindow("2026"), { from: "2026-09-28", to: "2026-11-30" });
  assert.deepEqual(defaultExamWindow("2026"), { from: "2026-10-01", to: "2027-09-30" });
  assert.equal(toItalian("2026-09-01"), "01-09-2026");
});

/* -------------------------------------------------------------------- match */

test("normalizeName / nameSimilarity: corrispondenza semplice senza dipendenze", () => {
  assert.equal(normalizeName("Ingegneria Dell'automazione [B12] (magistrale)"), "ingegneria dell automazione");
  assert.ok(namesMatch("Ingegneria Informatica (triennale)", "INGEGNERIA INFORMATICA"));
  assert.ok(namesMatch("Scienze dell'Educazione", "SCIENZE DELL'EDUCAZIONE E DELLA FORMAZIONE"));
  assert.ok(!namesMatch("Fisica", "Chimica"));
  assert.ok(nameSimilarity("Biologia", "Biologia") === 1);
});

test("tipo del programma vs tipo del combo", () => {
  assert.equal(tipoOfProgramme("Farmacia (ciclo unico)"), "cu");
  assert.equal(tipoOfProgramme("Fisica (magistrale)"), "mag");
  assert.equal(tipoOfProgramme("Fisica (triennale)"), "tri");
  assert.equal(tipoOfProgramme("Fisica"), "any");
  assert.ok(tipoCompatible("mag", "Laurea Magistrale"));
  assert.ok(!tipoCompatible("mag", "Laurea Magistrale Ciclo Unico 5 anni"));
  assert.ok(tipoCompatible("cu", "Laurea Magistrale Ciclo Unico 5 anni"));
  assert.ok(tipoCompatible("tri", "CORSO DI LAUREA"));
  assert.ok(!tipoCompatible("tri", "CORSO DI LAUREA MAGISTRALE"));
});

/* -------------------------------------------------------------------- flags */

test("classifyWeeks: NO_CELLS, live, PARTIAL, crollo, errori di rete", () => {
  assert.deepEqual(classifyWeeks([0, 0, 0, 0]).flags, ["NO_CELLS"]);
  assert.equal(classifyWeeks([0, 0, 0, 0]).live, false);
  const ok = classifyWeeks([0, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
  assert.equal(ok.live, true);
  assert.deepEqual(ok.flags, []);
  assert.equal(ok.total, 45);
  assert.equal(ok.weeksWithCells, 9);
  assert.ok(classifyWeeks([3, 0, 0, 1, 0, 0, 0, 0, 0, 0]).flags.includes("PARTIAL"));
  assert.ok(classifyWeeks([4, 4, 4, 4, 4, 4, 0, 0, 0, 0]).flags.includes("PARTIAL"));
  assert.deepEqual(classifyWeeks([-1, 2, 2]).flags, ["NET_ERROR"]);
});

test("comboFlags: codice mancante, scuola, nome, anno2, combo vuoto", () => {
  const combo = [course("B100", "INFORMATICA", "Laurea", "ScuolaX", ["GEN|1"])];
  const src = { programme: "Informatica", scuola: "ScuolaX", corso: "B100", anno2: ["GEN|1"], year: 1 };
  assert.deepEqual(comboFlags(src, combo), []);
  assert.deepEqual(comboFlags({ ...src, corso: "ZZZ" }, combo), ["CODE_MISSING_IN_COMBO"]);
  assert.deepEqual(comboFlags({ ...src, scuola: "Altra" }, combo), ["SCUOLA_NOT_IN_COMBO"]);
  assert.deepEqual(comboFlags({ ...src, programme: "Chimica" }, combo), ["NAME_MISMATCH"]);
  assert.deepEqual(comboFlags({ ...src, anno2: ["OLD|1"] }, combo), ["ANNO2_STALE"]);
  assert.deepEqual(comboFlags(src, []), []);
  // combo senza scuola (sempre vuota): nessun SCUOLA_NOT_IN_COMBO
  assert.deepEqual(comboFlags({ ...src, scuola: "300398" }, [course("B100", "INFORMATICA", "Laurea", "", ["GEN|1"])]), []);
});

test("wantExams: regola rigida, solo con appelli", () => {
  assert.equal(wantExams([0, 0]), false);
  assert.equal(wantExams([0, 3]), true);
  assert.equal(wantExams([]), false);
});

test("SEPT_ONLY_EXAMS: solo informativo, appelli a settembre e nessuno da ottobre", () => {
  assert.equal(septOnlyExams(0, 3), true);
  assert.equal(septOnlyExams(0, 0), false);
  assert.equal(septOnlyExams(2, 3), false);
  assert.deepEqual(septWindow("2026"), { from: "2026-09-01", to: "2026-09-30" });
  // non influenza la regola rigida degli esami
  assert.equal(wantExams([0, 0]), false);
});

test("clampConcurrency non supera mai 3", () => {
  assert.equal(clampConcurrency(10), 3);
  assert.equal(clampConcurrency(0), 1);
  assert.equal(clampConcurrency(2), 2);
});

/* ---------------------------------------------------------------- snapshot */

const rec = (id: string, over: Partial<SourceRecord> = {}): SourceRecord => ({
  id,
  programme: "Prog",
  kind: "timetable",
  year: 1,
  scuola: "S",
  corso: "C1",
  anno2: ["GEN|1"],
  weeks: [0, 5, 5],
  total: 10,
  weeksWithCells: 2,
  live: true,
  flags: [],
  ...over,
});

const snap = (over: Partial<Snapshot> = {}): Snapshot => ({
  tool: "ea-verify",
  version: 1,
  presetId: "test",
  generatedAt: "2026-09-25T00:00:00.000Z",
  params: { aa: "2026", from: "2026-09-28", to: "2026-11-30", examFrom: "2026-10-01", examTo: "2027-09-30", weeks: ["28-09-2026"] },
  baseHost: "host.test/agenda",
  combo: { status: "ok", count: 1, entries: [course("C1", "PROG UNO", "Laurea", "S", ["GEN|1"])] },
  presetFlags: [],
  sources: [rec("a-orario-anno-1"), rec("b-orario-anno-1", { programme: "Due" })],
  ...over,
});

test("snapshot: serializzazione stabile, array compatti, round-trip", () => {
  const text = serializeSnapshot(snap());
  assert.match(text, /"weeks": \[0, 5, 5\]/);
  assert.match(text, /"anno2": \["GEN\|1"\]/);
  assert.deepEqual(parseSnapshot(text), snap());
  assert.throws(() => parseSnapshot(JSON.stringify({ tool: "altro" })));
});

test("diffSnapshots: sorgenti live->vuote, nuove/sparite, codici rinumerati, celle dimezzate", () => {
  const before = snap({
    combo: { status: "ok", count: 2, entries: [course("C1", "PROG UNO", "Laurea", "S", ["GEN|1"]), course("OLD9", "Nuovo Nome", "Laurea", "S", ["GEN|1"])] },
    sources: [rec("a-orario-anno-1"), rec("b-orario-anno-1", { total: 100 }), rec("gone-orario-anno-1")],
  });
  const after = snap({
    combo: { status: "ok", count: 2, entries: [course("C1", "PROG 1", "Laurea", "S", ["GEN|1"]), course("NEW9", "NUOVO NOME", "Laurea", "S", ["GEN|1"])] },
    sources: [rec("a-orario-anno-1", { live: false, total: 0, weeks: [0, 0, 0], weeksWithCells: 0, flags: ["NO_CELLS"] }), rec("b-orario-anno-1", { total: 10 }), rec("new-orario-anno-1")],
  });
  const d = diffSnapshots(before, after);
  assert.deepEqual(d.becameEmpty.map((c) => c.id), ["a-orario-anno-1"]);
  assert.deepEqual(d.added.map((c) => c.id), ["new-orario-anno-1"]);
  assert.deepEqual(d.removed.map((c) => c.id), ["gone-orario-anno-1"]);
  assert.deepEqual(d.cellsShift.map((c) => c.id), ["b-orario-anno-1"]);
  assert.deepEqual(d.newCourses.map((c) => c.valore), ["NEW9"]);
  assert.deepEqual(d.removedCourses.map((c) => c.valore), ["OLD9"]);
  assert.deepEqual(d.renumbered, [{ label: "nuovo nome", from: ["OLD9"], to: ["NEW9"] }]);
  assert.deepEqual(d.renamed, [{ valore: "C1", from: "PROG UNO", to: "PROG 1" }]);
  assert.ok(!isEmptyDiff(d));
  assert.ok(formatDiff(d).join("\n").includes("Sorgenti passate da live a vuote"));
  assert.ok(isEmptyDiff(diffSnapshots(before, before)));
});

/* ---------------------------------------------------------------- candidati */

test("candidatesFor: stesso codice con anno2 aggiornato, poi nome uguale con tipo compatibile (stessa scuola prima)", () => {
  const combo = [
    course("B100", "FISICA", "Laurea Magistrale", "S1", ["NEW|1", "NEW|2"]),
    course("B200", "FISICA", "Laurea Magistrale", "S2", ["GEN|1"]),
    course("B201", "FISICA", "Laurea Magistrale", "S1", ["GEN|1"]),
    course("B300", "FISICA", "Laurea", "S1", ["GEN|1"]),
    course("B400", "CHIMICA", "Laurea Magistrale", "S1", ["GEN|1"]),
  ];
  const y: YearModel = { year: 1, scuola: "S1", corso: "B100", anno2: ["OLD|1"] };
  const c = candidatesFor("Fisica (magistrale)", y, combo);
  assert.deepEqual(c.map((x) => `${x.kind}:${x.entry.valore}`), ["same-code:B100", "label:B201", "label:B200"]);
  assert.deepEqual(c[0].anno2, ["NEW|1"]);
  // anno2 gia' allineato al combo => nessun candidato same-code
  assert.deepEqual(candidatesFor("Fisica (magistrale)", { ...y, anno2: ["NEW|1"] }, combo).map((x) => x.kind), ["label", "label"]);
});

test("pickHit: preferisce i non 'ante', chiede in caso di ambiguita'", () => {
  const mk = (valore: string, label: string) => ({ candidate: { kind: "label" as const, entry: course(valore, label, "Laurea", "S", ["GEN|1"]), anno2: ["GEN|1"] }, scuola: "S", celle: 3 });
  assert.equal(pickHit([]).hit, undefined);
  assert.equal(pickHit([mk("A", "X")]).hit?.candidate.entry.valore, "A");
  assert.equal(pickHit([mk("A", "X (ante a.a. 2025-2026)"), mk("B", "X")]).hit?.candidate.entry.valore, "B");
  assert.ok(pickHit([mk("A", "X"), mk("B", "X")]).ambiguous?.includes("A,B"));
});

/* -------------------------------------------------------------------- piano */

const yp = (year: number, oldCorso: string, next?: string, over: Partial<ProgramPlan["years"][number]> = {}): ProgramPlan["years"][number] => {
  const old: YearModel = { year, scuola: "S", corso: oldCorso, anno2: [`GEN|${year}`] };
  return { year, action: next ? (next === oldCorso ? "kept" : "recaptured") : "removed", old, next: next ? { ...old, corso: next } : undefined, ...over };
};

test("finalizeProgram / buildPlan / planStats: esami rigidi e passaggio a manuale", () => {
  const p = finalizeProgram({ programme: "P", slug: "p", special: false, hadExams: true }, [yp(1, "A", "A", { appelli: 0 }), yp(2, "A", "A", { appelli: 4 })]);
  assert.equal(p.wantExams, true);
  const q = finalizeProgram({ programme: "Q", slug: "q", special: false, hadExams: true }, [yp(1, "B", "B", { appelli: 0 })]);
  assert.equal(q.wantExams, false);
  const r = finalizeProgram({ programme: "R", slug: "r", special: false, hadExams: false }, [yp(1, "C")]);
  const plan = buildPlan({ presetId: "t", aa: "2026", date: "2026-09-25", comboEmpty: false }, [p, q, r]);
  assert.equal(plan.toManual, false);
  const st = planStats(plan);
  assert.equal(st.programsBefore, 3);
  assert.equal(st.programsAfter, 2);
  assert.deepEqual(st.examsOff, ["Q"]);
  assert.deepEqual(st.removedPrograms, ["R"]);
  assert.equal(buildPlan({ presetId: "t", aa: "2026", date: "d", comboEmpty: true }, [p]).toManual, true);
  assert.equal(buildPlan({ presetId: "t", aa: "2026", date: "d", comboEmpty: false }, [r]).toManual, true);
});

/* ------------------------------------------------------------ patch preset */

const PRESET_FIXTURE = `import type { LiveProgram, UniversityPreset } from "../provider";
import { degreeSources } from "./easystaff";

const BASE = "base-fittizia";
const ANNO = "2026";

const livePrograms: LiveProgram[] = [
  {
    programme: "Alfa",
    sources: degreeSources(BASE, ANNO, "alfa", "S1", [
      { year: 1, corso: "A1", anno2: ["GEN|1"] },
      { year: 2, corso: "A1", anno2: ["GEN|2"] },
    ]),
  },
  {
    programme: "Beta",
    // nota da conservare
    sources: degreeSources(BASE, ANNO, "beta", "S1", [
      { year: 1, corso: "B1", anno2: ["GEN|1"] },
    ]),
  },
  {
    programme: "Gamma",
    sources: degreeSources(BASE, ANNO, "gamma", "S1", [
      { year: 1, corso: "G1", anno2: ["GEN|1"] },
    ], false),
  },
  {
    programme: "Delta",
    sources: degreeSources(BASE, ANNO, "delta", "S1", [
      { year: 1, corso: "D1", anno2: ["GEN|1"] },
    ]),
  },
];

export const fixture: UniversityPreset = {
  id: "fixture-preset",
  name: "Fixture",
  shortName: "Fix",
  city: "Nowhere",
  programme: "Alfa",
  liveSources: true,
  sources: [],
  livePrograms,
};
`;

const oldY = (year: number, corso: string, scuola = "S1"): YearModel => ({ year, scuola, corso, anno2: [`GEN|${year}`] });
const py = (year: number, corso: string, next: YearModel | undefined, action: ProgramPlan["years"][number]["action"], over: Partial<ProgramPlan["years"][number]> = {}): ProgramPlan["years"][number] => ({ year, action, old: oldY(year, corso), next, ...over });

function fixturePlan(): Plan {
  return buildPlan({ presetId: "fixture-preset", aa: "2026", date: "2026-09-25", comboEmpty: false }, [
    // Alfa: anno 1 ricatturato su A9 con nuova scuola, anno 2 rimosso; esami restano
    finalizeProgram({ programme: "Alfa", slug: "alfa", special: false, hadExams: true }, [
      py(1, "A1", { year: 1, scuola: "S2", corso: "A9", anno2: ["GEN|1", "X|1"] }, "recaptured", { appelli: 2 }),
      py(2, "A1", undefined, "removed", { reason: "0 celle" }),
    ]),
    // Beta: invariato ma senza appelli -> exams:false (commento conservato)
    finalizeProgram({ programme: "Beta", slug: "beta", special: false, hadExams: true }, [py(1, "B1", oldY(1, "B1"), "kept", { appelli: 0 })]),
    // Gamma: invariato, gia' solo-orari -> blocco identico
    finalizeProgram({ programme: "Gamma", slug: "gamma", special: false, hadExams: false }, [py(1, "G1", oldY(1, "G1"), "kept", { appelli: 0 })]),
    // Delta: tutto rimosso
    finalizeProgram({ programme: "Delta", slug: "delta", special: false, hadExams: true }, [py(1, "D1", undefined, "removed", { reason: "assente dal combo" })]),
  ]);
}

test("renderPresetPatch: ricattura, scuola, esami rigidi, rimozione, commenti e blocchi invariati", () => {
  const r = renderPresetPatch(PRESET_FIXTURE, fixturePlan());
  assert.deepEqual(r.changed, ["Alfa", "Beta"]);
  assert.deepEqual(r.removed, ["Delta"]);
  assert.match(r.text, /degreeSources\(BASE, ANNO, "alfa", "S2", \[\n {6}\{ year: 1, corso: "A9", anno2: \["GEN\|1", "X\|1"\] \},\n {4}\]\),/);
  assert.ok(!r.text.includes('year: 2, corso: "A1"'));
  assert.match(r.text, /\/\/ nota da conservare\n {4}sources: degreeSources\(BASE, ANNO, "beta", "S1", \[\n {6}\{ year: 1, corso: "B1", anno2: \["GEN\|1"\] \},\n {4}\], false\),/);
  assert.ok(r.text.includes('"gamma", "S1", [\n      { year: 1, corso: "G1", anno2: ["GEN|1"] },\n    ], false),'));
  assert.ok(!r.text.includes("Delta"));
  // idempotente sul risultato: rieseguire lo stesso piano non deve rompere il file
  assert.ok(r.text.includes("export const fixture"));
});

test("renderPresetPatch: programmi special non si toccano; anni con scuole diverse -> due degreeSources", () => {
  const special = buildPlan({ presetId: "x", aa: "2026", date: "d", comboEmpty: false }, [
    finalizeProgram({ programme: "Alfa", slug: "alfa", special: true, hadExams: true }, [py(1, "A1", undefined, "removed"), py(2, "A1", undefined, "removed")]),
  ]);
  const r = renderPresetPatch(PRESET_FIXTURE, special);
  assert.deepEqual(r.skipped, ["Alfa"]);
  assert.equal(r.text, PRESET_FIXTURE);
  const multi = buildPlan({ presetId: "x", aa: "2026", date: "d", comboEmpty: false }, [
    finalizeProgram({ programme: "Alfa", slug: "alfa", special: false, hadExams: true }, [
      py(1, "A1", { year: 1, scuola: "S1", corso: "A1", anno2: ["GEN|1"] }, "kept", { appelli: 1 }),
      py(2, "A1", { year: 2, scuola: "S3", corso: "N2", anno2: ["GEN|2"] }, "recaptured", { appelli: 1 }),
    ]),
  ]);
  const m = renderPresetPatch(PRESET_FIXTURE, multi).text;
  assert.match(m, /sources: \[\n {6}\.\.\.degreeSources\(BASE, ANNO, "alfa", "S1", \[/);
  assert.match(m, /\.\.\.degreeSources\(BASE, ANNO, "alfa", "S3", \[/);
});

test("renderManualConversion: livePrograms -> const di ripristino, liveSources:false, programmes; idempotente", () => {
  const r = renderManualConversion(PRESET_FIXTURE, "combo vuoto", "2026-09-25");
  assert.equal(r.applied, true);
  assert.equal(r.constName, "FIXTURE_LIVE_PROGRAMS_2026_27");
  assert.match(r.text, /export const FIXTURE_LIVE_PROGRAMS_2026_27: LiveProgram\[\] = \[/);
  assert.match(r.text, /liveSources: false,/);
  assert.match(r.text, /programmes: FIXTURE_LIVE_PROGRAMS_2026_27\.map\(\(lp\) => lp\.programme\),/);
  assert.ok(!/^ {2}livePrograms,$/m.test(r.text));
  assert.ok(!/^ {2}programme: "Alfa",$/m.test(r.text));
  assert.ok(r.text.includes('corso: "A1"'), "i codici originali restano");
  assert.equal(renderManualConversion(r.text, "x", "d").applied, false);
  assert.equal(restoreConstName("uniba", "2025"), "UNIBA_LIVE_PROGRAMS_2025_26");
});

/* ----------------------------------------------------------------- coverage */

test("renderCoverageSection + mergeCoverage: sezione con codici originali, sostituita (non duplicata) a parita' di anno", () => {
  const plan = fixturePlan();
  const extra = { comboCount: 12, weeks: 10, window: "2026-09-28..2026-11-30", examWindow: "2026-10-01..2027-09-30" };
  const s = renderCoverageSection(plan, extra);
  assert.match(s, /^## Ri-verifica anno accademico 2026\/27 - 2026-09-25/);
  assert.match(s, /Anni rimossi da livePrograms \(2; 1 programmi interi\)/);
  assert.match(s, /\| Alfa \| S1 \| 2 \| `A1` \| `GEN\\\|2` \| 0 celle \|/);
  assert.match(s, /Codici ricatturati \(1 anni\)/);
  assert.match(s, /Corsi passati a solo-orari \(exams:false\) - 1/);
  const md = "# Titolo\n\nIntro\n\n## Storico\n\ntabella\n";
  const once = mergeCoverage(md, s);
  assert.ok(once.indexOf("## Ri-verifica") < once.indexOf("## Storico"));
  const twice = mergeCoverage(once, renderCoverageSection(plan, extra));
  assert.equal(twice, once);
  const manual = renderCoverageSection({ ...plan, toManual: true, comboEmpty: true }, extra);
  assert.match(manual, /MODALITA' MANUALE/);
});

/* ----------------------------------------------------------- muri e igiene */

test("il codice del tool non contiene URL ne' endpoint letterali (muro #4)", () => {
  const root = path.resolve(__dirname, "../tools/ea-verify");
  const urlRe = new RegExp("https?:" + "//");
  const endpoint = ["combo", "php"].join(".");
  const files: string[] = [];
  const walk = (d: string) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else files.push(p);
    }
  };
  walk(root);
  assert.ok(files.length >= 8);
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    assert.ok(!urlRe.test(t), `URL letterale in ${f}`);
    assert.ok(!t.includes(endpoint), `endpoint letterale in ${f}`);
  }
});
