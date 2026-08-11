import { describe, expect, it } from "vitest";
import { calculatePrice } from "@/lib/pricing/engine";
import type { PricingInput } from "@/lib/pricing/types";

function baseInput(overrides: Partial<PricingInput> = {}): PricingInput {
  return {
    baseUnitPriceCents: 50,
    quantity: 100,
    materialModifiers: [],
    printingModifiers: [],
    finishingModifiers: [],
    addonModifiers: [],
    designFeeCents: 0,
    urgencyFeeCents: 0,
    deliveryFeeCents: 0,
    discountCents: 0,
    vatPercent: 5,
    ...overrides,
  };
}

describe("calculatePrice", () => {
  it("computes base price from unit price x quantity", () => {
    const result = calculatePrice(baseInput());
    expect(result.baseCents).toBe(5000);
    expect(result.subtotalCents).toBe(5000);
    expect(result.vatCents).toBe(250);
    expect(result.totalCents).toBe(5250);
  });

  it("applies fixed and percent modifiers against the base, not the running total", () => {
    const result = calculatePrice(
      baseInput({
        materialModifiers: [{ id: "m1", label: "350 GSM", type: "FIXED", amountCents: 1000, amountPercent: 0 }],
        finishingModifiers: [
          { id: "f1", label: "Matte lamination", type: "PERCENT", amountCents: 0, amountPercent: 10 },
        ],
      }),
    );
    expect(result.materialCents).toBe(1000);
    expect(result.finishingCents).toBe(500); // 10% of 5000 base, not of 6000
    expect(result.subtotalCents).toBe(5000 + 1000 + 500);
  });

  it("adds design, urgency and delivery fees before VAT", () => {
    const result = calculatePrice(
      baseInput({ designFeeCents: 200, urgencyFeeCents: 300, deliveryFeeCents: 150 }),
    );
    expect(result.subtotalCents).toBe(5000 + 200 + 300 + 150);
    expect(result.vatCents).toBe(Math.round(result.subtotalCents * 0.05));
  });

  it("applies a discount before VAT and never exceeds the pre-discount subtotal", () => {
    const result = calculatePrice(baseInput({ discountCents: 100000 }));
    expect(result.discountCents).toBe(5000);
    expect(result.subtotalCents).toBe(0);
    expect(result.vatCents).toBe(0);
    expect(result.totalCents).toBe(0);
  });

  it("produces the same result regardless of modifier ordering", () => {
    const a = calculatePrice(
      baseInput({
        materialModifiers: [{ id: "m1", label: "A", type: "PERCENT", amountCents: 0, amountPercent: 10 }],
        addonModifiers: [{ id: "a1", label: "B", type: "PERCENT", amountCents: 0, amountPercent: 5 }],
      }),
    );
    const b = calculatePrice(
      baseInput({
        addonModifiers: [{ id: "a1", label: "B", type: "PERCENT", amountCents: 0, amountPercent: 5 }],
        materialModifiers: [{ id: "m1", label: "A", type: "PERCENT", amountCents: 0, amountPercent: 10 }],
      }),
    );
    expect(a.totalCents).toBe(b.totalCents);
  });

  it("records every non-zero component as a line item for order snapshotting", () => {
    const result = calculatePrice(baseInput({ urgencyFeeCents: 500 }));
    const keys = result.lineItems.map((l) => l.key);
    expect(keys).toContain("base");
    expect(keys).toContain("urgency_fee");
    expect(keys).toContain("vat");
  });
});
