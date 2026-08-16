import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, artworkVersions, orderItems, orders, proofComments, proofs } from "@/db/schema";

/** Resolves the current proof (if any) for an order item the given customer owns. */
export async function getOwnedProofForOrderItem(orderItemId: string, customerId: string) {
  const db = getDb();
  const [row] = await db
    .select({ item: orderItems, order: orders })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orderItems.id, orderItemId))
    .limit(1);
  if (!row || row.order.customerId !== customerId) return null;

  const [artwork] = await db.select().from(artworks).where(eq(artworks.orderItemId, orderItemId)).limit(1);
  if (!artwork?.currentVersionId) return { item: row.item, order: row.order, artwork, version: null, proof: null, comments: [] };

  const [version] = await db
    .select()
    .from(artworkVersions)
    .where(eq(artworkVersions.id, artwork.currentVersionId))
    .limit(1);

  const [proof] = await db
    .select()
    .from(proofs)
    .where(eq(proofs.artworkVersionId, artwork.currentVersionId))
    .limit(1);

  const comments = proof
    ? await db
        .select()
        .from(proofComments)
        .where(eq(proofComments.proofId, proof.id))
        .orderBy(desc(proofComments.createdAt))
    : [];

  return { item: row.item, order: row.order, artwork, version: version ?? null, proof: proof ?? null, comments };
}
