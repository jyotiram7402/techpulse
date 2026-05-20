import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { CategoryPills } from "@/components/category-pills";
import { SearchBar } from "@/components/search-bar";
import { NewsCard } from "@/components/news-card";
import { NewsGridSkeleton } from "@/components/news-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { fetchArticles } from "@/services/articles.service";
import type { ArticleCategory } from "@/types/article";
import { GitHubTrendingWidget, HackerNewsWidget } from "@/components/trending-widget";

export const revalidate = 300;

interface HomeProps {
  searchParams: { category?: string; q?: string; page?: string };
}

export default async function HomePage({ searchParams }: HomeProps) {
  const category = (searchParams.category as ArticleCategory | undefined) ?? "all";
  const search = searchParams.q;
  const page = Math.max(1, Number(searchParams.page ?? "1"));

  return (
    <div className="container space-y-10 py-8">
      <Hero />

      <div id="feed" className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Latest in tech</h2>
            <p className="text-sm text-muted-foreground">
              AI-curated news from across the developer ecosystem.
            </p>
          </div>
          <SearchBar />
        </div>

        <CategoryPills />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Suspense fallback={<NewsGridSkeleton count={6} />}>
            <Feed category={category} search={search} page={page} />
          </Suspense>

          <aside className="hidden space-y-6 lg:block">
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
  page
}: {
  category: ArticleCategory | "all";
  search?: string;
  page: number;
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

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((a, i) => (
          <NewsCard key={a.id} article={a} priority={i < 3} />
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
    <div className="flex items-center justify-between border-t border-border pt-6">
      <a
        href={`?page=${prev}`}
        className={`text-sm font-medium ${current === 1 ? "pointer-events-none opacity-40" : "hover:text-brand"}`}
      >
        ← Previous
      </a>
      <span className="text-xs text-muted-foreground">
        Page {current} of {total}
      </span>
      <a
        href={`?page=${next}`}
        className={`text-sm font-medium ${current === total ? "pointer-events-none opacity-40" : "hover:text-brand"}`}
      >
        Next →
      </a>
    </div>
  );
}
