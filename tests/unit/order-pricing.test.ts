import { describe, expect, it } from "vitest";
import { aggregateOrderPricing } from "@/lib/orders/pricing";
import { calculatePrice } from "@/lib/pricing/engine";

function makeBreakdown(baseUnitPriceCents: number, quantity: number, urgencyFeeCents = 0) {
  return calculatePrice({
    baseUnitPriceCents,
    quantity,
    materialModifiers: [],
    printingModifiers: [],
    finishingModifiers: [],
    addonModifiers: [],
    designFeeCents: 0,
    urgencyFeeCents,
    deliveryFeeCents: 0,
    discountCents: 0,
    vatPercent: 5, // deliberately different from the order-level rate below, to prove it's ignored
  });
}

describe("aggregateOrderPricing", () => {
  it("sums multiple items' pre-VAT subtotals and applies VAT once at the order level", () => {
    const item1 = makeBreakdown(50, 100); // 5000
    const item2 = makeBreakdown(60, 100); // 6000
    const result = aggregateOrderPricing([item1, item2], 0, 5);

    expect(result.subtotalCents).toBe(11000);
    expect(result.vatCents).toBe(Math.round(11000 * 0.05));
    expect(result.totalCents).toBe(11000 + result.vatCents);
  });

  it("includes delivery fee in the VAT base", () => {
    const item = makeBreakdown(50, 100); // 5000
    const result = aggregateOrderPricing([item], 2000, 5);

    expect(result.deliveryFeeCents).toBe(2000);
    expect(result.vatCents).toBe(Math.round((5000 + 2000) * 0.05));
    expect(result.totalCents).toBe(5000 + 2000 + result.vatCents);
  });

  it("separates the urgency fee out for order-level display", () => {
    const item = makeBreakdown(50, 100, 1250);
    const result = aggregateOrderPricing([item], 0, 5);

    expect(result.urgencyFeeCents).toBe(1250);
    expect(result.subtotalCents).toBe(5000); // urgency excluded from subtotal
  });

  it("applies a discount before VAT", () => {
    const item = makeBreakdown(50, 100); // 5000
    const result = aggregateOrderPricing([item], 0, 5, 1000);

    expect(result.discountCents).toBe(1000);
    expect(result.vatCents).toBe(Math.round((5000 - 1000) * 0.05));
    expect(result.totalCents).toBe(5000 - 1000 + result.vatCents);
  });
});
