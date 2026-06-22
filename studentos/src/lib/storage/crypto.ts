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

/** Ciphertext bundle: the random IV plus the AES-GCM bytes, both as plain
 *  number arrays so the pair survives IndexedDB structured-clone storage. */
export interface Sealed {
  iv: number[];
  data: number[];
}

/**
 * Encrypt a string under the local non-extractable AES-GCM key.
 * @param plaintext The text to seal.
 * @returns The IV + ciphertext bundle.
 */
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

/**
 * Decrypt a bundle produced by {@link seal} using the local AES-GCM key.
 * @param sealed The IV + ciphertext bundle to open.
 * @returns The recovered plaintext.
 */
export async function unseal(sealed: Sealed): Promise<string> {
  const key = await getOrCreateKey();
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(sealed.iv) },
    key,
    new Uint8Array(sealed.data),
  );
  return new TextDecoder().decode(plaintext);
}
