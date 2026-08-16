import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { addresses, artworks, artworkVersions, deliveries, deliveryMethods, orderItems, orderStatusHistory, orders } from "@/db/schema";

export async function listCustomerOrders(customerId: string) {
  const db = getDb();
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      totalCents: orders.totalCents,
      placedAt: orders.placedAt,
    })
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getCustomerOrderByNumber(customerId: string, orderNumber: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, orderNumber), eq(orders.customerId, customerId)))
    .limit(1);
  if (!order) return null;

  const itemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  const artworkRows = itemRows.length
    ? await db
        .select({
          orderItemId: artworks.orderItemId,
          currentVersionId: artworks.currentVersionId,
          fileName: artworkVersions.fileName,
          versionNumber: artworkVersions.versionNumber,
          createdAt: artworkVersions.createdAt,
        })
        .from(artworks)
        .leftJoin(artworkVersions, eq(artworks.currentVersionId, artworkVersions.id))
        .where(
          inArray(
            artworks.orderItemId,
            itemRows.map((i) => i.id),
          ),
        )
    : [];

  const items = itemRows.map((item) => {
    const artwork = artworkRows.find((a) => a.orderItemId === item.id);
    return {
      ...item,
      currentArtworkVersion:
        artwork?.currentVersionId && artwork.fileName
          ? { id: artwork.currentVersionId, fileName: artwork.fileName, versionNumber: artwork.versionNumber! }
          : null,
    };
  });

  const [delivery] = await db
    .select({
      status: deliveries.status,
      methodName: deliveryMethods.name,
      methodType: deliveryMethods.type,
      addressLine1: addresses.line1,
      addressLine2: addresses.line2,
      addressCity: addresses.city,
      addressEmirate: addresses.emirate,
    })
    .from(deliveries)
    .innerJoin(deliveryMethods, eq(deliveries.deliveryMethodId, deliveryMethods.id))
    .leftJoin(addresses, eq(deliveries.addressId, addresses.id))
    .where(eq(deliveries.orderId, order.id))
    .limit(1);

  const history = await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, order.id))
    .orderBy(orderStatusHistory.createdAt);

  return { order, items, delivery: delivery ?? null, history };
}
