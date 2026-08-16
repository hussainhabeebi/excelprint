"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { changeOrderStatusAsStaff, OrderAdminError, updateOrderInternalNotes } from "@/lib/orders/admin-mutations";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/constants";

export interface OrderActionState {
  error: string | null;
}

function isOrderStatus(value: FormDataEntryValue | null): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export async function changeOrderStatusAction(
  orderId: string,
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "orders");

    const newStatus = formData.get("status");
    if (!isOrderStatus(newStatus)) return { error: "Choose a valid status." };
    const notes = (formData.get("notes") as string) || undefined;

    await changeOrderStatusAsStaff(orderId, newStatus, staff.id, notes);
  } catch (error) {
    if (error instanceof OrderAdminError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}

export async function updateOrderNotesAction(
  orderId: string,
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "orders");

    const notes = (formData.get("notesInternal") as string) ?? "";
    await updateOrderInternalNotes(orderId, staff.id, notes);
  } catch (error) {
    if (error instanceof ForbiddenError) return { error: error.message };
    throw error;
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
