import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { categories, products } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import type { CategoryInput, ProductInput } from "@/lib/validation/catalog";

export class CatalogError extends Error {}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Error && /unique constraint failed/i.test(error.message);
}

export async function createCategory(input: CategoryInput, actorId: string) {
  const db = getDb();
  const id = crypto.randomUUID();

  try {
    await db.insert(categories).values({
      id,
      name: input.name,
      slug: input.slug,
      description: input.description,
      parentId: input.parentId,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new CatalogError(`A category with slug "${input.slug}" already exists.`);
    }
    throw error;
  }

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "CATEGORY_CREATED",
    entityType: "category",
    entityId: id,
    newValue: input,
  });

  return id;
}

export async function updateCategory(id: string, input: CategoryInput, actorId: string) {
  const db = getDb();
  const [before] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!before) throw new CatalogError("Category not found.");

  try {
    await db
      .update(categories)
      .set({
        name: input.name,
        slug: input.slug,
        description: input.description,
        parentId: input.parentId,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
      })
      .where(eq(categories.id, id));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new CatalogError(`A category with slug "${input.slug}" already exists.`);
    }
    throw error;
  }

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "CATEGORY_UPDATED",
    entityType: "category",
    entityId: id,
    oldValue: before,
    newValue: input,
  });
}

export async function createProduct(input: ProductInput, actorId: string) {
  const db = getDb();
  const id = crypto.randomUUID();

  try {
    await db.insert(products).values({
      id,
      categoryId: input.categoryId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      shortDescription: input.shortDescription,
      purchaseMode: input.purchaseMode,
      startingPriceCents: input.startingPriceCents,
      currency: input.currency,
      productionTimeStandardDays: input.productionTimeStandardDays,
      productionTimeExpressDays: input.productionTimeExpressDays,
      isActive: input.isActive,
      isFeatured: input.isFeatured,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new CatalogError(`A product with slug "${input.slug}" already exists.`);
    }
    throw error;
  }

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "PRODUCT_CREATED",
    entityType: "product",
    entityId: id,
    newValue: input,
  });

  return id;
}

export async function updateProduct(id: string, input: ProductInput, actorId: string) {
  const db = getDb();
  const [before] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!before) throw new CatalogError("Product not found.");

  try {
    await db
      .update(products)
      .set({
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        shortDescription: input.shortDescription,
        purchaseMode: input.purchaseMode,
        startingPriceCents: input.startingPriceCents,
        currency: input.currency,
        productionTimeStandardDays: input.productionTimeStandardDays,
        productionTimeExpressDays: input.productionTimeExpressDays,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
      })
      .where(eq(products.id, id));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new CatalogError(`A product with slug "${input.slug}" already exists.`);
    }
    throw error;
  }

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "PRODUCT_UPDATED",
    entityType: "product",
    entityId: id,
    oldValue: before,
    newValue: input,
  });
}
