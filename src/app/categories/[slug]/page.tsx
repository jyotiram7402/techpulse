import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { NewsCard } from "@/components/news-card";
import { NewsGridSkeleton } from "@/components/news-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { CATEGORIES } from "@/lib/constants";
import { fetchArticles } from "@/services/articles.service";
import type { ArticleCategory } from "@/types/article";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.label} news`,
    description: `Latest ${cat.label} articles for developers — curated and summarized.`
  };
}

export default function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { q?: string; page?: string };
}) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const page = Math.max(1, Number(searchParams.page ?? "1"));

  return (
    <div className="container space-y-6 py-6 sm:space-y-8 sm:py-8">
      <div className="space-y-3">
        <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${cat.gradient} px-3 py-1 text-xs font-semibold text-white`}>
          <span>{cat.emoji}</span>
          {cat.label}
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {cat.label} news for developers
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Auto-summarized articles, ranked by recency. Refreshed hourly.
        </p>
        <SearchBar placeholder={`Search ${cat.label}…`} />
      </div>

      <Suspense fallback={<NewsGridSkeleton count={6} />}>
        <CategoryFeed slug={cat.slug} search={searchParams.q} page={page} />
      </Suspense>
    </div>
  );
}

async function CategoryFeed({
  slug,
  search,
  page
}: {
  slug: ArticleCategory;
  search?: string;
  page: number;
}) {
  const { articles } = await fetchArticles({ category: slug, search, page });

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles yet"
        description="As fresh stories are ingested in this category, they'll appear here."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {articles.map((a, i) => (
        <NewsCard key={a.id} article={a} priority={i < 3} />
      ))}
    </div>
  );
}
