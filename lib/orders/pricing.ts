import type { PricingBreakdown } from "@/lib/pricing/types";

export interface OrderPricingRollup {
  subtotalCents: number;
  urgencyFeeCents: number;
  designFeeCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  vatCents: number;
  totalCents: number;
}

/**
 * Rolls up per-item pricing breakdowns (each already VAT-free at the
 * `subtotalCents` field — see lib/pricing/engine.ts) into order-level
 * totals, with VAT applied once across the whole order (items + delivery)
 * rather than per line. Pure function — the actual per-item breakdowns are
 * still stored verbatim in order_items.pricing_breakdown_snapshot for
 * itemized display.
 */
export function aggregateOrderPricing(
  itemBreakdowns: PricingBreakdown[],
  deliveryFeeCents: number,
  vatPercent: number,
  discountCents = 0,
): OrderPricingRollup {
  let subtotalCents = 0;
  let urgencyFeeCents = 0;
  let designFeeCents = 0;

  for (const breakdown of itemBreakdowns) {
    subtotalCents += breakdown.baseCents + breakdown.materialCents + breakdown.printingCents + breakdown.finishingCents + breakdown.addonCents;
    urgencyFeeCents += breakdown.urgencyFeeCents;
    designFeeCents += breakdown.designFeeCents;
  }

  const preVatTotal = subtotalCents + urgencyFeeCents + designFeeCents + deliveryFeeCents - discountCents;
  const vatCents = Math.round((preVatTotal * vatPercent) / 100);
  const totalCents = preVatTotal + vatCents;

  return { subtotalCents, urgencyFeeCents, designFeeCents, deliveryFeeCents, discountCents, vatCents, totalCents };
}
