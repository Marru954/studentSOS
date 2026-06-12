import { type NextFunction, type Request, type Response, Router } from "express";
import { env } from "../config/env";
import { saml, spPublicCert } from "../config/saml";
import { prisma } from "../db/prisma";
import { seedMockSyncedData } from "../sync/mockAdapter";
import { passport, samlStrategy } from "./passport";

export const samlRouter = Router();

/** Chiude la sessione locale e torna al client. */
function endLocalSession(req: Request, res: Response, redirectTo: string) {
  const finish = () => {
    res.clearCookie("uniportal.sid");
    res.redirect(redirectTo);
  };
  if (req.isAuthenticated()) {
    req.logout(() => req.session.destroy(finish));
  } else {
    finish();
  }
}

/**
 * 1) GET /saml/login — avvia l'SSO: AuthnRequest → redirect all'IdP.
 */
samlRouter.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: `${env.clientUrl}/login?error=saml` }),
);

/**
 * 2) POST /saml/acs — Assertion Consumer Service: valida la Response firmata,
 * esegue il signon verify (upsert utente) e crea la sessione.
 */
samlRouter.post(
  "/acs",
  passport.authenticate("saml", { failureRedirect: `${env.clientUrl}/login?error=acs` }),
  (_req: Request, res: Response) => {
    res.redirect(`${env.clientUrl}/dashboard`);
  },
);

/**
 * 3) GET /saml/metadata — metadata XML del SP (da registrare presso l'IdP).
 */
samlRouter.get("/metadata", (_req: Request, res: Response) => {
  const metadata = saml.generateServiceProviderMetadata(
    spPublicCert ?? null,
    spPublicCert ?? null,
  );
  res.type("application/xml").send(metadata);
});

/**
 * 4) GET /saml/logout — Single Logout iniziato dal SP. In produzione invia un
 * LogoutRequest firmato all'IdP; in sviluppo (o senza IdP) chiude solo la
 * sessione locale.
 */
samlRouter.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) return res.redirect(env.clientUrl);

  if (!env.isProd) {
    return endLocalSession(req, res, `${env.clientUrl}/login?logout=1`);
  }

  const logoutReq = req as unknown as Parameters<typeof samlStrategy.logout>[0];
  samlStrategy.logout(logoutReq, (err: Error | null, redirectUrl?: string | null) => {
    if (err) return next(err);
    req.logout((logoutErr) => {
      if (logoutErr) return next(logoutErr);
      req.session.destroy(() => {
        res.clearCookie("uniportal.sid");
        res.redirect(redirectUrl ?? env.clientUrl);
      });
    });
  });
});

/**
 * 5) GET|POST /saml/logout/callback — risposta di logout dall'IdP.
 * Validiamo ESPLICITAMENTE la firma del messaggio (LogoutResponse o
 * LogoutRequest) tramite l'istanza SAML: se la firma non è valida NON
 * effettuiamo il logout (difesa contro messaggi di logout forgiati).
 */
samlRouter.get("/logout/callback", async (req: Request, res: Response) => {
  if (!req.query.SAMLResponse && !req.query.SAMLRequest) {
    return res.redirect(`${env.clientUrl}/login`);
  }
  const originalQuery = req.url.split("?")[1] ?? "";
  try {
    // lancia se la firma in HTTP-Redirect non è valida
    await saml.validateRedirectAsync(
      req.query as unknown as Parameters<typeof saml.validateRedirectAsync>[0],
      originalQuery,
    );
  } catch (err) {
    console.warn("[saml] messaggio di logout non valido:", (err as Error).message);
    return res.redirect(`${env.clientUrl}/login?error=slo`);
  }
  endLocalSession(req, res, `${env.clientUrl}/login?logout=1`);
});

samlRouter.post("/logout/callback", async (req: Request, res: Response) => {
  try {
    if (req.body?.SAMLResponse) {
      await saml.validatePostResponseAsync(
        req.body as Parameters<typeof saml.validatePostResponseAsync>[0],
      );
    } else if (req.body?.SAMLRequest) {
      await saml.validatePostRequestAsync(
        req.body as Parameters<typeof saml.validatePostRequestAsync>[0],
      );
    } else {
      return res.redirect(`${env.clientUrl}/login`);
    }
  } catch (err) {
    console.warn("[saml] messaggio di logout non valido:", (err as Error).message);
    return res.redirect(`${env.clientUrl}/login?error=slo`);
  }
  endLocalSession(req, res, `${env.clientUrl}/login?logout=1`);
});

/**
 * DEV — GET /saml/dev-login
 * Solo in sviluppo: crea una sessione con un utente fittizio e popola i dati
 * mock, per vedere la dashboard completa senza un IdP reale.
 */
if (!env.isProd) {
  samlRouter.get(
    "/dev-login",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await prisma.user.upsert({
          where: { matricola: "0000000" },
          update: { lastLoginAt: new Date() },
          create: {
            matricola: "0000000",
            fullName: "Mario Rossi",
            email: "mario.rossi@students.uniroma2.eu",
            courseOfStudy: "Informatica (L-31)",
            nameId: "dev-mock",
          },
        });
        await seedMockSyncedData(user.id);

        req.login(
          {
            id: user.id,
            matricola: user.matricola,
            fullName: user.fullName ?? undefined,
            email: user.email ?? undefined,
            courseOfStudy: user.courseOfStudy ?? undefined,
            nameID: "dev-mock",
          },
          (err) => {
            if (err) return next(err);
            res.redirect(`${env.clientUrl}/dashboard`);
          },
        );
      } catch (err) {
        next(err);
      }
    },
  );
}
