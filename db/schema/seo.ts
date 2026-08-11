import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helpers";

/** Real, editorially-written landing pages (spec section 28) — not
 * auto-generated location spam pages. */
export const seoPages = sqliteTable("seo_pages", {
  id: id(),
  path: text("path").notNull(),
  pageType: text("page_type", { enum: ["PRODUCT", "SERVICE", "BLOG", "STATIC"] }).notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  canonical: text("canonical"),
  h1: text("h1").notNull(),
  introContent: text("intro_content"),
  /** JSON: freeform sections — options, artwork requirements, production info */
  bodyContent: text("body_content", { mode: "json" }),
  faq: text("faq", { mode: "json" }),
  relatedProductIds: text("related_product_ids", { mode: "json" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (t) => [uniqueIndex("seo_pages_path_idx").on(t.path)]);

export const redirects = sqliteTable("redirects", {
  id: id(),
  fromPath: text("from_path").notNull(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (t) => [uniqueIndex("redirects_from_path_idx").on(t.fromPath)]);

export const blogPosts = sqliteTable("blog_posts", {
  id: id(),
  category: text("category"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  coverImageKey: text("cover_image_key"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  ...timestamps,
}, (t) => [uniqueIndex("blog_posts_slug_idx").on(t.slug)]);
