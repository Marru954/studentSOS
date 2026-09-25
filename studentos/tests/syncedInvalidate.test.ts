import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { useSynced } from "@/lib/state/synced";
import { useSettings } from "@/lib/state/settings";
import { getClassEvents } from "@/lib/storage/repo";
import { runSync } from "@/lib/storage/syncClient";
import { __resetDbForTests } from "@/lib/storage/db";
import type { SyncSource } from "@/lib/sync/provider";

const realFetch = globalThis.fetch;

const SOURCE = {
  id: "corso-orario-anno-1",
  capability: "timetable",
} as unknown as SyncSource;

function apiResponse(source: SyncSource = SOURCE) {
  return new Response(
    JSON.stringify({
      syncedAt: "2026-09-25T10:00:00.000Z",
      results: [
        {
          sourceId: source.id,
          capability: "timetable",
          ok: true,
          data: [
            {
              id: `e-${source.id}`,
              courseName: "ANALISI",
              start: "2026-10-05T07:00:00.000Z",
              end: "2026-10-05T09:00:00.000Z",
              kind: "lecture",
              sourceId: source.id,
            },
          ],
        },
      ],
    }),
    { status: 200 },
  );
}

const RANGE = { from: "2026-09-21", to: "2026-12-31" };

beforeEach(async () => {
  await __resetDbForTests();
  globalThis.fetch = realFetch;
});

test("runSync: risultati scartati se shouldApply diventa false dopo il fetch", async () => {
  globalThis.fetch = (async () => apiResponse()) as typeof fetch;
  const summary = await runSync([SOURCE], RANGE, () => false);
  assert.equal(summary.okCount, 0);
  assert.equal((await getClassEvents()).length, 0);
});

test("runSync: senza shouldApply scrive come prima", async () => {
  globalThis.fetch = (async () => apiResponse()) as typeof fetch;
  const summary = await runSync([SOURCE], RANGE);
  assert.equal(summary.okCount, 1);
  assert.equal((await getClassEvents()).length, 1);
});

test("useSynced.invalidate: un sync in volo non scrive dopo l'invalidazione", async () => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  globalThis.fetch = (async () => {
    await gate;
    return apiResponse();
  }) as typeof fetch;
  const OTHER = { id: "altro-orario-anno-1", capability: "timetable" } as unknown as SyncSource;
  globalThis.fetch = (async () => {
    await gate;
    return apiResponse(OTHER);
  }) as typeof fetch;
  useSettings.setState({ enabledSources: () => [OTHER] });
  useSynced.setState({ syncing: false, classEvents: [] });

  const before = (await getClassEvents()).length; // il DB può conservare righe dei test precedenti
  const inFlight = useSynced.getState().sync();
  assert.equal(useSynced.getState().syncing, true);
  useSynced.getState().invalidate(); // es. cambio ateneo + clearSyncedCaches
  assert.equal(useSynced.getState().syncing, false);
  release();
  await inFlight;

  assert.equal((await getClassEvents()).length, before);
  assert.equal(useSynced.getState().classEvents.length, 0);
});
