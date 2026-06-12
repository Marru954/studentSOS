/**
 * Adapter Esse3 (CINECA e3rest) — server-only. Recupera la carriera reale di
 * uno studente a partire dalla matricola presa dalla Assertion SAML.
 *
 * Autenticazione: Esse3 REST usa HTTP Basic. La Assertion SAML NON porta la
 * password Esse3 dello studente, quindi qui si usa un **account integrazione**
 * istituzionale (env `ESSE3_API_USER`/`ESSE3_API_PASSWORD`) abilitato a leggere
 * i libretti per matricola. Senza queste env l'adapter è disattivo e
 * /api/saml/synced ripiega sui dati mock (sviluppo).
 *
 * NB: i path/parametri e3rest variano per versione e configurazione d'ateneo;
 * la risoluzione persId→matId→righe qui è quella tipica ma va verificata
 * contro l'istanza reale. Il parsing (testato) vive in ./parse.
 */
import type { LibrettoEntry } from "@/lib/domain/types";
import { parseEsse3Libretto } from "./parse";

const BASE = process.env.ESSE3_BASE_URL; // es. https://uniroma2.esse3.cineca.it
const USER = process.env.ESSE3_API_USER;
const PASS = process.env.ESSE3_API_PASSWORD;

export class Esse3Error extends Error {}

/** True se l'adapter Esse3 è configurato (altrimenti si usa il mock). */
export function esse3Enabled(): boolean {
  return Boolean(BASE && USER && PASS);
}

function authHeader(): string {
  return `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`;
}

async function get(path: string, signal: AbortSignal): Promise<unknown> {
  const res = await fetch(`${BASE}/e3rest/api${path}`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
    signal,
  });
  if (res.status === 401 || res.status === 403) {
    throw new Esse3Error("Credenziali dell'account integrazione Esse3 non valide.");
  }
  if (!res.ok) {
    throw new Esse3Error(`Esse3 ha risposto ${res.status} su ${path}.`);
  }
  return res.json();
}

function pick(value: unknown, ...keys: string[]): unknown {
  const obj = (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | undefined;
  if (!obj) return undefined;
  for (const k of keys) if (obj[k] != null) return obj[k];
  return undefined;
}

export async function fetchEsse3Libretto(
  matricola: string,
  signal: AbortSignal,
): Promise<LibrettoEntry[]> {
  if (!esse3Enabled()) throw new Esse3Error("Esse3 non configurato.");

  // 1) risolvi la persona dalla matricola
  const persone = await get(
    `/anagrafica-service-v2/persone?matricola=${encodeURIComponent(matricola)}`,
    signal,
  );
  const persId = pick(persone, "persId", "id");
  if (!persId) throw new Esse3Error("Nessuna persona trovata per la matricola.");

  // 2) trova la carriera/libretto (matId) della persona
  const libretti = await get(`/libretto-service-v2/libretti?persId=${persId}`, signal);
  const matId = pick(libretti, "matId", "stuId");
  if (!matId) throw new Esse3Error("Nessuna carriera trovata per la persona.");

  // 3) righe del libretto → LibrettoEntry[]
  const righe = await get(`/libretto-service-v2/libretti/${matId}/righe`, signal);
  return parseEsse3Libretto(righe);
}
