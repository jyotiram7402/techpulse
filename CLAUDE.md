# CLAUDE.md — TechPulse (DevFeed)

## Overview
- DevFeed ("Spotify for Tech News"): a Next.js site that pulls developer news from 47 RSS feeds, GitHub trending and Hacker News, summarizes and categorizes each item, and serves a searchable, filterable feed.
- Anyone can read without an account. Signed-in users (Supabase email/password) get bookmarks and saved category preferences.
- Repo `github.com/jyotiram7402/techpulse`. Runs on free tiers: Vercel (hosting), Supabase (DB + auth), GitHub Actions (crons).

## Tech stack (as on `main`)
- Next.js 14.2.13 (App Router, everything under `src/app`), React 18.3.1, TypeScript 5.5.4 (strict), `engines.node >=18.17.0`.
- Tailwind 3.4.11 + shadcn/ui on Radix (`components.json`), lucide-react, next-themes 0.3.0 (dark by default).
- Supabase Postgres + Auth through `@supabase/ssr` 0.5.1 and `@supabase/supabase-js` 2.45.4.
- `fast-xml-parser` 4.5.0 (RSS/Atom), `zod` 3.23.8 (API input validation), `date-fns` 3.6.0.
- All versions are exact pins (no `^`/`~`). No lockfile is committed (unverified whether that's deliberate).
- No test framework, no ESLint config, no Prettier config.

## Setup on a fresh machine
1. Install Git and Node ≥18.17 with npm (builds were verified on Node 24). No local database: the app uses the hosted Supabase project.
2. `npm install --package-lock=false`. The flag stops npm from creating a lockfile the repo doesn't track.
3. `cp .env.example .env.local`, then fill in the values listed under Env variables. Copy them from Vercel → Project → Settings → Environment Variables, or from Supabase → Project Settings → API.
4. `npm run dev`, then open http://localhost:3000.
5. To load data locally, leave `CRON_SECRET` unset and run `curl http://localhost:3000/api/cron/rss` (also `/github` and `/hackernews`). This writes to whichever Supabase project `.env.local` points at, and needs `SUPABASE_SERVICE_ROLE_KEY`.
- To create a brand-new Supabase/Vercel/GitHub setup from scratch, follow README.md → "Deployment".

## Commands
- Install: `npm install --package-lock=false`
- Dev server: `npm run dev` (port 3000)
- Production build: `npm run build`. It needs network access for `next/font/google`. Without real env values: `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy npm run build`
- Run the build: `npm start` (another port: `npm start -- -p 3123`)
- Type check: `npx tsc --noEmit`
- Tests: none. There's no runner, so `tsc` + `build` + a manual smoke test is the check.
- Lint: `npm run lint` runs `next lint`. No ESLint config is committed, so it will offer to create one (unverified).
- DB migrations: none. `supabase/schema.sql` is idempotent: paste it into Supabase → SQL Editor and run.
- Deploy: push to `main`, and Vercel builds it from GitHub (unverified; per the README the repo is imported into Vercel).
- Run ingestion in prod: GitHub → Actions → "Ingest …" → Run workflow, or `curl -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/cron/rss"`.

## Project map
- `src/app/`: App Router pages.
  - `/` (`page.tsx`): feed plus sidebar widgets.
  - `/trending`, `/categories`, `/categories/[slug]`, `/bookmarks`, `/settings`, `/login`, `/register`.
  - `layout.tsx`: fonts, providers, Navbar, Sidebar and Footer; reads the session.
  - Also `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`.
- `src/app/api/cron/{rss,github,hackernews}/route.ts`: ingestion (GET, Bearer `CRON_SECRET`, `force-dynamic`, `maxDuration = 60`).
- `src/app/api/articles/route.ts`: public JSON feed (zod-validated, `s-maxage=120`).
- `src/app/api/bookmarks/route.ts`: GET/POST for the signed-in user. No UI code calls these two JSON endpoints.
- `src/app/api/auth/callback/route.ts`: swaps the code from the sign-up confirmation email for a session.
- `src/actions/auth.ts`: Server Actions `signInWithPassword`, `signUpWithPassword`, `signOut`.
- `src/services/`: the data layer.
  - `articles.service.ts`: `fetchArticles`, `fetchTrending`, `upsertArticles`.
  - `rss.service.ts`, `github.service.ts`, `hackernews.service.ts`: one collector per source.
- `src/utils/`:
  - `feed-parser.ts`: fetches and parses RSS/Atom.
  - `summarizer.ts`: Hugging Face summary or a rule-based one, plus `generateWhyItMatters`.
  - `classifier.ts`: regex rules that pick a category.
  - `format.ts`.
- `src/lib/supabase/`:
  - `server.ts`: `createClient()` (cookie-aware anon client) and `createServiceClient()` (service role).
  - `client.ts`: the browser client.
  - `middleware.ts`: `updateSession`, inactive (see Gotchas).
- `src/lib/constants.ts`: `SITE`, `CATEGORIES` (14), `RSS_FEEDS`, `PAGE_SIZE` (24).
- `src/lib/utils.ts`: `cn`, `timeAgo`, `truncate`, `stripHtml`, `slugify`, `hashString`.
- `src/components/`: app components (cards, navbar, widgets, search, category pills, empty/error states). `src/components/ui/`: shadcn primitives.
- `src/hooks/use-bookmarks.ts`: client-side bookmarks via Supabase under RLS. `src/hooks/use-debounce.ts`.
- `src/providers/`: `SupabaseProvider` (`useSupabase()`) and `ThemeProvider`.
- `src/types/article.ts`: `Article`, `ArticleInput`, `ArticleCategory`. `src/types/database.ts`: table types, kept in sync with the schema (by hand or by generator, unverified).
- `supabase/schema.sql`: tables `articles` (unique `url`), `bookmarks` and `user_preferences`, plus indexes and RLS.
- `.github/workflows/`: `cron-rss.yml` (hourly), `cron-hackernews.yml` (every 30 min), `cron-github.yml` (every 6 h), `keepalive.yml` (weekly).
- `vercel.json`: a daily backup run of `/api/cron/rss` at 05:00 UTC.

How the parts connect:
- **Ingest:** an Actions cron sends `curl $SITE_URL/api/cron/<source>` with the Bearer secret. The collector service runs `feed-parser`, `summarizer` and `classifier`. Then `upsertArticles()` writes with the service-role client: upsert on `url`, after deduping lowercased URLs.
- **Read:** a page (Server Component) calls `fetchArticles()` or `fetchTrending()` with the anon client and the user's cookies. RLS makes `articles` world-readable. Widgets call the GitHub and HN APIs live, cached 30 and 10 min via `next.revalidate`.
- **Auth:** Server Actions set the Supabase cookies. The root layout passes `getSession()` into `SupabaseProvider`. Client components use `useSupabase()` for the user's own bookmarks and preferences.

## Where to start for common tasks
- **Add an RSS source:** append `{ url, source, category }` to `RSS_FEEDS` in `src/lib/constants.ts`, then check `feeds` and `feedsFailed` in the `/api/cron/rss` response.
- **Add a category:** add it to `ArticleCategory` (`src/types/article.ts`) and `CATEGORIES` (constants), and add a rule in `src/utils/classifier.ts`. The first matching rule wins, so put specific rules before broad ones. Routes, the sitemap and the pills all derive from `CATEGORIES`.
- **Add an ingestion source:** create `src/services/<x>.service.ts` returning `ArticleInput[]`. Copy the route from `src/app/api/cron/hackernews/route.ts` and the workflow from `.github/workflows/cron-hackernews.yml`.
- **Add an API endpoint:** create `src/app/api/<name>/route.ts` and validate input with zod as in `api/articles/route.ts`. Use `createClient()` for user-scoped reads; use `createServiceClient()` only for server-side writes.
- **Add a page:** write `src/app/<route>/page.tsx` as an async Server Component. Put data in a child async component inside `<Suspense fallback={<NewsGridSkeleton …/>}>`, and render `ErrorState` when `failed` and `EmptyState` when empty, as in `src/app/page.tsx`.
- **Change the DB:** edit `supabase/schema.sql` and keep it re-runnable, run it in the SQL Editor, then update `src/types/database.ts` and `src/types/article.ts`.
- **Build UI:** reuse `src/components/ui/*` and `cn()`. Variants use `class-variance-authority` (see `src/components/ui/button.tsx`).

## Conventions
- File names are kebab-case. Components are named exports (`export function NewsCard`); default exports are only for Next route files.
- Server Components by default. `"use client"` only for interactive pieces: forms, hooks, theme toggle, search, menus and providers.
- Server-side reads go through `src/services/*`. Client code touches Supabase only via `useSupabase()`, and only for the signed-in user's own rows.
- Errors don't reach the page:
  - Services `console.error(...)` and return `failed: true` or `[]`.
  - Widgets catch errors and show "No data yet".
  - Cron routes return `{ ok: false, error }` with status 500.
  - RSS collection uses `Promise.allSettled`, so one dead feed doesn't fail the run.
- Feed state lives in the URL (`?q=`, `?category=`, `?page=`). `SearchBar` debounces for 350 ms, then calls `router.replace`.
- Layout is mobile-first. Grid and flex children use `min-w-0` or `minmax(0,1fr)` to prevent mobile overflow; keep that in new layouts.
- Every `next/image` has `unoptimized`, because images come from arbitrary hosts (`remotePatterns: "**"`).
- Comments are sparse and explain why something is done.

## Env variables & external services
Names only. Values live in Vercel's env settings, the Supabase dashboard and GitHub secrets. The template is `.env.example`.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (Supabase → Project Settings → API). Inlined at build time.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the anon public key, from the same page. Inlined at build time.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only, from the same page. Used only by `createServiceClient()` for cron upserts; never import it in client code.
- `CRON_SECRET`: a long random string. Cron routes require `Authorization: Bearer <value>`; if it's unset they're open, which is only acceptable locally. Vercel's cron sends it automatically.
- `NEXT_PUBLIC_SITE_URL`: the public base URL, used for metadata, the sitemap, robots and the sign-up email redirect. `SITE.url` falls back to `https://devfeed.vercel.app`.
- `HUGGINGFACE_API_KEY`: optional. Enables HF summaries (`sshleifer/distilbart-cnn-12-6`, 5 s timeout); without it summaries are rule-based.
- GitHub Actions secrets, read by the workflows rather than the app: `SITE_URL` (prod URL, no trailing slash) and `CRON_SECRET` (same value as in Vercel).
- External services:
  - Vercel: hosting and the daily cron (Hobby plan, so crons can run at most once a day).
  - Supabase free tier: Postgres and Auth.
  - GitHub Actions: the frequent crons.
  - Hugging Face Inference API: optional.
  - GitHub Search API and the HN Firebase API: no keys needed.
- Production URL: probably `https://devfeed.vercel.app` (unverified).

## Gotchas
- **Middleware never runs.** Root `middleware.ts` isn't compiled: when the app is in `src/app`, Next only loads `src/middleware.ts`. So sessions aren't refreshed, and each protected page checks for itself (`getUser()` + `redirect()` in `bookmarks` and `settings`).
- **Every page is dynamic.** The root layout and `Navbar` call `cookies()` through `createClient()`. So `revalidate = 300` and `generateStaticParams` on `/categories/[slug]` don't prerender anything, even though the build shows `●`.
- **Redirects and 404s return 200.** `redirect()` and `notFound()` in a page answer with a 200 (a meta refresh or the not-found UI), because the root `loading.tsx` starts streaming first.
- **`src/utils/summarizer.ts` contains two literal NUL bytes** (the sentence separator, lines 13–14). grep and ripgrep treat the file as binary, so use `grep -a`, and editors can strip the bytes without warning. Keep them, or deliberately switch to `"\0"` escapes.
- **Don't remove the keep-alive pieces.** Supabase free projects pause after 7 days without traffic, and GitHub disables scheduled workflows after 60 days without commits. The `vercel.json` cron and `keepalive.yml` prevent both. The symptom is "Couldn't load the news feed"; see README → Troubleshooting.
- **`NEXT_PUBLIC_*` values are baked in at build time.** After changing one in Vercel, redeploy.
- **GitHub items use the repo's `created_at` as `published_at`,** so trending repos don't stay pinned at the top of the feed (`src/services/github.service.ts`).
- **Claude Code worktrees can hide missing packages.** They live under `.git/.claude/worktrees/` inside the checkout, so TypeScript and webpack can fall back to the main checkout's `node_modules`. Verify dependency changes with `npx tsc --noEmit --typeRoots ./node_modules/@types` or a build in a separate copy.

## Current status (as of 2026-11-13)
- **Next 15 upgrade, not on `main`:** branch `claude/musing-elbakyan-08d1ce` (`88f3648`) moves to Next 15.5.28 + React 19.1.10. next 14.2.13 matches 35 npm advisories, including two Server Actions DoS issues; 15.5.28 matches none.
  - Code changes: `createClient()` is async (`await cookies()`); `params`/`searchParams` are Promises; next-themes 0.4.6; Radix dialog/dropdown bumped; the login and register forms submit via `onSubmit`, because React 19 resets a form after its action.
  - Build and smoke tested. A real sign-in submit is untested.
- **Middleware fix, uncommitted:** in worktree `relaxed-kilby-ccc4c3`: next 14.2.35 plus `middleware.ts` → `src/middleware.ts`. It compiles on 14.2.35 and 15.5.28, and signed-out `/bookmarks` and `/settings` then get a 307.
- **Security:**
  - `fast-xml-parser` 4.5.0 has a critical and two high advisories that apply here, since it parses untrusted RSS. Bump to 4.5.7.
  - zod 3 has a high advisory, fixed only in zod 4; it probably doesn't apply because no schema has collections.
  - postcss (build-time only).
  - `@supabase/auth-js` and `cookie`: low.
- **The README is stale in places.** It says middleware protects routes, lists 8 categories (the code has 14), gives a ~2 s HF timeout (code: 5 s), and says Vercel runs the hourly crons (GitHub Actions does).
- **The HF endpoint `api-inference.huggingface.co` may be retired (unverified).** If so, summaries silently fall back to rule-based.
- **No TODO/FIXME markers in the code.** README roadmap: personalized ranking from `user_preferences`, weekly email digest, mark-as-read, per-source toggles, tag filters, infinite scroll.

When you change commands, structure, env vars or conventions, update this file in the same commit.
