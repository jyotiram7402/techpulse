export type ArticleCategory =
  | "ai"
  | "programming"
  | "java"
  | "react"
  | "devops"
  | "cybersecurity"
  | "startups"
  | "opensource";

export interface Article {
  id: string;
  title: string;
  summary: string;
  why_it_matters: string;
  url: string;
  source: string;
  category: ArticleCategory;
  image_url: string | null;
  published_at: string;
  created_at: string;
}

export interface ArticleInput {
  title: string;
  summary: string;
  why_it_matters: string;
  url: string;
  source: string;
  category: ArticleCategory;
  image_url: string | null;
  published_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: { login: string; avatar_url: string };
}

export interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}
