"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { chooseRequestDesignMethod, chooseUploadDesignMethod, DesignFlowError } from "@/lib/orders/design-flow";
import { designRequestInputSchema } from "@/lib/validation/design";

export interface DesignActionState {
  error: string | null;
}

export async function uploadArtworkAction(
  orderNumber: string,
  orderItemId: string,
  _prevState: DesignActionState,
  formData: FormData,
): Promise<DesignActionState> {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect(`/login?redirect=/orders/${orderNumber}/design/${orderItemId}`);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a file to upload." };
  }

  try {
    await chooseUploadDesignMethod(orderItemId, user.id, file);
  } catch (error) {
    if (error instanceof DesignFlowError) return { error: error.message };
    throw error;
  }

  redirect(`/orders/${orderNumber}?design=uploaded`);
}

export async function requestDesignAction(
  orderNumber: string,
  orderItemId: string,
  _prevState: DesignActionState,
  formData: FormData,
): Promise<DesignActionState> {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect(`/login?redirect=/orders/${orderNumber}/design/${orderItemId}`);

  const parsed = designRequestInputSchema.safeParse({
    companyName: formData.get("companyName") || undefined,
    contentText: formData.get("contentText") || undefined,
    contactInfo: formData.get("contactInfo") || undefined,
    preferredColors: formData.get("preferredColors") || undefined,
    designNotes: formData.get("designNotes") || undefined,
    stylePreference: formData.get("stylePreference") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  try {
    await chooseRequestDesignMethod(orderItemId, user.id, parsed.data);
  } catch (error) {
    if (error instanceof DesignFlowError) return { error: error.message };
    throw error;
  }

  redirect(`/orders/${orderNumber}?design=requested`);
}
