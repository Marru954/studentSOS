/**
 * Persisted Delphi credentials. The matricola/login is stored in clear (it's
 * printed on the student card, not a secret); the password is AES-GCM sealed
 * under the non-extractable local key. Read returns the decrypted pair only
 * when the caller actually needs to authenticate.
 */
import { type Sealed, seal, unseal } from "./crypto";
import { getDb } from "./db";

const CRED_KEY = "delphi-credentials";

interface StoredCredentials {
  login: string;
  password: Sealed;
  savedAt: string;
}

/** A decrypted Delphi credential pair, as handed to the authenticating caller. */
export interface DelphiCredentials {
  login: string;
  password: string;
}

/** Whether credentials are saved, plus the (non-secret) login to display. */
export async function getDelphiStatus(): Promise<{ login: string } | null> {
  const stored = (await (await getDb()).get("secrets", CRED_KEY)) as
    | StoredCredentials
    | undefined;
  return stored ? { login: stored.login } : null;
}

/**
 * Persist Delphi credentials: login in clear, password AES-GCM sealed under the
 * local key. Overwrites any previously saved pair.
 * @param creds The login and plaintext password to store.
 */
export async function saveDelphiCredentials(
  creds: DelphiCredentials,
): Promise<void> {
  const stored: StoredCredentials = {
    login: creds.login,
    password: await seal(creds.password),
    savedAt: new Date().toISOString(),
  };
  await (await getDb()).put("secrets", stored, CRED_KEY);
}

/**
 * Load and decrypt the saved Delphi credentials, if any.
 * @returns The decrypted login/password pair, or null when none are stored.
 */
export async function loadDelphiCredentials(): Promise<DelphiCredentials | null> {
  const stored = (await (await getDb()).get("secrets", CRED_KEY)) as
    | StoredCredentials
    | undefined;
  if (!stored) return null;
  return { login: stored.login, password: await unseal(stored.password) };
}

/** Delete the stored Delphi credentials from the secrets store. */
export async function clearDelphiCredentials(): Promise<void> {
  await (await getDb()).delete("secrets", CRED_KEY);
}
