import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/news-card";
import { EmptyState } from "@/components/empty-state";
import type { Article } from "@/types/article";

export const metadata = {
  title: "Bookmarks",
  description: "Your saved articles."
};

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/bookmarks");
  }

  // 1. Fetch user's bookmark rows (newest first).
  const { data: bookmarkRows } = await supabase
    .from("bookmarks")
    .select("article_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 2. Fetch the corresponding articles in one round-trip, then re-order
  //    them to match the bookmark order.
  let articles: Article[] = [];
  if (bookmarkRows && bookmarkRows.length > 0) {
    const articleIds = bookmarkRows.map((r) => r.article_id);
    const { data: articleRows } = await supabase
      .from("articles")
      .select("*")
      .in("id", articleIds);

    const articleMap = new Map<string, Article>(
      (articleRows ?? []).map((a) => [a.id, a as Article])
    );
    articles = bookmarkRows
      .map((row) => articleMap.get(row.article_id))
      .filter((a): a is Article => !!a);
  }

  return (
    <div className="container space-y-4 py-4 sm:space-y-8 sm:py-8">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[10px] font-medium text-brand sm:px-3 sm:py-1 sm:text-xs">
          <Bookmark className="h-3 w-3" />
          Your library
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-3xl">Bookmarks</h1>
        <p className="max-w-2xl text-xs text-muted-foreground sm:text-base">
          Everything you&apos;ve saved, in one place.
        </p>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Tap the bookmark icon on any article to save it for later."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
