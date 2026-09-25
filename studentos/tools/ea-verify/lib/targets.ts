import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";
import type { LiveProgram, UniversityPreset } from "@/lib/sync/provider";
import type { ProgramModel, YearModel } from "./types";

export const UNIVERSITIES_DIR = path.resolve(process.cwd(), "src/lib/sync/universities");

export interface SourceDef {
  id: string;
  programme: string;
  kind: "timetable" | "exams";
  year: number;
  scuola: string;
  corso: string;
  anno2: string[];
}

export interface Target {
  presetId: string;
  /** Nome della const esportata del preset (es. "unisa"). */
  presetVar: string;
  file: string;
  baseUrl: string;
  /** true se il preset e' gia' in modalita' manuale (si legge la const di ripristino). */
  manual: boolean;
  programs: ProgramModel[];
  sources: SourceDef[];
}

const ID_RE = /^(.+)-(orario|esami)-anno-(-?\d+)$/;

/** Traduce i livePrograms (o la const di ripristino) nel modello di ea-verify. */
export function modelPrograms(livePrograms: LiveProgram[]): { programs: ProgramModel[]; sources: SourceDef[]; baseUrl: string } {
  const programs: ProgramModel[] = [];
  const sources: SourceDef[] = [];
  let baseUrl = "";
  for (const lp of livePrograms) {
    const years: YearModel[] = [];
    const slugs = new Set<string>();
    let hasExams = false;
    let special = false;
    for (const s of lp.sources) {
      const p = s.params as { baseUrl?: string; scuola?: string; corso?: string; cdl?: string; anno2?: string[] };
      if (s.providerId !== "easyacademy") {
        special = true;
        continue;
      }
      if (p.baseUrl && !baseUrl) baseUrl = p.baseUrl;
      const m = ID_RE.exec(s.id);
      if (!m) special = true;
      else slugs.add(m[1]);
      const year = m ? Number(m[3]) : Number.parseInt(String(p.anno2?.[0] ?? "").split("|").pop() ?? "", 10);
      if (s.capability === "timetable") {
        years.push({ year, scuola: p.scuola ?? "", corso: p.corso ?? "", anno2: p.anno2 ?? [] });
        sources.push({ id: s.id, programme: lp.programme, kind: "timetable", year, scuola: p.scuola ?? "", corso: p.corso ?? "", anno2: p.anno2 ?? [] });
      } else if (s.capability === "exams") {
        hasExams = true;
        sources.push({ id: s.id, programme: lp.programme, kind: "exams", year, scuola: p.scuola ?? "", corso: p.cdl ?? "", anno2: p.anno2 ?? [] });
      }
    }
    if (slugs.size !== 1) special = true;
    programs.push({ programme: lp.programme, slug: [...slugs][0] ?? "", hasExams, special, years });
  }
  return { programs, sources, baseUrl };
}

function findPresetFile(presetId: string): string | undefined {
  for (const f of fs.readdirSync(UNIVERSITIES_DIR)) {
    if (!f.endsWith(".ts")) continue;
    const t = fs.readFileSync(path.join(UNIVERSITIES_DIR, f), "utf8");
    if (t.includes(`id: "${presetId}"`) && /export const \w+: UniversityPreset/.test(t)) return path.join(UNIVERSITIES_DIR, f);
  }
  return undefined;
}

async function build(preset: UniversityPreset, file: string): Promise<Target | null> {
  const text = fs.readFileSync(file, "utf8");
  const presetVar = /export const (\w+): UniversityPreset/.exec(text)?.[1] ?? "";
  let live = preset.livePrograms;
  let manual = false;
  if (!live?.length) {
    // Preset manuale: cerca la const di ripristino (es. XXX_LIVE_PROGRAMS_2025_26).
    const name = /export const (\w*LIVE_PROGRAMS\w*): LiveProgram\[\]/.exec(text)?.[1];
    if (!name) return null;
    const mod = (await import(pathToFileURL(file).href)) as Record<string, LiveProgram[]>;
    live = mod[name];
    manual = true;
  }
  if (!live?.length) return null;
  const { programs, sources, baseUrl } = modelPrograms(live);
  if (!baseUrl) return null;
  return { presetId: preset.id, presetVar, file, baseUrl, manual, programs, sources };
}

/** Un preset per id (live o manuale con const di ripristino). */
export async function loadTarget(idOrFile: string): Promise<Target> {
  // Accetta anche il nome del file (es. "unisa" -> preset "unisa-informatica").
  const fileGuess = path.join(UNIVERSITIES_DIR, `${idOrFile}.ts`);
  const aliasId = fs.existsSync(fileGuess) ? /export const \w+: UniversityPreset = \{[\s\S]*?\n {2}id: "([^"]+)"/.exec(fs.readFileSync(fileGuess, "utf8"))?.[1] : undefined;
  const presetId = UNIVERSITY_PRESETS.some((p) => p.id === idOrFile) ? idOrFile : (aliasId ?? idOrFile);
  const preset = UNIVERSITY_PRESETS.find((p) => p.id === presetId);
  if (!preset) throw new Error(`preset sconosciuto: ${presetId}`);
  const file = findPresetFile(presetId);
  if (!file) throw new Error(`file del preset non trovato per ${presetId}`);
  const t = await build(preset, file);
  if (!t) throw new Error(`${presetId} non ha sorgenti EasyAcademy (ne' const di ripristino)`);
  return t;
}

/** Tutti i preset EasyAcademy (live + manuali ripristinabili). */
export async function loadAllTargets(): Promise<Target[]> {
  const out: Target[] = [];
  for (const p of UNIVERSITY_PRESETS) {
    const file = findPresetFile(p.id);
    if (!file) continue;
    const t = await build(p, file).catch(() => null);
    if (t) out.push(t);
  }
  return out;
}

/** Coverage md del preset: `_<file>_coverage.md` o `_<presetId>_coverage.md` (se esiste), altrimenti il primo. */
export function coveragePath(t: Target): string {
  const base = path.basename(t.file, ".ts");
  const cands = [`_${base}_coverage.md`, `_${t.presetId}_coverage.md`];
  for (const c of cands) if (fs.existsSync(path.join(UNIVERSITIES_DIR, c))) return path.join(UNIVERSITIES_DIR, c);
  const glob = fs.readdirSync(UNIVERSITIES_DIR).find((f) => f.startsWith(`_${base}`) && f.endsWith("_coverage.md"));
  return path.join(UNIVERSITIES_DIR, glob ?? cands[0]);
}

export const snapshotPath = (presetId: string, dir = path.join(UNIVERSITIES_DIR, "_verify")): string => path.join(dir, `${presetId}.json`);
