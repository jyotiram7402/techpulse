import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[2/1] w-full rounded-none sm:aspect-[16/9]" />
      <CardContent className="space-y-2.5 p-3.5 sm:space-y-3 sm:p-5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-full sm:h-5" />
        <Skeleton className="h-4 w-3/4 sm:h-5" />
        <Skeleton className="h-3 w-full sm:h-4" />
        <Skeleton className="h-14 w-full rounded-lg sm:h-16" />
      </CardContent>
    </Card>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
