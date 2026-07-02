import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkButton } from "@/components/bookmark-button";
import { CATEGORIES } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";
import type { Article } from "@/types/article";

export function FeaturedCard({ article }: { article: Article }) {
  const cat = CATEGORIES.find((c) => c.slug === article.category) ?? CATEGORIES[1];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card transition-all hover:border-border hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-6xl",
              cat.gradient
            )}
          >
            <span>{cat.emoji}</span>
          </div>
        )}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
          <BookmarkButton
            articleId={article.id}
            className="bg-black/60 text-white backdrop-blur hover:bg-black/80"
          />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider sm:text-xs",
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
          className="line-clamp-3 text-balance text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-brand sm:text-2xl"
        >
          {article.title}
        </Link>

        <p className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-3 sm:text-sm">
          {article.summary}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
            {article.source}
          </span>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[11px] font-semibold text-brand hover:underline sm:text-xs"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompactCard({ article }: { article: Article }) {
  const cat = CATEGORIES.find((c) => c.slug === article.category) ?? CATEGORIES[1];

  return (
    <Link
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-xl border border-border/60 bg-card p-2.5 transition-all hover:border-border hover:shadow-md sm:p-3"
    >
      <div className="relative h-[72px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-muted">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt=""
            fill
            sizes="104px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-2xl",
              cat.gradient
            )}
          >
            <span>{cat.emoji}</span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn("text-[10px] font-bold uppercase tracking-wider", cat.color)}
        >
          {cat.label}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug transition-colors group-hover:text-brand sm:text-sm">
          {article.title}
        </h3>
        <span className="mt-auto pt-1 text-[10px] text-muted-foreground sm:text-[11px]">
          {article.source} · {timeAgo(article.published_at)}
        </span>
      </div>
    </Link>
  );
}
