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
| Cron         | Vercel Cron Jobs (free)                  |
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
├── middleware.ts                # Supabase session refresh + protected routes
├── vercel.json                  # Cron job definitions
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

Vercel automatically registers the cron jobs defined in `vercel.json`. Within the first hour, the RSS cron will fire and the feed will start populating.

### 4) (One-time) Seed the database

You don't have to wait an hour for the first cron tick. Hit these once after deploying:

```
https://<your>.vercel.app/api/cron/rss
https://<your>.vercel.app/api/cron/github
https://<your>.vercel.app/api/cron/hackernews
```

If you set `CRON_SECRET`, hit them with an `Authorization: Bearer <secret>` header (use any API client extension like Hoppscotch, RapidAPI, or browser DevTools fetch). When `CRON_SECRET` is unset, the routes are open — set it before public launch.

> Vercel-scheduled cron requests are automatically authenticated with the `Authorization: Bearer $CRON_SECRET` header.

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
