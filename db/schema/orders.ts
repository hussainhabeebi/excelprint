import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, softDelete, timestamps } from "./helpers";
import { customers, addresses } from "./identity";
import { products } from "./catalog";
import { ARTWORK_STATUSES, DESIGN_METHODS, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orders/constants";

/**
 * `orders`. Every money column is in fils (AED cents, integer) to avoid
 * float rounding. Totals here are the source of truth for what the
 * customer must pay — server-recalculated at checkout, never trusted from
 * the frontend. See lib/pricing/engine.ts and AGENTS.md.
 */
export const orders = sqliteTable("orders", {
  id: id(),
  orderNumber: text("order_number").notNull(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("DRAFT"),
  paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES }).notNull().default("UNPAID"),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  designFeeCents: integer("design_fee_cents").notNull().default(0),
  urgencyFeeCents: integer("urgency_fee_cents").notNull().default(0),
  deliveryFeeCents: integer("delivery_fee_cents").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  vatCents: integer("vat_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  currency: text("currency").notNull().default("AED"),
  couponId: text("coupon_id"),
  deliveryMethodId: text("delivery_method_id"),
  deliveryAddressId: text("delivery_address_id").references(() => addresses.id),
  billingAddressId: text("billing_address_id").references(() => addresses.id),
  notesCustomer: text("notes_customer"),
  notesInternal: text("notes_internal"),
  placedAt: integer("placed_at", { mode: "timestamp_ms" }),
  ...timestamps,
  ...softDelete,
}, (t) => [uniqueIndex("orders_order_number_idx").on(t.orderNumber)]);

export const orderItems = sqliteTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  productNameSnapshot: text("product_name_snapshot").notNull(),
  quantity: integer("quantity").notNull(),
  /** JSON snapshot of the configurator selections at order time. */
  configurationSnapshot: text("configuration_snapshot", { mode: "json" }).notNull(),
  designMethod: text("design_method", { enum: DESIGN_METHODS }),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalPriceCents: integer("total_price_cents").notNull(),
  /** Full itemized pricing engine output at the time of order, so a later
   * pricing_rules change never rewrites historical totals. */
  pricingBreakdownSnapshot: text("pricing_breakdown_snapshot", { mode: "json" }).notNull(),
  artworkStatus: text("artwork_status", { enum: ARTWORK_STATUSES }).notNull().default("ARTWORK_REQUIRED"),
  productionStatus: text("production_status"),
  ...timestamps,
});

export const orderItemOptions = sqliteTable("order_item_options", {
  id: id(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  optionName: text("option_name").notNull(),
  optionValue: text("option_value").notNull(),
  priceModifierCents: integer("price_modifier_cents").notNull().default(0),
});

/** Append-only. Every order.status change must insert a row here — see
 * lib/orders/state-machine.ts and AGENTS.md rule "every order state change
 * must be logged." */
export const orderStatusHistory = sqliteTable("order_status_history", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  oldStatus: text("old_status", { enum: ORDER_STATUSES }),
  newStatus: text("new_status", { enum: ORDER_STATUSES }).notNull(),
  actorType: text("actor_type", { enum: ["CUSTOMER", "STAFF", "SYSTEM"] }).notNull(),
  actorId: text("actor_id"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
