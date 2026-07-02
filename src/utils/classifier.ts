import type { ArticleCategory } from "@/types/article";

// Order matters — first match wins. Specific categories before broad ones.
const RULES: Array<{ category: ArticleCategory; patterns: RegExp[] }> = [
  {
    category: "cybersecurity",
    patterns: [
      /\b(security|vulnerability|cve|exploit|breach|ransomware|malware|phishing|zero-day|zero day|patch tuesday|owasp|infosec)\b/i
    ]
  },
  {
    category: "ai",
    patterns: [
      /\b(ai|a\.i\.|llm|gpt|claude|gemini|llama|mistral|anthropic|openai|huggingface|hugging face|machine learning|deep learning|neural|inference|rag|agentic|transformer|diffusion|copilot)\b/i
    ]
  },
  {
    category: "mobile",
    patterns: [
      /\b(android|ios app|iphone|swiftui|swift \d|flutter|react native|kotlin multiplatform|mobile app|app store|play store)\b/i
    ]
  },
  {
    category: "cloud",
    patterns: [
      /\b(aws|amazon web services|azure|google cloud|gcp|serverless|lambda|s3\b|ec2|cloud computing|cloud native|vercel|netlify)\b/i
    ]
  },
  {
    category: "data",
    patterns: [
      /\b(database|postgres|postgresql|mysql|mongodb|redis|kafka|sql\b|nosql|data engineering|etl\b|data pipeline|snowflake|bigquery|analytics|clickhouse|duckdb)\b/i
    ]
  },
  {
    category: "devops",
    patterns: [
      /\b(devops|kubernetes|k8s|docker|container|terraform|ansible|ci\/cd|sre\b|observability|grafana|prometheus|cloudflare|platform engineering|helm|gitops)\b/i
    ]
  },
  {
    category: "react",
    patterns: [/\b(react|next\.js|nextjs|jsx|remix|redux|react native)\b/i]
  },
  {
    category: "webdev",
    patterns: [
      /\b(css|html|frontend|front-end|browser|chrome|firefox|safari|webassembly|wasm|web platform|dom\b|tailwind|svelte|vue|astro|vite|web component)\b/i
    ]
  },
  {
    category: "java",
    patterns: [/\b(java\b|jvm|kotlin|spring boot|spring framework|jakarta|maven|gradle|hibernate|jpa|quarkus)\b/i]
  },
  {
    category: "architecture",
    patterns: [
      /\b(microservice|monolith|architecture|design pattern|domain-driven|event-driven|system design|distributed system|api design|scalability)\b/i
    ]
  },
  {
    category: "tools",
    patterns: [
      /\b(vs code|vscode|intellij|jetbrains|ide\b|neovim|vim\b|terminal|cli tool|developer tools|devtools|productivity)\b/i
    ]
  },
  {
    category: "startups",
    patterns: [/\b(startup|seed round|series [abc]|funding|yc\b|y combinator|raised \$|valuation|founder|acquisition|ipo\b)\b/i]
  },
  {
    category: "opensource",
    patterns: [/\b(open source|open-source|oss\b|github|mit license|apache license|contributor|maintainer|fork\b)\b/i]
  },
  {
    category: "programming",
    patterns: [
      /\b(python|typescript|javascript|rust|golang|go \d|c\+\+|c#|elixir|ruby|php|programming|developer|coding|software engineer|algorithm)\b/i
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
