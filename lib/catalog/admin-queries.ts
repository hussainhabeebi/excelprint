import "server-only";
import { asc, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { categories, products } from "@/db/schema";

/**
 * Admin-facing catalog reads — unlike lib/catalog/queries.ts these include
 * inactive rows, since staff need to manage everything, not just what's
 * publicly visible.
 */

export async function adminListCategories() {
  const db = getDb();
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function adminGetCategoryById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}

export async function adminListProducts() {
  const db = getDb();
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      startingPriceCents: products.startingPriceCents,
      currency: products.currency,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      categoryName: categories.name,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.updatedAt));
}

export async function adminGetProductById(id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return row ?? null;
}
