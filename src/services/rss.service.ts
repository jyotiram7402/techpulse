import { fetchAndParseFeed } from "@/utils/feed-parser";
import { summarize, generateWhyItMatters } from "@/utils/summarizer";
import { classify } from "@/utils/classifier";
import { safeDate } from "@/utils/format";
import { truncate } from "@/lib/utils";
import { RSS_FEEDS } from "@/lib/constants";
import type { ArticleInput } from "@/types/article";

export interface FeedReport {
  source: string;
  ok: boolean;
  items: number;
  error?: string;
}

export interface RssCollectResult {
  articles: ArticleInput[];
  feeds: FeedReport[];
}

const ITEMS_PER_FEED = 8;

export async function collectRssArticles(): Promise<RssCollectResult> {
  const settled = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const items = await fetchAndParseFeed(feed.url);
      const articles: ArticleInput[] = [];

      for (const item of items.slice(0, ITEMS_PER_FEED)) {
        if (!item.title || !item.link) continue;

        const body = item.content || item.description;
        const summary = truncate(await summarize(body || item.title), 320);
        const why = generateWhyItMatters(item.title, summary);
        const category = classify(item.title, body, feed.category);

        articles.push({
          title: item.title,
          summary: summary || truncate(item.description, 280) || item.title,
          why_it_matters: why,
          url: item.link,
          source: feed.source,
          category,
          image_url: item.image,
          published_at: safeDate(item.pubDate)
        });
      }
      return articles;
    })
  );

  const articles: ArticleInput[] = [];
  const feeds: FeedReport[] = settled.map((result, i) => {
    const feed = RSS_FEEDS[i];
    if (result.status === "fulfilled") {
      articles.push(...result.value);
      return { source: feed.source, ok: true, items: result.value.length };
    }
    const message =
      result.reason instanceof Error ? result.reason.message : String(result.reason);
    return { source: feed.source, ok: false, items: 0, error: message };
  });

  return { articles, feeds };
}
