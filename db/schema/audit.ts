import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id } from "./helpers";

/**
 * Append-only audit trail for every significant admin/system action (price
 * changes, status changes, artwork uploads, approvals, refunds, role
 * changes — spec section 38). Write via lib/security/audit.ts; never write
 * directly from a route handler so the shape stays consistent.
 */
export const auditLogs = sqliteTable("audit_logs", {
  id: id(),
  actorType: text("actor_type", { enum: ["CUSTOMER", "STAFF", "SYSTEM"] }).notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  oldValue: text("old_value", { mode: "json" }),
  newValue: text("new_value", { mode: "json" }),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Key/value business configuration (phone, address, hours, WhatsApp
 * number, Maps URL...) — admin-managed, never hardcoded/invented in code.
 * See spec section 31/50. */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
