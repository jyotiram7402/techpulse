import { generateWhyItMatters } from "@/utils/summarizer";
import { classify } from "@/utils/classifier";
import { truncate } from "@/lib/utils";
import type { ArticleInput, HackerNewsItem } from "@/types/article";

const TOPSTORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const ITEM_URL = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

export async function fetchTopStories(limit = 20): Promise<HackerNewsItem[]> {
  const idsRes = await fetch(TOPSTORIES_URL, {
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 600 }
  });
  if (!idsRes.ok) throw new Error(`HN topstories ${idsRes.status}`);
  const ids = (await idsRes.json()) as number[];

  const sliced = ids.slice(0, limit);
  const items = await Promise.all(
    sliced.map(async (id) => {
      try {
        const r = await fetch(ITEM_URL(id), {
          signal: AbortSignal.timeout(6000),
          next: { revalidate: 600 }
        });
        if (!r.ok) return null;
        return (await r.json()) as HackerNewsItem;
      } catch {
        return null;
      }
    })
  );
  return items.filter((i): i is HackerNewsItem => !!i && !!i.title);
}

export async function collectHackerNewsArticles(): Promise<ArticleInput[]> {
  const items = await fetchTopStories(25);

  return items
    .filter((item) => item.url)
    .map((item) => {
      const summary = truncate(
        `Trending on Hacker News with ${item.score} points and ${item.descendants ?? 0} comments. Submitted by ${item.by}.`,
        280
      );
      const why = generateWhyItMatters(item.title, summary);
      const category = classify(item.title, summary, "programming");

      return {
        title: item.title,
        summary,
        why_it_matters: why,
        url: item.url!,
        source: "Hacker News",
        category,
        image_url: null,
        published_at: new Date(item.time * 1000).toISOString()
      };
    });
}
