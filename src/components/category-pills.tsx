"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryPills({ activeBase = "/" }: { activeBase?: string }) {
  const params = useSearchParams();
  const current = params.get("category");

  function href(slug?: string) {
    const sp = new URLSearchParams(params.toString());
    if (!slug) sp.delete("category");
    else sp.set("category", slug);
    const qs = sp.toString();
    return `${activeBase}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="scrollbar-hide -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
      <Link
        href={href()}
        prefetch={false}
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          !current
            ? "border-transparent bg-foreground text-background"
            : "border-border bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </Link>
      {CATEGORIES.map((c) => {
        const active = current === c.slug;
        return (
          <Link
            key={c.slug}
            href={href(c.slug)}
            prefetch={false}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-transparent bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{c.emoji}</span>
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}
