"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/constants";

export function MobileNav() {
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-[calc(100vw-2rem)] max-w-xs"
        >
          <DropdownMenuItem asChild className="py-2.5 text-sm">
            <Link href="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2.5 text-sm">
            <Link href="/trending">Trending</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2.5 text-sm">
            <Link href="/categories">Categories</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2.5 text-sm">
            <Link href="/bookmarks">Bookmarks</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {CATEGORIES.map((c) => (
            <DropdownMenuItem key={c.slug} asChild className="py-2.5 text-sm">
              <Link href={`/categories/${c.slug}`}>
                <span className="text-base">{c.emoji}</span>
                {c.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
