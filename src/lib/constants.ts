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
  color: string;
}> = [
  { slug: "ai", label: "AI", emoji: "🧠", gradient: "from-violet-500 to-fuchsia-500", color: "text-violet-500" },
  { slug: "programming", label: "Programming", emoji: "💻", gradient: "from-sky-500 to-cyan-500", color: "text-sky-500" },
  { slug: "webdev", label: "Web Dev", emoji: "🕸️", gradient: "from-teal-400 to-emerald-500", color: "text-teal-500" },
  { slug: "react", label: "React", emoji: "⚛️", gradient: "from-cyan-400 to-blue-500", color: "text-cyan-500" },
  { slug: "java", label: "Java", emoji: "☕", gradient: "from-orange-500 to-red-500", color: "text-orange-500" },
  { slug: "mobile", label: "Mobile", emoji: "📱", gradient: "from-lime-500 to-green-500", color: "text-lime-500" },
  { slug: "cloud", label: "Cloud", emoji: "☁️", gradient: "from-blue-500 to-indigo-500", color: "text-blue-500" },
  { slug: "devops", label: "DevOps", emoji: "⚙️", gradient: "from-emerald-500 to-teal-500", color: "text-emerald-500" },
  { slug: "data", label: "Data & DB", emoji: "🗄️", gradient: "from-yellow-500 to-amber-500", color: "text-yellow-500" },
  { slug: "architecture", label: "Architecture", emoji: "🏗️", gradient: "from-stone-400 to-zinc-500", color: "text-stone-400" },
  { slug: "cybersecurity", label: "Cybersecurity", emoji: "🛡️", gradient: "from-rose-500 to-pink-500", color: "text-rose-500" },
  { slug: "tools", label: "Dev Tools", emoji: "🧰", gradient: "from-fuchsia-500 to-pink-500", color: "text-fuchsia-500" },
  { slug: "startups", label: "Startups", emoji: "🚀", gradient: "from-amber-500 to-orange-500", color: "text-amber-500" },
  { slug: "opensource", label: "Open Source", emoji: "🌐", gradient: "from-indigo-500 to-purple-500", color: "text-indigo-400" }
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

  // ── React ───────────────────────────────────────────────────────
  { url: "https://dev.to/feed/tag/react", source: "DEV · React", category: "react" },
  { url: "https://dev.to/feed/tag/nextjs", source: "DEV · Next.js", category: "react" },
  { url: "https://css-tricks.com/feed/", source: "CSS-Tricks", category: "webdev" },
  { url: "https://www.smashingmagazine.com/feed/", source: "Smashing Magazine", category: "webdev" },

  // ── Web Dev / Frontend ──────────────────────────────────────────
  { url: "https://web.dev/feed.xml", source: "web.dev", category: "webdev" },
  { url: "https://hacks.mozilla.org/feed/", source: "Mozilla Hacks", category: "webdev" },
  { url: "https://dev.to/feed/tag/webdev", source: "DEV · Web Dev", category: "webdev" },

  // ── Mobile ──────────────────────────────────────────────────────
  { url: "https://android-developers.googleblog.com/feeds/posts/default?alt=rss", source: "Android Developers", category: "mobile" },
  { url: "https://dev.to/feed/tag/flutter", source: "DEV · Flutter", category: "mobile" },
  { url: "https://dev.to/feed/tag/reactnative", source: "DEV · React Native", category: "mobile" },

  // ── Cloud ───────────────────────────────────────────────────────
  { url: "https://aws.amazon.com/blogs/aws/feed/", source: "AWS News Blog", category: "cloud" },
  { url: "https://azure.microsoft.com/en-us/blog/feed/", source: "Azure Blog", category: "cloud" },
  { url: "https://cloudblog.withgoogle.com/rss/", source: "Google Cloud Blog", category: "cloud" },

  // ── DevOps / Engineering ────────────────────────────────────────
  { url: "https://blog.cloudflare.com/rss/", source: "Cloudflare Blog", category: "devops" },
  { url: "https://netflixtechblog.com/feed", source: "Netflix Tech Blog", category: "devops" },
  { url: "https://kubernetes.io/feed.xml", source: "Kubernetes Blog", category: "devops" },
  { url: "https://dev.to/feed/tag/devops", source: "DEV · DevOps", category: "devops" },

  // ── Data & Databases ────────────────────────────────────────────
  { url: "https://dev.to/feed/tag/database", source: "DEV · Database", category: "data" },
  { url: "https://dev.to/feed/tag/datascience", source: "DEV · Data Science", category: "data" },

  // ── Architecture & Methods ──────────────────────────────────────
  { url: "https://martinfowler.com/feed.atom", source: "Martin Fowler", category: "architecture" },
  { url: "https://feed.infoq.com/architecture-design/", source: "InfoQ Architecture", category: "architecture" },

  // ── Dev Tools ───────────────────────────────────────────────────
  { url: "https://blog.jetbrains.com/feed/", source: "JetBrains Blog", category: "tools" },
  { url: "https://code.visualstudio.com/feed.xml", source: "VS Code Blog", category: "tools" },

  // ── Cybersecurity ───────────────────────────────────────────────
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", category: "cybersecurity" },
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security", category: "cybersecurity" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", category: "cybersecurity" },

  // ── Startups / Tech business ────────────────────────────────────
  { url: "https://techcrunch.com/feed/", source: "TechCrunch", category: "startups" },
  { url: "https://www.theverge.com/rss/index.xml", source: "The Verge", category: "startups" },
  { url: "https://venturebeat.com/feed/", source: "VentureBeat", category: "startups" },
  { url: "https://feeds.arstechnica.com/arstechnica/index", source: "Ars Technica", category: "startups" },
  { url: "https://www.theregister.com/headlines.atom", source: "The Register", category: "startups" },

  // ── Open Source ─────────────────────────────────────────────────
  { url: "https://github.blog/feed/", source: "GitHub Blog", category: "opensource" },
  { url: "https://itsfoss.com/rss/", source: "It's FOSS", category: "opensource" },
  { url: "https://dev.to/feed/tag/opensource", source: "DEV · Open Source", category: "opensource" }
];

export const PAGE_SIZE = 24;
