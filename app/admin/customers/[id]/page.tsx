import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getCustomerForAdmin } from "@/lib/customer/admin-queries";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";
import { CustomerStatusToggle } from "@/components/admin/customer-status-toggle";
import { setCustomerStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customer Detail" };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "customers");

  const { id } = await params;
  const result = await getCustomerForAdmin(id);
  if (!result) notFound();

  const { customer, addresses, orders } = result;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Joined {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={customer.status === "ACTIVE" ? "success" : "destructive"}>
          {customer.status === "ACTIVE" ? "Active" : "Disabled"}
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Orders</h2>
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Order</th>
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
                      <td className="px-4 py-3">
                        <Badge variant={orderStatusBadgeVariant(order.status)}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
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
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Addresses</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-lg border border-border p-4 text-sm">
                  {address.label && <p className="font-medium">{address.label}</p>}
                  <p className="text-muted-foreground">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}, {address.city}
                    {address.emirate ? `, ${address.emirate}` : ""}
                  </p>
                  {address.isDefault && (
                    <Badge variant="outline" className="mt-2">
                      Default
                    </Badge>
                  )}
                </div>
              ))}
              {addresses.length === 0 && <p className="text-sm text-muted-foreground">No saved addresses.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Contact</h2>
            <p className="mt-2 text-sm text-muted-foreground">{customer.email}</p>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Account</h2>
            <div className="mt-3">
              <CustomerStatusToggle
                action={setCustomerStatusAction.bind(
                  null,
                  customer.id,
                  customer.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
                )}
                currentStatus={customer.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
