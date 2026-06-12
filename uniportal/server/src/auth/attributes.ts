import type { Profile } from "@node-saml/node-saml";

/**
 * OID degli attributi SAML rilasciati dall'IdP di Tor Vergata.
 * Affianchiamo il friendlyName come fallback: alcuni IdP indicizzano gli
 * attributi per nome amichevole invece che per OID.
 */
export const SAML_ATTRS = {
  matricola: {
    oid: "urn:oid:1.3.6.1.4.1.25178.1.2.9",
    friendly: "schacPersonalUniqueCode",
  },
  fullName: {
    oid: "urn:oid:2.16.840.1.113730.3.1.241",
    friendly: "displayName",
  },
  email: {
    oid: "urn:oid:0.9.2342.19200300.100.1.3",
    friendly: "mail",
  },
  courseOfStudy: {
    oid: "urn:oid:1.3.6.1.4.1.25178.1.2.14",
    friendly: "schacUserStatus",
  },
} as const;

export interface SamlUserProfile {
  matricola?: string;
  fullName?: string;
  email?: string;
  courseOfStudy?: string;
}

/** Normalizza un valore di attributo (può essere stringa o array). */
function first(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return value.length > 0 && value[0] != null ? String(value[0]) : undefined;
  }
  return value != null && value !== "" ? String(value) : undefined;
}

/** Estrae un attributo cercandolo per OID, per friendlyName, e nella
 *  collezione `attributes` (a seconda di come l'IdP popola il profilo). */
function pick(
  profile: Profile,
  attr: { oid: string; friendly: string },
): string | undefined {
  const flat = profile as unknown as Record<string, unknown>;
  const nested = (flat.attributes ?? {}) as Record<string, unknown>;
  return (
    first(flat[attr.oid]) ??
    first(flat[attr.friendly]) ??
    first(nested[attr.oid]) ??
    first(nested[attr.friendly])
  );
}

/** Mappa la SAML Assertion sugli attributi applicativi di UniPortal. */
export function mapSamlProfile(profile: Profile): SamlUserProfile {
  return {
    matricola: pick(profile, SAML_ATTRS.matricola),
    fullName: pick(profile, SAML_ATTRS.fullName),
    email: pick(profile, SAML_ATTRS.email),
    courseOfStudy: pick(profile, SAML_ATTRS.courseOfStudy),
  };
}
