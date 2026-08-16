"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { CustomerAdminError, setCustomerStatus } from "@/lib/customer/admin-mutations";

export interface CustomerActionState {
  error: string | null;
}

export async function setCustomerStatusAction(
  customerId: string,
  status: "ACTIVE" | "DISABLED",
  _prevState: CustomerActionState,
  _formData: FormData,
): Promise<CustomerActionState> {
  void _prevState;
  void _formData;
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "customers");
    await setCustomerStatus(customerId, staff.id, status);
  } catch (error) {
    if (error instanceof CustomerAdminError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/admin/customers/${customerId}`);
  return { error: null };
}
