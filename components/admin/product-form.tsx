"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormState } from "@/app/admin/products/actions";
import type { categories, products } from "@/db/schema";

type Product = typeof products.$inferSelect;
type Category = typeof categories.$inferSelect;

interface ProductFormProps {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
  categories: Category[];
}

export function ProductForm({ action, product, categories }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="business-cards" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          required
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {!category.isActive ? " (inactive)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseMode">Purchase Mode</Label>
        <select
          id="purchaseMode"
          name="purchaseMode"
          defaultValue={product?.purchaseMode ?? "CONFIGURABLE"}
          required
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="CONFIGURABLE">Configurable / Online Order</option>
          <option value="QUOTE_ONLY">Request Quote</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Quote-only products skip online configuration and do not show a starting price.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription ?? ""} />
        <p className="text-xs text-muted-foreground">Shown on product cards.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={5} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startingPriceCents">Starting price (fils)</Label>
          <Input
            id="startingPriceCents"
            name="startingPriceCents"
            type="number"
            min={0}
            defaultValue={product?.startingPriceCents ?? 0}
            required
          />
          <p className="text-xs text-muted-foreground">
            e.g. 4500 = AED 45.00. This value is not displayed for quote-only products.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="productionTimeStandardDays">Standard days</Label>
          <Input
            id="productionTimeStandardDays"
            name="productionTimeStandardDays"
            type="number"
            min={0}
            defaultValue={product?.productionTimeStandardDays ?? 3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productionTimeExpressDays">Express days</Label>
          <Input
            id="productionTimeExpressDays"
            name="productionTimeExpressDays"
            type="number"
            min={0}
            defaultValue={product?.productionTimeExpressDays ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={product?.metaTitle ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Input id="metaDescription" name="metaDescription" defaultValue={product?.metaDescription ?? ""} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
            className="size-4 rounded border-input"
          />
          Active (visible on the storefront)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
            className="size-4 rounded border-input"
          />
          Featured on homepage
        </label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
