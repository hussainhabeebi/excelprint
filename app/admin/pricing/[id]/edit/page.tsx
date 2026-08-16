import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getPricingRule } from "@/lib/pricing/admin-queries";
import { adminListProducts } from "@/lib/catalog/admin-queries";
import { PricingRuleForm } from "@/components/admin/pricing-rule-form";
import { updatePricingRuleAction } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Pricing Rule" };

export default async function EditPricingRulePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "pricing");

  const { id } = await params;
  const rule = await getPricingRule(id);
  if (!rule) notFound();

  const products = await adminListProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Pricing Rule</h1>
      <div className="mt-6">
        <PricingRuleForm action={updatePricingRuleAction.bind(null, id)} rule={rule} products={products} />
      </div>
    </div>
  );
}
