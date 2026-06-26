import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchArticles } from "@/services/articles.service";
import type { ArticleCategory } from "@/types/article";

const QuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).max(50).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional()
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { category, q, page, pageSize } = parsed.data;
  const result = await fetchArticles({
    category: (category as ArticleCategory | undefined) ?? "all",
    search: q,
    page,
    pageSize
  });
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" }
  });
}
