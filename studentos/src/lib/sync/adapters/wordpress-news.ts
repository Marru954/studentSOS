/**
 * WordPress news adapter — department sites in academia are overwhelmingly
 * WordPress, and almost all expose the public REST API. Verified live on
 * informatica.uniroma2.it. Falls back cleanly: a site with the API disabled
 * simply errors and the source is reported as failed, never half-parsed.
 */
import { z } from "zod";
import type { NewsItem } from "@/lib/domain/types";
import type { FetchContext, SyncProvider } from "../provider";
import { htmlToText, stableId } from "../util";

const paramsSchema = z.object({
  /** Site root, e.g. "https://informatica.uniroma2.it". */
  baseUrl: z.string().url(),
  perPage: z.number().int().min(1).max(50).optional().default(20),
  /** Optional WP category ids to filter (e.g. only "avvisi"). */
  categories: z.array(z.number()).optional(),
});
export type WordPressNewsParams = z.infer<typeof paramsSchema>;

const wpPost = z.object({
  id: z.number(),
  date_gmt: z.string(),
  // `.url()` scarta post con link non valido/ostile (es. `javascript:`) a monte.
  link: z.string().url(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }).optional(),
});

async function fetchNews(params: WordPressNewsParams, ctx: FetchContext): Promise<NewsItem[]> {
  const url = new URL("/wp-json/wp/v2/posts", params.baseUrl);
  url.searchParams.set("per_page", String(params.perPage));
  url.searchParams.set("_fields", "id,date_gmt,link,title,excerpt");
  if (params.categories?.length) url.searchParams.set("categories", params.categories.join(","));

  const res = await fetch(url, { signal: ctx.signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`WordPress REST API responded ${res.status}`);
  const posts = z.array(wpPost).parse(await res.json());

  return posts.map((post) => ({
    id: stableId("wp", params.baseUrl, post.id),
    title: htmlToText(post.title.rendered),
    url: post.link,
    publishedAt: `${post.date_gmt}Z`,
    excerpt: post.excerpt ? htmlToText(post.excerpt.rendered).slice(0, 280) || undefined : undefined,
    sourceId: "",
  }));
}

export const wordpressNewsProvider: SyncProvider<WordPressNewsParams> = {
  id: "wordpress-news",
  label: "Avvisi WordPress (REST API)",
  paramsSchema,
  capabilities: ["news"],
  fetchNews,
};
