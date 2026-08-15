import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { listCategories, listProducts } from "@/lib/catalog/queries";
import { CatalogProductCard } from "@/components/products/catalog-product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse and configure custom printing products — business cards, flyers, banners, stamps, packaging and more.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ categorySlug: category }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">Choose a product to configure specs, artwork and pricing.</p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !category ? "border-brand bg-brand text-brand-foreground" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === cat.slug
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-medium">No products here yet</p>
          <p className="mt-1 text-muted-foreground">Check back soon, or browse other categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
