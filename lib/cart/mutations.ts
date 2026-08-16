import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { carts, cartItems, products } from "@/db/schema";
import { getActiveCart } from "./queries";
import { getConfiguratorSchema } from "@/lib/catalog/configurator-queries";
import { buildDisplayLines, computeConfiguredPrice, type ConfiguratorSelections } from "@/lib/pricing/configurator";

export class CartError extends Error {}

async function getOrCreateActiveCart(customerId: string) {
  const existing = await getActiveCart(customerId);
  if (existing) return existing;

  const db = getDb();
  const id = crypto.randomUUID();
  await db.insert(carts).values({ id, customerId, status: "ACTIVE" });
  return { id, customerId, status: "ACTIVE" as const };
}

/**
 * Adds an item to the customer's cart. The price is always recomputed
 * server-side from the product's current options/quantity tiers/pricing
 * rules (lib/pricing) — the configurator UI's live price preview is
 * never trusted as the source of truth. AGENTS.md rule 1.
 */
export async function addToCart(customerId: string, productSlug: string, selections: ConfiguratorSelections) {
  const schema = await getConfiguratorSchema(productSlug);
  if (!schema) throw new CartError("Product not found.");

  const requiredOptionIds = schema.options.filter((o) => o.isRequired).map((o) => o.id);
  for (const optionId of requiredOptionIds) {
    const option = schema.options.find((o) => o.id === optionId)!;
    const hasSelection = option.values.some((v) => selections.optionValueIds.includes(v.id));
    if (!hasSelection) throw new CartError(`Please choose an option for "${option.name}".`);
  }

  const { breakdown, tierFound } = computeConfiguredPrice(schema, selections);
  if (!tierFound) throw new CartError("Please choose a valid quantity.");

  const displayLines = buildDisplayLines(schema, selections);
  const cart = await getOrCreateActiveCart(customerId);

  const db = getDb();
  const id = crypto.randomUUID();
  await db.insert(cartItems).values({
    id,
    cartId: cart.id,
    productId: schema.productId,
    quantity: selections.quantity,
    configuration: { selections, displayLines },
    unitPriceCents: Math.round(breakdown.subtotalCents / selections.quantity),
    totalPriceCents: breakdown.subtotalCents,
  });

  return id;
}

export async function updateCartItemQuantity(customerId: string, cartItemId: string, quantity: number) {
  if (quantity < 1) throw new CartError("Quantity must be at least 1.");

  const db = getDb();
  const cart = await getActiveCart(customerId);
  if (!cart) throw new CartError("Cart not found.");

  const [item] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cart.id)))
    .limit(1);
  if (!item) throw new CartError("Item not found in your cart.");

  const config = item.configuration as { selections: ConfiguratorSelections; displayLines: unknown };
  const [product] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, item.productId)).limit(1);
  const schema = product ? await getConfiguratorSchema(product.slug) : null;
  if (!schema) throw new CartError("Product not found.");

  const newSelections: ConfiguratorSelections = { ...config.selections, quantity };
  const { breakdown, tierFound } = computeConfiguredPrice(schema, newSelections);
  if (!tierFound) throw new CartError("That quantity isn't available for this product.");

  const displayLines = buildDisplayLines(schema, newSelections);

  await db
    .update(cartItems)
    .set({
      quantity,
      configuration: { selections: newSelections, displayLines },
      unitPriceCents: Math.round(breakdown.subtotalCents / quantity),
      totalPriceCents: breakdown.subtotalCents,
    })
    .where(eq(cartItems.id, cartItemId));
}

export async function removeCartItem(customerId: string, cartItemId: string) {
  const db = getDb();
  const cart = await getActiveCart(customerId);
  if (!cart) throw new CartError("Cart not found.");

  await db.delete(cartItems).where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cart.id)));
}
