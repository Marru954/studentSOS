#!/usr/bin/env tsx
/**
 * ea-verify - verifica, confronto e (opzionale) patch dei preset EasyAcademy.
 *
 *   verify <presetId|all> [--aa 2026] [--from 2026-09-28] [--to 2026-11-30] [--fast] [--concurrency 3] [--pause 150]
 *   diff   <presetId|all> [--against file.json]
 *   apply  <presetId> [--write]
 *
 * verify e diff sono SOLA LETTURA (verify scrive solo lo snapshot in _verify/). apply e' dry-run
 * finche' non si passa --write.
 */
import { parseArgs } from "node:util";
import { applyPlan, buildPlanOnline, formatPlan } from "./apply";
import { clampConcurrency, DEFAULT_NET, type NetOptions } from "./lib/net";
import { diffSnapshots, formatDiff, isEmptyDiff, parseSnapshot } from "./lib/snapshot";
import { defaultAcademicYear, defaultExamWindow, defaultWindow, mondaysBetween } from "./lib/weeks";
import { loadAllTargets, loadTarget, type Target } from "./lib/targets";
import { readCommittedSnapshot, readSnapshot, runVerify, summarize, writeSnapshot } from "./verify";
import fs from "node:fs";

const USAGE = "uso: cli.ts <verify|diff|apply> <presetId|all> [--aa AAAA] [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--fast] [--concurrency N] [--pause ms] [--against file] [--write]";

async function targetsFor(arg: string): Promise<Target[]> {
  return arg === "all" ? loadAllTargets() : [await loadTarget(arg)];
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      aa: { type: "string" },
      from: { type: "string" },
      to: { type: "string" },
      fast: { type: "boolean", default: false },
      concurrency: { type: "string" },
      pause: { type: "string" },
      against: { type: "string" },
      write: { type: "boolean", default: false },
    },
  });
  const [cmd, arg] = positionals;
  if (!cmd || !arg) {
    console.error(USAGE);
    return 2;
  }
  const now = new Date();
  const aa = values.aa ?? defaultAcademicYear(now);
  const win = defaultWindow(aa);
  const from = values.from ?? win.from;
  const to = values.to ?? win.to;
  const ex = defaultExamWindow(aa);
  const net: NetOptions = { ...DEFAULT_NET, concurrency: clampConcurrency(Number(values.concurrency ?? DEFAULT_NET.concurrency)), pauseMs: Number(values.pause ?? DEFAULT_NET.pauseMs) };
  const log = (m: string) => console.error(m);

  if (cmd === "verify") {
    const weeks = mondaysBetween(from, to);
    for (const t of await targetsFor(arg)) {
      log(`verify ${t.presetId}: ${t.sources.length} sorgenti, ${weeks.length} settimane${t.manual ? " (preset manuale: codici dalla const di ripristino)" : ""}`);
      const snap = await runVerify(t, { params: { aa, from, to, examFrom: ex.from, examTo: ex.to, weeks }, net, fast: values.fast ?? false, log }, now);
      const file = writeSnapshot(snap);
      console.log(summarize(snap).join("\n"));
      console.log(`\nSnapshot: ${file}\n`);
    }
    return 0;
  }

  if (cmd === "diff") {
    for (const t of await targetsFor(arg)) {
      const now_ = readSnapshot(t.presetId);
      const old = values.against ? parseSnapshot(fs.readFileSync(values.against, "utf8")) : readCommittedSnapshot(t.presetId);
      if (!now_) {
        console.log(`${t.presetId}: nessuno snapshot locale (eseguire verify)`);
        continue;
      }
      if (!old) {
        console.log(`${t.presetId}: nessuno snapshot precedente da confrontare (primo snapshot)`);
        continue;
      }
      const d = diffSnapshots(old, now_);
      console.log(`## ${t.presetId}: ${old.generatedAt.slice(0, 10)} (anno ${old.params.aa}) -> ${now_.generatedAt.slice(0, 10)} (anno ${now_.params.aa})`);
      console.log(isEmptyDiff(d) ? "Nessuna differenza." : formatDiff(d).join("\n"));
      console.log("");
    }
    return 0;
  }

  if (cmd === "apply") {
    if (arg === "all") {
      console.error("apply lavora su UN preset alla volta");
      return 2;
    }
    const t = await loadTarget(arg);
    const snap = readSnapshot(t.presetId);
    if (!snap) {
      console.error(`nessuno snapshot per ${t.presetId}: eseguire prima verify`);
      return 1;
    }
    const plan = await buildPlanOnline(t, snap, net, log, now.toISOString().slice(0, 10));
    console.log(formatPlan(plan).join("\n"));
    const out = applyPlan(t, plan, snap, values.write ?? false);
    console.log("\n" + out.lines.join("\n"));
    const amb = plan.programs.some((p) => p.years.some((y) => y.action === "ambiguous"));
    if (amb) console.log("\nATTENZIONE: ci sono casi ambigui non applicati: chiedere prima di procedere.");
    return 0;
  }

  console.error(USAGE);
  return 2;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
