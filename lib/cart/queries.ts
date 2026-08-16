import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { carts, cartItems, products } from "@/db/schema";
import type { CartItemConfiguration, CartItemView } from "./types";
import type { DesignMethod } from "@/lib/orders/constants";

export async function getActiveCart(customerId: string) {
  const db = getDb();
  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.customerId, customerId), eq(carts.status, "ACTIVE")))
    .limit(1);
  return cart ?? null;
}

export async function listCartItems(cartId: string): Promise<CartItemView[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      productName: products.name,
      productSlug: products.slug,
      quantity: cartItems.quantity,
      configuration: cartItems.configuration,
      designMethod: cartItems.designMethod,
      unitPriceCents: cartItems.unitPriceCents,
      totalPriceCents: cartItems.totalPriceCents,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  return rows.map((row) => ({
    ...row,
    configuration: row.configuration as CartItemConfiguration,
    designMethod: row.designMethod as DesignMethod | null,
  }));
}

export async function getCartSummary(customerId: string): Promise<{ itemCount: number; subtotalCents: number }> {
  const cart = await getActiveCart(customerId);
  if (!cart) return { itemCount: 0, subtotalCents: 0 };
  const items = await listCartItems(cart.id);
  return {
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotalCents: items.reduce((sum, i) => sum + i.totalPriceCents, 0),
  };
}
