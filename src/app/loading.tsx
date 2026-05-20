import { NewsGridSkeleton } from "@/components/news-card-skeleton";

export default function Loading() {
  return (
    <div className="container space-y-8 py-8">
      <div className="space-y-3">
        <div className="skeleton h-8 w-48 rounded-md" />
        <div className="skeleton h-4 w-72 rounded-md" />
      </div>
      <NewsGridSkeleton count={6} />
    </div>
  );
}
