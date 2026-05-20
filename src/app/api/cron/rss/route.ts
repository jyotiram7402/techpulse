import { NextResponse } from "next/server";
import { collectRssArticles } from "@/services/rss.service";
import { upsertArticles } from "@/services/articles.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const articles = await collectRssArticles();
    const inserted = await upsertArticles(articles);
    return NextResponse.json({
      ok: true,
      source: "rss",
      fetched: articles.length,
      upserted: inserted
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
