import { createServiceClient, createClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "@/lib/constants";
import type { Article, ArticleInput, ArticleCategory } from "@/types/article";

function dedupeByUrl(articles: ArticleInput[]): ArticleInput[] {
  const seen = new Set<string>();
  const out: ArticleInput[] = [];
  for (const a of articles) {
    const key = a.url.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

export async function upsertArticles(articles: ArticleInput[]): Promise<number> {
  if (!articles.length) return 0;
  const supabase = createServiceClient();
  const deduped = dedupeByUrl(articles);

  const { error, count } = await supabase
    .from("articles")
    .upsert(deduped, { onConflict: "url", ignoreDuplicates: false, count: "exact" });

  if (error) {
    console.error("upsertArticles error:", error.message);
    return 0;
  }
  return count ?? deduped.length;
}

export interface FetchArticlesOptions {
  category?: ArticleCategory | "all";
  source?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchArticles(options: FetchArticlesOptions = {}): Promise<{
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { category = "all", source, search, page = 1, pageSize = PAGE_SIZE } = options;
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to);

  if (category && category !== "all") query = query.eq("category", category);
  if (source) query = query.eq("source", source);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;
  if (error) {
    console.error("fetchArticles error:", error.message);
    return { articles: [], total: 0, page, pageSize };
  }

  return {
    articles: (data ?? []) as Article[],
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function fetchTrending(limit = 12): Promise<Article[]> {
  const supabase = createClient();
  const since = new Date();
  since.setHours(since.getHours() - 48);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .gte("published_at", since.toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchTrending:", error.message);
    return [];
  }
  return (data ?? []) as Article[];
}
