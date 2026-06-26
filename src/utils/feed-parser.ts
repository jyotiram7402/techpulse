import { XMLParser } from "fast-xml-parser";
import { stripHtml } from "@/lib/utils";

export interface ParsedFeedItem {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  image: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  allowBooleanAttributes: true,
  parseTagValue: false,
  trimValues: true
});

function asString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v["#text"] === "string") return v["#text"];
    if (typeof v["#text"] === "number") return String(v["#text"]);
  }
  return "";
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function extractImage(item: Record<string, unknown>, html: string): string | null {
  const enclosure = item["enclosure"] as Record<string, unknown> | undefined;
  if (enclosure && typeof enclosure["@_url"] === "string") {
    return enclosure["@_url"];
  }
  const mediaContent = item["media:content"] as Record<string, unknown> | undefined;
  if (mediaContent && typeof mediaContent["@_url"] === "string") {
    return mediaContent["@_url"];
  }
  const mediaThumb = item["media:thumbnail"] as Record<string, unknown> | undefined;
  if (mediaThumb && typeof mediaThumb["@_url"] === "string") {
    return mediaThumb["@_url"];
  }
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return null;
}

function extractLink(item: Record<string, unknown>): string {
  const link = item["link"];
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    for (const l of link) {
      if (typeof l === "string") return l;
      if (l && typeof l === "object") {
        const lo = l as Record<string, unknown>;
        if (typeof lo["@_href"] === "string") return lo["@_href"];
      }
    }
  }
  if (link && typeof link === "object") {
    const lo = link as Record<string, unknown>;
    if (typeof lo["@_href"] === "string") return lo["@_href"];
    if (typeof lo["#text"] === "string") return lo["#text"];
  }
  return "";
}

export async function fetchAndParseFeed(url: string): Promise<ParsedFeedItem[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "DevFeed/1.0 (+https://devfeed.vercel.app)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"
    },
    signal: AbortSignal.timeout(12000),
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`Feed ${url} returned ${res.status}`);
  }

  const xml = await res.text();
  const parsed = parser.parse(xml) as Record<string, unknown>;

  // RSS 2.0
  if (parsed.rss) {
    const rss = parsed.rss as Record<string, unknown>;
    const channel = rss.channel as Record<string, unknown> | undefined;
    if (!channel) return [];
    const items = asArray(channel.item) as Record<string, unknown>[];
    return items.map((item) => {
      const description = asString(item.description);
      const contentEncoded = asString(item["content:encoded"]);
      const html = contentEncoded || description;
      return {
        title: stripHtml(asString(item.title)),
        link: extractLink(item),
        description: stripHtml(description),
        content: stripHtml(html),
        pubDate: asString(item.pubDate) || asString(item["dc:date"]) || new Date().toISOString(),
        image: extractImage(item, html)
      };
    });
  }

  // Atom
  if (parsed.feed) {
    const feed = parsed.feed as Record<string, unknown>;
    const entries = asArray(feed.entry) as Record<string, unknown>[];
    return entries.map((entry) => {
      const summary = asString(entry.summary);
      const content = asString(entry.content);
      const html = content || summary;
      return {
        title: stripHtml(asString(entry.title)),
        link: extractLink(entry),
        description: stripHtml(summary),
        content: stripHtml(html),
        pubDate: asString(entry.updated) || asString(entry.published) || new Date().toISOString(),
        image: extractImage(entry, html)
      };
    });
  }

  return [];
}
