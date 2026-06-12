/**
 * Local-only encryption for Delphi credentials. The AES-GCM key is generated
 * with extractable:false and stored as a live CryptoKey in IndexedDB: the
 * browser will use it to decrypt but will never hand back its raw bytes, so a
 * dump of the database yields ciphertext plus a key that can't leave the
 * device. This defends against casual inspection and DB exfiltration — not
 * against malicious code already running in this origin.
 */
import { getDb } from "./db";

const KEY_ID = "delphi-key";

async function getOrCreateKey(): Promise<CryptoKey> {
  const db = await getDb();
  const existing = (await db.get("secrets", KEY_ID)) as CryptoKey | undefined;
  if (existing) return existing;
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false, // non-extractable
    ["encrypt", "decrypt"],
  );
  await db.put("secrets", key, KEY_ID);
  return key;
}

export interface Sealed {
  iv: number[];
  data: number[];
}

export async function seal(plaintext: string): Promise<Sealed> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return { iv: [...iv], data: [...new Uint8Array(data)] };
}

export async function unseal(sealed: Sealed): Promise<string> {
  const key = await getOrCreateKey();
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(sealed.iv) },
    key,
    new Uint8Array(sealed.data),
  );
  return new TextDecoder().decode(plaintext);
}
