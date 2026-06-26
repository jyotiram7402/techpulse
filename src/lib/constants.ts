import type { ArticleCategory } from "@/types/article";

export const SITE = {
  name: "DevFeed",
  tagline: "Spotify for Tech News",
  description:
    "Your personalized stream of AI, programming, GitHub trends, and engineering blog posts — curated for developers.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://devfeed.vercel.app"
} as const;

export const CATEGORIES: Array<{
  slug: ArticleCategory;
  label: string;
  emoji: string;
  gradient: string;
}> = [
  { slug: "ai", label: "AI", emoji: "🧠", gradient: "from-violet-500 to-fuchsia-500" },
  { slug: "programming", label: "Programming", emoji: "💻", gradient: "from-sky-500 to-cyan-500" },
  { slug: "java", label: "Java", emoji: "☕", gradient: "from-orange-500 to-red-500" },
  { slug: "react", label: "React", emoji: "⚛️", gradient: "from-cyan-400 to-blue-500" },
  { slug: "devops", label: "DevOps", emoji: "⚙️", gradient: "from-emerald-500 to-teal-500" },
  { slug: "cybersecurity", label: "Cybersecurity", emoji: "🛡️", gradient: "from-rose-500 to-pink-500" },
  { slug: "startups", label: "Startups", emoji: "🚀", gradient: "from-amber-500 to-orange-500" },
  { slug: "opensource", label: "Open Source", emoji: "🌐", gradient: "from-indigo-500 to-purple-500" }
];

export const RSS_FEEDS: Array<{
  url: string;
  source: string;
  category: ArticleCategory;
}> = [
  // AI
  { url: "https://openai.com/news/rss.xml", source: "OpenAI", category: "ai" },
  { url: "https://huggingface.co/blog/feed.xml", source: "Hugging Face", category: "ai" },
  { url: "https://www.anthropic.com/news/rss.xml", source: "Anthropic", category: "ai" },
  // Programming
  { url: "https://dev.to/feed", source: "DEV", category: "programming" },
  { url: "https://hashnode.com/n/feed", source: "Hashnode", category: "programming" },
  // Engineering
  { url: "https://netflixtechblog.com/feed", source: "Netflix Tech Blog", category: "devops" },
  { url: "https://blog.cloudflare.com/rss/", source: "Cloudflare Blog", category: "devops" }
];

export const PAGE_SIZE = 24;
