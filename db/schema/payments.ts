import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { orders } from "./orders";
import { PAYMENT_STATUSES } from "@/lib/orders/constants";
import { users } from "./identity";

export const payments = sqliteTable("payments", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id),
  provider: text("provider", { enum: ["STRIPE"] }).notNull().default("STRIPE"),
  providerPaymentIntentId: text("provider_payment_intent_id"),
  providerCheckoutSessionId: text("provider_checkout_session_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("AED"),
  status: text("status", { enum: PAYMENT_STATUSES }).notNull().default("UNPAID"),
  ...timestamps,
});

/**
 * Raw Stripe webhook events, keyed by Stripe's event id for idempotency.
 * Order.paymentStatus is only ever advanced from a verified webhook
 * handler reading these rows — never from the client-side success redirect.
 * AGENTS.md rule "never mark a Stripe payment paid based only on browser
 * redirect."
 */
export const paymentEvents = sqliteTable("payment_events", {
  id: id(),
  paymentId: text("payment_id").notNull().references(() => payments.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  providerEventId: text("provider_event_id").notNull(),
  rawPayload: text("raw_payload", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (t) => [uniqueIndex("payment_events_provider_event_id_idx").on(t.providerEventId)]);

export const refunds = sqliteTable("refunds", {
  id: id(),
  paymentId: text("payment_id").notNull().references(() => payments.id),
  orderId: text("order_id").notNull().references(() => orders.id),
  amountCents: integer("amount_cents").notNull(),
  reason: text("reason"),
  status: text("status", { enum: ["REQUESTED", "PROCESSING", "COMPLETED", "FAILED"] }).notNull().default("REQUESTED"),
  providerRefundId: text("provider_refund_id"),
  requestedByStaffId: text("requested_by_staff_id").references(() => users.id),
  ...timestamps,
});
