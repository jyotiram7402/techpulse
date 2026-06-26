import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-card/30 px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="max-w-2xl space-y-4 sm:space-y-5">
        <Badge variant="brand" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI-curated · Free · Open
        </Badge>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Your personal stream of <span className="text-brand">tech news</span>, on repeat.
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg">
          AI, programming, GitHub trends, engineering blogs, startup launches — one beautiful feed.
          Summarized, categorized, and explained for developers.
        </p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
          <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
            <Link href="#feed">
              Explore feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/trending">See what&apos;s trending</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
