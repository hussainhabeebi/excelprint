import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, orderItems, proofApprovals, proofComments, proofs } from "@/db/schema";
import { updateOrderItemArtworkStatus } from "@/lib/artwork/mutations";
import { getOwnedProofForOrderItem } from "./customer-queries";
import { advanceOrderStatusIfValid } from "./order-status";
import { writeAuditLog } from "@/lib/security/audit";
import { PROOF_APPROVAL_STATEMENT } from "./constants";

export class ProofReviewError extends Error {}

export async function approveProof(orderItemId: string, customerId: string, ipAddress?: string): Promise<void> {
  const result = await getOwnedProofForOrderItem(orderItemId, customerId);
  if (!result) throw new ProofReviewError("Order item not found.");
  const { artwork, version, proof, order } = result;
  if (!artwork || !version || !proof) throw new ProofReviewError("No proof is available to approve yet.");
  if (proof.status === "APPROVED") return;

  const db = getDb();

  await db.insert(proofApprovals).values({
    id: crypto.randomUUID(),
    proofId: proof.id,
    artworkVersionId: version.id,
    customerId,
    orderId: order.id,
    approvedFilename: version.fileName,
    approvalStatement: PROOF_APPROVAL_STATEMENT,
    ipAddress,
  });

  await db.update(proofs).set({ status: "APPROVED" }).where(eq(proofs.id, proof.id));
  await db.update(artworks).set({ status: "APPROVED", updatedAt: new Date() }).where(eq(artworks.id, artwork.id));
  await updateOrderItemArtworkStatus(orderItemId, "APPROVED");

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: customerId,
    action: "PROOF_APPROVED",
    entityType: "proof",
    entityId: proof.id,
    ipAddress,
  });

  const allItems = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const allApproved = allItems.every((i) => (i.id === orderItemId ? true : i.artworkStatus === "APPROVED"));
  if (allApproved) {
    await advanceOrderStatusIfValid(order.id, "APPROVED", "CUSTOMER", customerId, "All items approved by customer.");
  }
}

export async function requestProofChanges(orderItemId: string, customerId: string, comment: string): Promise<void> {
  const result = await getOwnedProofForOrderItem(orderItemId, customerId);
  if (!result) throw new ProofReviewError("Order item not found.");
  const { artwork, proof, order } = result;
  if (!artwork || !proof) throw new ProofReviewError("No proof is available to comment on yet.");

  const db = getDb();

  await db.insert(proofComments).values({
    id: crypto.randomUUID(),
    proofId: proof.id,
    authorType: "CUSTOMER",
    authorId: customerId,
    comment,
  });

  await db.update(proofs).set({ status: "CHANGES_REQUESTED" }).where(eq(proofs.id, proof.id));
  await db.update(artworks).set({ status: "CHANGE_REQUESTED", updatedAt: new Date() }).where(eq(artworks.id, artwork.id));
  await updateOrderItemArtworkStatus(orderItemId, "CHANGE_REQUESTED");

  await advanceOrderStatusIfValid(order.id, "CHANGES_REQUESTED", "CUSTOMER", customerId, comment);

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: customerId,
    action: "PROOF_CHANGES_REQUESTED",
    entityType: "proof",
    entityId: proof.id,
  });
}
