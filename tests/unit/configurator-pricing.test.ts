import { describe, expect, it } from "vitest";
import { computeConfiguredPrice, type ConfiguratorSchema } from "@/lib/pricing/configurator";

const schema: ConfiguratorSchema = {
  productId: "prod_1",
  productSlug: "business-cards",
  productName: "Business Cards",
  currency: "AED",
  quantityTiers: [
    { id: "qt_100", quantity: 100, unitPriceCents: 45 },
    { id: "qt_500", quantity: 500, unitPriceCents: 32 },
  ],
  options: [
    {
      id: "opt_paper",
      name: "Paper",
      type: "SINGLE_SELECT",
      isRequired: true,
      values: [
        { id: "v_300", label: "300 GSM", value: "300gsm", isDefault: true, priceModifierType: null, priceModifierCents: 0, priceModifierPercent: 0 },
        { id: "v_350", label: "350 GSM", value: "350gsm", isDefault: false, priceModifierType: "FIXED", priceModifierCents: 1000, priceModifierPercent: 0 },
      ],
    },
    {
      id: "opt_printing",
      name: "Printing",
      type: "SINGLE_SELECT",
      isRequired: true,
      values: [
        { id: "v_single", label: "Single-sided", value: "single", isDefault: true, priceModifierType: null, priceModifierCents: 0, priceModifierPercent: 0 },
        { id: "v_double", label: "Double-sided", value: "double", isDefault: false, priceModifierType: "PERCENT", priceModifierCents: 0, priceModifierPercent: 15 },
      ],
    },
  ],
  expressModifier: { id: "rule_express", label: "Express production", type: "PERCENT", amountCents: 0, amountPercent: 25 },
};

describe("computeConfiguredPrice", () => {
  it("prices the base tier with no modifiers selected", () => {
    const result = computeConfiguredPrice(schema, {
      optionValueIds: ["v_300", "v_single"],
      quantity: 100,
      productionSpeed: "standard",
    });
    expect(result.tierFound).toBe(true);
    expect(result.breakdown.baseCents).toBe(4500);
    expect(result.breakdown.materialCents).toBe(0);
    expect(result.breakdown.urgencyFeeCents).toBe(0);
  });

  it("applies a fixed option modifier", () => {
    const result = computeConfiguredPrice(schema, {
      optionValueIds: ["v_350", "v_single"],
      quantity: 100,
      productionSpeed: "standard",
    });
    expect(result.breakdown.materialCents).toBe(1000);
  });

  it("applies a percent option modifier against the base, not a running total", () => {
    const result = computeConfiguredPrice(schema, {
      optionValueIds: ["v_350", "v_double"],
      quantity: 100,
      productionSpeed: "standard",
    });
    // base 4500 + material 1000 = subtotal so far, but printing % is against base (4500) only
    expect(result.breakdown.printingCents).toBe(Math.round(4500 * 0.15));
  });

  it("selects the matching quantity tier's unit price", () => {
    const result = computeConfiguredPrice(schema, {
      optionValueIds: ["v_300", "v_single"],
      quantity: 500,
      productionSpeed: "standard",
    });
    expect(result.breakdown.baseCents).toBe(32 * 500);
  });

  it("applies the express modifier from the schema, never a hardcoded percentage", () => {
    const result = computeConfiguredPrice(schema, {
      optionValueIds: ["v_300", "v_single"],
      quantity: 100,
      productionSpeed: "express",
    });
    expect(result.breakdown.urgencyFeeCents).toBe(Math.round(4500 * 0.25));
  });

  it("charges no urgency fee when no express modifier is configured for the product", () => {
    const schemaWithoutExpress: ConfiguratorSchema = { ...schema, expressModifier: null };
    const result = computeConfiguredPrice(schemaWithoutExpress, {
      optionValueIds: ["v_300", "v_single"],
      quantity: 100,
      productionSpeed: "express",
    });
    expect(result.breakdown.urgencyFeeCents).toBe(0);
  });
});
