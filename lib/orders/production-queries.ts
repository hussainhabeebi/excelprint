import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { customers, orderItems, orders } from "@/db/schema";
import type { OrderStatus } from "./constants";

export const PRODUCTION_STAGE_STATUSES: OrderStatus[] = [
  "QUEUED_FOR_PRINT",
  "PRINTING",
  "FINISHING",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
];

export async function listProductionOrders() {
  const db = getDb();
  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      updatedAt: orders.updatedAt,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(inArray(orders.status, PRODUCTION_STAGE_STATUSES))
    .orderBy(desc(orders.updatedAt));

  const itemCounts = rows.length
    ? await db
        .select({ orderId: orderItems.orderId, id: orderItems.id })
        .from(orderItems)
        .where(inArray(orderItems.orderId, rows.map((r) => r.id)))
    : [];

  return rows.map((row) => ({
    ...row,
    itemCount: itemCounts.filter((i) => i.orderId === row.id).length,
  }));
}
