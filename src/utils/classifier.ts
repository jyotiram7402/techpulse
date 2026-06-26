import type { ArticleCategory } from "@/types/article";

const RULES: Array<{ category: ArticleCategory; patterns: RegExp[] }> = [
  {
    category: "ai",
    patterns: [
      /\b(ai|a\.i\.|llm|gpt|claude|gemini|llama|mistral|anthropic|openai|huggingface|hugging face|model|inference|rag|agent|transformer|diffusion|midjourney|stable diffusion)\b/i
    ]
  },
  {
    category: "cybersecurity",
    patterns: [
      /\b(security|vulnerability|cve|exploit|breach|ransomware|malware|phishing|zero-day|zero day|patch|cert\b|owasp)\b/i
    ]
  },
  {
    category: "devops",
    patterns: [
      /\b(devops|kubernetes|k8s|docker|terraform|ansible|ci\/cd|sre|observability|grafana|prometheus|cloudflare|aws|gcp|azure|platform engineering)\b/i
    ]
  },
  {
    category: "react",
    patterns: [/\b(react|next\.js|nextjs|jsx|tsx|tailwind|shadcn|remix|vite|astro|svelte|vue\.js)\b/i]
  },
  {
    category: "java",
    patterns: [/\b(java\b|jvm|kotlin|spring boot|spring framework|jakarta|maven|gradle|hibernate|jpa)\b/i]
  },
  {
    category: "startups",
    patterns: [/\b(startup|seed round|series [abc]|funding|yc|y combinator|raised|valuation|founder)\b/i]
  },
  {
    category: "opensource",
    patterns: [/\b(open source|open-source|oss|github|mit license|apache license|contributor|maintainer)\b/i]
  },
  {
    category: "programming",
    patterns: [
      /\b(python|typescript|javascript|rust|go\b|golang|c\+\+|c#|elixir|ruby|php|programming|developer|coding|software engineer)\b/i
    ]
  }
];

export function classify(title: string, body: string, fallback: ArticleCategory = "programming"): ArticleCategory {
  const text = `${title} ${body}`;
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule.category;
  }
  return fallback;
}
