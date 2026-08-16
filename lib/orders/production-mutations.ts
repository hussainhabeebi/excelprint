import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { orderItems } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";

export class ProductionError extends Error {}

export async function setOrderItemProductionStatus(
  orderItemId: string,
  staffId: string,
  productionStatus: string,
): Promise<void> {
  const db = getDb();
  const [item] = await db.select().from(orderItems).where(eq(orderItems.id, orderItemId)).limit(1);
  if (!item) throw new ProductionError("Order item not found.");

  const trimmed = productionStatus.trim();
  await db
    .update(orderItems)
    .set({ productionStatus: trimmed || null, updatedAt: new Date() })
    .where(eq(orderItems.id, orderItemId));

  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "ORDER_ITEM_PRODUCTION_STATUS_UPDATED",
    entityType: "order_item",
    entityId: orderItemId,
    oldValue: { productionStatus: item.productionStatus },
    newValue: { productionStatus: trimmed || null },
  });
}
