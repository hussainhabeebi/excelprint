import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, softDelete, timestamps } from "./helpers";

export const categories = sqliteTable("categories", {
  id: id(),
  parentId: text("parent_id"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  imageKey: text("image_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ...timestamps,
}, (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]);

/** Products are catalog templates — see product_options / quantity_tiers for
 * the data-driven configurator, and pricing_rules for the pricing engine.
 * Never hardcode a product's configuration into a component; it must be
 * fully derivable from these rows. */
export const products = sqliteTable("products", {
  id: id(),
  categoryId: text("category_id").notNull().references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  startingPriceCents: integer("starting_price_cents").notNull().default(0),
  currency: text("currency").notNull().default("AED"),
  productionTimeStandardDays: integer("production_time_standard_days").notNull().default(3),
  productionTimeExpressDays: integer("production_time_express_days"),
  /** JSON: { format, resolutionDpi, colorProfile, bleedMm, safeMarginMm, fontRule } — see spec section 33 */
  artworkRequirements: text("artwork_requirements", { mode: "json" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalPath: text("canonical_path"),
  ...timestamps,
  ...softDelete,
}, (t) => [uniqueIndex("products_slug_idx").on(t.slug)]);

export const productImages = sqliteTable("product_images", {
  id: id(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageKey: text("image_key").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
});

/** A configurable dimension of a product, e.g. "Paper", "Finish", "Size".
 * Rendered generically by the configurator UI from productOptionValues. */
export const productOptions = sqliteTable("product_options", {
  id: id(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["SINGLE_SELECT", "MULTI_SELECT"] }).notNull().default("SINGLE_SELECT"),
  isRequired: integer("is_required", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productOptionValues = sqliteTable("product_option_values", {
  id: id(),
  optionId: text("option_id").notNull().references(() => productOptions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  priceModifierType: text("price_modifier_type", { enum: ["FIXED", "PERCENT"] }),
  priceModifierCents: integer("price_modifier_cents").notNull().default(0),
  priceModifierPercent: real("price_modifier_percent").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
});

export const quantityTiers = sqliteTable("quantity_tiers", {
  id: id(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * A single editable pricing modifier. `productId` null = applies globally
 * (e.g. a site-wide express-production surcharge). Admin-editable; adding a
 * modifier must never require a code deploy. See lib/pricing/engine.ts for
 * how these compose into a final price.
 */
export const pricingRules = sqliteTable("pricing_rules", {
  id: id(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ruleType: text("rule_type", {
    enum: [
      "MATERIAL",
      "PRINTING",
      "FINISH",
      "ADDON",
      "DESIGN_FEE",
      "URGENCY",
      "DELIVERY",
      "DISCOUNT",
      "CUSTOM",
    ],
  }).notNull(),
  modifierType: text("modifier_type", { enum: ["FIXED", "PERCENT"] }).notNull(),
  amountCents: integer("amount_cents").notNull().default(0),
  amountPercent: real("amount_percent").notNull().default(0),
  /** JSON condition, e.g. { optionValueId } or { quantityMin, quantityMax } */
  appliesTo: text("applies_to", { mode: "json" }),
  priority: integer("priority").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }),
  ...timestamps,
});
