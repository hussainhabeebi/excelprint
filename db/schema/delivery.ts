import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { orders } from "./orders";
import { addresses } from "./identity";
import { DELIVERY_METHOD_TYPES } from "@/lib/orders/constants";

/** Admin-configurable delivery options and fees — never hardcode a delivery
 * fee in checkout code. */
export const deliveryMethods = sqliteTable("delivery_methods", {
  id: id(),
  type: text("type", { enum: DELIVERY_METHOD_TYPES }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  feeCents: integer("fee_cents").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const deliveries = sqliteTable("deliveries", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  deliveryMethodId: text("delivery_method_id").notNull().references(() => deliveryMethods.id),
  addressId: text("address_id").references(() => addresses.id),
  status: text("status", {
    enum: ["PENDING", "DISPATCHED", "DELIVERED", "READY_FOR_PICKUP", "PICKED_UP"],
  }).notNull().default("PENDING"),
  trackingReference: text("tracking_reference"),
  courierName: text("courier_name"),
  dispatchedAt: integer("dispatched_at", { mode: "timestamp_ms" }),
  deliveredAt: integer("delivered_at", { mode: "timestamp_ms" }),
  ...timestamps,
});
