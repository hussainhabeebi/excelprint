"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { ProofingError, submitProofForOrderItem } from "@/lib/proofing/staff-mutations";

export interface DesignQueueActionState {
  error: string | null;
}

export async function submitProofAction(
  orderItemId: string,
  _prevState: DesignQueueActionState,
  formData: FormData,
): Promise<DesignQueueActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "design-queue");

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Please choose a file to upload." };
    }
    const notes = (formData.get("notes") as string) || undefined;

    await submitProofForOrderItem(orderItemId, staff.id, file, notes);
  } catch (error) {
    if (error instanceof ProofingError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/admin/design-queue/${orderItemId}`);
  revalidatePath("/admin/design-queue");
  return { error: null };
}
