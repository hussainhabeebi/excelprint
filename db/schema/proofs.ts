import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id } from "./helpers";
import { orderItems, orders } from "./orders";
import { artworkVersions } from "./artwork";
import { customers } from "./identity";

export const proofs = sqliteTable("proofs", {
  id: id(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  artworkVersionId: text("artwork_version_id").notNull().references(() => artworkVersions.id),
  status: text("status", {
    enum: ["PENDING", "SENT", "CHANGES_REQUESTED", "APPROVED"],
  }).notNull().default("PENDING"),
  sentAt: integer("sent_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const proofComments = sqliteTable("proof_comments", {
  id: id(),
  proofId: text("proof_id").notNull().references(() => proofs.id, { onDelete: "cascade" }),
  authorType: text("author_type", { enum: ["CUSTOMER", "STAFF"] }).notNull(),
  authorId: text("author_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/**
 * A durable, legally-meaningful approval record. Never delete or mutate a
 * row here. If artwork changes after approval, the approval must be
 * invalidated (set invalidatedAt) and a fresh proof/approval requested —
 * AGENTS.md rule "never modify an approved proof."
 */
export const proofApprovals = sqliteTable("proof_approvals", {
  id: id(),
  proofId: text("proof_id").notNull().references(() => proofs.id, { onDelete: "cascade" }),
  artworkVersionId: text("artwork_version_id").notNull().references(() => artworkVersions.id),
  customerId: text("customer_id").notNull().references(() => customers.id),
  orderId: text("order_id").notNull().references(() => orders.id),
  approvedFilename: text("approved_filename").notNull(),
  approvalStatement: text("approval_statement").notNull(),
  ipAddress: text("ip_address"),
  approvedAt: integer("approved_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  invalidatedAt: integer("invalidated_at", { mode: "timestamp_ms" }),
});
