import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { QUOTE_STATUSES } from "@/lib/orders/constants";
import { orders } from "./orders";

export const quotes = sqliteTable("quotes", {
  id: id(),
  quoteNumber: text("quote_number").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  productDescription: text("product_description").notNull(),
  quantity: integer("quantity"),
  dimensions: text("dimensions"),
  material: text("material"),
  deadline: integer("deadline", { mode: "timestamp_ms" }),
  description: text("description"),
  status: text("status", { enum: QUOTE_STATUSES }).notNull().default("NEW"),
  quotedPriceCents: integer("quoted_price_cents"),
  convertedOrderId: text("converted_order_id").references(() => orders.id),
  ...timestamps,
}, (t) => [uniqueIndex("quotes_quote_number_idx").on(t.quoteNumber)]);

export const quoteItems = sqliteTable("quote_items", {
  id: id(),
  quoteId: text("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity"),
  notes: text("notes"),
});

export const quoteAttachments = sqliteTable("quote_attachments", {
  id: id(),
  quoteId: text("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
