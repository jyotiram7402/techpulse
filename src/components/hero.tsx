import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-card/30 px-6 py-12 md:px-12 md:py-16">
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="max-w-2xl space-y-5">
        <Badge variant="brand" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI-curated · Free · Open
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Your personal stream of <span className="text-brand">tech news</span>, on repeat.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground md:text-lg">
          AI, programming, GitHub trends, engineering blogs, startup launches — one beautiful feed.
          Summarized, categorized, and explained for developers.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg">
            <Link href="#feed">
              Explore feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/trending">See what&apos;s trending</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
