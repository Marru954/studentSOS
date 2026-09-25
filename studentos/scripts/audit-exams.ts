/**
 * Audit READ-ONLY delle sorgenti ESAMI dei preset live (test_call.php).
 *
 * Per ogni sorgente "exams" fa il POST reale che fa l'adapter e conta gli
 * appelli sull'intero anno accademico. Un flag `exams` senza appelli non è dato
 * sbagliato, ma è una sorgente vuota: il report serve a decidere se spegnerla.
 * Non modifica nulla nel repo.
 *
 * Uso: tsx scripts/audit-exams.ts <out.json> [presetId ...]
 */
import { writeFileSync } from "node:fs";
import { UNIVERSITY_PRESETS } from "../src/lib/sync/universities";

const FROM = "01-09-2026";
const TO = "31-08-2027";
const PER_HOST = 4;

async function appelli(p: Record<string, unknown>): Promise<number> {
  const body = new URLSearchParams();
  const f: [string, string][] = [
    ["view", "easytest"], ["form-type", "et_cdl"], ["include", "et_cdl"], ["et_er", "1"],
    ["scuola", String(p.scuola)], ["esami_cdl", String(p.cdl)],
    ...(p.anno2 as string[]).map((a) => ["anno2[]", a] as [string, string]),
    ["datefrom", FROM], ["dateto", TO], ["_lang", "it"],
  ];
  for (const [k, v] of f) body.append(k, v);
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${String(p.baseUrl)}/test_call.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        redirect: "manual",
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = (await res.json()) as { Insegnamenti?: Record<string, { Appelli?: unknown[] }> };
      return Object.values(j.Insegnamenti ?? {}).reduce((n, c) => n + (Array.isArray(c.Appelli) ? c.Appelli.length : 0), 0);
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  return -1;
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}

async function main() {
  const out = process.argv[2];
  const only = new Set(process.argv.slice(3));
  const results: Record<string, unknown>[] = [];
  const presets = UNIVERSITY_PRESETS.filter((p) => p.livePrograms?.length && (!only.size || only.has(p.id)));
  await Promise.all(presets.map(async (preset) => {
    const jobs = preset.livePrograms!.flatMap((lp) =>
      lp.sources.filter((s) => s.capability === "exams").map((src) => ({ programme: lp.programme, src })),
    );
    await pool(jobs, PER_HOST, async ({ programme, src }) => {
      results.push({ preset: preset.id, programme, id: src.id, appelli: await appelli(src.params as Record<string, unknown>) });
    });
    const mine = results.filter((r) => r.preset === preset.id);
    console.log(`${preset.id}: ${mine.length} sorgenti esami, con appelli ${mine.filter((r) => (r.appelli as number) > 0).length}, errori rete ${mine.filter((r) => (r.appelli as number) < 0).length}`);
    writeFileSync(out, JSON.stringify(results, null, 1));
  }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
