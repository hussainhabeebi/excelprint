import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { adminGetCategoryById } from "@/lib/catalog/admin-queries";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategoryAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "categories");

  const { id } = await params;
  const category = await adminGetCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Category</h1>
      <div className="mt-6">
        <CategoryForm action={updateCategoryAction.bind(null, id)} category={category} />
      </div>
    </div>
  );
}
