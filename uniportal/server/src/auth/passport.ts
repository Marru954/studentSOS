import {
  type Profile,
  Strategy as SamlStrategy,
  type VerifiedCallback,
} from "@node-saml/passport-saml";
import passport from "passport";
import { env } from "../config/env";
import { samlConfig } from "../config/saml";
import { prisma } from "../db/prisma";
import { seedMockSyncedData } from "../sync/mockAdapter";
import { mapSamlProfile } from "./attributes";

/**
 * Verifica della SAML Assertion (login): estrae gli attributi, fa l'upsert
 * dell'utente su PostgreSQL e restituisce l'oggetto utente che Passport
 * serializza in sessione. In sviluppo popola anche i dati mock.
 */
async function signonVerify(
  profile: Profile | null,
  done: VerifiedCallback,
): Promise<void> {
  try {
    if (!profile) return done(new Error("Assertion SAML vuota"));

    const attrs = mapSamlProfile(profile);
    const matricola = attrs.matricola ?? profile.nameID;
    if (!matricola) {
      return done(new Error("Assertion priva di matricola e NameID"));
    }

    const user = await prisma.user.upsert({
      where: { matricola },
      update: {
        fullName: attrs.fullName,
        email: attrs.email,
        courseOfStudy: attrs.courseOfStudy,
        nameId: profile.nameID,
        lastLoginAt: new Date(),
      },
      create: {
        matricola,
        fullName: attrs.fullName,
        email: attrs.email,
        courseOfStudy: attrs.courseOfStudy,
        nameId: profile.nameID,
      },
    });

    // in sviluppo: senza adapter reali, popola dati mock per la dashboard
    if (!env.isProd) await seedMockSyncedData(user.id);

    return done(null, {
      id: user.id,
      matricola: user.matricola,
      fullName: user.fullName ?? undefined,
      email: user.email ?? undefined,
      courseOfStudy: user.courseOfStudy ?? undefined,
      nameID: profile.nameID,
      nameIDFormat: profile.nameIDFormat,
      sessionIndex: profile.sessionIndex,
    });
  } catch (error) {
    return done(error as Error);
  }
}

/**
 * Verifica del LogoutRequest (SLO iniziato dall'IdP). La firma è già stata
 * validata dalla libreria; qui non dobbiamo ricreare una sessione.
 */
function logoutVerify(_profile: Profile | null, done: VerifiedCallback): void {
  done(null, undefined);
}

// @node-saml/passport-saml v5 richiede ENTRAMBE le callback (login + logout).
export const samlStrategy = new SamlStrategy(
  samlConfig,
  signonVerify,
  logoutVerify,
);

passport.use("saml", samlStrategy);

// L'utente è piccolo e contiene i dati SAML per il logout: lo serializziamo
// per intero nella sessione (memorizzata su PostgreSQL).
passport.serializeUser<Express.User>((user, done) => done(null, user));
passport.deserializeUser<Express.User>((user, done) => done(null, user));

export { passport };
