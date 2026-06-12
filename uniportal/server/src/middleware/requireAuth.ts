import type { NextFunction, Request, Response } from "express";

/** Protegge le route applicative: 401 se la sessione non è autenticata. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "non_autenticato" });
}
