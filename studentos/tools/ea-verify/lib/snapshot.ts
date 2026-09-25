import type { ComboCourse, Snapshot, SourceRecord } from "./types";
import { normalizeName } from "./match";

/** JSON leggibile e stabile nei diff git: gli array di soli numeri/stringhe stanno su una riga. */
export function serializeSnapshot(s: Snapshot): string {
  const sorted: Snapshot = {
    ...s,
    combo: { ...s.combo, entries: [...s.combo.entries].sort((a, b) => a.valore.localeCompare(b.valore) || a.scuola.localeCompare(b.scuola)) },
    sources: [...s.sources].sort((a, b) => a.id.localeCompare(b.id)),
  };
  const raw = JSON.stringify(sorted, null, 1);
  return (
    raw.replace(/\[\s+((?:-?\d+|"(?:[^"\\]|\\.)*")(?:,\s+(?:-?\d+|"(?:[^"\\]|\\.)*"))*)\s+\]/g, (_m, inner: string) => `[${inner.replace(/,\s+/g, ", ")}]`) + "\n"
  );
}

export function parseSnapshot(text: string): Snapshot {
  const v = JSON.parse(text) as Snapshot;
  if (v.tool !== "ea-verify" || v.version !== 1) throw new Error("snapshot non riconosciuto");
  return v;
}

export interface SourceChange {
  id: string;
  programme: string;
  kind: "timetable" | "exams";
  before?: SourceRecord;
  after?: SourceRecord;
}

export interface SnapshotDiff {
  comboBefore: number;
  comboAfter: number;
  comboStatusBefore: string;
  comboStatusAfter: string;
  newCourses: ComboCourse[];
  removedCourses: ComboCourse[];
  renamed: { valore: string; from: string; to: string }[];
  /** Stesso nome normalizzato, codici diversi: probabile rinumerazione. */
  renumbered: { label: string; from: string[]; to: string[] }[];
  becameEmpty: SourceChange[];
  becameLive: SourceChange[];
  added: SourceChange[];
  removed: SourceChange[];
  /** Live prima e dopo ma con celle totali molto diverse (< meta' o > doppio). */
  cellsShift: SourceChange[];
  flagsChanged: SourceChange[];
}

const key = (c: ComboCourse) => `${c.valore}\u0000${c.scuola}`;

export function diffSnapshots(a: Snapshot, b: Snapshot): SnapshotDiff {
  const aC = new Map(a.combo.entries.map((c) => [key(c), c]));
  const bC = new Map(b.combo.entries.map((c) => [key(c), c]));
  const newCourses = [...bC.values()].filter((c) => !aC.has(key(c)));
  const removedCourses = [...aC.values()].filter((c) => !bC.has(key(c)));
  const renamed: SnapshotDiff["renamed"] = [];
  for (const [k, c] of bC) {
    const o = aC.get(k);
    if (o && o.label !== c.label) renamed.push({ valore: c.valore, from: o.label, to: c.label });
  }
  const byLabel = (list: ComboCourse[]) => {
    const m = new Map<string, string[]>();
    for (const c of list) {
      const n = normalizeName(c.label);
      m.set(n, [...(m.get(n) ?? []), c.valore]);
    }
    return m;
  };
  const rem = byLabel(removedCourses);
  const add = byLabel(newCourses);
  const renumbered: SnapshotDiff["renumbered"] = [];
  for (const [n, from] of rem) {
    const to = add.get(n);
    if (to) renumbered.push({ label: n, from: [...new Set(from)], to: [...new Set(to)] });
  }

  const aS = new Map(a.sources.map((s) => [s.id, s]));
  const bS = new Map(b.sources.map((s) => [s.id, s]));
  const mk = (before?: SourceRecord, after?: SourceRecord): SourceChange => {
    const s = (after ?? before) as SourceRecord;
    return { id: s.id, programme: s.programme, kind: s.kind, before, after };
  };
  const becameEmpty: SourceChange[] = [];
  const becameLive: SourceChange[] = [];
  const added: SourceChange[] = [];
  const removed: SourceChange[] = [];
  const cellsShift: SourceChange[] = [];
  const flagsChanged: SourceChange[] = [];
  for (const [id, after] of bS) {
    const before = aS.get(id);
    if (!before) {
      added.push(mk(undefined, after));
      continue;
    }
    if (before.live && !after.live) becameEmpty.push(mk(before, after));
    else if (!before.live && after.live) becameLive.push(mk(before, after));
    else if (before.live && after.live && before.kind === "timetable" && (after.total < before.total / 2 || after.total > before.total * 2)) cellsShift.push(mk(before, after));
    if (before.flags.join() !== after.flags.join()) flagsChanged.push(mk(before, after));
  }
  for (const [id, before] of aS) if (!bS.has(id)) removed.push(mk(before, undefined));

  return {
    comboBefore: a.combo.count,
    comboAfter: b.combo.count,
    comboStatusBefore: a.combo.status,
    comboStatusAfter: b.combo.status,
    newCourses,
    removedCourses,
    renamed,
    renumbered,
    becameEmpty,
    becameLive,
    added,
    removed,
    cellsShift,
    flagsChanged,
  };
}

export function isEmptyDiff(d: SnapshotDiff): boolean {
  return (
    d.comboBefore === d.comboAfter &&
    d.comboStatusBefore === d.comboStatusAfter &&
    !d.newCourses.length &&
    !d.removedCourses.length &&
    !d.renamed.length &&
    !d.becameEmpty.length &&
    !d.becameLive.length &&
    !d.added.length &&
    !d.removed.length &&
    !d.cellsShift.length &&
    !d.flagsChanged.length
  );
}

const cap = (lines: string[], n = 25): string[] => (lines.length > n ? [...lines.slice(0, n), `  ... (+${lines.length - n})`] : lines);

export function formatDiff(d: SnapshotDiff): string[] {
  const out: string[] = [];
  out.push(`Combo: ${d.comboBefore} (${d.comboStatusBefore}) -> ${d.comboAfter} (${d.comboStatusAfter})`);
  const sec = (title: string, lines: string[]) => {
    if (lines.length) out.push("", `${title} (${lines.length})`, ...cap(lines.map((l) => `  - ${l}`)));
  };
  const src = (c: SourceChange) => `${c.programme} / ${c.id}`;
  sec("Sorgenti passate da live a vuote", d.becameEmpty.map(src));
  sec("Sorgenti passate da vuote a live", d.becameLive.map(src));
  sec("Sorgenti nuove nel preset", d.added.map(src));
  sec("Sorgenti sparite dal preset", d.removed.map(src));
  sec("Celle molto diverse (meta' o doppio)", d.cellsShift.map((c) => `${src(c)}: ${c.before?.total} -> ${c.after?.total}`));
  sec("Flag cambiati", d.flagsChanged.map((c) => `${src(c)}: [${c.before?.flags.join(",")}] -> [${c.after?.flags.join(",")}]`));
  sec("Nuovi corsi nel combo", d.newCourses.map((c) => `${c.valore} ${c.label} (${c.tipo})`));
  sec("Corsi spariti dal combo", d.removedCourses.map((c) => `${c.valore} ${c.label} (${c.tipo})`));
  sec("Codici rinumerati (stesso nome)", d.renumbered.map((r) => `${r.label}: ${r.from.join("/")} -> ${r.to.join("/")}`));
  sec("Nomi cambiati", d.renamed.map((r) => `${r.valore}: "${r.from}" -> "${r.to}"`));
  return out;
}
