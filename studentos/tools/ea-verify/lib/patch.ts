import type { ComboCourse, Plan, ProgramPlan, YearModel, YearPlan } from "./types";
import { valoriForYear } from "./combo";
import { normalizeName, tipoCompatible, tipoOfProgramme } from "./match";

/* ------------------------------------------------------------------ candidati */

export interface Candidate {
  kind: "same-code" | "label";
  entry: ComboCourse;
  anno2: string[];
}

/**
 * Candidati di ricattura per UN anno di un programma, in ordine di priorita':
 *  1. stesso codice corso col elenco anno2 attuale del combo (se diverso dal vecchio);
 *  2. altri corsi con nome normalizzato UGUALE e tipo compatibile (stessa scuola prima).
 * Nessun codice viene inventato: ogni candidato esce dal combo e va poi confermato da un POST reale.
 */
export function candidatesFor(programme: string, y: YearModel, combo: ComboCourse[]): Candidate[] {
  const out: Candidate[] = [];
  const oldKey = JSON.stringify(y.anno2);
  for (const e of combo.filter((c) => c.valore === y.corso)) {
    const cur = valoriForYear(e, y.year);
    if (cur.length && JSON.stringify(cur) !== oldKey) out.push({ kind: "same-code", entry: e, anno2: cur });
  }
  const nm = normalizeName(programme);
  const want = tipoOfProgramme(programme);
  const labelHits = combo.filter((c) => c.valore !== y.corso && normalizeName(c.label) === nm && tipoCompatible(want, c.tipo));
  const ordered = [...labelHits.filter((c) => c.scuola === y.scuola), ...labelHits.filter((c) => c.scuola !== y.scuola)];
  for (const e of ordered) {
    const cur = valoriForYear(e, y.year);
    if (cur.length) out.push({ kind: "label", entry: e, anno2: cur });
  }
  return out;
}

export interface Hit {
  candidate: Candidate;
  scuola: string;
  celle: number;
}

/** Sceglie fra piu' candidati verificati: preferisce i non "ante a.a."; se ancora >1 => ambiguo (chiedere). */
export function pickHit(hits: Hit[]): { hit?: Hit; ambiguous?: string } {
  if (hits.length === 0) return {};
  let pool = hits;
  if (pool.length > 1) {
    const nonAnte = pool.filter((h) => !/ante/i.test(h.candidate.entry.label));
    if (nonAnte.length) pool = nonAnte;
  }
  if (pool.length === 1) return { hit: pool[0] };
  return { ambiguous: `piu' corsi verificano: ${pool.map((h) => h.candidate.entry.valore).join(",")}` };
}

/* ---------------------------------------------------------------------- piano */

export function finalizeProgram(base: Pick<ProgramPlan, "programme" | "slug" | "special" | "hadExams">, years: YearPlan[]): ProgramPlan {
  const live = years.filter((y) => y.next);
  const wantExams = live.some((y) => (y.appelli ?? 0) > 0);
  return { ...base, wantExams, years };
}

export function buildPlan(meta: { presetId: string; aa: string; date: string; comboEmpty: boolean }, programs: ProgramPlan[]): Plan {
  const liveYears = programs.reduce((n, p) => n + p.years.filter((y) => y.next).length, 0);
  return { ...meta, toManual: meta.comboEmpty || liveYears === 0, programs };
}

export const isLiveProgram = (p: ProgramPlan) => p.years.some((y) => y.next);

export interface PlanStats {
  programsBefore: number;
  programsAfter: number;
  yearsBefore: number;
  yearsAfter: number;
  kept: number;
  refreshed: number;
  recaptured: number;
  removed: number;
  ambiguous: number;
  examsOff: string[];
  /** Programmi solo-orari nel preset ma con appelli nella finestra: riattivabili. */
  examsOn: string[];
  removedPrograms: string[];
}

export function planStats(plan: Plan): PlanStats {
  const yrs = plan.programs.flatMap((p) => p.years);
  const count = (a: YearPlan["action"]) => yrs.filter((y) => y.action === a).length;
  return {
    programsBefore: plan.programs.length,
    programsAfter: plan.programs.filter(isLiveProgram).length,
    yearsBefore: yrs.length,
    yearsAfter: yrs.filter((y) => y.next).length,
    kept: count("kept"),
    refreshed: count("refreshed"),
    recaptured: count("recaptured"),
    removed: count("removed"),
    ambiguous: count("ambiguous"),
    examsOff: plan.programs.filter((p) => isLiveProgram(p) && p.hadExams && !p.wantExams).map((p) => p.programme),
    examsOn: plan.programs.filter((p) => isLiveProgram(p) && !p.hadExams && p.wantExams).map((p) => p.programme),
    removedPrograms: plan.programs.filter((p) => !isLiveProgram(p)).map((p) => p.programme),
  };
}

/* ----------------------------------------------------------- patch del preset */

const BLOCK_RE =
  /  \{\n    programme: ("(?:[^"\\]|\\.)*"),\n((?:    \/\/[^\n]*\n)*)(    sources: degreeSources\([^\n]*\[)\n([\s\S]*?)\n    \](\)|, false\)),\n  \},\n/g;

export interface PatchResult {
  text: string;
  changed: string[];
  removed: string[];
  skipped: string[];
}

const yearLine = (y: YearModel) =>
  `      { year: ${y.year}, corso: ${JSON.stringify(y.corso)}, anno2: [${y.anno2.map((a) => JSON.stringify(a)).join(", ")}] },`;

/** Riscrive i blocchi programma del file preset (testo LF) secondo il piano. I programmi `special` o in forma non standard non si toccano. */
export function renderPresetPatch(text: string, plan: Plan): PatchResult {
  const byName = new Map(plan.programs.map((p) => [p.programme, p]));
  const changed: string[] = [];
  const removed: string[] = [];
  const skipped: string[] = [];
  const out = text.replace(BLOCK_RE, (all: string, pn: string, comments: string, head0: string, _years: string, tail: string) => {
    const name = JSON.parse(pn) as string;
    const p = byName.get(name);
    if (!p) return all;
    if (p.special) {
      skipped.push(name);
      return all;
    }
    const live = p.years.filter((y) => y.next);
    if (live.length === 0) {
      removed.push(name);
      return "";
    }
    const oldExams = tail === ")";
    const sameYears = p.years.every((y) => y.next && JSON.stringify(y.next) === JSON.stringify(y.old));
    if (sameYears && oldExams === p.wantExams) return all;
    const scuole = [...new Set(live.map((y) => (y.next as YearModel).scuola))];
    const oldScuola = p.years[0].old.scuola;
    const closing = p.wantExams ? ")" : ", false)";
    changed.push(name);
    if (scuole.length === 1) {
      const head = scuole[0] !== oldScuola ? head0.replace(JSON.stringify(oldScuola), JSON.stringify(scuole[0])) : head0;
      const lines = live.map((y) => yearLine(y.next as YearModel)).join("\n");
      return `  {\n    programme: ${pn},\n${comments}${head}\n${lines}\n    ]${closing},\n  },\n`;
    }
    const parts = scuole.map((s) => {
      const h = head0.replace(JSON.stringify(oldScuola), JSON.stringify(s)).replace("    sources: ", "      ...");
      const lines = live
        .filter((y) => (y.next as YearModel).scuola === s)
        .map((y) => yearLine(y.next as YearModel).replace(/^ {6}/, "        "))
        .join("\n");
      return `${h}\n${lines}\n      ]${closing}`;
    });
    return `  {\n    programme: ${pn},\n${comments}    sources: [\n${parts.join(",\n")},\n    ],\n  },\n`;
  });
  return { text: out, changed, removed, skipped };
}

/** Nome della const che conserva i codici originali quando il preset passa a manuale. */
export function restoreConstName(presetVar: string, anno: string): string {
  const yy = String((Number(anno) + 1) % 100).padStart(2, "0");
  return `${presetVar.toUpperCase()}_LIVE_PROGRAMS_${anno}_${yy}`;
}

export interface ManualResult {
  text: string;
  constName: string;
  applied: boolean;
}

/**
 * Preset -> modalita' manuale: la const `livePrograms` diventa un export di ripristino,
 * il preset esportato passa a liveSources:false con `programmes` = nomi dei corsi.
 */
export function renderManualConversion(text: string, reason: string, date: string): ManualResult {
  const annoM = /const ANNO = "(\d{4})"/.exec(text);
  const presetM = /export const (\w+): UniversityPreset = \{/.exec(text);
  const liveM = /const livePrograms: LiveProgram\[\] = \[/.exec(text);
  if (!annoM || !presetM || !liveM || /liveSources: false/.test(text)) return { text, constName: "", applied: false };
  const constName = restoreConstName(presetM[1], annoM[1]);
  let t = text.replace(
    liveM[0],
    `/**\n * MANUAL MODE since ${date} - original ${annoM[1]}/${(Number(annoM[1]) + 1) % 100} live wiring kept verbatim ONLY to restore it\n * later (not referenced by the preset below). Reason: ${reason}\n * Re-verify with tools/ea-verify, then move these back into \`livePrograms\`, set \`liveSources: true\` and bump ANNO.\n */\nexport const ${constName}: LiveProgram[] = [`,
  );
  const start = t.indexOf(`export const ${presetM[1]}: UniversityPreset = {`);
  const head = t.slice(0, start);
  let block = t.slice(start);
  block = block.replace(/  programme: "[^"\n]*",\n/, "").replace("  liveSources: true,", `  programmes: ${constName}.map((lp) => lp.programme),\n  liveSources: false,`).replace(/  livePrograms,\n/, "");
  t = head + block;
  return { text: t, constName, applied: true };
}

/* ------------------------------------------------------------------- coverage */

const esc = (s: string) => s.replace(/\|/g, "\\|");

export function renderCoverageSection(plan: Plan, extra: { comboCount: number; weeks: number; window: string; examWindow: string }): string {
  const st = planStats(plan);
  const L: string[] = [];
  L.push(`## Ri-verifica anno accademico ${plan.aa}/${(Number(plan.aa) + 1) % 100} - ${plan.date}`);
  L.push("");
  L.push(
    `Generato da \`tools/ea-verify\`: combo dell'anno ${plan.aa} (${extra.comboCount} corsi) + ${extra.weeks} POST settimanali a grid_call (${extra.window}; live solo con celle > 0 in almeno una settimana) + test_call (finestra ${extra.examWindow}, nessun fallback sull'anno precedente). Nessun codice inventato: ogni ricattura e' confermata da una risposta reale non vuota.`,
  );
  L.push("");
  if (plan.toManual) L.push(`**Preset passato a MODALITA' MANUALE** (${plan.comboEmpty ? "combo vuoto: il sistema non ha ancora l'anno" : "nessuna sorgente live rimasta"}). I codici originali sono conservati nel file preset per il ripristino.`, "");
  L.push(`- Programmi prima: **${st.programsBefore}** - dopo: **${st.programsAfter}** (rimossi interi: ${st.removedPrograms.length})`);
  L.push(`- Anni-orario prima: **${st.yearsBefore}** - dopo: **${st.yearsAfter}** (invariati: ${st.kept}, aggiornati: ${st.refreshed}, ricatturati: ${st.recaptured}, rimossi: ${st.removed}, ambigui non applicati: ${st.ambiguous})`);
  L.push(`- Le tabelle per scuola piu' sotto sono lo storico della verifica precedente e NON sono rigenerate: fa fede questa sezione.`);
  L.push("");
  if (st.examsOff.length) {
    L.push(`### Corsi passati a solo-orari (exams:false) - ${st.examsOff.length}`, "");
    L.push("Regola rigida: `exams:false` se test_call non ha appelli nella finestra del nuovo anno. Da riattivare quando pubblicano i calendari.", "");
    for (const n of st.examsOff) L.push(`- ${n}`);
    L.push("");
  }
  const recaptured = plan.programs.flatMap((p) => p.years.filter((y) => y.next && y.action !== "kept").map((y) => ({ p, y })));
  if (recaptured.length) {
    L.push(`### Codici ricatturati (${recaptured.length} anni)`, "", "| Corso | Anno | corso prima -> dopo | anno2 prima -> dopo |", "|---|---|---|---|");
    for (const { p, y } of recaptured) {
      const n = y.next as YearModel;
      L.push(`| ${esc(p.programme)} | ${y.year} | \`${y.old.corso}\` -> \`${n.corso}\` | \`${esc(y.old.anno2.join(", "))}\` -> \`${esc(n.anno2.join(", "))}\` |`);
    }
    L.push("");
  }
  const dropped = plan.programs.flatMap((p) => p.years.filter((y) => !y.next).map((y) => ({ p, y })));
  if (dropped.length) {
    L.push(`### Anni rimossi da livePrograms (${dropped.length}; ${st.removedPrograms.length} programmi interi)`, "");
    L.push("Restano disponibili in modalita' manuale. Codici originali (scuola + corso + anno2) conservati per il ripristino.", "");
    L.push("| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |", "|---|---|---|---|---|---|");
    for (const { p, y } of dropped) {
      L.push(`| ${esc(p.programme)} | ${esc(y.old.scuola || "(nessuna)")} | ${y.year} | \`${y.old.corso}\` | \`${esc(y.old.anno2.join(", "))}\` | ${esc(y.reason ?? y.action)} |`);
    }
    L.push("");
  }
  return L.join("\n");
}

/** Inserisce/sostituisce la sezione nel coverage md (testo LF): dopo l'intro, prima del primo `## `. */
export function mergeCoverage(md: string, section: string): string {
  const heading = section.split("\n")[0];
  const prefix = heading.replace(/ - \d{4}-\d{2}-\d{2}$/, "");
  let t = md;
  const re = new RegExp(`\\n${prefix.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")} - [^\\n]*\\n[\\s\\S]*?(?=\\n## |$)`);
  t = t.replace(re, "");
  const i = t.indexOf("\n## ");
  const body = section.endsWith("\n") ? section : section + "\n";
  if (i < 0) return `${t.replace(/\n*$/, "\n")}\n${body}`;
  return `${t.slice(0, i + 1)}${body}\n${t.slice(i + 1)}`;
}
