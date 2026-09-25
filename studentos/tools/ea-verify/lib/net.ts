/**
 * Rete: SOLO richieste pubbliche in lettura verso gli endpoint agenda dei preset.
 * Gli URL si costruiscono a runtime dal baseUrl del preset (mai letterali nel codice).
 */

export const USER_AGENT = "StudentOS-ea-verify/1 (verifica cataloghi orari; sola lettura; richieste diradate)";

export interface NetOptions {
  timeoutMs: number;
  retries: number;
  pauseMs: number;
  concurrency: number;
}

export const DEFAULT_NET: NetOptions = { timeoutMs: 45_000, retries: 2, pauseMs: 150, concurrency: 3 };

/** Massimo 3 richieste in parallelo, comunque. */
export const clampConcurrency = (n: number): number => Math.min(3, Math.max(1, Math.floor(n) || 1));

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function withRetry<T>(fn: () => Promise<T>, o: NetOptions): Promise<T> {
  let last: unknown;
  for (let i = 0; i <= o.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await sleep(800 * (i + 1));
    }
  }
  throw last;
}

export async function getText(url: string, o: NetOptions): Promise<string> {
  return withRetry(async () => {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(o.timeoutMs), redirect: "manual" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }, o);
}

export async function postForm(url: string, form: [string, string][], o: NetOptions): Promise<unknown> {
  const body = new URLSearchParams();
  for (const [k, v] of form) body.append(k, v);
  const json = await withRetry(async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
      body: body.toString(),
      signal: AbortSignal.timeout(o.timeoutMs),
      redirect: "manual",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as unknown;
  }, o);
  await sleep(o.pauseMs);
  return json;
}

/** Esegue `fn` su tutti gli item con al piu' `concurrency` in parallelo. */
export async function pool<T, R>(items: T[], concurrency: number, fn: (t: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: clampConcurrency(concurrency) }, async () => {
    while (next < items.length) {
      const k = next++;
      out[k] = await fn(items[k], k);
    }
  });
  await Promise.all(workers);
  return out;
}
