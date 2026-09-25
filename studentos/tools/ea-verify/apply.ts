import fs from "node:fs";
import { examAppelli, gridCells } from "./lib/endpoints";
import { candidatesFor, buildPlan, finalizeProgram, mergeCoverage, pickHit, planStats, renderCoverageSection, renderManualConversion, renderPresetPatch, type Hit } from "./lib/patch";
import type { NetOptions } from "./lib/net";
import type { ComboCourse, Plan, ProgramPlan, Snapshot, YearModel, YearPlan } from "./lib/types";
import { coveragePath, type Target } from "./lib/targets";

const uniq = <T,>(a: T[]): T[] => [...new Set(a)];

/**
 * Costruisce il piano a partire dallo snapshot (verify) + POST reali sui soli candidati di ricattura.
 * Una ricattura vale SOLO se la richiesta reale torna celle > 0: nessun codice viene mai dedotto.
 */
export async function buildPlanOnline(t: Target, snap: Snapshot, net: NetOptions, log: (m: string) => void, today: string): Promise<Plan> {
  const rec = new Map(snap.sources.map((s) => [s.id, s]));
  const combo = snap.combo.entries;
  const f2s = new Map<string, Set<string>>();
  for (const p of t.programs) for (const y of p.years) for (const e of combo.filter((c) => c.valore === y.corso)) (f2s.get(e.facoltaId) ?? f2s.set(e.facoltaId, new Set()).get(e.facoltaId)!).add(y.scuola);
  const base = t.baseUrl;
  const { aa, weeks } = snap.params;

  const probe = async (scuola: string, corso: string, anno2: string[]): Promise<number> => {
    for (const wk of weeks) {
      const n = await gridCells(base, aa, scuola, corso, anno2, wk, net);
      if (n > 0) return n;
    }
    return 0;
  };
  const scuoleFor = (y: YearModel, e: ComboCourse): string[] => uniq([y.scuola, ...(f2s.get(e.facoltaId) ?? []), e.scuola]);

  const programs: ProgramPlan[] = [];
  let i = 0;
  for (const p of t.programs) {
    const years: YearPlan[] = [];
    for (const y of p.years) {
      const def = t.sources.find((s) => s.kind === "timetable" && s.programme === p.programme && s.year === y.year && s.corso === y.corso);
      const r = def ? rec.get(def.id) : undefined;
      if (!r) throw new Error(`sorgente senza record nello snapshot (${p.programme} anno ${y.year}): rieseguire verify`);
      const yp: YearPlan = { year: y.year, action: "kept", old: y, next: y, celle: r.total };
      let recapture = !r.live;
      if (r.live && r.flags.includes("ANNO2_STALE")) {
        for (const c of candidatesFor(p.programme, y, combo).filter((c) => c.kind === "same-code")) {
          const n = await probe(y.scuola, c.entry.valore, c.anno2);
          if (n > 0) {
            yp.action = "refreshed";
            yp.next = { ...y, corso: c.entry.valore, anno2: c.anno2 };
            yp.celle = n;
            break;
          }
        }
      }
      if (recapture) {
        const hits: Hit[] = [];
        const cands = candidatesFor(p.programme, y, combo);
        // Il primo candidato same-code che verifica basta; per i label si raccolgono tutti (ambiguita').
        for (const c of cands) {
          let found: Hit | undefined;
          for (const sc of scuoleFor(y, c.entry)) {
            const n = await probe(sc, c.entry.valore, c.anno2);
            if (n > 0) {
              found = { candidate: c, scuola: sc, celle: n };
              break;
            }
          }
          if (found) {
            hits.push(found);
            if (c.kind === "same-code") break;
          }
        }
        const pick = pickHit(hits);
        recapture = false;
        if (pick.hit) {
          const h = pick.hit;
          yp.action = "recaptured";
          yp.next = { year: y.year, scuola: h.scuola, corso: h.candidate.entry.valore, anno2: h.candidate.anno2 };
          yp.celle = h.celle;
          yp.via = h.candidate.kind === "label" ? h.candidate.entry.label : "stesso codice, anno2 aggiornato";
        } else if (pick.ambiguous) {
          yp.action = "ambiguous"; // non applicato: si lascia com'e' e si chiede
          yp.reason = pick.ambiguous;
        } else {
          yp.action = "removed";
          yp.next = undefined;
          yp.celle = 0;
          const known = combo.length > 0 && combo.some((c) => c.valore === y.corso);
          yp.reason = combo.length === 0 ? "combo vuoto: sistema non ancora pubblicato" : known ? `0 celle in tutte le ${weeks.length} settimane (${snap.params.from}..${snap.params.to})` : "codice assente dal combo e nessun candidato per nome verifica";
        }
      }
      if (yp.next) {
        const n = yp.next;
        const ex = def && yp.action === "kept" ? snap.sources.find((s) => s.kind === "exams" && s.programme === p.programme && s.year === y.year && s.corso === n.corso) : undefined;
        yp.appelli = ex && (ex.appelli ?? -1) >= 0 ? ex.appelli : Math.max(0, await examAppelli(base, n.scuola, n.corso, String(y.year), snap.params.examFrom, snap.params.examTo, net));
      }
      years.push(yp);
    }
    programs.push(finalizeProgram({ programme: p.programme, slug: p.slug, special: p.special, hadExams: p.hasExams }, years));
    if (++i % 20 === 0) log(`  piano: ${i}/${t.programs.length} programmi`);
  }
  return buildPlan({ presetId: t.presetId, aa, date: today, comboEmpty: snap.combo.status === "empty" }, programs);
}

export function formatPlan(plan: Plan): string[] {
  const st = planStats(plan);
  const L: string[] = [];
  L.push(`## Piano per ${plan.presetId} (anno ${plan.aa})`, "");
  L.push(`- Programmi: ${st.programsBefore} -> ${st.programsAfter} (rimossi interi: ${st.removedPrograms.length})`);
  L.push(`- Anni-orario: ${st.yearsBefore} -> ${st.yearsAfter} (invariati ${st.kept}, aggiornati ${st.refreshed}, ricatturati ${st.recaptured}, rimossi ${st.removed}, AMBIGUI ${st.ambiguous})`);
  L.push(`- Esami passati a solo-orari: ${st.examsOff.length}; con esami: ${plan.programs.filter((p) => p.years.some((y) => y.next) && p.wantExams).length}`);
  if (plan.toManual) L.push(`- **Il preset passerebbe a MODALITA' MANUALE** (${plan.comboEmpty ? "combo vuoto" : "0 anni live"}).`);
  const lines = (title: string, items: string[]) => {
    if (items.length) L.push("", `${title} (${items.length}${items.length > 40 ? ", primi 40" : ""})`, ...items.slice(0, 40).map((x) => `  - ${x}`));
  };
  const all = plan.programs.flatMap((p) => p.years.map((y) => ({ p, y })));
  lines("Ricatturati/aggiornati", all.filter(({ y }) => y.action === "recaptured" || y.action === "refreshed").map(({ p, y }) => `${p.programme} anno ${y.year}: ${y.old.corso} -> ${y.next?.corso} ${y.via ? `[${y.via}]` : ""}`));
  lines("Rimossi", all.filter(({ y }) => y.action === "removed").map(({ p, y }) => `${p.programme} anno ${y.year} (${y.old.corso}): ${y.reason}`));
  lines("AMBIGUI (non applicati, da decidere)", all.filter(({ y }) => y.action === "ambiguous").map(({ p, y }) => `${p.programme} anno ${y.year}: ${y.reason}`));
  lines("Programmi 'special' (forma non standard: non riscritti)", plan.programs.filter((p) => p.special).map((p) => p.programme));
  lines("Esami -> solo-orari", st.examsOff);
  lines("Esami -> attivabili (solo-orari nel preset ma con appelli)", st.examsOn);
  return L;
}

export interface ApplyOutcome {
  lines: string[];
  wrote: boolean;
}

/** Dry-run di default; con `write` modifica il file preset e il coverage md. */
export function applyPlan(t: Target, plan: Plan, snap: Snapshot, write: boolean): ApplyOutcome {
  const raw = fs.readFileSync(t.file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = raw.split("\r\n").join("\n");
  const L: string[] = [];
  let next = text;
  if (plan.toManual) {
    const reason = plan.comboEmpty ? `combo ${plan.aa} vuoto, nessun corso pubblicato` : `0 sorgenti orario con celle nella finestra ${snap.params.from}..${snap.params.to}`;
    const r = renderManualConversion(text, reason, plan.date);
    L.push(r.applied ? `Preset -> manuale: const di ripristino ${r.constName}` : "Preset gia' in modalita' manuale (nessuna modifica)");
    next = r.text;
  } else {
    const r = renderPresetPatch(text, plan);
    L.push(`Blocchi riscritti: ${r.changed.length}, rimossi: ${r.removed.length}, non toccati (special/forma non standard): ${r.skipped.length}`);
    next = r.text;
  }
  const covFile = coveragePath(t);
  const section = renderCoverageSection(plan, { comboCount: snap.combo.count, weeks: snap.params.weeks.length, window: `${snap.params.from}..${snap.params.to}`, examWindow: `${snap.params.examFrom}..${snap.params.examTo}` });
  const covRaw = fs.existsSync(covFile) ? fs.readFileSync(covFile, "utf8") : `# ${t.presetId} - copertura corsi\n`;
  const covNext = mergeCoverage(covRaw.split("\r\n").join("\n"), section);
  L.push(`Coverage md: ${covFile}`);
  if (!write) {
    L.push("", "DRY-RUN: nessun file modificato (usare --write).");
    return { lines: L, wrote: false };
  }
  const enc = (s: string) => (crlf ? s.split("\n").join("\r\n") : s);
  if (next !== text) fs.writeFileSync(t.file, enc(next));
  fs.writeFileSync(covFile, covRaw.includes("\r\n") || crlf ? covNext.split("\n").join("\r\n") : covNext);
  L.push("", "SCRITTO: preset + coverage aggiornati. Ora: gate (build, test, tsc, lint) e commit.");
  return { lines: L, wrote: true };
}
