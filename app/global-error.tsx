"use client";

import { Button } from "@/components/ui/button";

/**
 * Root-level fallback for errors thrown above the (marketing)/admin/account
 * layouts. Never renders internal error details/stack traces to the
 * customer — spec section 40.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">
            We hit an unexpected error on our end. Please try again — if this keeps happening, contact us and
            we&apos;ll help sort it out.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
