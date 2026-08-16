import "server-only";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, artworkVersions, customers, designRequests, orderItems, orders, proofComments, proofs } from "@/db/schema";
import type { ArtworkStatus } from "@/lib/orders/constants";

const QUEUE_ARTWORK_STATUSES: ArtworkStatus[] = [
  "ARTWORK_REQUIRED",
  "ARTWORK_RECEIVED",
  "DESIGN_IN_PROGRESS",
  "CHANGE_REQUESTED",
  "REVISION_IN_PROGRESS",
];

export async function listDesignQueue() {
  const db = getDb();
  return db
    .select({
      item: orderItems,
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      orderStatus: orders.status,
      customerEmail: customers.email,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(and(inArray(orderItems.artworkStatus, QUEUE_ARTWORK_STATUSES), isNotNull(orderItems.designMethod)))
    .orderBy(desc(orderItems.updatedAt));
}

export async function getDesignQueueItem(orderItemId: string) {
  const db = getDb();
  const [row] = await db
    .select({
      item: orderItems,
      order: orders,
      customerEmail: customers.email,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orderItems.id, orderItemId))
    .limit(1);
  if (!row) return null;

  const [artwork] = await db.select().from(artworks).where(eq(artworks.orderItemId, orderItemId)).limit(1);

  const versions = artwork
    ? await db
        .select()
        .from(artworkVersions)
        .where(eq(artworkVersions.artworkId, artwork.id))
        .orderBy(desc(artworkVersions.versionNumber))
    : [];

  const [designRequest] = await db
    .select()
    .from(designRequests)
    .where(eq(designRequests.orderItemId, orderItemId))
    .limit(1);

  let comments: (typeof proofComments.$inferSelect)[] = [];
  if (artwork?.currentVersionId) {
    const [currentProof] = await db
      .select()
      .from(proofs)
      .where(eq(proofs.artworkVersionId, artwork.currentVersionId))
      .limit(1);
    if (currentProof) {
      comments = await db
        .select()
        .from(proofComments)
        .where(eq(proofComments.proofId, currentProof.id))
        .orderBy(desc(proofComments.createdAt));
    }
  }

  return { ...row, artwork, versions, designRequest: designRequest ?? null, comments };
}
