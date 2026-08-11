import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id } from "./helpers";

export const coupons = sqliteTable("coupons", {
  id: id(),
  code: text("code").notNull(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["FIXED", "PERCENT"] }).notNull(),
  amountCents: integer("amount_cents").notNull().default(0),
  amountPercent: real("amount_percent").notNull().default(0),
  minOrderCents: integer("min_order_cents").notNull().default(0),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (t) => [uniqueIndex("coupons_code_idx").on(t.code)]);

/**
 * Outbox for all customer/staff notifications. Written to synchronously by
 * domain code, delivered asynchronously by the notifications Queue worker.
 * `channel` is deliberately open-ended (EMAIL today; SMS/WHATSAPP later)
 * so a future WhatsApp integration only needs a new channel handler, not a
 * schema change — see spec section 23/36 and lib/notifications.
 */
export const notifications = sqliteTable("notifications", {
  id: id(),
  recipientType: text("recipient_type", { enum: ["CUSTOMER", "STAFF"] }).notNull(),
  recipientId: text("recipient_id").notNull(),
  channel: text("channel", { enum: ["EMAIL", "SMS", "WHATSAPP"] }).notNull().default("EMAIL"),
  templateKey: text("template_key").notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  status: text("status", { enum: ["PENDING", "SENT", "FAILED"] }).notNull().default("PENDING"),
  sentAt: integer("sent_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
