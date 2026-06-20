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

/** Logical identity of an insegnamento, independent of its stored id: the
 *  course code when present, otherwise normalised name + anno. Used to decide
 *  whether an incoming synced row corresponds to one the student already
 *  protected (so we never overwrite it nor create a duplicate). */
function logicalKey(row: Pick<Insegnamento, "codice" | "nome" | "anno">): string {
  const codice = row.codice?.trim().toLowerCase();
  if (codice) return `c:${codice}`;
  const nome = row.nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const anno = (row.anno ?? "").toString().trim().toLowerCase();
  return `n:${nome}|${anno}`;
}

/** True for any row the student has made their own — manual entries and synced
 *  rows they have edited. Sync must leave these completely intact. */
function isProtected(row: Insegnamento): boolean {
  return row.inserito_manualmente === true || row.modificato_manualmente === true;
}

/** Write the parsed rows, replacing only the corso's UNTOUCHED synced bucket.
 *  Rows the student added or edited (see `isProtected`) are never overwritten or
 *  removed, and an incoming row matching one of them (by `logicalKey`) is skipped
 *  to avoid duplicates. Returns the number of synced rows written this run. */
async function persist(
  ateneo_id: string,
  corso_id: string,
  parsed: Insegnamento[],
  url: string,
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();

  const tx = db.transaction(["insegnamenti", "manifesti"], "readwrite");
  const store = tx.objectStore("insegnamenti");
  const existing = (await store.index("by-corso").getAll(corso_id)).filter(
    (r) => r.ateneo_id === ateneo_id,
  );

  // Logical keys the student has claimed — incoming rows hitting these are
  // dropped (the protected row wins), so a re-sync can't duplicate or clobber.
  const protectedKeys = new Set(
    existing.filter(isProtected).map(logicalKey),
  );

  // Stamp identity; dedupe by stable id (a manifesto may list a course twice);
  // skip anything the student protected.
  const incoming = new Map<string, Insegnamento>();
  for (const row of parsed) {
    if (protectedKeys.has(logicalKey(row))) continue;
    const id = stableId("ins", ateneo_id, corso_id, row.codice || row.nome);
    incoming.set(id, { ...row, id, ateneo_id, corso_id });
  }

  // Among untouched synced rows: preserve created_at, drop those no longer listed.
  const createdAt = new Map<string, string>();
  for (const row of existing) {
    if (isProtected(row)) continue; // never touch protected rows
    createdAt.set(row.id, row.created_at);
    if (!incoming.has(row.id)) await store.delete(row.id);
  }

  for (const row of incoming.values()) {
    await store.put({
      ...row,
      modificato_manualmente: false,
      created_at: createdAt.get(row.id) ?? now,
      updated_at: now,
    });
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
