import Link from "next/link";
import { Github, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/constants";
import { UserMenu } from "@/components/user-menu";
import { MobileNav } from "@/components/mobile-nav";

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M12 7v10M8 9v6M16 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold tracking-tight">{SITE.name}</div>
              <div className="text-[10px] text-muted-foreground">{SITE.tagline}</div>
            </div>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/trending"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Trending
            </Link>
            <Link
              href="/categories"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Categories
            </Link>
            <Link
              href="/bookmarks"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Bookmarks
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <UserMenu email={user.email ?? ""} />
          ) : (
            <Button asChild size="sm" variant="brand">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
