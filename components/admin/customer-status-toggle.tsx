"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { CustomerActionState } from "@/app/admin/customers/[id]/actions";

interface CustomerStatusToggleProps {
  action: (state: CustomerActionState, formData: FormData) => Promise<CustomerActionState>;
  currentStatus: "ACTIVE" | "DISABLED";
}

export function CustomerStatusToggle({ action, currentStatus }: CustomerStatusToggleProps) {
  const [state, formAction, pending] = useActionState<CustomerActionState, FormData>(action, { error: null });

  return (
    <form action={formAction}>
      {state.error && <p className="mb-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant={currentStatus === "ACTIVE" ? "outline" : "brand"} size="sm" disabled={pending}>
        {pending ? "Updating…" : currentStatus === "ACTIVE" ? "Disable Account" : "Re-enable Account"}
      </Button>
    </form>
  );
}
