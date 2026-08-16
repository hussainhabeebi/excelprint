import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getOrderForAdmin } from "@/lib/orders/admin-queries";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { OrderNotesForm } from "@/components/admin/order-notes-form";
import { changeOrderStatusAction, updateOrderNotesAction } from "./actions";
import type { CartItemConfiguration } from "@/lib/cart/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Detail" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "orders");

  const { id } = await params;
  const result = await getOrderForAdmin(id);
  if (!result) notFound();

  const { order, customer, items, delivery, history } = result;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {order.placedAt ? new Date(order.placedAt).toLocaleString() : "—"}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={orderStatusBadgeVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
          <Badge variant="outline">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Items</h2>
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
              {items.map((item) => {
                const configuration = item.configurationSnapshot as CartItemConfiguration;
                return (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{item.productNameSnapshot}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {configuration.displayLines.map((line, i) => (
                            <span key={line.label}>
                              {i > 0 && " · "}
                              {line.label}: {line.value}
                            </span>
                          ))}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Design: {item.designMethod ?? "Not chosen yet"} · Artwork: {item.artworkStatus}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-semibold">{formatMoneyAed(item.totalPriceCents)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Status History</h2>
            <ul className="mt-3 space-y-3 rounded-lg border border-border p-4">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between text-sm">
                  <span>
                    {entry.oldStatus ? `${ORDER_STATUS_LABELS[entry.oldStatus]} → ` : ""}
                    {ORDER_STATUS_LABELS[entry.newStatus]}
                    {entry.notes && <span className="ml-2 text-muted-foreground">— {entry.notes}</span>}
                  </span>
                  <span className="whitespace-nowrap text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
              {history.length === 0 && <li className="text-sm text-muted-foreground">No history yet.</li>}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Internal Notes</h2>
            <div className="mt-3 rounded-lg border border-border p-4">
              <OrderNotesForm
                action={updateOrderNotesAction.bind(null, order.id)}
                initialNotes={order.notesInternal}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Change Status</h2>
            <div className="mt-3">
              <OrderStatusForm action={changeOrderStatusAction.bind(null, order.id)} currentStatus={order.status} />
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Customer</h2>
            <p className="mt-2 text-sm font-medium">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Price Summary</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatMoneyAed(order.subtotalCents)}</dd>
              </div>
              {order.designFeeCents > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Design fee</dt>
                  <dd>{formatMoneyAed(order.designFeeCents)}</dd>
                </div>
              )}
              {order.urgencyFeeCents > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Express production</dt>
                  <dd>{formatMoneyAed(order.urgencyFeeCents)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{order.deliveryFeeCents > 0 ? formatMoneyAed(order.deliveryFeeCents) : "Free"}</dd>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd>-{formatMoneyAed(order.discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">VAT</dt>
                <dd>{formatMoneyAed(order.vatCents)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
              <span>Total</span>
              <span>{formatMoneyAed(order.totalCents)}</span>
            </div>
          </div>

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
      </div>
    </div>
  );
}
