import "server-only";
import { and, asc, eq, inArray, isNull, or } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { pricingRules, productOptionValues, productOptions, products, quantityTiers } from "@/db/schema";
import type { ConfiguratorSchema } from "@/lib/pricing/configurator";
import type { PriceModifier } from "@/lib/pricing/types";

export async function getConfiguratorSchema(slug: string): Promise<ConfiguratorSchema | null> {
  const db = getDb();

  const [product] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.slug, slug),
        eq(products.purchaseMode, "CONFIGURABLE"),
        eq(products.isActive, true),
        isNull(products.deletedAt),
      ),
    )
    .limit(1);
  if (!product) return null;

  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, product.id))
    .orderBy(asc(productOptions.sortOrder));

  const optionIds = options.map((o) => o.id);
  const values = optionIds.length
    ? await db
        .select()
        .from(productOptionValues)
        .where(inArray(productOptionValues.optionId, optionIds))
        .orderBy(asc(productOptionValues.sortOrder))
    : [];

  const tiers = await db
    .select()
    .from(quantityTiers)
    .where(eq(quantityTiers.productId, product.id))
    .orderBy(asc(quantityTiers.quantity));

  const urgencyRules = await db
    .select()
    .from(pricingRules)
    .where(
      and(
        eq(pricingRules.ruleType, "URGENCY"),
        eq(pricingRules.isActive, true),
        or(isNull(pricingRules.productId), eq(pricingRules.productId, product.id)),
      ),
    );

  // Prefer a product-specific rule over a global one if both target "express".
  const expressRule =
    urgencyRules.find((r) => r.productId === product.id && isExpressRule(r.appliesTo)) ??
    urgencyRules.find((r) => r.productId === null && isExpressRule(r.appliesTo)) ??
    null;

  const expressModifier: PriceModifier | null = expressRule
    ? {
        id: expressRule.id,
        label: expressRule.name,
        type: expressRule.modifierType,
        amountCents: expressRule.amountCents,
        amountPercent: expressRule.amountPercent,
      }
    : null;

  return {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    currency: product.currency,
    options: options.map((option) => ({
      id: option.id,
      name: option.name,
      type: option.type,
      isRequired: option.isRequired,
      values: values
        .filter((v) => v.optionId === option.id)
        .map((v) => ({
          id: v.id,
          label: v.label,
          value: v.value,
          isDefault: v.isDefault,
          priceModifierType: v.priceModifierType,
          priceModifierCents: v.priceModifierCents,
          priceModifierPercent: v.priceModifierPercent,
        })),
    })),
    quantityTiers: tiers.map((t) => ({ id: t.id, quantity: t.quantity, unitPriceCents: t.unitPriceCents })),
    expressModifier: product.productionTimeExpressDays != null ? expressModifier : null,
  };
}

function isExpressRule(appliesTo: unknown): boolean {
  return (
    typeof appliesTo === "object" &&
    appliesTo !== null &&
    "productionSpeed" in appliesTo &&
    (appliesTo as { productionSpeed?: string }).productionSpeed === "express"
  );
}
