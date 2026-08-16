"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ORDER_STATUS_TRANSITIONS, type OrderStatus } from "@/lib/orders/constants";
import { ORDER_STATUS_LABELS } from "@/lib/orders/display";
import type { OrderActionState } from "@/app/admin/orders/[id]/actions";

interface OrderStatusFormProps {
  action: (state: OrderActionState, formData: FormData) => Promise<OrderActionState>;
  currentStatus: OrderStatus;
}

export function OrderStatusForm({ action, currentStatus }: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState<OrderActionState, FormData>(action, { error: null });
  const nextStatuses = ORDER_STATUS_TRANSITIONS[currentStatus];

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-muted-foreground">No further status changes are possible for this order.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="status">Change status to</Label>
        <select
          id="status"
          name="status"
          defaultValue=""
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Select a status
          </option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" rows={2} placeholder="Internal note about this status change" />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Updating…" : "Update Status"}
      </Button>
    </form>
  );
}
