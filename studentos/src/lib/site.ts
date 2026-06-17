/** URL pubblico assoluto del sito, per metadata OG/twitter, sitemap e robots.
 *  Configurabile via env (NEXT_PUBLIC_SITE_URL); fallback al dominio del prodotto. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentos.app";
