import { type Request, type Response, Router } from "express";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const apiRouter = Router();

/** Config pubblica del client (es. mostrare l'accesso demo in sviluppo). */
apiRouter.get("/config", (_req: Request, res: Response) => {
  res.json({ devMode: !env.isProd });
});

/** Profilo dell'utente autenticato (attributi estratti dalla Assertion). */
apiRouter.get("/me", requireAuth, (req: Request, res: Response) => {
  const u = req.user!;
  res.json({
    user: {
      id: u.id,
      matricola: u.matricola,
      fullName: u.fullName,
      email: u.email,
      courseOfStudy: u.courseOfStudy,
    },
  });
});

/** Dati sincronizzati dell'utente, raggruppati per tipo (esami/cfu/pianoStudi). */
apiRouter.get("/synced", requireAuth, async (req: Request, res: Response) => {
  const rows = await prisma.syncedData.findMany({
    where: { userId: req.user!.id },
  });
  const byKind: Record<string, unknown> = {};
  for (const row of rows) byKind[row.kind] = row.payload;
  res.json({ synced: byKind });
});
