import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { orderItems } from "./orders";
import { ARTWORK_SOURCES, ARTWORK_STATUSES } from "@/lib/orders/constants";

export const artworks = sqliteTable("artworks", {
  id: id(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  currentVersionId: text("current_version_id"),
  status: text("status", { enum: ARTWORK_STATUSES }).notNull().default("ARTWORK_REQUIRED"),
  ...timestamps,
});

/**
 * Append-only artwork history. NEVER update or delete a row here — every
 * revision (customer upload, designer edit, AI draft, print-ready file)
 * inserts a new row with an incremented versionNumber. See AGENTS.md rule
 * "never overwrite artwork versions."
 */
export const artworkVersions = sqliteTable("artwork_versions", {
  id: id(),
  artworkId: text("artwork_id").notNull().references(() => artworks.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  source: text("source", { enum: ARTWORK_SOURCES }).notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploadedByType: text("uploaded_by_type", { enum: ["CUSTOMER", "STAFF", "SYSTEM"] }).notNull(),
  uploadedById: text("uploaded_by_id"),
  notes: text("notes"),
  status: text("status", { enum: ARTWORK_STATUSES }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
