import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Indicizza solo le pagine pubbliche; le route app/dati restano fuori (sono
 *  local-first e personali, non hanno senso nei motori di ricerca). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cruscotto",
        "/libretto",
        "/note",
        "/focus",
        "/orario",
        "/appelli",
        "/impostazioni",
        "/onboarding",
        "/auth",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
