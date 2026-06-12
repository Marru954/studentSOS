import "dotenv/config";

/** Legge una variabile d'ambiente, con fallback per lo sviluppo. In
 *  produzione le variabili critiche devono essere impostate esplicitamente. */
function envVar(name: string, devFallback?: string): string {
  const value = process.env[name] ?? devFallback;
  if (value === undefined) {
    throw new Error(`Variabile d'ambiente mancante: ${name}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProd = nodeEnv === "production";

export const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT ?? 4000),
  baseUrl: envVar("SP_BASE_URL", "http://localhost:4000"),
  clientUrl: envVar("CLIENT_URL", "http://localhost:5173"),
  databaseUrl: envVar(
    "DATABASE_URL",
    "postgresql://uniportal:uniportal@localhost:5432/uniportal?schema=public",
  ),
  sessionSecret: isProd
    ? envVar("SESSION_SECRET")
    : envVar("SESSION_SECRET", "dev-only-secret-change-me"),

  sp: {
    entityId: envVar("SP_ENTITY_ID", "http://localhost:4000/saml/metadata"),
    acsUrl: envVar("SP_ACS_URL", "http://localhost:4000/saml/acs"),
    sloUrl: envVar("SP_SLO_URL", "http://localhost:4000/saml/logout/callback"),
    privateKeyPath: envVar("SP_PRIVATE_KEY_PATH", "./certs/sp-private-key.pem"),
    certPath: envVar("SP_CERT_PATH", "./certs/sp-public-cert.pem"),
  },

  idp: {
    entityId: envVar("IDP_ENTITY_ID", "https://idp.uniroma2.it/idp/shibboleth"),
    entryPoint: envVar(
      "IDP_ENTRY_POINT",
      "https://idp.uniroma2.it/idp/profile/SAML2/Redirect/SSO",
    ),
    logoutUrl: envVar(
      "IDP_LOGOUT_URL",
      "https://idp.uniroma2.it/idp/profile/SAML2/Redirect/SLO",
    ),
    certPath: envVar("IDP_CERT_PATH", "./certs/idp-cert.pem"),
  },
} as const;
