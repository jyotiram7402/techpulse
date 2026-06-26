import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-card/30 px-4 py-7 sm:px-8 sm:py-12 md:px-12 md:py-16">
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="max-w-2xl space-y-3 sm:space-y-5">
        <Badge variant="brand" className="gap-1.5 text-[10px] sm:text-xs">
          <Sparkles className="h-3 w-3" />
          AI-curated · Free · Open
        </Badge>
        <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Your personal stream of <span className="text-brand">tech news</span>.
        </h1>
        <p className="max-w-xl text-xs text-muted-foreground sm:text-base md:text-lg">
          AI, programming, GitHub trends, engineering blogs — summarized for developers.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 sm:gap-3">
          <Button asChild variant="brand" size="sm" className="sm:h-11 sm:px-8 sm:text-base">
            <Link href="#feed">
              Explore feed
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="sm:h-11 sm:px-8 sm:text-base">
            <Link href="/trending">See trending</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
