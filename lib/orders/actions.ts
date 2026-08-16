"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createOrderFromCart, OrderCreationError } from "./create-order";
import { placeOrderSchema } from "@/lib/validation/checkout";

export interface PlaceOrderState {
  error: string | null;
}

function parseFormData(formData: FormData) {
  const hasNewAddress = formData.get("addressMode") === "new";

  return {
    deliveryMethodId: formData.get("deliveryMethodId"),
    deliveryAddressId: hasNewAddress ? undefined : formData.get("deliveryAddressId") || undefined,
    newAddress: hasNewAddress
      ? {
          label: formData.get("label") || undefined,
          line1: formData.get("line1"),
          line2: formData.get("line2") || undefined,
          city: formData.get("city"),
          emirate: formData.get("emirate") || undefined,
          postalCode: formData.get("postalCode") || undefined,
        }
      : undefined,
    notesCustomer: formData.get("notesCustomer") || undefined,
  };
}

export async function placeOrderAction(_prevState: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") {
    redirect("/login?redirect=/checkout");
  }

  const parsed = placeOrderSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  let orderNumber: string;
  try {
    const result = await createOrderFromCart(user.id, parsed.data);
    orderNumber = result.orderNumber;
  } catch (error) {
    if (error instanceof OrderCreationError) return { error: error.message };
    throw error;
  }

  redirect(`/orders/${orderNumber}?placed=1`);
}
