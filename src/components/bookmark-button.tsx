"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarkIds } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkButton({ articleId, className }: { articleId: string; className?: string }) {
  const { ids, toggle, isAuthenticated, loading } = useBookmarkIds();
  const saved = ids.has(articleId);
  const [pending, startTransition] = React.useTransition();

  if (!isAuthenticated) {
    return (
      <Button
        asChild
        size="icon"
        variant="ghost"
        className={cn("h-8 w-8 shrink-0", className)}
        aria-label="Sign in to bookmark"
      >
        <Link href="/login">
          <Bookmark className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={loading || pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(() => {
          toggle(articleId);
        });
      }}
      className={cn("h-8 w-8 shrink-0", saved && "text-brand", className)}
      aria-label={saved ? "Remove bookmark" : "Save article"}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  );
}
