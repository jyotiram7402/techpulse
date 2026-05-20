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
    <div className="container space-y-10 py-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">
          <Flame className="h-3 w-3" />
          Trending now
        </div>
        <h1 className="text-3xl font-bold tracking-tight">What developers are reading</h1>
        <p className="max-w-2xl text-muted-foreground">
          Articles published in the last 48 hours, plus live signals from GitHub and Hacker News.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Suspense fallback={<NewsGridSkeleton count={6} />}>
          <TrendingFeed />
        </Suspense>
        <aside className="space-y-6">
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
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((a, i) => (
        <NewsCard key={a.id} article={a} priority={i < 3} />
      ))}
    </div>
  );
}
