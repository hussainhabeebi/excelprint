import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { designRequests, proofs } from "@/db/schema";
import { getArtworkByOrderItemId, getOrderItemWithOrder } from "@/lib/artwork/queries";
import { addArtworkVersion, updateOrderItemArtworkStatus } from "@/lib/artwork/mutations";
import { validateArtworkFile } from "@/lib/r2/validate";
import { artworkUploadKey } from "@/lib/r2/keys";
import { getArtworkBucket } from "@/lib/r2/client";
import { advanceOrderStatusIfValid } from "./order-status";
import { writeAuditLog } from "@/lib/security/audit";

export class ProofingError extends Error {}

/**
 * A designer uploads a proof for an order item. Chains the order through
 * any required intermediate status (DESIGN_REQUIRED/CHANGES_REQUESTED must
 * pass through DESIGN_IN_PROGRESS before AWAITING_APPROVAL per the order
 * state machine) so a designer only has to take one action here.
 */
export async function submitProofForOrderItem(
  orderItemId: string,
  staffId: string,
  file: File,
  notes?: string,
): Promise<void> {
  const row = await getOrderItemWithOrder(orderItemId);
  if (!row) throw new ProofingError("Order item not found.");
  const { item, order } = row;

  const artwork = await getArtworkByOrderItemId(orderItemId);
  if (!artwork) throw new ProofingError("Artwork record not found for this item.");

  const validation = validateArtworkFile(file.name, file.type, file.size);
  if (!validation.valid) throw new ProofingError(validation.error ?? "Invalid file.");

  const key = artworkUploadKey(order.id, orderItemId, file.name);
  const bucket = getArtworkBucket();
  await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });

  const versionId = await addArtworkVersion({
    artworkId: artwork.id,
    source: "DESIGNER_REVISION",
    fileKey: key,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    uploadedByType: "STAFF",
    uploadedById: staffId,
    notes,
    status: "PROOF_READY",
  });

  await updateOrderItemArtworkStatus(orderItemId, "PROOF_READY");

  const db = getDb();
  await db.insert(proofs).values({
    id: crypto.randomUUID(),
    orderItemId,
    artworkVersionId: versionId,
    status: "SENT",
    sentAt: new Date(),
  });

  if (item.designMethod === "REQUEST_DESIGN") {
    await db
      .update(designRequests)
      .set({ status: "COMPLETED", assignedDesignerId: staffId, updatedAt: new Date() })
      .where(eq(designRequests.orderItemId, orderItemId));
  }

  // Chain the order through DESIGN_IN_PROGRESS first if it's currently
  // DESIGN_REQUIRED or CHANGES_REQUESTED — both must pass through it before
  // AWAITING_APPROVAL is a valid next transition.
  await advanceOrderStatusIfValid(order.id, "DESIGN_IN_PROGRESS", "STAFF", staffId, "Designer started work.");
  await advanceOrderStatusIfValid(order.id, "AWAITING_APPROVAL", "STAFF", staffId, "Proof sent to customer.");

  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "PROOF_SENT",
    entityType: "order_item",
    entityId: orderItemId,
    newValue: { artworkVersionId: versionId },
  });
}
