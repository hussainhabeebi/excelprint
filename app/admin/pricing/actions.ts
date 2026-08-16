"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { pricingRuleInputSchema } from "@/lib/validation/pricing-rules";
import { createPricingRule, PricingRuleError, updatePricingRule } from "@/lib/pricing/admin-mutations";

export interface PricingRuleFormState {
  error: string | null;
}

function parseFormData(formData: FormData) {
  return {
    productId: formData.get("productId") || undefined,
    name: formData.get("name"),
    ruleType: formData.get("ruleType"),
    modifierType: formData.get("modifierType"),
    amountCents: formData.get("amountCents")
      ? Math.round(Number(formData.get("amountCents")) * 100)
      : 0,
    amountPercent: formData.get("amountPercent") || 0,
    appliesTo: formData.get("appliesTo") || undefined,
    priority: formData.get("priority") || 0,
    isActive: formData.get("isActive") === "on",
    startsAt: formData.get("startsAt") || undefined,
    endsAt: formData.get("endsAt") || undefined,
  };
}

export async function createPricingRuleAction(
  _prevState: PricingRuleFormState,
  formData: FormData,
): Promise<PricingRuleFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "pricing");

    const parsed = pricingRuleInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await createPricingRule(parsed.data, staff.id);
  } catch (error) {
    if (error instanceof PricingRuleError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/pricing");
}

export async function updatePricingRuleAction(
  id: string,
  _prevState: PricingRuleFormState,
  formData: FormData,
): Promise<PricingRuleFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "pricing");

    const parsed = pricingRuleInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await updatePricingRule(id, parsed.data, staff.id);
  } catch (error) {
    if (error instanceof PricingRuleError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/pricing");
}
