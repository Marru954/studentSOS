import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Solo route pubbliche indicizzabili. Le pagine dati sono local-first/private
 *  (vedi robots.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
