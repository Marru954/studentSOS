/**
 * Regressione #5 (audit sicurezza): l'allowlist è scoped per providerId. Un host
 * spedito per un provider non deve essere raggiungibile guidandolo come sorgente
 * di un altro provider (relay attraverso l'adapter sbagliato).
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import type { SyncSource } from "@/lib/sync/provider";
import {
  SyncUrlError,
  allowedHosts,
  allowedHostsFor,
  validateSources,
} from "@/lib/sync/validateUrl";

// easyutv.uniroma2.it è un host EasyAcademy reale (Tor Vergata, uniroma2.ts).
const EA_HOST = "easyutv.uniroma2.it";
const resolvePublic = async () => ["93.184.216.34"]; // IP pubblico, no network

test("allowedHostsFor: l'host EasyAcademy è registrato sotto 'easyacademy'", () => {
  assert.equal(allowedHostsFor("easyacademy").has(EA_HOST), true);
});

test("allowedHostsFor: lo stesso host NON è nel set di un altro provider", () => {
  assert.equal(allowedHostsFor("ical").has(EA_HOST), false);
  assert.equal(allowedHostsFor("wordpress-news").has(EA_HOST), false);
});

test("allowedHostsFor: provider sconosciuto -> set vuoto", () => {
  assert.equal(allowedHostsFor("provider-inesistente").size, 0);
});

test("allowedHosts (union) resta un superset di ogni set per-provider", () => {
  const union = allowedHosts();
  assert.equal(union.has(EA_HOST), true);
});

test("validateSources accetta l'host EasyAcademy sotto il suo provider", async () => {
  const src: SyncSource = {
    id: "a",
    label: "a",
    capability: "timetable",
    providerId: "easyacademy",
    params: { kind: "timetable", baseUrl: `https://${EA_HOST}/agendaweb` },
  };
  await assert.doesNotReject(() => validateSources([src], { resolve: resolvePublic }));
});

test("validateSources rifiuta lo stesso host guidato come sorgente ical", async () => {
  const src: SyncSource = {
    id: "b",
    label: "b",
    capability: "timetable",
    providerId: "ical",
    params: { url: `https://${EA_HOST}/feed.ics` },
  };
  await assert.rejects(
    () => validateSources([src], { resolve: resolvePublic }),
    SyncUrlError,
  );
});
