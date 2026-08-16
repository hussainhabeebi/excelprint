import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listCustomerOrders } from "@/lib/orders/customer-queries";
import { ORDER_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Account" };

export default async function AccountDashboardPage() {
  const user = await getCurrentUser();
  const orders = user?.type === "customer" ? await listCustomerOrders(user.id) : [];
  const activeOrders = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Your active orders and proofs will appear here.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{activeOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Proofs awaiting approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved designs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
      </div>

      {orders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id}>
                <Link href={`/orders/${order.orderNumber}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary/50">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="flex items-center gap-3">
                    <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    <span className="text-muted-foreground">{formatMoneyAed(order.totalCents)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
