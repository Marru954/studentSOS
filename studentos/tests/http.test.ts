/**
 * politeFetch: User-Agent, richieste condizionali (304 = nessun cambiamento),
 * backoff differenziato (429/503 + Retry-After) e retry semplice sui timeout.
 * Nessuna rete: fetch e sleep sono iniettati.
 */

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { _resetPoliteFetchCache, parseRetryAfter, politeFetch, USER_AGENT } from "../src/lib/sync/http";

beforeEach(() => _resetPoliteFetchCache());

type Call = { url: string; headers: Headers };
function scripted(steps: Array<Response | Error>) {
  const calls: Call[] = [];
  const waits: number[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, headers: new Headers(init.headers) });
    const step = steps.shift();
    if (!step) throw new Error("script exhausted");
    if (step instanceof Error) throw step;
    return step;
  }) as unknown as typeof fetch;
  const sleep = async (ms: number) => { waits.push(ms); };
  return { calls, waits, opts: { fetchImpl, sleep, random: () => 0, hostGapMs: 0 } };
}
const res = (status: number, headers: Record<string, string> = {}, body = "") =>
  new Response(status === 304 ? null : body, { status, headers });

test("invia lo User-Agent descrittivo, senza sovrascrivere uno esplicito", async () => {
  const s = scripted([res(200), res(200)]);
  await politeFetch("https://x.example/a", {}, s.opts);
  await politeFetch("https://x.example/b", { headers: { "User-Agent": "custom" } }, s.opts);
  assert.equal(s.calls[0].headers.get("user-agent"), USER_AGENT);
  assert.match(USER_AGENT, /^StudentOS\/\d/);
  assert.equal(s.calls[1].headers.get("user-agent"), "custom");
});

test("304: rinvia i validatori e serve il corpo in cache come 200", async () => {
  const s = scripted([
    res(200, { etag: '"v1"', "last-modified": "Wed, 01 Jan 2026 00:00:00 GMT" }, "corpo"),
    res(304),
  ]);
  const first = await politeFetch("https://x.example/f", {}, s.opts);
  assert.equal(await first.text(), "corpo");
  assert.equal(s.calls[0].headers.get("if-none-match"), null);
  const second = await politeFetch("https://x.example/f", {}, s.opts);
  assert.equal(s.calls[1].headers.get("if-none-match"), '"v1"');
  assert.equal(s.calls[1].headers.get("if-modified-since"), "Wed, 01 Jan 2026 00:00:00 GMT");
  assert.equal(second.status, 200);
  assert.equal(await second.text(), "corpo");
});

test("senza validatori dal server non si fanno richieste condizionali", async () => {
  const s = scripted([res(200, {}, "a"), res(200, {}, "b")]);
  await politeFetch("https://x.example/n", {}, s.opts);
  await politeFetch("https://x.example/n", {}, s.opts);
  assert.equal(s.calls[1].headers.get("if-none-match"), null);
  assert.equal(s.calls[1].headers.get("if-modified-since"), null);
});

test("POST non è mai condizionale", async () => {
  const s = scripted([res(200, { etag: '"p"' }, "x"), res(200)]);
  await politeFetch("https://x.example/p", { method: "POST" }, s.opts);
  await politeFetch("https://x.example/p", { method: "POST" }, s.opts);
  assert.equal(s.calls[1].headers.get("if-none-match"), null);
});

test("429 con Retry-After: attende esattamente quanto chiesto, poi riprova", async () => {
  const s = scripted([res(429, { "retry-after": "3" }), res(200, {}, "ok")]);
  const r = await politeFetch("https://x.example/r", {}, s.opts);
  assert.equal(r.status, 200);
  assert.deepEqual(s.waits, [3000]);
});

test("503 senza Retry-After: backoff esponenziale, mai raffica immediata", async () => {
  const s = scripted([res(503), res(503), res(503), res(200)]);
  const r = await politeFetch("https://x.example/b", {}, s.opts);
  assert.equal(r.status, 200);
  assert.deepEqual(s.waits, [1000, 2000, 4000]);
});

test("503 persistente: tentativi limitati, poi restituisce la risposta", async () => {
  const s = scripted([res(503), res(503), res(503), res(503)]);
  const r = await politeFetch("https://x.example/p", {}, s.opts);
  assert.equal(r.status, 503);
  assert.equal(s.calls.length, 4);
});

test("Retry-After oltre il tetto: non si blocca il sync, restituisce 429", async () => {
  const s = scripted([res(429, { "retry-after": "3600" })]);
  const r = await politeFetch("https://x.example/l", {}, s.opts);
  assert.equal(r.status, 429);
  assert.deepEqual(s.waits, []);
});

test("timeout / connessione caduta: retry semplice, tentativi limitati", async () => {
  const timeout = () => Object.assign(new Error("t"), { name: "TimeoutError" });
  const ok = scripted([timeout(), new TypeError("fetch failed"), res(200, {}, "ok")]);
  assert.equal((await politeFetch("https://x.example/t", {}, ok.opts)).status, 200);
  assert.equal(ok.waits.length, 2);

  const bad = scripted([timeout(), timeout(), timeout(), res(200)]);
  await assert.rejects(politeFetch("https://x.example/t", {}, bad.opts));
  assert.equal(bad.calls.length, 3);
});

test("errori non di rete (e abort del chiamante) non vengono ritentati", async () => {
  const s = scripted([new RangeError("boom"), res(200)]);
  await assert.rejects(politeFetch("https://x.example/e", {}, s.opts), RangeError);
  assert.equal(s.calls.length, 1);

  const ctl = new AbortController();
  ctl.abort();
  const t = scripted([Object.assign(new Error("a"), { name: "AbortError" }), res(200)]);
  await assert.rejects(politeFetch("https://x.example/e2", { signal: ctl.signal }, t.opts));
  assert.equal(t.calls.length, 1);
});

test("parseRetryAfter: secondi, data HTTP, valori invalidi", () => {
  assert.equal(parseRetryAfter("5"), 5000);
  assert.equal(parseRetryAfter(null), null);
  assert.equal(parseRetryAfter("boh"), null);
  const now = Date.parse("2026-01-01T00:00:00Z");
  assert.equal(parseRetryAfter("Thu, 01 Jan 2026 00:00:07 GMT", now), 7000);
});

test("pausa per host: richieste allo stesso host distanziate, host diversi no", async () => {
  const t = 1000;
  const s = scripted([res(200), res(200), res(200)]);
  const opts = { ...s.opts, hostGapMs: 250, now: () => t };
  await politeFetch("https://a.example/1", {}, opts);
  await politeFetch("https://a.example/2", {}, opts); // subito dopo: deve attendere 250ms
  await politeFetch("https://b.example/1", {}, opts); // altro host: nessuna attesa
  assert.deepEqual(s.waits, [250]);
});
