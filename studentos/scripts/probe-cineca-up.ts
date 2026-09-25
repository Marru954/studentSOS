/**
 * Probe READ-ONLY di un'istanza Cineca University Planner (UP): il passo di
 * verifica live che manca all'adapter `cineca-up` (dormiente finché non c'è una
 * fixture reale, vedi docs/superpowers/specs/2026-09-25-adapter-cineca-up-design.md).
 * Non scrive nulla nel repo, salvo le fixture grezze con --save.
 *
 * Uso (da studentos/):
 *   tsx scripts/probe-cineca-up.ts <origin> <linkCalendarioId>... [--from AAAA-MM-GG] [--days N] [--windows N] [--save]
 *   tsx scripts/probe-cineca-up.ts --harvest <url-pagina-orari>...
 *
 * <origin> = schema + host del tenant (*.prod.up.cineca.it), preso dal link
 * pubblico dell'ateneo: mai inventato. Per ogni calendario stampa:
 *  - la data di creazione dell'ObjectId (un calendario di un anno passato è stantio);
 *  - l'esito della POST IDENTICA a quella dell'adapter (impegniRequest), sulle
 *    stesse finestre di 28 giorni dal lunedì di --from (default oggi; --days più
 *    corto per una prova leggera, --windows per più finestre);
 *  - chiavi dei campi, forma di docenti/aule, fuso di dataInizio, anni di corso e
 *    campi candidati per tipo attività / annullato (i punti aperti della spec);
 *  - quanti impegni reali readImpegno legge e quanti scarta, con campioni.
 * --save scrive la risposta grezza (byte per byte) in tests/fixtures/cineca-up/,
 * più un .sample.json con i primi 5 impegni invariati (quello da committare).
 * --harvest estrae dalle pagine orari dell'ateneo i linkCalendarioId con il testo
 * del link e la data di creazione: il censimento, visto che l'elenco dei
 * calendari non è pubblico (401).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchWindows, impegniRequest, readImpegno } from "../src/lib/sync/adapters/cineca-up";
import { politeFetch } from "../src/lib/sync/http";

const OBJECT_ID = /^[0-9a-f]{24}$/;
const FIXTURES = join(__dirname, "..", "tests", "fixtures", "cineca-up");
const TIMEOUT_MS = 30_000;
const PAUSE_MS = 1_000;
const STALE_MONTHS = 10;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The first 4 bytes of an ObjectId are its creation time, in seconds. */
function createdAt(id: string): string {
  return new Date(parseInt(id.slice(0, 8), 16) * 1000).toISOString().slice(0, 10);
}

function staleNote(created: string): string {
  const months = (Date.now() - Date.parse(created)) / (30.4 * 86_400_000);
  return months > STALE_MONTHS ? `  ⚠ creato ${Math.round(months)} mesi fa: probabile calendario di un anno passato` : "";
}

async function get(url: string): Promise<{ status: number; text: string }> {
  // Local CLI, not the server proxy: following redirects is fine here.
  const res = await politeFetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
  return { status: res.status, text: await res.text() };
}

// ── survey of the real payload ──────────────────────────────────────────────

const obj = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
const keysOf = (v: unknown): string => (obj(v) ? Object.keys(obj(v)!).sort().join(", ") : JSON.stringify(v) ?? "—");
const first = (v: unknown): unknown => (Array.isArray(v) ? v[0] : undefined);

/** Scalar fields whose path reads like type/state/cancelled, anywhere in one impegno (depth ≤ 4). */
function candidates(v: unknown, path: string, depth: number, out: Map<string, string>): void {
  if (depth > 4 || !v || typeof v !== "object") return;
  if (Array.isArray(v)) return candidates(v[0], `${path}[0]`, depth + 1, out);
  for (const [k, val] of Object.entries(v)) {
    const p = path ? `${path}.${k}` : k;
    if (/tipo|stato|annull|cancel/i.test(p) && (val === null || typeof val !== "object")) {
      out.set(p, JSON.stringify(val));
    }
    candidates(val, p, depth + 1, out);
  }
}

function survey(raw: unknown[]): void {
  const imp = obj(raw[0]);
  if (!imp) return;
  const evento = obj(imp.evento);
  const zone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(String(imp.dataInizio)) ? "con fuso" : "SENZA fuso → letto come ora di Roma";
  console.log(`    chiavi impegno: ${keysOf(imp)}`);
  console.log(`    chiavi evento: ${keysOf(evento)}`);
  console.log(`    chiavi dettagliDidattici[0]: ${keysOf(first(evento?.dettagliDidattici))}`);
  console.log(`    docenti[0]: ${(JSON.stringify(first(imp.docenti)) ?? "—").slice(0, 200)}`);
  console.log(`    chiavi aule[0]: ${keysOf(first(imp.aule))}`);
  console.log(`    dataInizio grezzo: ${JSON.stringify(imp.dataInizio)} (${zone})`);

  const years = new Map<string, number>();
  for (const one of raw) {
    for (const d of (obj(obj(one)?.evento)?.dettagliDidattici as unknown[] | undefined) ?? []) {
      const key = JSON.stringify(obj(d)?.annoCorso) ?? "assente";
      years.set(key, (years.get(key) ?? 0) + 1);
    }
  }
  console.log(`    annoCorso (valore → n. dettagli): ${[...years].map(([k, n]) => `${k}→${n}`).join(", ") || "nessuno"}`);

  const cand = new Map<string, string>();
  candidates(imp, "", 0, cand);
  console.log(`    campi tipo/stato/annullato: ${[...cand].map(([k, v]) => `${k}=${v}`).join("; ") || "nessuno"}`);

  const read = raw.map(readImpegno).filter((x) => x !== null);
  console.log(`    readImpegno: ${read.length}/${raw.length} leggibili`);
  for (const r of read.slice(0, 3)) {
    console.log(
      `      · ${r.start} → ${r.end} | ${r.courseName} | anni ${r.years.join(",") || "—"} | ` +
        `${r.rooms.join(", ") || "—"} | ${r.teachers.join(", ") || "—"}`,
    );
  }
}

// ── probe: tenant + calendars ──────────────────────────────────────────────

async function probe(origin: URL, ids: string[], from: string, days: number, windows: number, save: boolean): Promise<void> {
  const robots = await get(new URL("/robots.txt", origin).toString());
  console.log(`robots.txt: HTTP ${robots.status}`);
  for (const line of robots.text.split("\n").filter((l) => /^\s*(user-agent|disallow|allow|crawl-delay)/i.test(l)).slice(0, 12)) {
    console.log(`  ${line.trim()}`);
  }

  const lookup = new URL("/api/Clienti/cercaPerDominio", origin);
  lookup.searchParams.set("dominio", origin.host);
  const cliente = await get(lookup.toString());
  let clienteId: string | undefined;
  try {
    const j = obj(JSON.parse(cliente.text));
    clienteId = typeof j?.id === "string" ? j.id : undefined;
    console.log(`cercaPerDominio: HTTP ${cliente.status} → clienteId ${clienteId ?? "—"} (${String(j?.codice ?? "?")})`);
  } catch {
    console.log(`cercaPerDominio: HTTP ${cliente.status}, risposta non JSON: ${cliente.text.slice(0, 200)}`);
  }
  if (!clienteId || !OBJECT_ID.test(clienteId)) {
    console.log("clienteId non valido: stop.");
    process.exitCode = 1;
    return;
  }

  const lastDay = new Date(Date.parse(`${from}T00:00:00Z`) + (windows * days - 1) * 86_400_000).toISOString().slice(0, 10);
  const spans = fetchWindows(from, lastDay, days, windows);
  for (const id of ids) {
    const created = createdAt(id);
    console.log(`\ncalendario ${id} — creato il ${created}${staleNote(created)}`);
    for (const span of spans) {
      await sleep(PAUSE_MS);
      const label = `${span.start.slice(0, 10)}+${days}g`;
      const { url, init } = impegniRequest(origin.origin, clienteId, id, span);
      const res = await politeFetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
      const text = await res.text();
      if (!res.ok) {
        console.log(`  ${label}: HTTP ${res.status} ${text.slice(0, 200)}`);
        continue;
      }
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        console.log(`  ${label}: risposta non JSON: ${text.slice(0, 200)}`);
        continue;
      }
      if (!Array.isArray(raw)) {
        console.log(`  ${label}: risposta non-array (chiavi: ${keysOf(raw)})`);
        continue;
      }
      console.log(`  ${label}: ${raw.length} impegni, ${(text.length / 1024).toFixed(0)} KB`);
      if (save && raw.length) {
        mkdirSync(FIXTURES, { recursive: true });
        const base = join(FIXTURES, `${origin.host.replace(/[^A-Za-z0-9.-]/g, "_")}-${id}-${span.start.slice(0, 10)}-${days}g`);
        writeFileSync(`${base}.json`, text);
        writeFileSync(`${base}.sample.json`, `${JSON.stringify(raw.slice(0, 5), null, 2)}\n`);
        console.log(`    salvate: ${base}.json (grezza) + .sample.json (primi 5 impegni)`);
      }
      survey(raw);
    }
  }
}

// ── harvest: the census of public calendars ─────────────────────────────────

function plain(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

async function harvest(pages: string[]): Promise<void> {
  const found = new Map<string, { text: string; page: string }>();
  for (const page of pages) {
    await sleep(PAUSE_MS);
    const { status, text } = await get(page);
    console.log(`${page}: HTTP ${status}`);
    for (const m of text.matchAll(/<a\b[^>]*?linkCalendarioId=([0-9a-f]{24})[^>]*>([\s\S]*?)<\/a>/gi)) {
      if (!found.has(m[1])) found.set(m[1], { text: plain(m[2]).slice(0, 120), page });
    }
    for (const m of text.matchAll(/linkCalendarioId=([0-9a-f]{24})/gi)) {
      if (!found.has(m[1])) found.set(m[1], { text: "", page });
    }
  }
  const rows = [...found].map(([id, v]) => ({ id, created: createdAt(id), ...v }));
  rows.sort((a, b) => b.created.localeCompare(a.created));
  console.log(`\n${rows.length} calendari trovati (dal più recente):`);
  for (const r of rows) console.log(`  ${r.id}  creato ${r.created}  ${r.text || "(nessun testo)"}${staleNote(r.created)}`);
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function usage(): never {
  console.error(
    "Uso: tsx scripts/probe-cineca-up.ts <origin> <linkCalendarioId>... [--from AAAA-MM-GG] [--days N] [--windows N] [--save]\n" +
      "     tsx scripts/probe-cineca-up.ts --harvest <url-pagina-orari>...",
  );
  process.exit(2);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args[0] === "--harvest") {
    if (args.length < 2) usage();
    return harvest(args.slice(1));
  }
  const flag = (name: string) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  let origin: URL;
  try {
    origin = new URL(args[0] ?? "");
  } catch {
    usage();
  }
  // https only; plain http just for a local mock server.
  if (origin.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(origin.hostname)) usage();
  const ids = args.slice(1).filter((a) => OBJECT_ID.test(a));
  if (!ids.length) usage();
  const from = flag("--from") ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) usage();
  const days = Math.min(Math.max(Number(flag("--days") ?? 28) || 28, 1), 28);
  const windows = Math.min(Math.max(Number(flag("--windows") ?? 1) || 1, 1), 5);
  await probe(origin, ids, from, days, windows, args.includes("--save"));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
