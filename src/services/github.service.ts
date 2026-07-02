import { generateWhyItMatters } from "@/utils/summarizer";
import { classify } from "@/utils/classifier";
import { truncate } from "@/lib/utils";
import type { ArticleInput, GitHubRepo } from "@/types/article";

const SEARCH_URL =
  "https://api.github.com/search/repositories?q=created:>{since}&sort=stars&order=desc&per_page=20";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function fetchTrendingRepos(): Promise<GitHubRepo[]> {
  const url = SEARCH_URL.replace("{since}", isoDaysAgo(7));
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "DevFeed/1.0"
  };

  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 1800 }
  });

  if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
  const data = (await res.json()) as { items?: GitHubRepo[] };
  return data.items ?? [];
}

export async function collectGitHubArticles(): Promise<ArticleInput[]> {
  const repos = await fetchTrendingRepos();
  const fallbackDate = new Date().toISOString();

  return repos.slice(0, 10).map((repo) => {
    const desc = repo.description ?? "A trending repository on GitHub.";
    const title = `${repo.full_name} — ${repo.stargazers_count.toLocaleString()} stars`;
    const summary = truncate(
      `${desc} ${repo.language ? `Written in ${repo.language}.` : ""} Trending this week on GitHub.`,
      280
    );
    const why = generateWhyItMatters(title, desc);
    const category = classify(title, desc, "opensource");

    return {
      title,
      summary,
      why_it_matters: why,
      url: repo.html_url,
      source: "GitHub Trending",
      category,
      image_url: repo.owner?.avatar_url ?? null,
      // Use the repo's real creation date so trending repos don't get
      // re-stamped "now" on every cron run and permanently sit at the
      // top of the feed above genuinely fresh articles.
      published_at: repo.created_at ?? fallbackDate
    };
  });
}
