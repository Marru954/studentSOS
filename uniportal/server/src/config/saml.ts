import fs from "node:fs";
import path from "node:path";
import { SAML, type SamlConfig } from "@node-saml/node-saml";
import { env } from "./env";

/** Legge un file PEM se presente; in sviluppo i certificati potrebbero non
 *  esistere ancora (lancia `npm run certs`), quindi non blocchiamo il boot. */
function readPemOptional(p: string): string | undefined {
  try {
    return fs.readFileSync(path.resolve(p), "utf8");
  } catch {
    console.warn(`[saml] certificato non trovato: ${p} (ok in fase di setup)`);
    return undefined;
  }
}

/** node-saml accetta il certificato come base64 senza intestazioni PEM. */
function stripPem(pem: string): string {
  return pem
    .replace(/-----BEGIN CERTIFICATE-----/g, "")
    .replace(/-----END CERTIFICATE-----/g, "")
    .replace(/\s+/g, "");
}

const spPrivateKey = readPemOptional(env.sp.privateKeyPath);
/** Certificato pubblico del SP (PEM completo) — usato nel metadata. */
export const spPublicCert = readPemOptional(env.sp.certPath);
const idpCertPem = readPemOptional(env.idp.certPath);

/**
 * Configurazione del Service Provider SAML 2.0 (libreria @node-saml).
 * Rispetto a passport-saml v3 l'opzione `cert` è stata rinominata in
 * **`idpCert`** (certificato di firma dell'IdP, valida le Assertion).
 *  - `privateKey`/`decryptionPvk`: firmano gli AuthnRequest e decifrano le
 *    Assertion cifrate
 */
export const samlConfig: SamlConfig = {
  // identità del SP
  issuer: env.sp.entityId,
  callbackUrl: env.sp.acsUrl,

  // Identity Provider (Tor Vergata)
  entryPoint: env.idp.entryPoint,
  logoutUrl: env.idp.logoutUrl,
  logoutCallbackUrl: env.sp.sloUrl,
  idpIssuer: env.idp.entityId,
  // certificato di firma dell'IdP — va fornito prima del go-live
  idpCert: idpCertPem ? stripPem(idpCertPem) : "MISSING_IDP_CERT",

  // chiavi del SP (firma richieste + decifratura asserzioni)
  privateKey: spPrivateKey,
  decryptionPvk: spPrivateKey,

  // sicurezza
  signatureAlgorithm: "sha256",
  digestAlgorithm: "sha256",
  identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  authnRequestBinding: "HTTP-Redirect",
  wantAssertionsSigned: true,
  acceptedClockSkewMs: 5000,
  // gli IdP Shibboleth accademici spesso non gradiscono un AuthnContext rigido
  disableRequestedAuthnContext: true,
};

/**
 * Istanza SAML condivisa: la usiamo per generare il metadata e per validare
 * in modo esplicito la firma dei messaggi di Single Logout (la Strategy
 * Passport ne crea una propria internamente con la stessa config).
 */
export const saml = new SAML(samlConfig);
