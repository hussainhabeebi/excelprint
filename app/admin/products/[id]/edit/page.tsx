import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { adminGetProductById, adminListCategories } from "@/lib/catalog/admin-queries";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "products");

  const { id } = await params;
  const [product, categories] = await Promise.all([adminGetProductById(id), adminListCategories()]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
      <div className="mt-6">
        <ProductForm action={updateProductAction.bind(null, id)} product={product} categories={categories} />
      </div>
    </div>
  );
}
