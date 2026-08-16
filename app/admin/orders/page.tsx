import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listOrdersForAdmin } from "@/lib/orders/admin-queries";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/constants";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders" };

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  requireStaffSection(user, "orders");

  const { status, q } = await searchParams;
  const statusFilter = status && isOrderStatus(status) ? status : undefined;

  const orders = await listOrdersForAdmin({ status: statusFilter, search: q || undefined });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">Manage customer orders and production status.</p>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin/orders">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search order number or customer email"
          className="h-10 w-72 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          name="status"
          defaultValue={statusFilter ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Filter
        </button>
        {(statusFilter || q) && (
          <Link href="/admin/orders" className="text-sm text-brand hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="text-brand hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.customerFirstName} {order.customerLastName}
                  <div className="text-xs">{order.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</td>
                <td className="px-4 py-3 font-medium">{formatMoneyAed(order.totalCents)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
