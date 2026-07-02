import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTrending } from "@/services/articles.service";
import { CATEGORIES } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";

export async function HeadlinesWidget() {
  const articles = await fetchTrending(6);
  if (articles.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Newspaper className="h-4 w-4 text-brand" />
          Top Headlines
        </CardTitle>
        <Link href="/trending" className="text-xs font-medium text-brand hover:underline">
          See all →
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        {articles.map((a) => {
          const cat = CATEGORIES.find((c) => c.slug === a.category) ?? CATEGORIES[1];
          return (
            <Link
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-2.5 first:pt-0 last:pb-0"
            >
              <span
                className={cn("text-[10px] font-bold uppercase tracking-wider", cat.color)}
              >
                {cat.label}
              </span>
              <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                {a.title}
              </h4>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                {a.source} · {timeAgo(a.published_at)}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
