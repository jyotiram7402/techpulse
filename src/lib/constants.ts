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
  // ── AI ──────────────────────────────────────────────────────────
  { url: "https://huggingface.co/blog/feed.xml", source: "Hugging Face", category: "ai" },
  { url: "https://venturebeat.com/category/ai/feed/", source: "VentureBeat AI", category: "ai" },
  { url: "https://www.marktechpost.com/feed/", source: "MarkTechPost", category: "ai" },
  { url: "https://blog.google/technology/ai/rss/", source: "Google AI Blog", category: "ai" },
  { url: "https://dev.to/feed/tag/ai", source: "DEV · AI", category: "ai" },

  // ── Programming ─────────────────────────────────────────────────
  { url: "https://dev.to/feed", source: "DEV", category: "programming" },
  { url: "https://www.freecodecamp.org/news/rss/", source: "freeCodeCamp", category: "programming" },
  { url: "https://stackoverflow.blog/feed/", source: "Stack Overflow Blog", category: "programming" },
  { url: "https://feed.infoq.com/", source: "InfoQ", category: "programming" },
  { url: "https://lobste.rs/rss", source: "Lobsters", category: "programming" },

  // ── Java ────────────────────────────────────────────────────────
  { url: "https://feeds.feedburner.com/Baeldung", source: "Baeldung", category: "java" },
  { url: "https://dev.to/feed/tag/java", source: "DEV · Java", category: "java" },
  { url: "https://feed.infoq.com/java/", source: "InfoQ Java", category: "java" },

  // ── React / Frontend ────────────────────────────────────────────
  { url: "https://dev.to/feed/tag/react", source: "DEV · React", category: "react" },
  { url: "https://css-tricks.com/feed/", source: "CSS-Tricks", category: "react" },
  { url: "https://www.smashingmagazine.com/feed/", source: "Smashing Magazine", category: "react" },

  // ── DevOps / Engineering ────────────────────────────────────────
  { url: "https://blog.cloudflare.com/rss/", source: "Cloudflare Blog", category: "devops" },
  { url: "https://netflixtechblog.com/feed", source: "Netflix Tech Blog", category: "devops" },
  { url: "https://kubernetes.io/feed.xml", source: "Kubernetes Blog", category: "devops" },
  { url: "https://aws.amazon.com/blogs/aws/feed/", source: "AWS News Blog", category: "devops" },
  { url: "https://dev.to/feed/tag/devops", source: "DEV · DevOps", category: "devops" },

  // ── Cybersecurity ───────────────────────────────────────────────
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", category: "cybersecurity" },
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security", category: "cybersecurity" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", category: "cybersecurity" },

  // ── Startups / Tech business ────────────────────────────────────
  { url: "https://techcrunch.com/feed/", source: "TechCrunch", category: "startups" },
  { url: "https://www.theverge.com/rss/index.xml", source: "The Verge", category: "startups" },
  { url: "https://venturebeat.com/feed/", source: "VentureBeat", category: "startups" },

  // ── Open Source ─────────────────────────────────────────────────
  { url: "https://github.blog/feed/", source: "GitHub Blog", category: "opensource" },
  { url: "https://itsfoss.com/rss/", source: "It's FOSS", category: "opensource" },
  { url: "https://dev.to/feed/tag/opensource", source: "DEV · Open Source", category: "opensource" }
];

export const PAGE_SIZE = 24;
