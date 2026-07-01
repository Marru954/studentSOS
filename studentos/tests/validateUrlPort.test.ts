/**
 * Regressione #2 (audit sicurezza): l'allowlist è keyed su host[:port]
 * (`URL.host`), non solo hostname. Un `preset-host:9999` non deve passare il
 * check anche se l'hostname nudo è in allowlist (evita port-scan / servizi
 * off-port interni sullo stesso host).
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { SyncUrlError, validateSyncUrl } from "@/lib/sync/validateUrl";

const resolvePublic = async () => ["93.184.216.34"]; // IP pubblico

test("validateSyncUrl rifiuta un host allowlisted ma su porta non consentita", async () => {
  // allowlist contiene solo il bare host (porta default) → :9999 non combacia.
  await assert.rejects(
    () =>
      validateSyncUrl("https://safe.uni.it:9999/agendaweb", {
        allowlist: new Set(["safe.uni.it"]),
        resolve: resolvePublic,
      }),
    SyncUrlError,
  );
});

test("validateSyncUrl accetta la porta esatta quando l'allowlist la pinna", async () => {
  const url = await validateSyncUrl("https://safe.uni.it:8443/agendaweb", {
    allowlist: new Set(["safe.uni.it:8443"]),
    resolve: resolvePublic,
  });
  assert.equal(url.host, "safe.uni.it:8443");
});

test("validateSyncUrl: bare host in allowlist accetta l'URL a porta default", async () => {
  // URL.host omette la porta di default → combacia con il bare host in lista.
  const url = await validateSyncUrl("https://safe.uni.it/agendaweb", {
    allowlist: new Set(["safe.uni.it"]),
    resolve: resolvePublic,
  });
  assert.equal(url.host, "safe.uni.it");
});
