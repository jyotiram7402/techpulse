import { Suspense } from "react";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { CategoryPills } from "@/components/category-pills";
import { SearchBar } from "@/components/search-bar";
import { NewsCard } from "@/components/news-card";
import { FeaturedCard, CompactCard } from "@/components/featured-card";
import { NewsGridSkeleton } from "@/components/news-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { fetchArticles } from "@/services/articles.service";
import type { ArticleCategory } from "@/types/article";
import { GitHubTrendingWidget, HackerNewsWidget } from "@/components/trending-widget";
import { HeadlinesWidget } from "@/components/headlines-widget";

export const revalidate = 300;

interface HomeProps {
  searchParams: { category?: string; q?: string; page?: string };
}

export default async function HomePage({ searchParams }: HomeProps) {
  const category = (searchParams.category as ArticleCategory | undefined) ?? "all";
  const search = searchParams.q;
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  // Featured layout only on the unfiltered first page.
  const showFeatured = category === "all" && !search && page === 1;

  return (
    <div className="container space-y-6 py-4 sm:space-y-10 sm:py-8">
      <Hero />

      <div id="feed" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-tight sm:text-2xl">
              Latest
              <span className="ml-2 inline-block h-1 w-8 rounded-full bg-brand align-middle" />
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              AI-curated news from across the developer ecosystem.
            </p>
          </div>
          <SearchBar />
        </div>

        <CategoryPills />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <Suspense fallback={<NewsGridSkeleton count={6} />}>
            <Feed category={category} search={search} page={page} showFeatured={showFeatured} />
          </Suspense>

          <aside className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-1">
            <Suspense fallback={null}>
              <HeadlinesWidget />
            </Suspense>
            <Suspense fallback={null}>
              <GitHubTrendingWidget />
            </Suspense>
            <Suspense fallback={null}>
              <HackerNewsWidget />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  );
}

async function Feed({
  category,
  search,
  page,
  showFeatured
}: {
  category: ArticleCategory | "all";
  search?: string;
  page: number;
  showFeatured: boolean;
}) {
  const { articles, total, pageSize } = await fetchArticles({ category, search, page });

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles yet"
        description="The cron job runs hourly to fetch new stories. Once it has populated the database, articles will appear here."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const useFeatured = showFeatured && articles.length >= 5;
  const featured = useFeatured ? articles[0] : null;
  const compact = useFeatured ? articles.slice(1, 5) : [];
  const rest = useFeatured ? articles.slice(5) : articles;

  return (
    <div className="space-y-5 sm:space-y-8">
      {featured ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="min-w-0 lg:col-span-3">
            <FeaturedCard article={featured} />
          </div>
          <div className="flex min-w-0 flex-col gap-3 lg:col-span-2">
            {compact.map((a) => (
              <CompactCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 2xl:grid-cols-3">
        {rest.map((a, i) => (
          <NewsCard key={a.id} article={a} priority={!featured && i < 3} />
        ))}
      </div>
      <Pagination current={page} total={totalPages} />
    </div>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;
  const prev = Math.max(1, current - 1);
  const next = Math.min(total, current + 1);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-5 sm:pt-6">
      <Link
        href={`?page=${prev}`}
        className={`rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors ${current === 1 ? "pointer-events-none opacity-40" : "hover:bg-accent hover:text-brand"}`}
      >
        ← Prev
      </Link>
      <span className="text-xs text-muted-foreground">
        Page {current} / {total}
      </span>
      <Link
        href={`?page=${next}`}
        className={`rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors ${current === total ? "pointer-events-none opacity-40" : "hover:bg-accent hover:text-brand"}`}
      >
        Next →
      </Link>
    </div>
  );
}
