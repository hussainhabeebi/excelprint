"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/orders/constants";
import type { QuoteActionState } from "@/app/admin/quotes/[id]/actions";

const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  QUOTED: "Quoted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CONVERTED: "Converted",
};

interface QuoteStatusFormProps {
  action: (state: QuoteActionState, formData: FormData) => Promise<QuoteActionState>;
  currentStatus: QuoteStatus;
  currentQuotedPriceCents: number | null;
}

export function QuoteStatusForm({ action, currentStatus, currentQuotedPriceCents }: QuoteStatusFormProps) {
  const [state, formAction, pending] = useActionState<QuoteActionState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {QUOTE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {QUOTE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quotedPriceAed">Quoted price (AED)</Label>
        <Input
          id="quotedPriceAed"
          name="quotedPriceAed"
          type="number"
          step="0.01"
          min={0}
          defaultValue={currentQuotedPriceCents != null ? (currentQuotedPriceCents / 100).toFixed(2) : ""}
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
