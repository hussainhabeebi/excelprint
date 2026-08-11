import type { PriceModifier, PricingBreakdown, PricingInput, PricingLineItem } from "./types";

/**
 * The dynamic pricing engine (spec section 7).
 *
 * Formula:
 *   base_price
 *   + material_modifier + printing_modifier + finishing_modifier + addon_modifier
 *   + design_fee + urgency_fee + delivery_fee
 *   - discount
 *   + vat
 *
 * PERCENT modifiers are computed against `baseCents` (unit price × quantity)
 * — never against a running total — so the result is order-independent:
 * applying the same set of modifiers always yields the same price no
 * matter what order they're evaluated in.
 *
 * Pure function, no I/O. Callers (cart pricing preview, checkout
 * recalculation, order creation) must persist the returned breakdown
 * verbatim into order_items.pricing_breakdown_snapshot — see AGENTS.md
 * "store historical calculated pricing inside each order item."
 */
export function calculatePrice(input: PricingInput): PricingBreakdown {
  const baseCents = round(input.baseUnitPriceCents * input.quantity);

  const lineItems: PricingLineItem[] = [
    { key: "base", label: "Base price", amountCents: baseCents },
  ];

  const materialCents = sumModifiers(input.materialModifiers, baseCents, lineItems);
  const printingCents = sumModifiers(input.printingModifiers, baseCents, lineItems);
  const finishingCents = sumModifiers(input.finishingModifiers, baseCents, lineItems);
  const addonCents = sumModifiers(input.addonModifiers, baseCents, lineItems);

  if (input.designFeeCents) {
    lineItems.push({ key: "design_fee", label: "Design fee", amountCents: input.designFeeCents });
  }
  if (input.urgencyFeeCents) {
    lineItems.push({ key: "urgency_fee", label: "Express production fee", amountCents: input.urgencyFeeCents });
  }
  if (input.deliveryFeeCents) {
    lineItems.push({ key: "delivery_fee", label: "Delivery fee", amountCents: input.deliveryFeeCents });
  }

  const preDiscountCents =
    baseCents +
    materialCents +
    printingCents +
    finishingCents +
    addonCents +
    input.designFeeCents +
    input.urgencyFeeCents +
    input.deliveryFeeCents;

  const discountCents = Math.min(input.discountCents, preDiscountCents);
  if (discountCents) {
    lineItems.push({ key: "discount", label: "Discount", amountCents: -discountCents });
  }

  const subtotalCents = preDiscountCents - discountCents;
  const vatCents = round((subtotalCents * input.vatPercent) / 100);
  if (vatCents) {
    lineItems.push({ key: "vat", label: `VAT (${input.vatPercent}%)`, amountCents: vatCents });
  }

  const totalCents = subtotalCents + vatCents;

  return {
    baseCents,
    materialCents,
    printingCents,
    finishingCents,
    addonCents,
    designFeeCents: input.designFeeCents,
    urgencyFeeCents: input.urgencyFeeCents,
    deliveryFeeCents: input.deliveryFeeCents,
    discountCents,
    vatCents,
    subtotalCents,
    totalCents,
    lineItems,
  };
}

function sumModifiers(modifiers: PriceModifier[], baseCents: number, lineItems: PricingLineItem[]): number {
  let total = 0;
  for (const modifier of modifiers) {
    const amountCents =
      modifier.type === "FIXED" ? modifier.amountCents : round((baseCents * modifier.amountPercent) / 100);
    if (amountCents !== 0) {
      lineItems.push({ key: modifier.id, label: modifier.label, amountCents });
    }
    total += amountCents;
  }
  return total;
}

function round(value: number): number {
  return Math.round(value);
}
