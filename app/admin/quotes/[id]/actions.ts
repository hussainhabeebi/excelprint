"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { QuoteAdminError, updateQuoteAsStaff } from "@/lib/quotes/admin-mutations";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/orders/constants";

export interface QuoteActionState {
  error: string | null;
}

function isQuoteStatus(value: FormDataEntryValue | null): value is QuoteStatus {
  return typeof value === "string" && (QUOTE_STATUSES as readonly string[]).includes(value);
}

export async function updateQuoteAction(
  quoteId: string,
  _prevState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "quotes");

    const status = formData.get("status");
    if (!isQuoteStatus(status)) return { error: "Choose a valid status." };

    const quotedPriceAed = formData.get("quotedPriceAed");
    const quotedPriceCents =
      typeof quotedPriceAed === "string" && quotedPriceAed.trim() !== ""
        ? Math.round(Number(quotedPriceAed) * 100)
        : undefined;
    if (quotedPriceCents !== undefined && (!Number.isFinite(quotedPriceCents) || quotedPriceCents < 0)) {
      return { error: "Enter a valid quoted price." };
    }

    await updateQuoteAsStaff(quoteId, staff.id, { status, quotedPriceCents });
  } catch (error) {
    if (error instanceof QuoteAdminError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/admin/quotes/${quoteId}`);
  return { error: null };
}
