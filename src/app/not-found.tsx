import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <div className="text-7xl font-bold tracking-tighter text-brand">404</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for has moved, been removed, or never existed.
      </p>
      <Button asChild className="mt-6" variant="brand">
        <Link href="/">Back to feed</Link>
      </Button>
    </div>
  );
}
