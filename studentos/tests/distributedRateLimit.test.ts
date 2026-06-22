import assert from "node:assert/strict";
import { test } from "node:test";
import {
  distributedRateLimit,
  fixedWindowStep,
  hashKey,
  type RateDecision,
  type WindowState,
} from "@/lib/api/distributedRateLimit";

/** Esegue `fn` con RATE_LIMIT_SECRET impostato, ripristinando l'env dopo. */
async function withSecret(secret: string, fn: () => void | Promise<void>): Promise<void> {
  const prev = process.env.RATE_LIMIT_SECRET;
  process.env.RATE_LIMIT_SECRET = secret;
  try {
    await fn();
  } finally {
    if (prev === undefined) delete process.env.RATE_LIMIT_SECRET;
    else process.env.RATE_LIMIT_SECRET = prev;
  }
}

// --- fixedWindowStep: logica pura della finestra fissa --------------------

test("fixedWindowStep: primo colpo apre la finestra con count 1", () => {
  const { next, decision } = fixedWindowStep(null, 1000, 3, 60_000);
  assert.equal(next.count, 1);
  assert.equal(next.windowStart, 1000);
  assert.equal(decision.ok, true);
  assert.equal(decision.count, 1);
});

test("fixedWindowStep: sotto soglia incrementa e resta ok", () => {
  const prev: WindowState = { windowStart: 1000, count: 2 };
  const { next, decision } = fixedWindowStep(prev, 2000, 3, 60_000);
  assert.equal(next.count, 3);
  assert.equal(decision.ok, true);
});

test("fixedWindowStep: sopra soglia blocca con retryAfter > 0", () => {
  const prev: WindowState = { windowStart: 1000, count: 3 };
  const { decision } = fixedWindowStep(prev, 2000, 3, 60_000);
  assert.equal(decision.ok, false);
  assert.equal(decision.count, 4);
  assert.ok(decision.retryAfter > 0);
});

test("fixedWindowStep: finestra scaduta riparte da 1", () => {
  const prev: WindowState = { windowStart: 1000, count: 9 };
  const now = 1000 + 60_000; // esattamente alla scadenza
  const { next, decision } = fixedWindowStep(prev, now, 3, 60_000);
  assert.equal(next.count, 1);
  assert.equal(next.windowStart, now);
  assert.equal(decision.ok, true);
});

// --- distributedRateLimit: backstop in-memory iniettato -------------------
// rpc:null forza il backstop; store + now iniettati per determinismo.

test("distributedRateLimit: sotto soglia -> passa", async () => {
  const store = new Map<string, WindowState>();
  for (let i = 0; i < 3; i++) {
    const d = await distributedRateLimit(
      "k",
      { limit: 3, windowMs: 60_000 },
      { rpc: null, now: 1000, fallback: store },
    );
    assert.equal(d.ok, true, `colpo ${i + 1} deve passare`);
  }
});

test("distributedRateLimit: sopra soglia -> blocca", async () => {
  const store = new Map<string, WindowState>();
  const opts = { limit: 3, windowMs: 60_000 };
  for (let i = 0; i < 3; i++) {
    await distributedRateLimit("k", opts, { rpc: null, now: 1000, fallback: store });
  }
  const blocked = await distributedRateLimit("k", opts, {
    rpc: null,
    now: 1000,
    fallback: store,
  });
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfter > 0);
});

test("distributedRateLimit: reset finestra -> torna a passare", async () => {
  const store = new Map<string, WindowState>();
  const opts = { limit: 1, windowMs: 60_000 };
  const first = await distributedRateLimit("k", opts, {
    rpc: null,
    now: 1000,
    fallback: store,
  });
  assert.equal(first.ok, true);
  const blocked = await distributedRateLimit("k", opts, {
    rpc: null,
    now: 1000,
    fallback: store,
  });
  assert.equal(blocked.ok, false);
  // avanza oltre la finestra → nuova finestra, di nuovo consentito
  const after = await distributedRateLimit("k", opts, {
    rpc: null,
    now: 1000 + 60_001,
    fallback: store,
  });
  assert.equal(after.ok, true);
});

test("distributedRateLimit: usa la RPC distribuita quando fornita", async () => {
  const rpc = async (): Promise<RateDecision> => ({ ok: false, retryAfter: 42, count: 99 });
  const d = await distributedRateLimit("k", { limit: 1, windowMs: 60_000 }, { rpc });
  assert.equal(d.ok, false);
  assert.equal(d.retryAfter, 42);
  assert.equal(d.count, 99);
});

test("distributedRateLimit: RPC che lancia -> fail-open verso backstop", async () => {
  const store = new Map<string, WindowState>();
  const rpc = async (): Promise<RateDecision> => {
    throw new Error("supabase down");
  };
  // Non deve propagare l'errore: degrada al backstop e concede il primo colpo.
  const d = await distributedRateLimit(
    "k",
    { limit: 3, windowMs: 60_000 },
    { rpc, now: 1000, fallback: store },
  );
  assert.equal(d.ok, true);
  assert.equal(d.count, 1);
});

// --- hashKey: salatura HMAC delle chiavi (chiude il DoS via RPC diretta) ---

test("hashKey: con segreto produce 'chiave:<digest>' opaco", async () => {
  await withSecret("super-secret", () => {
    const h = hashKey("ai:cb");
    assert.ok(h.startsWith("ai:cb:"), "deve conservare il prefisso logico");
    assert.notEqual(h, "ai:cb");
    assert.ok(h.length > "ai:cb:".length, "deve avere un digest non vuoto");
  });
});

test("hashKey: chiavi logiche diverse -> hash diversi (no collisione)", async () => {
  await withSecret("super-secret", () => {
    assert.notEqual(hashKey("ai:cb"), hashKey("ai:daily"));
  });
});

test("hashKey: deterministico a parità di chiave e segreto", async () => {
  await withSecret("super-secret", () => {
    assert.equal(hashKey("ai:cb"), hashKey("ai:cb"));
  });
});

test("hashKey: segreti diversi -> digest diversi per la stessa chiave", async () => {
  let a = "";
  let b = "";
  await withSecret("secret-A", () => {
    a = hashKey("ai:cb");
  });
  await withSecret("secret-B", () => {
    b = hashKey("ai:cb");
  });
  assert.notEqual(a, b);
});

test("hashKey: senza segreto -> chiave invariata (build locale/offline)", () => {
  const prev = process.env.RATE_LIMIT_SECRET;
  const prevGroq = process.env.GROQ_API_KEY;
  delete process.env.RATE_LIMIT_SECRET;
  delete process.env.GROQ_API_KEY;
  try {
    assert.equal(hashKey("ai:cb"), "ai:cb");
  } finally {
    if (prev !== undefined) process.env.RATE_LIMIT_SECRET = prev;
    if (prevGroq !== undefined) process.env.GROQ_API_KEY = prevGroq;
  }
});

test("distributedRateLimit: la RPC riceve la chiave SALATA, non quella raw", async () => {
  await withSecret("super-secret", async () => {
    let seenKey = "";
    const rpc = async (key: string): Promise<RateDecision> => {
      seenKey = key;
      return { ok: true, retryAfter: 0, count: 1 };
    };
    await distributedRateLimit("ai:cb", { limit: 60, windowMs: 60_000 }, { rpc });
    assert.notEqual(seenKey, "ai:cb", "non deve passare la chiave logica in chiaro");
    assert.equal(seenKey, hashKey("ai:cb"), "deve passare esattamente la chiave saltata");
  });
});
