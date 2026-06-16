import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy (statica, applicata a ogni risposta).
 *
 * `script-src` resta `'unsafe-inline'` per **scelta consapevole**: Next App Router
 * inietta script inline RSC (`self.__next_f.push`) con contenuto per-pagina instabile,
 * non hashabile; CSP3 ignora `'unsafe-inline'` se è presente un hash/nonce, e la via
 * nonce forzerebbe tutte le pagine a rendering dinamico (niente statico/CDN). Il muro
 * XSS vero è altrove: note senza `rehype-raw`, KaTeX `trust:false`, `safeHref` sugli
 * href esterni, RLS Supabase. Tutte le altre direttive sono strette.
 *
 * `connect-src` include `https:`/`wss:` perché l'import iCal-by-URL fa `fetch` di URL
 * arbitrari dal browser e supabase-js parla diretto col browser; `http:`/`javascript:`/
 * non-TLS restano bloccati. Il sync università passa da `/api/sync` (server-side) → `'self'`.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https: wss:${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS solo in produzione: in dev su http://localhost lo escludiamo.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
