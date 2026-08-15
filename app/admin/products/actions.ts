"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { productInputSchema } from "@/lib/validation/catalog";
import { CatalogError, createProduct, updateProduct } from "@/lib/catalog/mutations";

export interface ProductFormState {
  error: string | null;
}

function parseFormData(formData: FormData) {
  return {
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    startingPriceCents: formData.get("startingPriceCents") || 0,
    currency: formData.get("currency") || "AED",
    productionTimeStandardDays: formData.get("productionTimeStandardDays") || 3,
    productionTimeExpressDays: formData.get("productionTimeExpressDays") || undefined,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "products");

    const parsed = productInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await createProduct(parsed.data, staff.id);
  } catch (error) {
    if (error instanceof CatalogError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "products");

    const parsed = productInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await updateProduct(id, parsed.data, staff.id);
  } catch (error) {
    if (error instanceof CatalogError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/products");
}
