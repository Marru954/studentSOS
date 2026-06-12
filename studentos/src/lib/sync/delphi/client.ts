/**
 * Server-only Delphi login + libretto scrape. Runs ONLY inside the
 * /api/sync-delphi route — never bundled to the client. Maintains a manual
 * cookie jar (fetch has none), authenticates against the student portal,
 * discovers the libretto page from the post-login menu, and hands the HTML
 * to the pure parser.
 *
 * Credentials live only as function arguments here: never logged, never
 * persisted, gone when the request returns.
 */
import * as cheerio from "cheerio";
import type { LibrettoEntry } from "@/lib/domain/types";
import { parseLibretto } from "./parse";

const BASE = "https://delphi.uniroma2.it/totem/jsp";
const AUTH_PAGE = `${BASE}/Iscrizioni/autenticazione.jsp?language=IT`;
const LOGIN_ACTION = `${BASE}/Iscrizioni/sStudentiLoginIntro.jsp`;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

export class DelphiError extends Error {
  constructor(
    message: string,
    readonly code: "credentials" | "unavailable" | "parse",
  ) {
    super(message);
  }
}

/** Minimal cookie jar: name→value, updated from every Set-Cookie. */
type Jar = Map<string, string>;

function rememberCookies(jar: Jar, res: Response): void {
  // node fetch exposes the combined header; split on commas that precede a token=
  const raw = res.headers.get("set-cookie");
  if (!raw) return;
  for (const part of raw.split(/,(?=\s*[A-Za-z0-9_.-]+=)/)) {
    const [pair] = part.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

function cookieHeader(jar: Jar): string {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function jarFetch(
  jar: Jar,
  url: string,
  init: RequestInit & { signal: AbortSignal },
): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    redirect: "manual",
    headers: {
      "User-Agent": UA,
      "Accept-Language": "it-IT,it;q=0.9",
      ...(jar.size ? { Cookie: cookieHeader(jar) } : {}),
      ...init.headers,
    },
  });
  rememberCookies(jar, res);
  // follow up to 5 redirects, carrying the jar
  let current = res;
  for (let i = 0; i < 5 && current.status >= 300 && current.status < 400; i++) {
    const loc = current.headers.get("location");
    if (!loc) break;
    const next = new URL(loc, url).toString();
    current = await fetch(next, {
      redirect: "manual",
      headers: {
        "User-Agent": UA,
        Cookie: cookieHeader(jar),
      },
      signal: init.signal,
    });
    rememberCookies(jar, current);
    url = next;
  }
  return current;
}

/** True when a page still shows the login form / an auth error. */
function looksLikeLoginFailure(html: string): boolean {
  const t = html.toLowerCase();
  return (
    /password\s+errat|login\s+errat|credenziali|non\s+corrett|riprova/.test(t) ||
    t.includes('name="password"') // still on the login form
  );
}

/** Find the libretto page URL from a post-login menu page. */
function findLibrettoLink(html: string, fromUrl: string): string | undefined {
  const $ = cheerio.load(html);
  let href: string | undefined;
  $("a").each((_, a) => {
    if (href) return;
    const text = $(a).text().toLowerCase();
    const link = $(a).attr("href") ?? "";
    if (/libretto/.test(text) || /libretto/i.test(link)) {
      href = new URL(link, fromUrl).toString();
    }
  });
  return href;
}

export async function fetchDelphiLibretto(
  login: string,
  password: string,
  signal: AbortSignal,
): Promise<LibrettoEntry[]> {
  const jar: Jar = new Map();

  // 1. prime the session (sets the cookie the login form tests for)
  await jarFetch(jar, AUTH_PAGE, { signal });

  // 2. submit credentials. The real form (verified against the live page)
  // posts exactly these four fields; `entra` is the submit button's name and
  // the servlet branches on it — omitting it makes Delphi silently re-render
  // the login form, which reads as an auth failure. `targetcookie` belongs to
  // a different (JS cookie-test) form and must NOT be sent here.
  const body = new URLSearchParams({
    login,
    password,
    entra: "Entra",
    language: "IT",
  });
  const loginRes = await jarFetch(jar, LOGIN_ACTION, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal,
  });

  if (!loginRes.ok) {
    throw new DelphiError(
      `Delphi ha risposto ${loginRes.status}`,
      "unavailable",
    );
  }
  const homeHtml = await loginRes.text();
  if (looksLikeLoginFailure(homeHtml)) {
    throw new DelphiError("Matricola o password non validi.", "credentials");
  }

  // 3. discover and fetch the libretto page
  const librettoUrl =
    findLibrettoLink(homeHtml, loginRes.url || LOGIN_ACTION) ??
    `${BASE}/aS_2_2_1.jsp?language=IT`;
  const librettoRes = await jarFetch(jar, librettoUrl, { signal });
  if (!librettoRes.ok) {
    throw new DelphiError("Libretto non raggiungibile.", "unavailable");
  }
  const librettoHtml = await librettoRes.text();

  const entries = parseLibretto(librettoHtml);
  if (entries.length === 0 && /libretto/i.test(librettoHtml) === false) {
    throw new DelphiError(
      "Pagina del libretto non riconosciuta.",
      "parse",
    );
  }
  return entries;
}
