import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listProductionOrders } from "@/lib/orders/production-queries";
import { ORDER_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Production Queue" };

export default async function AdminProductionPage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "production-queue");

  const orders = await listProductionOrders();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Production Queue</h1>
        <p className="mt-1 text-muted-foreground">Paid orders moving through print, finishing and delivery.</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/production/${order.id}`} className="text-brand hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.customerFirstName} {order.customerLastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{order.itemCount}</td>
                <td className="px-4 py-3">
                  <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Nothing in production right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
