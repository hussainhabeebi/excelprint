"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { changeOrderStatusAsStaff, OrderAdminError } from "@/lib/orders/admin-mutations";
import { ProductionError, setOrderItemProductionStatus } from "@/lib/orders/production-mutations";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/constants";

export interface ProductionActionState {
  error: string | null;
}

function isOrderStatus(value: FormDataEntryValue | null): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export async function changeProductionOrderStatusAction(
  orderId: string,
  _prevState: ProductionActionState,
  formData: FormData,
): Promise<ProductionActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "production-queue");

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

  revalidatePath(`/admin/production/${orderId}`);
  return { error: null };
}

export async function setItemProductionStatusAction(
  orderId: string,
  orderItemId: string,
  _prevState: ProductionActionState,
  formData: FormData,
): Promise<ProductionActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "production-queue");

    const productionStatus = (formData.get("productionStatus") as string) ?? "";
    await setOrderItemProductionStatus(orderItemId, staff.id, productionStatus);
  } catch (error) {
    if (error instanceof ProductionError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/admin/production/${orderId}`);
  return { error: null };
}
