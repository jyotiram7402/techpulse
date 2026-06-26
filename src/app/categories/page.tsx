import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "Categories",
  description: "Browse tech news by topic — AI, programming, DevOps, cybersecurity, and more."
};

export default function CategoriesPage() {
  return (
    <div className="container space-y-6 py-6 sm:space-y-8 sm:py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pick a topic to drill in. Each category is automatically classified from titles and content.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="group">
            <Card className="overflow-hidden transition-all hover:border-brand/40 hover:shadow-lg">
              <CardContent className="p-0">
                <div
                  className={`flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${c.gradient} text-5xl`}
                >
                  <span className="drop-shadow">{c.emoji}</span>
                </div>
                <div className="p-4">
                  <div className="text-base font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground">Explore latest in {c.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
