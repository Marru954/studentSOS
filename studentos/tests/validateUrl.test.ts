import assert from "node:assert/strict";
import { test } from "node:test";
import type { SyncSource } from "@/lib/sync/provider";
import {
  SyncUrlError,
  allowedHosts,
  isPrivateIp,
  sourceUrls,
  validateSources,
  validateSyncUrl,
} from "@/lib/sync/validateUrl";

// A fixed allowlist + resolver so the tests never touch the real network.
const ALLOW = new Set(["safe.uni.it", "169.254.169.254"]);
const resolvePublic = async () => ["93.184.216.34"]; // example.com, public
const resolveMeta = async () => ["169.254.169.254"]; // cloud metadata, private

// ── isPrivateIp ────────────────────────────────────────────────────────────────

test("isPrivateIp riconosce i range privati IPv4", () => {
  for (const ip of [
    "10.0.0.1",
    "10.255.255.255",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "127.0.0.1",
    "169.254.169.254",
    "0.0.0.0",
  ]) {
    assert.equal(isPrivateIp(ip), true, `${ip} dovrebbe essere privato`);
  }
});

test("isPrivateIp lascia passare gli IPv4 pubblici", () => {
  for (const ip of ["93.184.216.34", "8.8.8.8", "172.15.0.1", "172.32.0.1"]) {
    assert.equal(isPrivateIp(ip), false, `${ip} dovrebbe essere pubblico`);
  }
});

test("isPrivateIp riconosce i range privati IPv6", () => {
  for (const ip of ["::1", "::", "fc00::1", "fd12:3456::1", "fe80::1", "::ffff:127.0.0.1"]) {
    assert.equal(isPrivateIp(ip), true, `${ip} dovrebbe essere privato`);
  }
  assert.equal(isPrivateIp("2606:4700:4700::1111"), false); // Cloudflare, pubblico
});

test("isPrivateIp tratta come non sicuro tutto ciò che non è un IP literal", () => {
  assert.equal(isPrivateIp("not-an-ip"), true);
  assert.equal(isPrivateIp(""), true);
});

// ── validateSyncUrl ─────────────────────────────────────────────────────────────

test("validateSyncUrl accetta un host in allowlist che risolve a IP pubblico", async () => {
  const url = await validateSyncUrl("https://safe.uni.it/agendaweb", {
    allowlist: ALLOW,
    resolve: resolvePublic,
  });
  assert.equal(url.hostname, "safe.uni.it");
});

test("validateSyncUrl rifiuta un host fuori allowlist", async () => {
  await assert.rejects(
    () => validateSyncUrl("https://evil.example.com/", { allowlist: ALLOW, resolve: resolvePublic }),
    SyncUrlError,
  );
});

test("validateSyncUrl rifiuta protocolli non http(s)", async () => {
  for (const raw of ["file:///etc/passwd", "ftp://safe.uni.it/", "gopher://safe.uni.it/"]) {
    await assert.rejects(
      () => validateSyncUrl(raw, { allowlist: ALLOW, resolve: resolvePublic }),
      SyncUrlError,
    );
  }
});

test("validateSyncUrl rifiuta un URL malformato", async () => {
  await assert.rejects(
    () => validateSyncUrl("http://", { allowlist: ALLOW, resolve: resolvePublic }),
    SyncUrlError,
  );
});

test("validateSyncUrl blocca il DNS rebinding: host allowed ma IP interno", async () => {
  // 169.254.169.254 è nell'allowlist di test ma risolve a un IP privato.
  await assert.rejects(
    () => validateSyncUrl("http://169.254.169.254/latest/meta-data/", {
      allowlist: ALLOW,
      resolve: resolveMeta,
    }),
    SyncUrlError,
  );
});

test("validateSyncUrl blocca un IP literal privato senza DNS lookup", async () => {
  let resolved = false;
  await assert.rejects(
    () =>
      validateSyncUrl("http://127.0.0.1/", {
        allowlist: new Set(["127.0.0.1"]),
        resolve: async () => {
          resolved = true;
          return ["1.2.3.4"];
        },
      }),
    SyncUrlError,
  );
  assert.equal(resolved, false, "un IP literal non deve passare dal resolver");
});

test("validateSyncUrl rifiuta quando il resolver non restituisce indirizzi", async () => {
  await assert.rejects(
    () => validateSyncUrl("https://safe.uni.it/", { allowlist: ALLOW, resolve: async () => [] }),
    SyncUrlError,
  );
});

// ── sourceUrls + validateSources ────────────────────────────────────────────────

test("sourceUrls estrae baseUrl e url dai params", () => {
  const ea: SyncSource = {
    id: "x",
    label: "x",
    capability: "timetable",
    providerId: "easyacademy",
    params: { kind: "timetable", baseUrl: "https://safe.uni.it/agendaweb" },
  };
  const ics: SyncSource = {
    id: "y",
    label: "y",
    capability: "timetable",
    providerId: "ical",
    params: { url: "https://safe.uni.it/feed.ics" },
  };
  const empty: SyncSource = {
    id: "z",
    label: "z",
    capability: "news",
    providerId: "ical",
    params: null,
  };
  assert.deepEqual(sourceUrls(ea), ["https://safe.uni.it/agendaweb"]);
  assert.deepEqual(sourceUrls(ics), ["https://safe.uni.it/feed.ics"]);
  assert.deepEqual(sourceUrls(empty), []);
});

test("validateSources passa quando tutte le URL sono valide e fallisce sulla prima ostile", async () => {
  const good: SyncSource = {
    id: "g",
    label: "g",
    capability: "timetable",
    providerId: "easyacademy",
    params: { kind: "timetable", baseUrl: "https://safe.uni.it/agendaweb" },
  };
  const bad: SyncSource = {
    id: "b",
    label: "b",
    capability: "timetable",
    providerId: "ical",
    params: { url: "http://169.254.169.254/" },
  };
  await assert.doesNotReject(() =>
    validateSources([good], { allowlist: ALLOW, resolve: resolvePublic }),
  );
  await assert.rejects(
    () => validateSources([good, bad], { allowlist: ALLOW, resolve: resolveMeta }),
    SyncUrlError,
  );
});

// ── allowlist reale (derivata dai preset) ───────────────────────────────────────

test("allowedHosts deriva gli host reali dai preset spediti", () => {
  const hosts = allowedHosts();
  // Tor Vergata è cablato in uniroma2.ts (EASY_BASE = easyutv.uniroma2.it).
  assert.equal(hosts.has("easyutv.uniroma2.it"), true);
  // Nessun host interno deve mai finire nell'allowlist.
  for (const h of ["127.0.0.1", "localhost", "169.254.169.254"]) {
    assert.equal(hosts.has(h), false);
  }
  assert.ok(hosts.size > 1, "l'allowlist dovrebbe contenere più atenei live");
});
