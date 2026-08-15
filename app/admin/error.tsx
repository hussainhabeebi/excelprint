"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({ error }: { error: Error & { digest?: string } }) {
  const isForbidden = error.name === "ForbiddenError";

  useEffect(() => {
    if (!isForbidden) console.error(error);
  }, [error, isForbidden]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-semibold">{isForbidden ? "Access denied" : "Something went wrong"}</h1>
      <p className="max-w-sm text-muted-foreground">
        {isForbidden
          ? "Your staff role doesn't have access to this section."
          : "We hit an unexpected error loading this page."}
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
