import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved or no longer exists. Try browsing our products or head back
        home.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild variant="brand">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}
