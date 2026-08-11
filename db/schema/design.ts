import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { orderItems } from "./orders";
import { customers, users } from "./identity";
import { AI_GENERATION_STATUSES } from "@/lib/orders/constants";

/** "Excel Printing Will Design It" requests (design option 2). */
export const designRequests = sqliteTable("design_requests", {
  id: id(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  requestedByCustomerId: text("requested_by_customer_id").notNull().references(() => customers.id),
  companyName: text("company_name"),
  contentText: text("content_text"),
  contactInfo: text("contact_info"),
  logoFileKey: text("logo_file_key"),
  preferredColors: text("preferred_colors"),
  designNotes: text("design_notes"),
  stylePreference: text("style_preference", {
    enum: ["CORPORATE", "MINIMAL", "LUXURY", "MODERN", "BOLD", "ELEGANT", "CREATIVE"],
  }),
  assignedDesignerId: text("assigned_designer_id").references(() => users.id),
  status: text("status", {
    enum: ["NEW", "ASSIGNED", "IN_PROGRESS", "COMPLETED"],
  }).notNull().default("NEW"),
  ...timestamps,
});

export const designRequestFiles = sqliteTable("design_request_files", {
  id: id(),
  designRequestId: text("design_request_id").notNull().references(() => designRequests.id, { onDelete: "cascade" }),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  kind: text("kind", { enum: ["REFERENCE", "LOGO"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/**
 * "Create Design With AI" requests (design option 3), processed async via
 * the ai-design Cloudflare Queue against fal.ai. Output is always a DRAFT —
 * see artwork.ts `source: AI_GENERATION` and AGENTS.md rule "AI-generated
 * artwork is never automatically print-ready."
 */
export const aiGenerations = sqliteTable("ai_generations", {
  id: id(),
  orderItemId: text("order_item_id").references(() => orderItems.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  businessType: text("business_type"),
  style: text("style"),
  colorPreference: text("color_preference"),
  additionalDescription: text("additional_description"),
  outputFileKey: text("output_file_key"),
  outputUrl: text("output_url"),
  status: text("status", { enum: AI_GENERATION_STATUSES }).notNull().default("QUEUED"),
  errorMessage: text("error_message"),
  ...timestamps,
});
