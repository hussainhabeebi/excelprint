"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { OrderActionState } from "@/app/admin/orders/[id]/actions";

interface OrderNotesFormProps {
  action: (state: OrderActionState, formData: FormData) => Promise<OrderActionState>;
  initialNotes: string | null;
}

export function OrderNotesForm({ action, initialNotes }: OrderNotesFormProps) {
  const [state, formAction, pending] = useActionState<OrderActionState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="space-y-3">
      <Textarea name="notesInternal" rows={4} defaultValue={initialNotes ?? ""} placeholder="Internal notes about this order (not visible to the customer)" />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save Notes"}
      </Button>
    </form>
  );
}
