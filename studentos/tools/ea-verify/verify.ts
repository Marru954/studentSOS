import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fetchCatalog, examAppelli, gridCells } from "./lib/endpoints";
import { parseCombo } from "./lib/combo";
import { classifyWeeks, comboFlags } from "./lib/flags";
import { pool, type NetOptions } from "./lib/net";
import { parseSnapshot, serializeSnapshot } from "./lib/snapshot";
import type { Flag, Snapshot, SnapshotParams, SourceRecord } from "./lib/types";
import { snapshotPath, type Target } from "./lib/targets";

export interface VerifyOptions {
  params: SnapshotParams;
  net: NetOptions;
  /** Ferma la scansione di una sorgente alla prima settimana con celle (meno richieste, niente profilo completo). */
  fast: boolean;
  log: (msg: string) => void;
}

const hostOf = (base: string) => base.replace(/^[a-z]+:\/\//i, "");

/** Sola lettura: combo + N POST settimanali per sorgente orario + test_call per gli esami. */
export async function runVerify(t: Target, o: VerifyOptions, now = new Date()): Promise<Snapshot> {
  const { params, net } = o;
  let comboStatus: Snapshot["combo"]["status"] = "error";
  let entries: Snapshot["combo"]["entries"] = [];
  try {
    entries = parseCombo(await fetchCatalog(t.baseUrl, params.aa, net));
    comboStatus = entries.length ? "ok" : "empty";
  } catch (e) {
    o.log(`combo non raggiungibile: ${String(e)}`);
  }
  const presetFlags: Flag[] = comboStatus === "empty" ? ["COMBO_EMPTY"] : [];
  o.log(`combo ${params.aa}: ${comboStatus} (${entries.length} corsi)`);

  // Le sorgenti con stessi (scuola, corso, anno2) condividono le richieste.
  const gridCache = new Map<string, Promise<number[]>>();
  const examCache = new Map<string, Promise<number>>();
  const scanWeeks = (scuola: string, corso: string, anno2: string[]): Promise<number[]> => {
    const k = `${scuola}|${corso}|${anno2.join(",")}`;
    let p = gridCache.get(k);
    if (!p) {
      p = (async () => {
        const w: number[] = [];
        for (const wk of params.weeks) {
          const n = await gridCells(t.baseUrl, params.aa, scuola, corso, anno2, wk, net);
          w.push(n);
          if (o.fast && n > 0) break;
        }
        while (o.fast && w.length < params.weeks.length) w.push(0);
        return w;
      })();
      gridCache.set(k, p);
    }
    return p;
  };
  const scanExam = (scuola: string, corso: string, year: string): Promise<number> => {
    const k = `${scuola}|${corso}|${year}`;
    let p = examCache.get(k);
    if (!p) {
      p = examAppelli(t.baseUrl, scuola, corso, year, params.examFrom, params.examTo, net);
      examCache.set(k, p);
    }
    return p;
  };

  let done = 0;
  const records = await pool(t.sources, net.concurrency, async (s): Promise<SourceRecord> => {
    let rec: SourceRecord;
    if (s.kind === "timetable") {
      const weeks = await scanWeeks(s.scuola, s.corso, s.anno2);
      const v = classifyWeeks(weeks);
      rec = { ...base(s), weeks, total: v.total, weeksWithCells: v.weeksWithCells, live: v.live, flags: [...v.flags, ...comboFlags(s, entries)] };
    } else {
      const appelli = await scanExam(s.scuola, s.corso, s.anno2[0] ?? String(s.year));
      const flags: Flag[] = [...comboFlags({ ...s, anno2: [] }, entries)];
      if (appelli < 0) flags.push("NET_ERROR");
      else if (appelli === 0) flags.push("EXAMS_EMPTY_ARRAY_RISK");
      rec = { ...base(s), weeks: [], total: 0, weeksWithCells: 0, appelli, live: appelli > 0, flags };
    }
    if (++done % 25 === 0) o.log(`  ${done}/${t.sources.length} sorgenti`);
    return rec;
  });

  return {
    tool: "ea-verify",
    version: 1,
    presetId: t.presetId,
    generatedAt: now.toISOString(),
    params,
    baseHost: hostOf(t.baseUrl),
    combo: { status: comboStatus, count: entries.length, entries },
    presetFlags,
    sources: records,
  };
}

function base(s: Target["sources"][number]) {
  return { id: s.id, programme: s.programme, kind: s.kind, year: s.year, scuola: s.scuola, corso: s.corso, anno2: s.anno2 };
}

export function writeSnapshot(s: Snapshot, dir?: string): string {
  const file = snapshotPath(s.presetId, dir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, serializeSnapshot(s));
  return file;
}

export function readSnapshot(presetId: string, dir?: string): Snapshot | null {
  const file = snapshotPath(presetId, dir);
  return fs.existsSync(file) ? parseSnapshot(fs.readFileSync(file, "utf8")) : null;
}

/** Snapshot dell'ultimo commit (HEAD) dello stesso file, se esiste. */
export function readCommittedSnapshot(presetId: string, dir?: string): Snapshot | null {
  const file = snapshotPath(presetId, dir);
  try {
    const top = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
    const rel = path.relative(top, file).split(path.sep).join("/");
    return parseSnapshot(execFileSync("git", ["show", `HEAD:${rel}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

/** Riepilogo markdown per il terminale. */
export function summarize(s: Snapshot): string[] {
  const tt = s.sources.filter((r) => r.kind === "timetable");
  const ex = s.sources.filter((r) => r.kind === "exams");
  const count = (f: Flag) => s.sources.filter((r) => r.flags.includes(f)).length;
  const L: string[] = [];
  L.push(`## ${s.presetId} - anno ${s.params.aa} (${s.generatedAt.slice(0, 10)})`, "");
  L.push(`- Combo: **${s.combo.status}** (${s.combo.count} corsi)${s.presetFlags.length ? " - " + s.presetFlags.join(",") : ""}`);
  L.push(`- Orari: ${tt.length} sorgenti, live ${tt.filter((r) => r.live).length}, vuote ${tt.filter((r) => !r.live).length}`);
  L.push(`- Esami: ${ex.length} sorgenti, con appelli ${ex.filter((r) => r.live).length}, senza ${ex.filter((r) => !r.live).length}`);
  L.push("- Flag: " + (["NO_CELLS", "PARTIAL", "CODE_MISSING_IN_COMBO", "ANNO2_STALE", "NAME_MISMATCH", "SCUOLA_NOT_IN_COMBO", "EXAMS_EMPTY_ARRAY_RISK", "NET_ERROR"] as Flag[]).map((f) => `${f}=${count(f)}`).join(" "));
  const empty = tt.filter((r) => !r.live);
  if (empty.length) {
    L.push("", `Orari senza celle (${empty.length}, max 30):`);
    for (const r of empty.slice(0, 30)) L.push(`  - ${r.programme} anno ${r.year} (${r.corso}) [${r.flags.join(",")}]`);
  }
  const risk = ex.filter((r) => r.flags.includes("EXAMS_EMPTY_ARRAY_RISK"));
  if (risk.length) L.push("", `Esami a rischio bug adapter Insegnamenti:[] (${risk.length}).`);
  return L;
}
