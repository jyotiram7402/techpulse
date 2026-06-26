import { fetchAndParseFeed } from "@/utils/feed-parser";
import { summarize, generateWhyItMatters } from "@/utils/summarizer";
import { classify } from "@/utils/classifier";
import { safeDate } from "@/utils/format";
import { truncate } from "@/lib/utils";
import { RSS_FEEDS } from "@/lib/constants";
import type { ArticleInput } from "@/types/article";

export async function collectRssArticles(): Promise<ArticleInput[]> {
  const results: ArticleInput[] = [];

  // Process feeds sequentially in small chunks to stay within memory/time limits.
  const settled = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const items = await fetchAndParseFeed(feed.url);
      const articles: ArticleInput[] = [];

      for (const item of items.slice(0, 12)) {
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

  for (const r of settled) {
    if (r.status === "fulfilled") results.push(...r.value);
  }

  return results;
}
