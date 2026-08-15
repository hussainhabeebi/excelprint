"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ForbiddenError, requireStaffSection } from "@/lib/auth/rbac";
import { categoryInputSchema } from "@/lib/validation/catalog";
import { CatalogError, createCategory, updateCategory } from "@/lib/catalog/mutations";

export interface CategoryFormState {
  error: string | null;
}

function parseFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  };
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "categories");

    const parsed = categoryInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await createCategory(parsed.data, staff.id);
  } catch (error) {
    if (error instanceof CatalogError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/categories");
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  try {
    const user = await getCurrentUser();
    const staff = requireStaffSection(user, "categories");

    const parsed = categoryInputSchema.safeParse(parseFormData(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    await updateCategory(id, parsed.data, staff.id);
  } catch (error) {
    if (error instanceof CatalogError || error instanceof ForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/admin/categories");
}
