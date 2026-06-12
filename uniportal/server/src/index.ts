import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import helmet from "helmet";
import { passport } from "./auth/passport";
import { samlRouter } from "./auth/saml.routes";
import { env } from "./config/env";
import { apiRouter } from "./routes/api";

const app = express();
app.set("trust proxy", 1); // dietro reverse proxy/HTTPS in produzione

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true, // i cookie di sessione viaggiano cross-origin
  }),
);
app.use(express.json());
// l'ACS riceve la SAML Response come form url-encoded
app.use(express.urlencoded({ extended: false }));

// ── Sessioni su PostgreSQL ────────────────────────────────────────────────
const PgStore = connectPgSimple(session);
app.use(
  session({
    store: new PgStore({
      conString: env.databaseUrl,
      tableName: "session",
      createTableIfMissing: true,
    }),
    name: "uniportal.sid",
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProd,
      maxAge: 1000 * 60 * 60 * 8, // 8 ore
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// ── Route ─────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/saml", samlRouter);
app.use("/api", apiRouter);

// ── Gestione errori ───────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[uniportal] errore:", err.message);
  res.status(500).json({ error: "errore_interno" });
});

app.listen(env.port, () => {
  console.log(`UniPortal SP in ascolto su ${env.baseUrl} (porta ${env.port})`);
  console.log(`Metadata SP: ${env.baseUrl}/saml/metadata`);
});
