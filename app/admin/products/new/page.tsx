import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { adminListCategories } from "@/lib/catalog/admin-queries";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "products");

  const categories = await adminListCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New Product</h1>
      <div className="mt-6">
        <ProductForm action={createProductAction} categories={categories} />
      </div>
    </div>
  );
}
