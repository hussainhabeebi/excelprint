"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatMoneyAed } from "@/lib/utils";
import { placeOrderAction, type PlaceOrderState } from "@/lib/orders/actions";
import type { addresses, deliveryMethods } from "@/db/schema";

type DeliveryMethod = typeof deliveryMethods.$inferSelect;
type Address = typeof addresses.$inferSelect;

interface CheckoutFormProps {
  deliveryOptions: DeliveryMethod[];
  savedAddresses: Address[];
  subtotalCents: number;
}

export function CheckoutForm({ deliveryOptions, savedAddresses, subtotalCents }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState<PlaceOrderState, FormData>(placeOrderAction, { error: null });
  const [deliveryMethodId, setDeliveryMethodId] = useState(deliveryOptions[0]?.id ?? "");
  const [addressMode, setAddressMode] = useState<"existing" | "new">(savedAddresses.length > 0 ? "existing" : "new");

  const selectedMethod = deliveryOptions.find((m) => m.id === deliveryMethodId);
  const needsAddress = selectedMethod?.type !== "PICKUP";
  const estimatedTotalCents = subtotalCents + (selectedMethod?.feeCents ?? 0);

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Delivery Method</legend>
          <div className="space-y-2">
            {deliveryOptions.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors",
                  deliveryMethodId === method.id ? "border-brand bg-accent" : "border-input hover:border-brand/50",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryMethodId"
                    value={method.id}
                    checked={deliveryMethodId === method.id}
                    onChange={() => setDeliveryMethodId(method.id)}
                    className="size-4"
                  />
                  <span>
                    <span className="block font-medium">{method.name}</span>
                    {method.description && <span className="block text-muted-foreground">{method.description}</span>}
                  </span>
                </span>
                <span className="font-medium">{method.feeCents > 0 ? formatMoneyAed(method.feeCents) : "Free"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {needsAddress && (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Delivery Address</legend>

            {savedAddresses.length > 0 && (
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddressMode("existing")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium",
                    addressMode === "existing" ? "border-brand bg-accent" : "border-input text-muted-foreground",
                  )}
                >
                  Saved address
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode("new")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium",
                    addressMode === "new" ? "border-brand bg-accent" : "border-input text-muted-foreground",
                  )}
                >
                  New address
                </button>
              </div>
            )}

            <input type="hidden" name="addressMode" value={addressMode} />

            {addressMode === "existing" ? (
              <div className="space-y-2">
                {savedAddresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-input px-4 py-3 text-sm hover:border-brand/50"
                  >
                    <input type="radio" name="deliveryAddressId" value={address.id} defaultChecked className="mt-0.5 size-4" />
                    <span>
                      {address.label && <span className="block font-medium">{address.label}</span>}
                      <span className="block text-muted-foreground">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}, {address.city}
                        {address.emirate ? `, ${address.emirate}` : ""}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="label">Address label (optional)</Label>
                  <Input id="label" name="label" placeholder="Home, Office…" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input id="line1" name="line1" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
                  <Input id="line2" name="line2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue="Ajman" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emirate">Emirate</Label>
                  <Input id="emirate" name="emirate" defaultValue="Ajman" />
                </div>
              </div>
            )}
          </fieldset>
        )}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Order Notes (optional)</legend>
          <Textarea name="notesCustomer" placeholder="Anything we should know about this order?" />
        </fieldset>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-border bg-secondary/30 p-6">
          <h2 className="text-sm font-semibold text-muted-foreground">Order Summary</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatMoneyAed(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{selectedMethod && selectedMethod.feeCents > 0 ? formatMoneyAed(selectedMethod.feeCents) : "Free"}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">Estimated total</span>
            <span className="text-xl font-semibold">{formatMoneyAed(estimatedTotalCents)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Final total includes VAT, shown on your order confirmation.</p>

          {state.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}

          <Button type="submit" variant="brand" size="lg" className="mt-6 w-full" disabled={pending}>
            {pending ? "Placing Order…" : "Place Order"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            No payment is collected yet — you&apos;ll pay after approving your design proof.
          </p>
        </div>
      </div>
    </form>
  );
}
