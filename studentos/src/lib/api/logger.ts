/**
 * Minimal structured logger for the API routes + proxy. No dependency, no
 * transport: just console, so it works in the Node and edge runtimes alike.
 *
 * In production each line is a single JSON object (level, route, message, any
 * meta, timestamp) so Vercel's log drain can filter/correlate by field. In
 * development it's a short human-readable line with optional ANSI colours.
 *
 * NEVER pass to `meta` (or `message`): full user-facing URLs, credentials,
 * the content of user messages, or env-var VALUES. Log presence/status/counts,
 * never secrets or personal payloads.
 */

type Level = "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";
// Colours only on an interactive TTY in dev; never in prod (would corrupt JSON).
const useColor = !isProd && typeof process !== "undefined" && Boolean(process.stdout?.isTTY);

const COLOR: Record<Level, string> = {
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";

const SINK: Record<Level, (...args: unknown[]) => void> = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

export function apiLog(
  level: Level,
  route: string,
  message: string,
  meta?: Record<string, unknown>,
): void {
  const timestamp = new Date().toISOString();
  const log = SINK[level];

  if (isProd) {
    log(JSON.stringify({ level, route, message, ...meta, timestamp }));
    return;
  }

  const tag = useColor ? `${COLOR[level]}${level}${RESET}` : level;
  const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  log(`[${tag}] ${route}: ${message}${metaStr}`);
}
