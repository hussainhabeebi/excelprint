import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getOrderForAdmin } from "@/lib/orders/admin-queries";
import { ORDER_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { Badge } from "@/components/ui/badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { ItemProductionStatusForm } from "@/components/admin/item-production-status-form";
import { changeProductionOrderStatusAction, setItemProductionStatusAction } from "./actions";
import type { CartItemConfiguration } from "@/lib/cart/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Production Order" };

export default async function AdminProductionOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "production-queue");

  const { id } = await params;
  const result = await getOrderForAdmin(id);
  if (!result) notFound();

  const { order, customer, items, delivery } = result;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.firstName} {customer.lastName}
          </p>
        </div>
        <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Items</h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {items.map((item) => {
              const configuration = item.configurationSnapshot as CartItemConfiguration;
              return (
                <li key={item.id} className="p-4">
                  <p className="font-medium">{item.productNameSnapshot}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {configuration.displayLines.map((line, i) => (
                      <span key={line.label}>
                        {i > 0 && " · "}
                        {line.label}: {line.value}
                      </span>
                    ))}
                    {" · "}Qty: {item.quantity}
                  </p>
                  <div className="mt-3 border-t border-border pt-3">
                    <ItemProductionStatusForm
                      action={setItemProductionStatusAction.bind(null, order.id, item.id)}
                      currentValue={item.productionStatus}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {delivery && (
            <div className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Delivery</h2>
              <p className="mt-2 text-sm font-medium">{delivery.methodName}</p>
              {delivery.addressLine1 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {delivery.addressLine1}
                  {delivery.addressLine2 ? `, ${delivery.addressLine2}` : ""}, {delivery.addressCity}
                  {delivery.addressEmirate ? `, ${delivery.addressEmirate}` : ""}
                </p>
              )}
              {delivery.trackingReference && (
                <p className="mt-1 text-xs text-muted-foreground">Tracking: {delivery.trackingReference}</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Advance Status</h2>
          <div className="mt-3">
            <OrderStatusForm action={changeProductionOrderStatusAction.bind(null, order.id)} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
