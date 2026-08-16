"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_ARTWORK_EXTENSIONS } from "@/lib/r2/validate";
import type { DesignQueueActionState } from "@/app/admin/design-queue/[orderItemId]/actions";

interface ProofUploadFormProps {
  action: (state: DesignQueueActionState, formData: FormData) => Promise<DesignQueueActionState>;
}

export function ProofUploadForm({ action }: ProofUploadFormProps) {
  const [state, formAction, pending] = useActionState<DesignQueueActionState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Proof file</Label>
        <Input id="file" name="file" type="file" accept={ALLOWED_ARTWORK_EXTENSIONS.map((e) => `.${e}`).join(",")} required />
        <p className="text-xs text-muted-foreground">
          Allowed formats: {ALLOWED_ARTWORK_EXTENSIONS.join(", ").toUpperCase()}. Max 100 MB.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes for this version (optional, internal)</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Sending…" : "Send Proof to Customer"}
      </Button>
    </form>
  );
}
