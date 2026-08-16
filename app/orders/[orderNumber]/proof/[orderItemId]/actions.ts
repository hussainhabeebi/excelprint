"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { approveProof, ProofReviewError, requestProofChanges } from "@/lib/proofing/customer-mutations";
import { proofChangeRequestSchema } from "@/lib/validation/proofing";

export interface ProofActionState {
  error: string | null;
}

export async function approveProofAction(
  orderNumber: string,
  orderItemId: string,
  _prevState: ProofActionState,
  formData: FormData,
): Promise<ProofActionState> {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect(`/login?redirect=/orders/${orderNumber}/proof/${orderItemId}`);

  const confirmed = formData.get("confirmed") === "on";
  if (!confirmed) return { error: "Please confirm you have reviewed and approve the artwork." };

  try {
    await approveProof(orderItemId, user.id);
  } catch (error) {
    if (error instanceof ProofReviewError) return { error: error.message };
    throw error;
  }

  redirect(`/orders/${orderNumber}?design=approved`);
}

export async function requestProofChangesAction(
  orderNumber: string,
  orderItemId: string,
  _prevState: ProofActionState,
  formData: FormData,
): Promise<ProofActionState> {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect(`/login?redirect=/orders/${orderNumber}/proof/${orderItemId}`);

  const parsed = proofChangeRequestSchema.safeParse({ comment: formData.get("comment") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  try {
    await requestProofChanges(orderItemId, user.id, parsed.data.comment);
  } catch (error) {
    if (error instanceof ProofReviewError) return { error: error.message };
    throw error;
  }

  redirect(`/orders/${orderNumber}?design=changes-requested`);
}
