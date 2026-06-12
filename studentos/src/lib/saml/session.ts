/**
 * Sessione SSO senza database: un cookie HMAC-firmato (StudentOS è
 * offline-first, niente Postgres). Il payload è il profilo dell'utente —
 * dati suoi, che rivede comunque nella dashboard — firmato per impedirne la
 * manomissione. In produzione imposta `SAML_SESSION_SECRET`.
 */
import crypto from "node:crypto";

export const SSO_COOKIE = "studentos.sso";

const SECRET =
  process.env.SAML_SESSION_SECRET ?? "studentos-dev-sso-secret-change-me";

export interface SsoSession {
  matricola: string;
  fullName?: string;
  email?: string;
  courseOfStudy?: string;
  // dati SAML necessari al Single Logout (assenti nelle sessioni dev/mock)
  nameID?: string;
  nameIDFormat?: string;
  sessionIndex?: string;
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function signSession(session: SsoSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifySession(token: string | undefined | null): SsoSession | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = hmac(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function cookieOptions(maxAgeSeconds = 60 * 60 * 8) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
