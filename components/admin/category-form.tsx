"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryFormState } from "@/app/admin/categories/actions";
import type { categories } from "@/db/schema";

type Category = typeof categories.$inferSelect;

interface CategoryFormProps {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  category?: Category;
}

export function CategoryForm({ action, category }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="business-printing" required />
        <p className="text-xs text-muted-foreground">Lowercase letters, numbers and hyphens only.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={category?.description ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={category?.metaTitle ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Input id="metaDescription" name="metaDescription" defaultValue={category?.metaDescription ?? ""} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={category?.isActive ?? true}
          className="size-4 rounded border-input"
        />
        Active (visible on the storefront)
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Saving…" : category ? "Save changes" : "Create category"}
      </Button>
    </form>
  );
}
