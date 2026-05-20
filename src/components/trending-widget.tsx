import Link from "next/link";
import { Flame, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTrendingRepos } from "@/services/github.service";
import { fetchTopStories } from "@/services/hackernews.service";
import { formatNumber, domainOf } from "@/utils/format";

export async function GitHubTrendingWidget() {
  let repos: Awaited<ReturnType<typeof fetchTrendingRepos>> = [];
  try {
    repos = (await fetchTrendingRepos()).slice(0, 8);
  } catch {
    repos = [];
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-4 w-4 text-amber-500" />
          GitHub Trending
        </CardTitle>
        <span className="text-xs text-muted-foreground">7 days</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {repos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet — try again later.</p>
        ) : (
          repos.map((repo, i) => (
            <Link
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-accent"
            >
              <span className="w-5 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{repo.full_name}</div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {repo.description ?? "No description"}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {formatNumber(repo.stargazers_count)}
                  </span>
                  {repo.language ? <span>{repo.language}</span> : null}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export async function HackerNewsWidget() {
  let stories: Awaited<ReturnType<typeof fetchTopStories>> = [];
  try {
    stories = (await fetchTopStories(10)).slice(0, 10);
  } catch {
    stories = [];
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="h-4 w-4 text-orange-500" />
          Hacker News Top
        </CardTitle>
        <span className="text-xs text-muted-foreground">Live</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {stories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet — try again later.</p>
        ) : (
          stories.map((s, i) => (
            <Link
              key={s.id}
              href={s.url ?? `https://news.ycombinator.com/item?id=${s.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-accent"
            >
              <span className="w-5 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-sm font-medium">{s.title}</div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{s.score} pts</span>
                  <span>{s.descendants ?? 0} comments</span>
                  {s.url ? <span>{domainOf(s.url)}</span> : null}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
