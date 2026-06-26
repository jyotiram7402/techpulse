import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:py-8 md:flex-row">
        <div className="text-center text-xs text-muted-foreground md:text-left">
          <p className="font-medium text-foreground">{SITE.name}</p>
          <p className="mt-0.5">Spotify for Tech News · Built with Next.js, Supabase &amp; free APIs.</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/trending" className="hover:text-foreground">
            Trending
          </Link>
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <Link href="/bookmarks" className="hover:text-foreground">
            Bookmarks
          </Link>
        </nav>
      </div>
    </footer>
  );
}
