import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listCustomerOrders } from "@/lib/orders/customer-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoneyAed } from "@/lib/utils";
import { ORDER_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect("/orders"); // AccountShell (layout) renders the login prompt

  const orders = await listCustomerOrders(user.id);

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
        <div className="mt-8 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Button asChild variant="brand" className="mt-4">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatMoneyAed(order.totalCents)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/orders/${order.orderNumber}`} className="text-brand hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
