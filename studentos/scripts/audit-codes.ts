/**
 * Audit READ-ONLY dei codici EasyAcademy dei preset live.
 *
 * Per ogni sorgente "timetable" di ogni `livePrograms`:
 *  1. scarica (una volta per base+anno) il catalogo `combo.php?sw=ec_&aa=<anno>&page=corsi`;
 *  2. controlla che `corso` e ogni `anno2` esistano davvero nel catalogo (check strutturale);
 *  3. POST reale a `grid_call.php` su alcune settimane di semestre: `celle > 0` = viva.
 * Scrive un JSON con l'esito per sorgente. Non modifica nulla nel repo.
 *
 * Uso: tsx scripts/audit-codes.ts <out.json> [presetId ...]
 */
import { writeFileSync } from "node:fs";
import { UNIVERSITY_PRESETS } from "../src/lib/sync/universities";

const WEEKS = ["12-10-2026", "09-11-2026", "07-12-2026"];
const PER_HOST = 4;

interface ComboCourse {
  valore: string;
  label: string;
  scuola?: string;
  elenco_anni?: { valore: string; label: string }[];
}

async function getJson(url: string, init?: RequestInit, tries = 3): Promise<unknown> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, redirect: "manual", signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return init ? await res.json() : await res.text();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw last;
}

async function combo(base: string, anno: string): Promise<ComboCourse[] | null> {
  try {
    const t = (await getJson(`${base}/combo.php?sw=ec_&aa=${anno}&page=corsi`)) as string;
    const m = t.match(/var elenco_corsi = (\[[\s\S]*?\]);\s*\n?/);
    return m ? (JSON.parse(m[1]) as ComboCourse[]) : null;
  } catch {
    return null;
  }
}

async function celle(p: Record<string, unknown>, week: string): Promise<number> {
  const body = new URLSearchParams();
  const f: Record<string, string | string[]> = {
    view: "easycourse",
    "form-type": "corso",
    include: "corso",
    anno: String(p.anno),
    scuola: String(p.scuola),
    corso: String(p.corso),
    "anno2[]": p.anno2 as string[],
    date: week,
    _lang: "it",
    all_events: "0",
  };
  for (const [k, v] of Object.entries(f)) {
    if (Array.isArray(v)) for (const x of v) body.append(k, x);
    else body.append(k, v);
  }
  const j = (await getJson(`${String(p.baseUrl)}/grid_call.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })) as { celle?: unknown[] };
  return Array.isArray(j.celle) ? j.celle.length : 0;
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

async function main() {
  const out = process.argv[2];
  const only = new Set(process.argv.slice(3));
  const results: Record<string, unknown>[] = [];
  const combos = new Map<string, ComboCourse[] | null>();

  const presets = UNIVERSITY_PRESETS.filter((p) => p.livePrograms?.length && (!only.size || only.has(p.id)));
  await Promise.all(presets.map(async (preset) => {
    if (!preset.livePrograms) return;
    const jobs: { programme: string; src: (typeof preset.livePrograms)[number]["sources"][number] }[] = [];
    for (const lp of preset.livePrograms)
      for (const src of lp.sources) if (src.capability === "timetable") jobs.push({ programme: lp.programme, src });

    for (const key of new Set(jobs.map((j) => `${(j.src.params as Record<string, unknown>).baseUrl}|${(j.src.params as Record<string, unknown>).anno}`))) {
      const [b, a] = key.split("|");
      combos.set(key, await combo(b, a));
    }
    const cache = new Map<string, Promise<number>>();
    await pool(jobs, PER_HOST, async ({ programme, src }) => {
      const p = src.params as Record<string, unknown>;
      const cat = combos.get(`${p.baseUrl}|${p.anno}`);
      const c = cat?.find((x) => x.valore === p.corso);
      const have = new Set((c?.elenco_anni ?? []).map((a) => a.valore));
      const structural = !cat ? "combo-down" : !c ? "corso-assente" : (p.anno2 as string[]).every((a) => have.has(a)) ? "ok" : "anno2-assente";
      const k = JSON.stringify([p.baseUrl, p.anno, p.scuola, p.corso, p.anno2]);
      if (!cache.has(k))
        cache.set(
          k,
          (async () => {
            let best = 0;
            for (const w of WEEKS) {
              try {
                best = Math.max(best, await celle(p, w));
              } catch {
                best = Math.max(best, -1);
              }
              if (best > 0) break;
            }
            return best;
          })(),
        );
      const n = await cache.get(k)!;
      results.push({ preset: preset.id, programme, id: src.id, structural, celle: n });
    });
    const mine = results.filter((r) => r.preset === preset.id);
    const alive = mine.filter((r) => (r.celle as number) > 0).length;
    console.log(`${preset.id}: ${mine.length} sorgenti, vive ${alive}, strutturali ok ${mine.filter((r) => r.structural === "ok").length}`);
    writeFileSync(out, JSON.stringify(results, null, 1));
  }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
