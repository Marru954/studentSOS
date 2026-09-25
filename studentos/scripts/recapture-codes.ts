/**
 * Ri-cattura dei codici EasyAcademy dal combo dell'anno corrente.
 *
 * Per ogni preset live "uniforme" (file generato, senza codice a mano):
 *  1. round-trip: rigenera il testo di `livePrograms` dai dati attuali e lo
 *     confronta col file → se differisce, il file NON viene toccato;
 *  2. scarica `combo.php?sw=ec_&aa=<ANNO>&page=corsi` (GET reale);
 *  3. per ogni corso già presente (match per nome) ricostruisce gli anni dai
 *     codici del combo, e tiene SOLO gli anni per cui grid_call.php restituisce
 *     `celle > 0` su almeno una settimana campione (POST reale);
 *  4. i corsi senza nessun anno verificato escono da `livePrograms` (= manuale).
 * Nessun codice è inventato: ogni `corso`/`anno2` scritto viene dal combo ed è
 * stato visto tornare celle. I corsi nuovi nel combo NON vengono aggiunti (solo
 * elencati nel report).
 *
 * Uso: tsx scripts/recapture-codes.ts <report.json> [--write] [--exams-rule] [presetId ...]
 *   --exams-rule: regola esami RIGIDA, un anno tiene la sorgente esami solo se test_call.php ha appelli nell'anno accademico corrente.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { UNIVERSITY_PRESETS } from "../src/lib/sync/universities";
import type { LiveProgram, UniversityPreset } from "../src/lib/sync/provider";

const ANNO_TARGET = "2026";
const WEEKS = ["12-10-2026", "09-11-2026", "07-12-2026", "02-11-2026", "14-12-2026", "08-03-2027"];
const PER_HOST = 4;
const DIR = join(__dirname, "..", "src", "lib", "sync", "universities");

interface ComboCourse {
  valore: string;
  label: string;
  scuola?: string;
  elenco_anni?: { valore: string }[];
}
type Year = { year: number; corso: string; anno2: string[]; ex?: boolean };
interface Prog {
  programme: string;
  slug: string;
  scuola: string;
  anno: string;
  exams: boolean;
  years: Year[];
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

async function http(url: string, init?: RequestInit, tries = 3): Promise<Response> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, redirect: "manual", signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw last;
}

async function combo(base: string, anno: string): Promise<ComboCourse[] | null> {
  try {
    const t = await (await http(`${base}/combo.php?sw=ec_&aa=${anno}&page=corsi`)).text();
    const m = t.match(/var elenco_corsi = (\[[\s\S]*?\]);\s*\n?/);
    return m ? (JSON.parse(m[1]) as ComboCourse[]) : null;
  } catch {
    return null;
  }
}

async function celle(base: string, anno: string, scuola: string, corso: string, anno2: string[], week: string) {
  const body = new URLSearchParams();
  const f: [string, string][] = [
    ["view", "easycourse"], ["form-type", "corso"], ["include", "corso"], ["anno", anno],
    ["scuola", scuola], ["corso", corso], ...anno2.map((a) => ["anno2[]", a] as [string, string]),
    ["date", week], ["_lang", "it"], ["all_events", "0"],
  ];
  for (const [k, v] of f) body.append(k, v);
  const j = (await (await http(`${base}/grid_call.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })).json()) as { celle?: unknown[] };
  return Array.isArray(j.celle) ? j.celle.length : 0;
}

const EXAM_RULE = process.argv.includes("--exams-rule");
const EXAM_FROM = "01-09-2026";
const EXAM_TO = "31-08-2027";

/** Appelli totali che test_call.php restituisce per (scuola, corso, anno) sull'anno accademico; -1 se la rete fallisce. */
async function appelli(base: string, scuola: string, cdl: string, year: number): Promise<number> {
  const body = new URLSearchParams();
  for (const [k, v] of [
    ["view", "easytest"], ["form-type", "et_cdl"], ["include", "et_cdl"], ["et_er", "1"], ["scuola", scuola],
    ["esami_cdl", cdl], ["anno2[]", String(year)], ["datefrom", EXAM_FROM], ["dateto", EXAM_TO], ["_lang", "it"],
  ]) body.append(k, v);
  try {
    const j = (await (await http(`${base}/test_call.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })).json()) as { Insegnamenti?: Record<string, { Appelli?: unknown[] }> };
    return Object.values(j.Insegnamenti ?? {}).reduce((n, c) => n + (Array.isArray(c.Appelli) ? c.Appelli.length : 0), 0);
  } catch {
    return -1;
  }
}

async function alive(base: string, anno: string, scuola: string, corso: string, anno2: string[]) {
  for (const w of WEEKS) {
    try {
      if ((await celle(base, anno, scuola, corso, anno2, w)) > 0) return true;
    } catch {
      /* rete: prova la settimana dopo */
    }
  }
  return false;
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}

/** Programmi con id "slug-orario-anno-N" (N anche negativo, es. Unisa). Gli altri (es. Informatica di Tor Vergata, id nudi) restano a mano. */
const isStd = (lp: LiveProgram) => lp.sources.some((s) => /-orario-anno--?\d+$/.test(s.id));

/** Il timetable `<slug>-orario-anno-N` ha la sorgente esami gemella `<slug>-esami-anno-N`? */
const hasExam = (lp: LiveProgram, orarioId: string) =>
  lp.sources.some((x) => x.capability === "exams" && x.id === orarioId.replace("-orario-anno-", "-esami-anno-"));

function toProgs(lps: LiveProgram[]): Prog[] {
  return lps.filter(isStd).map((lp) => {
    const ts = lp.sources.filter((s) => s.capability === "timetable");
    const p0 = ts[0].params as Record<string, string>;
    const slug = ts[0].id.replace(/-orario-anno--?\d+$/, "");
    return {
      programme: lp.programme,
      slug,
      scuola: p0.scuola,
      anno: p0.anno,
      exams: ts.every((s) => hasExam(lp, s.id)),
      years: ts.map((s) => {
        const p = s.params as Record<string, unknown>;
        return { year: Number(/-orario-anno-(-?\d+)$/.exec(s.id)![1]), corso: String(p.corso), anno2: p.anno2 as string[], ex: hasExam(lp, s.id) };
      }),
    };
  });
}

function emit(progs: Prog[], annoConst: (a: string) => string | null, roma2 = false): string | null {
  const out: string[] = [];
  for (const p of progs) {
    const c = annoConst(p.anno);
    if (!c) return null;
    out.push("  {");
    out.push(`    programme: ${JSON.stringify(p.programme)},`);
    const call = roma2
      ? `degreeSources(${JSON.stringify(p.slug)}, ${JSON.stringify(p.scuola)}, [`
      : `degreeSources(BASE, ${c}, ${JSON.stringify(p.slug)}, ${JSON.stringify(p.scuola)}, [`;
    const yl = (y: Year) => `      { year: ${y.year}, corso: ${JSON.stringify(y.corso)}, anno2: [${y.anno2.map((a) => JSON.stringify(a)).join(", ")}] },`;
    const exOf = (y: Year) => y.ex ?? p.exams;
    if (p.years.every((y) => exOf(y) === exOf(p.years[0]))) {
      out.push(`    sources: ${call}`);
      for (const y of p.years) out.push(yl(y));
      out.push(`    ]${exOf(p.years[0]) || roma2 ? "" : ", false"}),`);
    } else {
      // esami solo su alcuni anni: un blocco per ogni tratto consecutivo con lo stesso flag
      out.push("    sources: [");
      for (let i = 0; i < p.years.length; ) {
        let j = i;
        while (j < p.years.length && exOf(p.years[j]) === exOf(p.years[i])) j++;
        out.push(`      ...${call}`);
        for (const y of p.years.slice(i, j)) out.push(yl(y));
        out.push(`      ]${exOf(p.years[i]) ? "" : ", false"}),`);
        i = j;
      }
      out.push("    ],");
    }
    out.push("  },");
  }
  return out.join("\n");
}

const SMALL = new Set(["a","al","alla","con","dei","degli","del","della","delle","dello","di","e","ed","i","il","in","la","le","lo","nel","nella","nei","per","sul","sulla"]);
const titleCase = (label: string) =>
  label.toLowerCase().split(/\s+/).map((t) => (/^[a-zà-ÿ]/.test(t) && !SMALL.has(t) ? t[0].toUpperCase() + t.slice(1) : t)).join(" ");
const slugOf = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const START = "const livePrograms: LiveProgram[] = [\n";

const ANNO_PREV = "2025";
const YEAR_WORDS =
  /\b(primo|secondo|terzo|quarto|quinto|sesto)\s+anno\b|\(\s*(?:i|ii|iii|iv|v|vi|[1-6])\s*anno\s*\)|\b(?:i|ii|iii|iv|v|vi|[1-6])\s*[°º]?\s*anno\b|\b\d{2}\/\d{2}\b|\bante\s+a\.?\s?a\.?[^)]*/gi;
/** Etichetta senza le parole "di anno" (primo anno, 25/26, ...), per riconoscere lo stesso corso tra un anno e l'altro. */
const stem = (s: string) => s.toLowerCase().replace(YEAR_WORDS, " ").replace(/_/g, " ").replace(/[^a-z0-9à-ÿ]+/g, " ").trim();
const displayName = (label: string) =>
  titleCase(label.replace(YEAR_WORDS, " ").replace(/_([a-z]+)/gi, " - $1").replace(/\s*-\s*$/, "").replace(/\s+/g, " ").trim());

const yearGroups = (c: ComboCourse) => {
  const g = new Map<number, string[]>();
  for (const an of c.elenco_anni ?? []) {
    const n = Number(an.valore.split("|").pop());
    if (Number.isInteger(n) && n !== 0) g.set(n, [...(g.get(n) ?? []), an.valore]);
  }
  return g;
};

async function doPreset(preset: UniversityPreset, write: boolean, report: Record<string, unknown>[]) {
  const id = preset.id;
  const file = join(DIR, `${id.split("-")[0]}.ts`);
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const a = raw.indexOf(START);
  const b = raw.indexOf("];\n", a);
  if (a < 0 || b < 0) return report.push({ id, status: "skip", why: "struttura file non riconosciuta" });
  const head = raw.slice(0, a + START.length);
  const body = raw.slice(a + START.length, b);
  const tail = raw.slice(b);
  const roma2 = id.startsWith("uniroma2");
  const prefix = roma2 ? "  informatica,\n" : "";
  // confronto semantico: ignora spazi e virgole finali (file scritti a mano con formattazione diversa)
  const sq = (t: string) => t.replace(/\s+/g, "").replace(/,(?=[\]\)}])/g, "");
  const annoDefs = new Map<string, string>();
  for (const m of raw.matchAll(/^const (ANNO\w*) = "(\d{4})";/gm)) annoDefs.set(m[2], m[1]);
  const annoConst = (an: string) => annoDefs.get(an) ?? null;

  const progs = toProgs(preset.livePrograms!);
  const want = sq(prefix + (emit(progs, annoConst, roma2) ?? "\u0000"));
  const have = sq(body.replace(/\/\/[^\n]*/g, ""));
  if (want !== have) {
    let i = 0;
    while (i < want.length && want[i] === have[i]) i++;
    return report.push({ id, status: "skip", why: "round-trip diverso: file non uniforme (codice a mano)", primaDivergenza: { atteso: want.slice(Math.max(0, i - 60), i + 80), file: have.slice(Math.max(0, i - 60), i + 80) } });
  }

  const base = (preset.livePrograms![0].sources[0].params as Record<string, string>).baseUrl;
  const cat = await combo(base, ANNO_TARGET);
  if (!cat || !cat.length) return report.push({ id, status: "skip", why: `combo ${ANNO_TARGET} vuoto/irraggiungibile` });
  const prev = (await combo(base, ANNO_PREV)) ?? [];
  const prevLabel = new Map(prev.map((c) => [c.valore, c.label]));

  const mine = progs.filter((p) => p.anno === ANNO_TARGET);
  // identità di un vecchio programma = stem delle etichette 2025 dei suoi codici (o del suo nome se il codice non c'è più)
  const stems = new Map<Prog, Set<string>>();
  for (const p of mine) stems.set(p, new Set(p.years.map((y) => stem(prevLabel.get(y.corso) ?? p.programme))));
  const claimedBy = new Map<string, Prog>();
  const cands = new Map<Prog, ComboCourse[]>();
  const add = (p: Prog, c: ComboCourse) => { cands.set(p, [...(cands.get(p) ?? []), c]); claimedBy.set(c.valore, p); };
  // 1) continuità per codice: stesso `valore` e stessa etichetta-stem
  for (const p of mine)
    for (const c of cat) {
      if (claimedBy.has(c.valore) || !p.years.some((y) => y.corso === c.valore)) continue;
      if (stems.get(p)!.has(stem(c.label))) add(p, c);
    }
  // 2) codice rinumerato: stessa etichetta-stem, ma solo se identifica UN solo programma
  const owners = new Map<string, Prog[]>();
  for (const p of mine) for (const s of stems.get(p)!) owners.set(s, [...(owners.get(s) ?? []), p]);
  for (const c of cat) {
    if (claimedBy.has(c.valore)) continue;
    const o = owners.get(stem(c.label));
    if (o && o.length === 1) add(o[0], c);
  }

  type Job = { p: Prog; c: ComboCourse; year: number; anno2: string[]; scuola: string };
  const jobs: Job[] = [];
  const jobsFor = (p: Prog, cs: ComboCourse[]) => {
    for (const c of cs)
      for (const [year, anno2] of yearGroups(c))
        jobs.push({ p, c, year, anno2, scuola: typeof c.scuola === "string" ? c.scuola : p.scuola });
  };
  for (const p of mine) jobsFor(p, cands.get(p) ?? []);

  // corsi nuovi (mai visti): uno stem senza sovrapposizione di anni = un programma nuovo
  const taken = new Set(progs.map((p) => norm(p.programme)));
  const freshByStem = new Map<string, ComboCourse[]>();
  for (const c of cat) if (!claimedBy.has(c.valore)) freshByStem.set(stem(c.label), [...(freshByStem.get(stem(c.label)) ?? []), c]);
  const newProgs: Prog[] = [];
  const ambiguous: string[] = [];
  for (const [st, cs] of freshByStem) {
    if (!st || owners.has(st)) { ambiguous.push(cs[0].label); continue; }
    const all = cs.flatMap((c) => [...yearGroups(c).keys()]);
    if (new Set(all).size !== all.length) { ambiguous.push(cs[0].label); continue; }
    const name = displayName(cs[0].label);
    if (!slugOf(name) || taken.has(norm(name))) { ambiguous.push(cs[0].label); continue; }
    taken.add(norm(name));
    const np: Prog = { programme: name, slug: slugOf(name), scuola: typeof cs[0].scuola === "string" ? cs[0].scuola : "", anno: ANNO_TARGET, exams: false, years: [] };
    newProgs.push(np);
    jobsFor(np, cs);
  }

  const okYears = new Map<Prog, Map<number, Job>>();
  await pool(jobs, PER_HOST, async (j) => {
    if (!(await alive(base, ANNO_TARGET, j.scuola, j.c.valore, j.anno2))) return;
    const m = okYears.get(j.p) ?? new Map<number, Job>();
    const cur = m.get(j.year);
    // a parità di anno vince il corso con continuità di codice (già in `cands`, quindi prima nell'elenco)
    if (!cur) m.set(j.year, j);
    okYears.set(j.p, m);
  });

  // esami: il flag dell'anno vecchio con lo stesso numero; un anno nuovo eredita il flag solo se il programma era uniforme
  const exOld = (p: Prog, year: number) => {
    const uniform = p.years.every((y) => y.ex === p.years[0].ex);
    return p.years.find((y) => y.year === year)?.ex ?? (uniform ? p.years[0]?.ex : false) ?? false;
  };
  // regola esami RIGIDA (--exams-rule): l'anno tiene la sorgente esami solo se test_call ha appelli nel 2026/27,
  // senza fallback sul 2025/26. Un errore di rete NON spegne (n < 0 → si tiene il flag com'era).
  const examOk = new Map<Job, boolean>();
  if (EXAM_RULE) {
    const toCheck = [...okYears.entries()].flatMap(([p, m]) => [...m.values()].filter((j) => exOld(p, j.year)));
    await pool(toCheck, PER_HOST, async (j) => {
      examOk.set(j, (await appelli(base, j.scuola, j.c.valore, j.year)) !== 0);
    });
  }

  const stats = { kept: 0, changed: 0, dropped: 0, untouched: progs.length - mine.length, examsOff: 0 };
  const build = (p: Prog): Prog | null => {
    const m = okYears.get(p);
    if (!m || !m.size) return null;
    const js = [...m.values()].sort((x, y) => x.year - y.year);
    const scs = js.map((j) => j.scuola);
    const scuola = scs.sort((x, y) => scs.filter((s) => s === y).length - scs.filter((s) => s === x).length)[0];
    return {
      ...p,
      scuola,
      years: js.map((j) => {
        const ex = exOld(p, j.year) && (!EXAM_RULE || examOk.get(j) === true);
        if (exOld(p, j.year) && !ex) stats.examsOff++;
        return { year: j.year, corso: j.c.valore, anno2: j.anno2, ex };
      }),
    };
  };
  const final: Prog[] = [];
  for (const p of progs) {
    if (p.anno !== ANNO_TARGET) { final.push(p); continue; }
    const n = build(p);
    if (!n) { stats.dropped++; continue; }
    stats[JSON.stringify(n.years) === JSON.stringify(p.years) && n.scuola === p.scuola ? "kept" : "changed"]++;
    final.push(n);
  }
  let added = 0;
  for (const np of newProgs) {
    const n = build(np);
    if (n) { final.push(n); added++; }
  }
  const text = prefix + emit(final, annoConst, roma2)!;
  if (write) writeFileSync(file, head + text + "\n" + tail);
  const res = { ...stats, aggiunti: added, programmiOra: final.length, corsiNonAssegnati: ambiguous.length };
  report.push({ id, status: write ? "scritto" : "dry-run", ...res, nonAssegnatiEsempi: ambiguous.slice(0, 10) });
  console.log(id, JSON.stringify(res));
}

async function main() {
  const args = process.argv.slice(2);
  const out = args[0];
  const write = args.includes("--write");
  const only = new Set(args.slice(1).filter((x) => !x.startsWith("--")));
  const report: Record<string, unknown>[] = [];
  const presets = UNIVERSITY_PRESETS.filter((p) => p.livePrograms?.length && (!only.size || only.has(p.id)));
  await Promise.all(presets.map((p) => doPreset(p, write, report).catch((e) => report.push({ id: p.id, status: "errore", why: String(e) }))));
  writeFileSync(out, JSON.stringify(report, null, 1));
  for (const r of report) if (r.status === "skip" || r.status === "errore") console.log("SKIP", r.id, r.why);
}

main();
