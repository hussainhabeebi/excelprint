import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { adminListProducts } from "@/lib/catalog/admin-queries";
import { PricingRuleForm } from "@/components/admin/pricing-rule-form";
import { createPricingRuleAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Pricing Rule" };

export default async function NewPricingRulePage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "pricing");

  const products = await adminListProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New Pricing Rule</h1>
      <div className="mt-6">
        <PricingRuleForm action={createPricingRuleAction} products={products} />
      </div>
    </div>
  );
}
