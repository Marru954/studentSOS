import { SAML, type SamlConfig } from "@node-saml/node-saml";

/**
 * Service Provider SAML 2.0 di StudentOS verso l'IdP di Tor Vergata.
 * Adattato da UniPortal: niente file su disco, i certificati arrivano da
 * variabili d'ambiente (contenuto PEM). Senza IdP reale resta utilizzabile la
 * dev-login mock; per l'SSO vero vanno impostate le env e registrato il SP.
 */
function envPem(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v : undefined;
}

function strip(pem: string): string {
  return pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
}

const idpCert = envPem("SAML_IDP_CERT");
const spPrivateKey = envPem("SAML_SP_PRIVATE_KEY");
export const spCert = envPem("SAML_SP_CERT");

const base = process.env.SAML_BASE_URL ?? "http://localhost:3000";

export const samlConfig: SamlConfig = {
  issuer: process.env.SAML_SP_ENTITY_ID ?? `${base}/api/saml/metadata`,
  callbackUrl: process.env.SAML_SP_ACS_URL ?? `${base}/api/saml/acs`,
  entryPoint:
    process.env.SAML_IDP_ENTRY_POINT ??
    "https://idp.uniroma2.it/idp/profile/SAML2/Redirect/SSO",
  logoutUrl:
    process.env.SAML_IDP_LOGOUT_URL ??
    "https://idp.uniroma2.it/idp/profile/SAML2/Redirect/SLO",
  logoutCallbackUrl:
    process.env.SAML_SP_SLO_URL ?? `${base}/api/saml/logout/callback`,
  idpIssuer: process.env.SAML_IDP_ENTITY_ID ?? "https://idp.uniroma2.it/idp/shibboleth",
  // certificato di firma dell'IdP — necessario per l'SSO reale (idpCert)
  idpCert: idpCert ? strip(idpCert) : "MISSING_IDP_CERT",
  privateKey: spPrivateKey,
  decryptionPvk: spPrivateKey,
  signatureAlgorithm: "sha256",
  digestAlgorithm: "sha256",
  identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  wantAssertionsSigned: true,
  acceptedClockSkewMs: 5000,
  disableRequestedAuthnContext: true,
};

export const saml = new SAML(samlConfig);

/** True quando l'IdP reale è configurato (certificato di firma presente):
 *  abilita il Single Logout SAML completo. In dev/mock resta false → logout
 *  locale. */
export function idpConfigured(): boolean {
  return Boolean(idpCert);
}
