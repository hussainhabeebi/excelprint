import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { CategoryForm } from "@/components/admin/category-form";
import { createCategoryAction } from "../actions";

export const metadata: Metadata = { title: "New Category" };

export default async function NewCategoryPage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "categories");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New Category</h1>
      <div className="mt-6">
        <CategoryForm action={createCategoryAction} />
      </div>
    </div>
  );
}
