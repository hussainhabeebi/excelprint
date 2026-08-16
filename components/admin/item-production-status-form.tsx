"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductionActionState } from "@/app/admin/production/[id]/actions";

interface ItemProductionStatusFormProps {
  action: (state: ProductionActionState, formData: FormData) => Promise<ProductionActionState>;
  currentValue: string | null;
}

export function ItemProductionStatusForm({ action, currentValue }: ItemProductionStatusFormProps) {
  const [state, formAction, pending] = useActionState<ProductionActionState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Input
        name="productionStatus"
        defaultValue={currentValue ?? ""}
        placeholder="e.g. Cutting, Laminating, Packed"
        className="h-9 max-w-xs"
      />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
