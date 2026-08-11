import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";
import { customers } from "./identity";
import { products } from "./catalog";
import { DESIGN_METHODS } from "@/lib/orders/constants";

export const carts = sqliteTable("carts", {
  id: id(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  /** Guest cart identifier stored in a cookie; merged into the customer's
   * cart on login. */
  sessionToken: text("session_token"),
  status: text("status", { enum: ["ACTIVE", "CONVERTED", "ABANDONED"] }).notNull().default("ACTIVE"),
  ...timestamps,
});

export const cartItems = sqliteTable("cart_items", {
  id: id(),
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  /** JSON map of productOptionId -> selected productOptionValueId(s) */
  configuration: text("configuration", { mode: "json" }).notNull(),
  designMethod: text("design_method", { enum: DESIGN_METHODS }),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalPriceCents: integer("total_price_cents").notNull(),
  ...timestamps,
});
