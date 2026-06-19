/**
 * Insegnamenti sync driver (CLIENT-SIDE).
 *
 * Mirrors the existing sync split: the browser can't fetch other universities'
 * sites (CORS), so the server route discovers + fetches the manifesto HTML; the
 * server can neither parse it (no `DOMParser`) nor persist it (no IndexedDB), so
 * THIS module — running in the browser — parses with `DOMParser` and writes to
 * IndexedDB. IndexedDB stays the source of truth.
 *
 * Idempotent persistence: synced rows get content-stable ids (`stableId`), and a
 * re-sync atomically replaces ONLY the synced bucket for the corso
 * (`inserito_manualmente === false`), preserving the student's manual rows and
 * each synced row's original `created_at`. Same manifesto in → same rows out.
 */
import { getDb } from "@/lib/storage/db";
import { stableId } from "@/lib/sync/util";
import { currentAcademicYear } from "@/lib/domain/academicYear";
import type { Insegnamento } from "@/types/insegnamenti";
import type { ManifestoApiResponse } from "./discovery";
import { parseManifestoHTML } from "./parser";

export type SyncResult =
  | { status: "ok"; count: number; url: string }
  | { status: "manual" }
  | { status: "error"; error: string };

export async function syncInsegnamenti(
  ateneo_id: string,
  corso_id: string,
): Promise<SyncResult> {
  // 1. Server proxy: discover + fetch the manifesto HTML (or tell us to go manual).
  let api: ManifestoApiResponse;
  try {
    const res = await fetch("/api/insegnamenti/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ateneo_id, corso_id }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { status: "error", error: body.error ?? `API ${res.status}` };
    }
    api = (await res.json()) as ManifestoApiResponse;
  } catch (cause) {
    return { status: "error", error: cause instanceof Error ? cause.message : "rete non disponibile" };
  }

  if (api.status === "manual") return { status: "manual" };
  if (api.status === "error") return { status: "error", error: api.error };

  // 2. Parse client-side (DOMParser). No table rows → effectively manual.
  const parsed = parseManifestoHTML(api.html);
  if (parsed.length === 0) return { status: "manual" };

  // 3. Persist idempotently + stamp the manifesto's last_sync.
  const count = await persist(ateneo_id, corso_id, parsed, api.url);
  return { status: "ok", count, url: api.url };
}

/** Write the parsed rows, replacing only the corso's synced bucket. Returns the
 *  number of synced insegnamenti now stored for the corso. */
async function persist(
  ateneo_id: string,
  corso_id: string,
  parsed: Insegnamento[],
  url: string,
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();

  // Stamp identity; dedupe by stable id (a manifesto may list a course twice).
  const incoming = new Map<string, Insegnamento>();
  for (const row of parsed) {
    const id = stableId("ins", ateneo_id, corso_id, row.codice || row.nome);
    incoming.set(id, { ...row, id, ateneo_id, corso_id });
  }

  const tx = db.transaction(["insegnamenti", "manifesti"], "readwrite");
  const store = tx.objectStore("insegnamenti");

  // Preserve created_at for rows that persist; drop synced rows no longer listed.
  const existing = await store.index("by-corso").getAll(corso_id);
  const createdAt = new Map<string, string>();
  for (const row of existing) {
    if (row.ateneo_id !== ateneo_id || row.inserito_manualmente !== false) continue;
    createdAt.set(row.id, row.created_at);
    if (!incoming.has(row.id)) await store.delete(row.id);
  }

  for (const row of incoming.values()) {
    await store.put({ ...row, created_at: createdAt.get(row.id) ?? now, updated_at: now });
  }

  await tx.objectStore("manifesti").put({
    id: stableId("manifesto", ateneo_id, corso_id),
    ateneo_id,
    corso_id,
    url_sorgente: url,
    anno_accademico: currentAcademicYear(),
    last_sync: now,
  });

  await tx.done;
  return incoming.size;
}
