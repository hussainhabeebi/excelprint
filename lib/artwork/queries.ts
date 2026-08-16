import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, artworkVersions, orderItems, orders } from "@/db/schema";

/** Resolves an order_item together with its parent order, for ownership checks. */
export async function getOrderItemWithOrder(orderItemId: string) {
  const db = getDb();
  const [row] = await db
    .select({ item: orderItems, order: orders })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orderItems.id, orderItemId))
    .limit(1);
  return row ?? null;
}

export async function getArtworkByOrderItemId(orderItemId: string) {
  const db = getDb();
  const [artwork] = await db.select().from(artworks).where(eq(artworks.orderItemId, orderItemId)).limit(1);
  return artwork ?? null;
}

export async function listArtworkVersions(artworkId: string) {
  const db = getDb();
  return db
    .select()
    .from(artworkVersions)
    .where(eq(artworkVersions.artworkId, artworkId))
    .orderBy(asc(artworkVersions.versionNumber));
}

/** Resolves an artwork_version together with enough context to check access
 * (its order_item's order) — the sole authorization path for file serving. */
export async function getArtworkVersionWithOwner(versionId: string) {
  const db = getDb();
  const [row] = await db
    .select({ version: artworkVersions, orderItem: orderItems, order: orders })
    .from(artworkVersions)
    .innerJoin(artworks, eq(artworkVersions.artworkId, artworks.id))
    .innerJoin(orderItems, eq(artworks.orderItemId, orderItems.id))
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(artworkVersions.id, versionId)))
    .limit(1);
  return row ?? null;
}
