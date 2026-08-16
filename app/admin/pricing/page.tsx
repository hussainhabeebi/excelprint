import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listPricingRules } from "@/lib/pricing/admin-queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pricing Rules" };

export default async function AdminPricingPage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "pricing");

  const rules = await listPricingRules();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing Rules</h1>
          <p className="mt-1 text-muted-foreground">Modifiers that feed into the pricing engine.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/pricing/new">New Rule</Link>
        </Button>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Only <strong>URGENCY</strong> rules currently affect live pricing (express/same-day production fees).
        Per-option pricing (material, printing, finish, addons) is set directly on each product&apos;s option
        values under Products. Other rule types here are reserved for upcoming pricing phases and have no effect
        yet.
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Applies to</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rules.map(({ rule, productName }) => (
              <tr key={rule.id}>
                <td className="px-4 py-3 font-medium">{rule.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{rule.ruleType}</td>
                <td className="px-4 py-3 text-muted-foreground">{productName ?? "All products"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {rule.modifierType === "FIXED" ? formatMoneyAed(rule.amountCents) : `${rule.amountPercent}%`}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{rule.priority}</td>
                <td className="px-4 py-3">
                  <Badge variant={rule.isActive ? "success" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/pricing/${rule.id}/edit`} className="text-brand hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No pricing rules yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
