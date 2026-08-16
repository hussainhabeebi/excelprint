import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, FileUp, Wand2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCustomerOrderByNumber } from "@/lib/orders/customer-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoneyAed } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, orderStatusBadgeVariant } from "@/lib/orders/display";
import type { ArtworkStatus } from "@/lib/orders/constants";
import type { CartItemConfiguration } from "@/lib/cart/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Details" };

const DESIGN_METHOD_LABELS: Record<string, string> = {
  UPLOAD: "You uploaded your artwork",
  REQUEST_DESIGN: "Design requested from Excel Printing",
  AI_GENERATE: "AI design draft",
};

const PROOF_READY_STATUSES: ArtworkStatus[] = ["PROOF_READY", "FINAL_PROOF_READY"];

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ placed?: string; design?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect("/orders");

  const { orderNumber } = await params;
  const { placed, design } = await searchParams;
  const result = await getCustomerOrderByNumber(user.id, orderNumber);
  if (!result) notFound();

  const { order, items, delivery, history } = result;

  return (
    <div>
      {placed === "1" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">Order placed successfully.</p>
            <p className="text-sm text-emerald-800">
              Choose how to provide your artwork below — no payment is due until you approve your design proof.
            </p>
          </div>
        </div>
      )}
      {design === "uploaded" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="font-medium">Artwork uploaded. Our team will prepare your proof next.</p>
        </div>
      )}
      {design === "requested" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="font-medium">Design request submitted. A designer will be in touch.</p>
        </div>
      )}
      {design === "approved" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="font-medium">Artwork approved. We&apos;ll be in touch about payment and production next.</p>
        </div>
      )}
      {design === "changes-requested" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="font-medium">Your requested changes were sent to our design team.</p>
        </div>
      )}

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
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Items</h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
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
                    </div>
                    <p className="whitespace-nowrap font-semibold">{formatMoneyAed(item.totalPriceCents)}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                    {item.designMethod ? (
                      <div className="flex items-center gap-2 text-sm">
                        {item.designMethod === "UPLOAD" ? (
                          <FileUp className="size-4 text-brand" />
                        ) : (
                          <Wand2 className="size-4 text-brand" />
                        )}
                        <span>{DESIGN_METHOD_LABELS[item.designMethod] ?? item.designMethod}</span>
                        {item.currentArtworkVersion && (
                          <a
                            href={`/api/artwork/${item.currentArtworkVersion.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline"
                          >
                            View file
                          </a>
                        )}
                      </div>
                    ) : (
                      <Button asChild size="sm" variant="brand">
                        <Link href={`/orders/${orderNumber}/design/${item.id}`}>Choose how to provide your artwork</Link>
                      </Button>
                    )}
                    {PROOF_READY_STATUSES.includes(item.artworkStatus) && (
                      <Button asChild size="sm" variant="brand">
                        <Link href={`/orders/${orderNumber}/proof/${item.id}`}>Review Proof</Link>
                      </Button>
                    )}
                    {item.artworkStatus === "CHANGE_REQUESTED" && (
                      <Link href={`/orders/${orderNumber}/proof/${item.id}`} className="text-sm text-brand hover:underline">
                        View your requested changes
                      </Link>
                    )}
                    {item.artworkStatus === "APPROVED" && (
                      <Badge variant="success">Artwork Approved</Badge>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="pt-4 text-sm font-semibold text-muted-foreground">Status History</h2>
          <ul className="space-y-3 rounded-lg border border-border p-4">
            {history.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between text-sm">
                <span>{ORDER_STATUS_LABELS[entry.newStatus]}</span>
                <span className="text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Price Summary</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatMoneyAed(order.subtotalCents)}</dd>
              </div>
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
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Questions about this order?{" "}
        <Link href="/quote" className="text-brand hover:underline">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
