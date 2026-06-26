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

  const { data } = await supabase
    .from("bookmarks")
    .select("article_id, created_at, articles(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const articles: Article[] =
    (data ?? [])
      .map((row) => row.articles)
      .filter((a): a is Article => !!a && typeof a === "object" && "id" in a) ?? [];

  return (
    <div className="container space-y-6 py-6 sm:space-y-8 sm:py-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          <Bookmark className="h-3 w-3" />
          Your library
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bookmarks</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
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
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
