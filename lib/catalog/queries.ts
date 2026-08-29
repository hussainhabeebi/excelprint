import "server-only";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { categories, productImages, products } from "@/db/schema";
import type { ArtworkRequirements, CatalogCategory, CatalogProductDetail, CatalogProductSummary } from "./types";

export async function listCategories(): Promise<CatalogCategory[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      sortOrder: categories.sortOrder,
      isActive: categories.isActive,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  return rows;
}

interface ListProductsOptions {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}

export async function listProducts(options: ListProductsOptions = {}): Promise<CatalogProductSummary[]> {
  const db = getDb();

  const conditions = [eq(products.isActive, true), isNull(products.deletedAt)];
  if (options.categorySlug) conditions.push(eq(categories.slug, options.categorySlug));
  if (options.featuredOnly) conditions.push(eq(products.isFeatured, true));

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      shortDescription: products.shortDescription,
      purchaseMode: products.purchaseMode,
      startingPriceCents: products.startingPriceCents,
      currency: products.currency,
      productionTimeStandardDays: products.productionTimeStandardDays,
      isFeatured: products.isFeatured,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(asc(products.name))
    .limit(options.limit ?? 200);

  return attachPrimaryImages(rows);
}

export async function getProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  const db = getDb();

  const [row] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      purchaseMode: products.purchaseMode,
      startingPriceCents: products.startingPriceCents,
      currency: products.currency,
      productionTimeStandardDays: products.productionTimeStandardDays,
      productionTimeExpressDays: products.productionTimeExpressDays,
      artworkRequirements: products.artworkRequirements,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      isFeatured: products.isFeatured,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true), isNull(products.deletedAt)))
    .limit(1);

  if (!row) return null;

  const images = await db
    .select({ imageKey: productImages.imageKey, alt: productImages.alt, isPrimary: productImages.isPrimary })
    .from(productImages)
    .where(eq(productImages.productId, row.id))
    .orderBy(asc(productImages.sortOrder));

  return {
    ...row,
    artworkRequirements: (row.artworkRequirements as ArtworkRequirements | null) ?? null,
    primaryImageKey: images.find((i) => i.isPrimary)?.imageKey ?? images[0]?.imageKey ?? null,
    images,
  };
}

async function attachPrimaryImages<T extends { id: string }>(
  rows: T[],
): Promise<(T & { primaryImageKey: string | null })[]> {
  if (rows.length === 0) return [];

  const db = getDb();
  const images = await db
    .select({ productId: productImages.productId, imageKey: productImages.imageKey, isPrimary: productImages.isPrimary })
    .from(productImages)
    .where(
      inArray(
        productImages.productId,
        rows.map((r) => r.id),
      ),
    )
    .orderBy(asc(productImages.sortOrder));

  const primaryByProduct = new Map<string, string>();
  for (const image of images) {
    if (!primaryByProduct.has(image.productId) || image.isPrimary) {
      primaryByProduct.set(image.productId, image.imageKey);
    }
  }

  return rows.map((row) => ({ ...row, primaryImageKey: primaryByProduct.get(row.id) ?? null }));
}
