"use client";

/**
 * Bridges the offline-first Zustand/IndexedDB stores to Supabase.
 *
 * On sign-in we reconcile once: pull the account; if the cloud already has data
 * it is the source of truth and replaces the local cache; if the cloud is empty
 * we migrate the existing local data up (first login from a local-only setup).
 * After reconciliation we attach store subscriptions that push every later
 * mutation to the cloud, best-effort — IndexedDB stays the authoritative local
 * cache so the UI never blocks on the network.
 */
import type { StoreApi } from "zustand";
import {
  useFocusSessions,
  useLibretto,
  useNotes,
  useTasks,
} from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import {
  deleteItem,
  pullAll,
  pushItem,
  pushMany,
  pushProfile,
  type RemoteTable,
} from "./remote";

/** Set while we apply remote data locally, so mirrors don't echo it back. */
let applying = false;

interface ItemStore {
  items: { id: string }[];
  clear(): Promise<void>;
  upsertMany(items: never[]): Promise<void>;
}

interface Territory {
  table: RemoteTable;
  store: StoreApi<ItemStore>;
  remote: () => { id: string }[];
}

let stopFns: Array<() => void> = [];

/** Attach a push-on-change mirror to one territory store. */
function mirror(
  store: StoreApi<ItemStore>,
  table: RemoteTable,
  getUserId: () => string | null,
): () => void {
  const snapshot = new Map<string, string>();
  for (const it of store.getState().items) snapshot.set(it.id, JSON.stringify(it));

  return store.subscribe((state) => {
    if (applying) return;
    const uid = getUserId();
    if (!uid) return;
    const next = new Map<string, string>();
    for (const it of state.items) next.set(it.id, JSON.stringify(it));

    for (const id of snapshot.keys()) {
      if (!next.has(id)) void deleteItem(table, uid, id);
    }
    for (const it of state.items) {
      if (snapshot.get(it.id) !== next.get(it.id)) void pushItem(table, uid, it);
    }
    snapshot.clear();
    for (const [id, json] of next) snapshot.set(id, json);
  });
}

/** One-time reconcile + start the live mirrors. Idempotent per session. */
export async function startCloudSync(
  userId: string,
  email: string | null,
): Promise<void> {
  stopCloudSync();

  const territories: Territory[] = [];
  applying = true;
  try {
    const remote = await pullAll(userId);

    // ── personal territories ──
    const map: Array<{
      table: RemoteTable;
      store: StoreApi<ItemStore>;
      rows: { id: string }[];
    }> = [
      { table: "libretto_entries", store: useLibretto as unknown as StoreApi<ItemStore>, rows: remote.libretto },
      { table: "notes", store: useNotes as unknown as StoreApi<ItemStore>, rows: remote.notes },
      { table: "tasks", store: useTasks as unknown as StoreApi<ItemStore>, rows: remote.tasks },
      { table: "focus_sessions", store: useFocusSessions as unknown as StoreApi<ItemStore>, rows: remote.focus },
    ];

    for (const { table, store, rows } of map) {
      const local = store.getState().items;
      if (rows.length > 0) {
        // cloud wins
        await store.getState().clear();
        await store.getState().upsertMany(rows as never[]);
      } else if (local.length > 0) {
        // migrate local-only data up to the cloud
        await pushMany(table, userId, local);
      }
      territories.push({ table, store, remote: () => rows });
    }

    // ── profile / settings ──
    const settings = useSettings.getState();
    if (remote.profile && remote.profile.preset_id) {
      await settings.update({
        presetId: remote.profile.preset_id ?? undefined,
        programme: remote.profile.programme ?? undefined,
        yearOfStudy: remote.profile.year_of_study ?? undefined,
        degreePlan: remote.profile.degree_plan ?? settings.degreePlan,
      });
    } else {
      await pushProfile(userId, email, {
        presetId: settings.presetId,
        programme: settings.programme,
        yearOfStudy: settings.yearOfStudy,
        degreePlan: settings.degreePlan,
      });
    }
  } finally {
    applying = false;
  }

  // ── live mirrors ──
  const getUid = () => userId;
  for (const t of territories) {
    stopFns.push(mirror(t.store, t.table, getUid));
  }
  // push profile whenever onboarding-relevant settings change
  let profileSnap = profileKey();
  stopFns.push(
    useSettings.subscribe(() => {
      if (applying) return;
      const k = profileKey();
      if (k === profileSnap) return;
      profileSnap = k;
      const s = useSettings.getState();
      void pushProfile(userId, email, {
        presetId: s.presetId,
        programme: s.programme,
        yearOfStudy: s.yearOfStudy,
        degreePlan: s.degreePlan,
      });
    }),
  );
}

function profileKey(): string {
  const s = useSettings.getState();
  return JSON.stringify([s.presetId, s.programme, s.yearOfStudy, s.degreePlan]);
}

export function stopCloudSync(): void {
  for (const stop of stopFns) stop();
  stopFns = [];
}
