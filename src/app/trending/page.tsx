import { Suspense } from "react";
import { Flame } from "lucide-react";
import { fetchTrending } from "@/services/articles.service";
import { NewsCard } from "@/components/news-card";
import { NewsGridSkeleton } from "@/components/news-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { GitHubTrendingWidget, HackerNewsWidget } from "@/components/trending-widget";

export const revalidate = 300;

export const metadata = {
  title: "Trending",
  description: "What developers are reading right now — GitHub repos, Hacker News, and trending articles."
};

export default function TrendingPage() {
  return (
    <div className="container space-y-5 py-4 sm:space-y-10 sm:py-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">
          <Flame className="h-3 w-3" />
          Trending now
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
          What developers are reading
        </h1>
        <p className="max-w-2xl text-xs text-muted-foreground sm:text-base">
          Last 48 hours, plus live signals from GitHub and Hacker News.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <Suspense fallback={<NewsGridSkeleton count={6} />}>
          <TrendingFeed />
        </Suspense>
        <aside className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          <Suspense fallback={null}>
            <GitHubTrendingWidget />
          </Suspense>
          <Suspense fallback={null}>
            <HackerNewsWidget />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

async function TrendingFeed() {
  const articles = await fetchTrending(15);
  if (articles.length === 0) {
    return (
      <EmptyState
        title="No trending articles yet"
        description="As fresh stories are ingested, they'll show up here within 48 hours of publishing."
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 2xl:grid-cols-3">
      {articles.map((a, i) => (
        <NewsCard key={a.id} article={a} priority={i < 3} />
      ))}
    </div>
  );
}
