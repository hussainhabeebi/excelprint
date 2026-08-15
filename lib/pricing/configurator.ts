import { calculatePrice } from "./engine";
import type { PriceModifier, PricingBreakdown } from "./types";

/**
 * UAE's standard VAT rate. Not "Excel Printing's pricing" (AGENTS.md §6/50
 * forbids inventing that) — it's public tax law. Still worth making
 * admin-configurable via the `settings` table in a later phase rather than
 * a scattered constant.
 */
export const DEFAULT_VAT_PERCENT = 5;

export interface ConfiguratorOptionValue {
  id: string;
  label: string;
  value: string;
  isDefault: boolean;
  priceModifierType: "FIXED" | "PERCENT" | null;
  priceModifierCents: number;
  priceModifierPercent: number;
}

export interface ConfiguratorOption {
  id: string;
  name: string;
  type: "SINGLE_SELECT" | "MULTI_SELECT";
  isRequired: boolean;
  values: ConfiguratorOptionValue[];
}

export interface ConfiguratorQuantityTier {
  id: string;
  quantity: number;
  unitPriceCents: number;
}

export interface ConfiguratorSchema {
  productId: string;
  productSlug: string;
  productName: string;
  currency: string;
  options: ConfiguratorOption[];
  quantityTiers: ConfiguratorQuantityTier[];
  /** Resolved from pricing_rules (rule_type=URGENCY), global or product-specific — never hardcoded in the UI. */
  expressModifier: PriceModifier | null;
}

export interface ConfiguratorSelections {
  /** One entry per SINGLE_SELECT option, plus zero-or-more for each MULTI_SELECT option. */
  optionValueIds: string[];
  quantity: number;
  productionSpeed: "standard" | "express";
}

/**
 * Buckets a product_option_values modifier into the pricing engine's
 * material/printing/finishing/addon line-item groups, inferred from the
 * parent option's name since the schema doesn't carry an explicit
 * category. Falls back to "addon" for anything unrecognized (enhancements,
 * custom options) — this only affects breakdown line-item grouping, not
 * the total.
 */
function bucketForOptionName(optionName: string): "material" | "printing" | "finishing" | "addon" {
  const name = optionName.toLowerCase();
  if (name.includes("paper") || name.includes("material") || name.includes("stock")) return "material";
  if (name.includes("print") || name.includes("side")) return "printing";
  if (name.includes("finish") || name.includes("lamination") || name.includes("coat")) return "finishing";
  return "addon";
}

export interface ComputedPrice {
  breakdown: PricingBreakdown;
  /** False when the selected quantity doesn't match a configured tier (shouldn't happen via the UI, which only offers real tiers). */
  tierFound: boolean;
}

export function computeConfiguredPrice(schema: ConfiguratorSchema, selections: ConfiguratorSelections): ComputedPrice {
  const tier =
    schema.quantityTiers.find((t) => t.quantity === selections.quantity) ?? schema.quantityTiers[0] ?? null;
  const baseUnitPriceCents = tier?.unitPriceCents ?? 0;

  const buckets: Record<"material" | "printing" | "finishing" | "addon", PriceModifier[]> = {
    material: [],
    printing: [],
    finishing: [],
    addon: [],
  };

  for (const option of schema.options) {
    for (const value of option.values) {
      if (!selections.optionValueIds.includes(value.id)) continue;
      if (!value.priceModifierType) continue;

      buckets[bucketForOptionName(option.name)].push({
        id: value.id,
        label: `${option.name}: ${value.label}`,
        type: value.priceModifierType,
        amountCents: value.priceModifierCents,
        amountPercent: value.priceModifierPercent,
      });
    }
  }

  const urgencyFeeCents = (() => {
    if (selections.productionSpeed !== "express" || !schema.expressModifier) return 0;
    const modifier = schema.expressModifier;
    return modifier.type === "FIXED"
      ? modifier.amountCents
      : Math.round((baseUnitPriceCents * selections.quantity * modifier.amountPercent) / 100);
  })();

  const breakdown = calculatePrice({
    baseUnitPriceCents,
    quantity: selections.quantity,
    materialModifiers: buckets.material,
    printingModifiers: buckets.printing,
    finishingModifiers: buckets.finishing,
    addonModifiers: buckets.addon,
    designFeeCents: 0, // design method (and its fee) is chosen after configuration — see Phase 5/6
    urgencyFeeCents,
    deliveryFeeCents: 0, // resolved at checkout — see Phase 4
    discountCents: 0,
    vatPercent: DEFAULT_VAT_PERCENT,
  });

  return { breakdown, tierFound: tier !== null };
}
