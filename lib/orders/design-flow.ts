import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { orderItems, orders, orderStatusHistory } from "@/db/schema";
import { getOrderItemWithOrder, getArtworkByOrderItemId } from "@/lib/artwork/queries";
import { addArtworkVersion } from "@/lib/artwork/mutations";
import { createDesignRequest } from "@/lib/design/mutations";
import { validateArtworkFile } from "@/lib/r2/validate";
import { artworkUploadKey } from "@/lib/r2/keys";
import { getArtworkBucket } from "@/lib/r2/client";
import { assertValidOrderTransition } from "./state-machine";
import { writeAuditLog } from "@/lib/security/audit";
import type { DesignRequestInput } from "@/lib/validation/design";

export class DesignFlowError extends Error {}

async function requireOwnedPendingOrderItem(orderItemId: string, customerId: string) {
  const row = await getOrderItemWithOrder(orderItemId);
  if (!row || row.order.customerId !== customerId) {
    throw new DesignFlowError("Order item not found.");
  }
  if (row.item.designMethod) {
    throw new DesignFlowError("A design method has already been chosen for this item.");
  }
  return row;
}

/**
 * Customer uploads their own print-ready (or near-ready) artwork. Order
 * stays in AWAITING_ARTWORK — a designer still needs to turn the upload
 * into a formal proof (Phase 7) before the customer can approve it.
 */
export async function chooseUploadDesignMethod(orderItemId: string, customerId: string, file: File) {
  const { item } = await requireOwnedPendingOrderItem(orderItemId, customerId);

  const validation = validateArtworkFile(file.name, file.type, file.size);
  if (!validation.valid) throw new DesignFlowError(validation.error ?? "Invalid file.");

  const artwork = await getArtworkByOrderItemId(orderItemId);
  if (!artwork) throw new DesignFlowError("Artwork record not found for this item.");

  const key = artworkUploadKey(item.orderId, orderItemId, file.name);
  const bucket = getArtworkBucket();
  await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });

  await addArtworkVersion({
    artworkId: artwork.id,
    source: "CUSTOMER_UPLOAD",
    fileKey: key,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    uploadedByType: "CUSTOMER",
    uploadedById: customerId,
    status: "ARTWORK_RECEIVED",
  });

  const db = getDb();
  await db.update(orderItems).set({ designMethod: "UPLOAD", artworkStatus: "ARTWORK_RECEIVED" }).where(eq(orderItems.id, orderItemId));
}

/**
 * Customer asks Excel Printing to design it. No file exists yet — this
 * just records the brief and moves the order into the design queue
 * (Phase 9 builds the staff side of that queue).
 */
export async function chooseRequestDesignMethod(orderItemId: string, customerId: string, input: DesignRequestInput) {
  const { order } = await requireOwnedPendingOrderItem(orderItemId, customerId);

  await createDesignRequest(orderItemId, customerId, input);

  const db = getDb();
  await db.update(orderItems).set({ designMethod: "REQUEST_DESIGN" }).where(eq(orderItems.id, orderItemId));

  if (order.status === "AWAITING_ARTWORK") {
    assertValidOrderTransition(order.status, "DESIGN_REQUIRED");
    await db.update(orders).set({ status: "DESIGN_REQUIRED" }).where(eq(orders.id, order.id));
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId: order.id,
      oldStatus: order.status,
      newStatus: "DESIGN_REQUIRED",
      actorType: "CUSTOMER",
      actorId: customerId,
      notes: "Customer requested Excel Printing to design this item.",
    });
  }

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: customerId,
    action: "ORDER_STATUS_CHANGED",
    entityType: "order",
    entityId: order.id,
    oldValue: { status: order.status },
    newValue: { status: "DESIGN_REQUIRED" },
  });
}
