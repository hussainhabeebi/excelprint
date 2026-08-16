import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { orders, orderStatusHistory } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import { assertValidOrderTransition, InvalidOrderTransitionError } from "./state-machine";
import type { OrderStatus } from "./constants";

export class OrderAdminError extends Error {}

export async function changeOrderStatusAsStaff(
  orderId: string,
  newStatus: OrderStatus,
  staffId: string,
  notes?: string,
): Promise<void> {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new OrderAdminError("Order not found.");

  try {
    assertValidOrderTransition(order.status, newStatus);
  } catch (error) {
    if (error instanceof InvalidOrderTransitionError) throw new OrderAdminError(error.message);
    throw error;
  }

  if (order.status === newStatus) return;

  await db.update(orders).set({ status: newStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    id: crypto.randomUUID(),
    orderId,
    oldStatus: order.status,
    newStatus,
    actorType: "STAFF",
    actorId: staffId,
    notes,
  });

  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "ORDER_STATUS_CHANGED",
    entityType: "order",
    entityId: orderId,
    oldValue: { status: order.status },
    newValue: { status: newStatus },
  });
}

export async function updateOrderInternalNotes(orderId: string, staffId: string, notes: string): Promise<void> {
  const db = getDb();
  await db.update(orders).set({ notesInternal: notes, updatedAt: new Date() }).where(eq(orders.id, orderId));
  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "ORDER_NOTES_UPDATED",
    entityType: "order",
    entityId: orderId,
  });
}
