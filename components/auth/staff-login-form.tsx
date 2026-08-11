"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StaffLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/staff-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        // TODO(Phase 4): replace with the real Cloudflare Turnstile widget token.
        turnstileToken: "dev-bypass",
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({ error: "Something went wrong." }))) as { error?: string };
      setError(body.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-background p-6 shadow-sm" noValidate>
      <div>
        <h1 className="text-lg font-semibold">Staff sign in</h1>
        <p className="text-sm text-muted-foreground">Excel Printing admin, design, and production access.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="staff-email">Email</Label>
        <Input id="staff-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="staff-password">Password</Label>
        <Input id="staff-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="brand" className="w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
