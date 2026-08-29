"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function QuoteRequestForm({ initialServiceName }: { initialServiceName?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        company: formData.get("company") || undefined,
        productDescription: formData.get("productDescription"),
        quantity: formData.get("quantity") || undefined,
        dimensions: formData.get("dimensions") || undefined,
        material: formData.get("material") || undefined,
        description: formData.get("description") || undefined,
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

    const body = (await res.json()) as { quoteNumber: string };
    setQuoteNumber(body.quoteNumber);
    setSubmitting(false);
    router.refresh();
  }

  if (quoteNumber) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-medium">Thanks — your quote request has been submitted.</p>
        <p className="mt-1 text-sm text-emerald-800">
          Reference number <span className="font-mono font-semibold">{quoteNumber}</span>. Our team will get back to
          you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Full name</Label>
          <Input id="customerName" name="customerName" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+971 5x xxx xxxx" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productDescription">What do you need printed?</Label>
        <Textarea
          id="productDescription"
          name="productDescription"
          rows={3}
          defaultValue={initialServiceName}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input id="dimensions" name="dimensions" placeholder="e.g. A4, 90x50mm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input id="material" name="material" placeholder="e.g. 300gsm card" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Anything else we should know? (optional)</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="brand" size="lg" disabled={submitting}>
        {submitting ? "Submitting…" : "Request a Quote"}
      </Button>
    </form>
  );
}
