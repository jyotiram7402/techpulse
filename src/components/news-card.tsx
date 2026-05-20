import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/bookmark-button";
import { CATEGORIES } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";
import { domainOf } from "@/utils/format";
import type { Article } from "@/types/article";

export function NewsCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const cat = CATEGORIES.find((c) => c.slug === article.category) ?? CATEGORIES[1];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card transition-all hover:border-border hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-5xl",
              cat.gradient
            )}
          >
            <span>{cat.emoji}</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge variant="brand" className="bg-black/60 text-white backdrop-blur">
            {cat.emoji} {cat.label}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <BookmarkButton
            articleId={article.id}
            className="bg-black/60 text-white backdrop-blur hover:bg-black/80"
          />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.published_at)}</span>
        </div>

        <Link
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-balance text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand"
        >
          {article.title}
        </Link>

        <p className="line-clamp-3 text-sm text-muted-foreground">{article.summary}</p>

        <div className="mt-auto space-y-3 pt-2">
          <div className="rounded-lg border border-brand/20 bg-brand/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-3 w-3" />
              Why this matters
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{article.why_it_matters}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{domainOf(article.url)}</span>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-brand"
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
