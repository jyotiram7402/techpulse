-- =====================================================================
-- Spotify for Tech News — Supabase schema
-- Run this in the Supabase SQL editor: https://app.supabase.com/project/_/sql
-- =====================================================================

-- Required extensions (Supabase already has these enabled, but safe to assert).
create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- =====================================================================
-- articles
-- =====================================================================
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  summary         text not null default '',
  why_it_matters  text not null default '',
  url             text not null unique,
  source          text not null,
  category        text not null,
  image_url       text,
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

create index if not exists articles_category_published_at_idx
  on public.articles (category, published_at desc);

create index if not exists articles_source_idx
  on public.articles (source);

create index if not exists articles_title_trgm_idx
  on public.articles using gin (title gin_trgm_ops);

-- =====================================================================
-- bookmarks
-- =====================================================================
create table if not exists public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  article_id  uuid not null references public.articles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, article_id)
);

create index if not exists bookmarks_user_id_idx
  on public.bookmarks (user_id, created_at desc);

-- =====================================================================
-- user_preferences
-- =====================================================================
create table if not exists public.user_preferences (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.articles          enable row level security;
alter table public.bookmarks         enable row level security;
alter table public.user_preferences  enable row level security;

-- Articles: world-readable, writes only via service-role (cron jobs).
drop policy if exists "articles_select_all" on public.articles;
create policy "articles_select_all"
  on public.articles for select
  using (true);

-- (No insert/update/delete policy => only the service role can write.)

-- Bookmarks: each user can manage only their own.
drop policy if exists "bookmarks_select_own"  on public.bookmarks;
drop policy if exists "bookmarks_insert_own"  on public.bookmarks;
drop policy if exists "bookmarks_delete_own"  on public.bookmarks;
create policy "bookmarks_select_own"
  on public.bookmarks for select
  using (auth.uid() = user_id);
create policy "bookmarks_insert_own"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);
create policy "bookmarks_delete_own"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Preferences: each user can manage only their own.
drop policy if exists "prefs_select_own" on public.user_preferences;
drop policy if exists "prefs_upsert_own" on public.user_preferences;
drop policy if exists "prefs_update_own" on public.user_preferences;
create policy "prefs_select_own"
  on public.user_preferences for select
  using (auth.uid() = user_id);
create policy "prefs_upsert_own"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);
create policy "prefs_update_own"
  on public.user_preferences for update
  using (auth.uid() = user_id);
