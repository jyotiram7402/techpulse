import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkButton } from "@/components/bookmark-button";
import { CATEGORIES } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";
import type { Article } from "@/types/article";

export function NewsCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const cat = CATEGORIES.find((c) => c.slug === article.category) ?? CATEGORIES[1];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card transition-all hover:border-border hover:shadow-lg">
      {article.image_url ? (
        <div className="relative aspect-[2/1] overflow-hidden bg-muted sm:aspect-[16/9]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <BookmarkButton
              articleId={article.id}
              className="bg-black/60 text-white backdrop-blur hover:bg-black/80"
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative flex h-16 items-center justify-center bg-gradient-to-br text-2xl sm:h-24 sm:text-3xl",
            cat.gradient
          )}
        >
          <span>{cat.emoji}</span>
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <BookmarkButton
              articleId={article.id}
              className="bg-black/60 text-white backdrop-blur hover:bg-black/80"
            />
          </div>
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-2 p-3.5 sm:gap-2.5 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px]",
              cat.color
            )}
          >
            {cat.label}
          </span>
          <span className="whitespace-nowrap text-[11px] text-muted-foreground sm:text-xs">
            {timeAgo(article.published_at)}
          </span>
        </div>

        <Link
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-balance text-sm font-bold leading-snug tracking-tight transition-colors group-hover:text-brand sm:text-lg"
        >
          {article.title}
        </Link>

        <p className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-3 sm:text-sm">
          {article.summary}
        </p>

        <div className="mt-auto space-y-2.5 pt-1.5 sm:space-y-3 sm:pt-2">
          <div className="rounded-lg border border-brand/20 bg-brand/5 p-2 sm:p-3">
            <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand sm:mb-1 sm:text-[11px]">
              <Sparkles className="h-3 w-3" />
              Why this matters
            </div>
            <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {article.why_it_matters}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
              {article.source}
            </span>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent hover:text-brand sm:text-xs"
            >
              Read more
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
