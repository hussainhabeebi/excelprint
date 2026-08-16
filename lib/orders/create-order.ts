import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, carts, deliveries, orderItems, orderStatusHistory, orders } from "@/db/schema";
import { getActiveCart, listCartItems } from "@/lib/cart/queries";
import { getDeliveryMethod } from "@/lib/checkout/delivery";
import { createAddress, getAddress } from "@/lib/customer/addresses";
import { getConfiguratorSchema } from "@/lib/catalog/configurator-queries";
import { computeConfiguredPrice, DEFAULT_VAT_PERCENT } from "@/lib/pricing/configurator";
import { aggregateOrderPricing } from "./pricing";
import { writeAuditLog } from "@/lib/security/audit";
import type { PlaceOrderInput } from "@/lib/validation/checkout";
import type { ConfiguratorSelections } from "@/lib/pricing/configurator";

export class OrderCreationError extends Error {}

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `EX${stamp}${random}`;
}

/**
 * Places an order from the customer's active cart. Every price is
 * recomputed here from current product/pricing data — the cart's stored
 * totals are never trusted as final (AGENTS.md rule 1). Not wrapped in a
 * single D1 transaction (Drizzle's D1 driver doesn't expose interactive
 * transactions the way a traditional Postgres/MySQL driver does); accepted
 * as a known limitation at this stage rather than hand-rolling fragile
 * batch-statement orchestration.
 */
export async function createOrderFromCart(customerId: string, input: PlaceOrderInput) {
  const db = getDb();

  const cart = await getActiveCart(customerId);
  if (!cart) throw new OrderCreationError("Your cart is empty.");
  const cartItemRows = await listCartItems(cart.id);
  if (cartItemRows.length === 0) throw new OrderCreationError("Your cart is empty.");

  const deliveryMethod = await getDeliveryMethod(input.deliveryMethodId);
  if (!deliveryMethod || !deliveryMethod.isActive) throw new OrderCreationError("Please choose a valid delivery method.");

  let deliveryAddressId: string | null = null;
  if (deliveryMethod.type !== "PICKUP") {
    if (input.deliveryAddressId) {
      const address = await getAddress(customerId, input.deliveryAddressId);
      if (!address) throw new OrderCreationError("That address wasn't found on your account.");
      deliveryAddressId = address.id;
    } else if (input.newAddress) {
      deliveryAddressId = await createAddress(customerId, input.newAddress);
    } else {
      throw new OrderCreationError("Please provide a delivery address.");
    }
  }

  // Recompute every item's price fresh from current catalog/pricing data.
  const itemsWithPricing = [];
  for (const cartItem of cartItemRows) {
    const schema = await getConfiguratorSchema(cartItem.productSlug);
    if (!schema) throw new OrderCreationError(`"${cartItem.productName}" is no longer available.`);

    const selections = cartItem.configuration.selections as ConfiguratorSelections;
    const { breakdown, tierFound } = computeConfiguredPrice(schema, selections);
    if (!tierFound) throw new OrderCreationError(`"${cartItem.productName}" no longer offers that quantity.`);

    itemsWithPricing.push({ cartItem, breakdown });
  }

  const rollup = aggregateOrderPricing(
    itemsWithPricing.map((i) => i.breakdown),
    deliveryMethod.feeCents,
    DEFAULT_VAT_PERCENT,
  );

  const orderId = crypto.randomUUID();
  const orderNumber = generateOrderNumber();
  const now = new Date();

  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerId,
    status: "AWAITING_ARTWORK",
    paymentStatus: "UNPAID",
    subtotalCents: rollup.subtotalCents,
    designFeeCents: rollup.designFeeCents,
    urgencyFeeCents: rollup.urgencyFeeCents,
    deliveryFeeCents: rollup.deliveryFeeCents,
    discountCents: rollup.discountCents,
    vatCents: rollup.vatCents,
    totalCents: rollup.totalCents,
    deliveryMethodId: deliveryMethod.id,
    deliveryAddressId,
    notesCustomer: input.notesCustomer,
    placedAt: now,
  });

  await db.insert(orderStatusHistory).values({
    id: crypto.randomUUID(),
    orderId,
    oldStatus: null,
    newStatus: "AWAITING_ARTWORK",
    actorType: "CUSTOMER",
    actorId: customerId,
    notes: "Order placed at checkout.",
  });

  for (const { cartItem, breakdown } of itemsWithPricing) {
    const orderItemId = crypto.randomUUID();

    await db.insert(orderItems).values({
      id: orderItemId,
      orderId,
      productId: cartItem.productId,
      productNameSnapshot: cartItem.productName,
      quantity: cartItem.quantity,
      configurationSnapshot: cartItem.configuration,
      designMethod: null,
      unitPriceCents: Math.round(breakdown.subtotalCents / cartItem.quantity),
      totalPriceCents: breakdown.subtotalCents,
      pricingBreakdownSnapshot: breakdown,
      artworkStatus: "ARTWORK_REQUIRED",
    });

    await db.insert(artworks).values({
      id: crypto.randomUUID(),
      orderItemId,
      status: "ARTWORK_REQUIRED",
    });
  }

  await db.insert(deliveries).values({
    id: crypto.randomUUID(),
    orderId,
    deliveryMethodId: deliveryMethod.id,
    addressId: deliveryAddressId,
    status: "PENDING",
  });

  await db.update(carts).set({ status: "CONVERTED" }).where(eq(carts.id, cart.id));

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: customerId,
    action: "ORDER_PLACED",
    entityType: "order",
    entityId: orderId,
    newValue: { orderNumber, totalCents: rollup.totalCents },
  });

  return { orderId, orderNumber };
}
