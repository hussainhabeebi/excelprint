"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Catches errors from any route segment under app/ (marketing pages,
 * product pages, account, etc.) that doesn't have its own nested
 * error.tsx — e.g. admin has its own (app/admin/error.tsx) for a
 * ForbiddenError-aware message. This is the general fallback; only a
 * failure in the root layout itself falls through to global-error.tsx.
 * Never exposes the underlying error/stack trace to the customer.
 */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        We hit an unexpected error loading this page. Please try again — if it keeps happening, head back home and
        try from there.
      </p>
      <div className="mt-2 flex gap-3">
        <Button onClick={() => reset()} variant="brand">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
