import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { orders, orderStatusHistory } from "@/db/schema";
import { canTransitionOrder } from "@/lib/orders/state-machine";
import type { OrderStatus } from "@/lib/orders/constants";

/**
 * Moves an order to `newStatus` only if that's currently a valid transition
 * (silently no-ops otherwise) — used to advance the parent order as proofing
 * events land on individual order_items, without corrupting order state for
 * multi-item orders whose items are at different points in the flow.
 */
export async function advanceOrderStatusIfValid(
  orderId: string,
  newStatus: OrderStatus,
  actorType: "STAFF" | "CUSTOMER" | "SYSTEM",
  actorId?: string,
  notes?: string,
): Promise<void> {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return;
  if (order.status === newStatus) return;

  if (!canTransitionOrder(order.status, newStatus)) return;

  await db.update(orders).set({ status: newStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));
  await db.insert(orderStatusHistory).values({
    id: crypto.randomUUID(),
    orderId,
    oldStatus: order.status,
    newStatus,
    actorType,
    actorId,
    notes,
  });
}
