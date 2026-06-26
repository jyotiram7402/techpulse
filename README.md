# DevFeed — Spotify for Tech News

> An AI-powered, personalized news feed for developers.
> AI news · GitHub trending · Hacker News · engineering blogs · open-source launches — all in one beautiful dashboard.

Built with Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel Cron.
Runs end-to-end on free tiers.

---

## Features

- **AI-summarized articles** — every article gets a short summary and a "why this matters" blurb (Hugging Face Inference API with a deterministic rule-based fallback).
- **Multi-source ingestion** — RSS feeds (OpenAI, Anthropic, Hugging Face, DEV, Hashnode, Netflix Tech Blog, Cloudflare, etc.), GitHub trending repos, and Hacker News top stories.
- **Automatic categorization** — AI, Programming, Java, React, DevOps, Cybersecurity, Startups, Open Source.
- **Search + category filters** with URL-driven state (shareable links).
- **Trending page** combining recent articles + live GitHub & HN sidebars.
- **Auth + bookmarks** via Supabase (email/password). Protected `/bookmarks` and `/settings` routes.
- **Premium dark mode** with developer-focused glassmorphism aesthetic. Light mode included.
- **Responsive** — phone, tablet, desktop.
- **SEO ready** — metadata, OpenGraph, sitemap.xml, robots.txt.
- **Vercel cron jobs** — hourly RSS sync, 30-minute HN sync, 6-hour GitHub sync.

---

## Tech stack

| Layer        | Choice                                  |
|--------------|------------------------------------------|
| Framework    | Next.js 14 App Router                    |
| Language     | TypeScript (strict)                      |
| Styling      | Tailwind CSS + shadcn/ui                 |
| Database     | Supabase Postgres (free)                 |
| Auth         | Supabase Auth (free)                     |
| Cron         | GitHub Actions (free) — pings cron endpoints on schedule |
| AI summary   | Hugging Face Inference API (free, opt-in) + rule-based fallback |
| Hosting      | Vercel (free)                            |

No paid services. No vector DB. No OpenAI billing.

---

## Project structure

```
.
├── src/
│   ├── app/                     # App Router pages, API, layouts
│   │   ├── api/
│   │   │   ├── articles/        # GET feed (paginated, filterable)
│   │   │   ├── auth/callback/   # Supabase OAuth callback
│   │   │   ├── bookmarks/       # User bookmarks
│   │   │   └── cron/
│   │   │       ├── rss/         # Hourly RSS ingestion
│   │   │       ├── github/      # 6-hourly GitHub trending
│   │   │       └── hackernews/  # 30-min HN top stories
│   │   ├── bookmarks/
│   │   ├── categories/[slug]/
│   │   ├── login/, register/, settings/, trending/
│   │   ├── error.tsx, loading.tsx, not-found.tsx
│   │   ├── sitemap.ts, robots.ts
│   │   ├── layout.tsx, page.tsx
│   │   └── globals.css
│   ├── components/              # Reusable UI (navbar, cards, widgets, ui/)
│   ├── services/                # rss / github / hackernews / articles
│   ├── utils/                   # summarizer, classifier, feed-parser, format
│   ├── lib/                     # supabase clients + constants + utils
│   ├── hooks/                   # use-debounce, use-bookmarks
│   ├── providers/               # theme, supabase
│   ├── actions/                 # server actions (auth)
│   └── types/                   # article, database
├── supabase/
│   └── schema.sql               # complete DB schema + RLS policies
├── .github/workflows/           # GitHub Actions cron triggers (free)
│   ├── cron-rss.yml             # hourly RSS ingestion
│   ├── cron-hackernews.yml      # 30-min HN ingestion
│   └── cron-github.yml          # 6-hour GitHub trending
├── middleware.ts                # Supabase session refresh + protected routes
├── vercel.json                  # Vercel config (minimal — crons live in GH Actions)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json              # shadcn config
├── package.json
├── .env.example
└── README.md
```

---

## Deployment — zero local commands

This project is designed to be deployed without running anything on your machine.

### 1) Push to GitHub

Upload this folder to a fresh GitHub repository (drag & drop in github.com works fine).

### 2) Create a free Supabase project

1. Sign up at [supabase.com](https://supabase.com) → create a project.
2. In the dashboard go to **SQL Editor** → paste the contents of `supabase/schema.sql` → run.
3. Go to **Project Settings → API** and grab:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, used by cron jobs)
4. (Optional) **Authentication → Providers → Email**: enable, decide whether to require email confirmation. For dev, disabling confirmation is fastest.

### 3) Connect to Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
2. **Framework preset**: Next.js (auto-detected).
3. **Environment Variables** — add the values from `.env.example`:

   | Name | Example |
   |------|---------|
   | `NEXT_PUBLIC_SUPABASE_URL`      | `https://abcdefgh.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ…` (the anon key)          |
   | `SUPABASE_SERVICE_ROLE_KEY`     | `eyJ…` (the service-role key)  |
   | `CRON_SECRET`                   | any long random string         |
   | `NEXT_PUBLIC_SITE_URL`          | `https://<your>.vercel.app`    |
   | `HUGGINGFACE_API_KEY`           | _optional_ — HF token, or leave blank for rule-based summaries |

4. Click **Deploy**.

### 4) Set up the cron triggers (GitHub Actions — free)

Vercel's Hobby plan only allows daily crons, so we use GitHub Actions instead. The workflows are already in `.github/workflows/` and will run automatically once you add two secrets:

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions → New repository secret**
2. Add these two secrets:

   | Name | Value |
   |------|-------|
   | `SITE_URL` | Your Vercel URL, e.g. `https://devfeed.vercel.app` (no trailing slash) |
   | `CRON_SECRET` | Same long random string you set in Vercel env vars |

3. That's it. The three workflows will start running on their schedules:
   - `cron-rss.yml` — every hour
   - `cron-hackernews.yml` — every 30 min
   - `cron-github.yml` — every 6 hours

You can also trigger any of them manually: **Actions tab → pick a workflow → Run workflow**.

### 5) (One-time) Seed the database

You don't have to wait an hour for the first cron tick. Easiest way: go to your GitHub repo → **Actions tab** → pick any of the three workflows → **Run workflow**. Do that for all three to populate every source.

Alternatively, hit the endpoints directly. If `CRON_SECRET` is set, you'll need to send it as a Bearer header:

```
https://<your>.vercel.app/api/cron/rss
https://<your>.vercel.app/api/cron/github
https://<your>.vercel.app/api/cron/hackernews
```

When `CRON_SECRET` is unset (e.g. for local testing), the routes are open — set it before going to production.

---

## How the AI summarization works

`src/utils/summarizer.ts` exports a `summarize()` function:

1. If `HUGGINGFACE_API_KEY` is set, try `sshleifer/distilbart-cnn-12-6` via the Hugging Face Inference API. ~2-second timeout to keep cron fast.
2. Otherwise (or on failure), fall back to a deterministic **extractive summarizer**: splits content into sentences and scores them by length, keyword density, and position.

`generateWhyItMatters()` matches the title + summary against keyword rules to produce a short developer-facing rationale ("security teams should patch", "platform engineering shift", "AI tooling signal", etc.).

`classify()` in `src/utils/classifier.ts` assigns one of the 8 categories using regex rules over the title and content.

All three are zero-cost, deterministic, and run inside the cron job before upserting into Supabase.

---

## Local development (optional)

If you ever want to run it locally:

```bash
git clone <your-repo>
cd <repo>
cp .env.example .env.local   # fill in real values
npm install
npm run dev
```

App runs at `http://localhost:3000`. The cron endpoints can be hit manually at the URLs above.

---

## Security

- Service-role key is never exposed to the client — it's only used inside `src/lib/supabase/server.ts` `createServiceClient()` and the cron route handlers.
- Cron routes require `Authorization: Bearer $CRON_SECRET` when the env var is set.
- All API inputs are validated with `zod`.
- Row Level Security is enabled on every table; only the owner can read/write their bookmarks and preferences.
- Articles are world-readable but write-only via the service role.

---

## Roadmap

- Personalized ranking using `user_preferences.categories`
- Email digest (weekly)
- Mark-as-read tracking
- Per-source toggle in settings
- Tag-based filtering
- Infinite scroll

---

Made with care. No paid APIs were harmed in the making of this project.
