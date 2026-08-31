import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { listCategories, listProducts } from "@/lib/catalog/queries";
import { POPULAR_PRODUCTS } from "@/lib/config/popular-products";
import { CatalogProductCard } from "@/components/products/catalog-product-card";
import type { CatalogCategory, CatalogProductSummary } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products & Services",
  description: "Explore Excelprint’s complete range of printing, branding, signage and custom production solutions.",
};

const FALLBACK_PRODUCT_SLUGS = new Set([
  "business-cards",
  "flyers",
  "brochures",
  "stamps",
  "stickers",
  "banners",
  "roll-up-banners",
  "packaging",
]);

type CatalogueProduct = Pick<CatalogProductSummary, "id" | "name" | "slug" | "shortDescription"> & {
  categoryId?: string;
  categoryName?: string | null;
  categorySlug?: string;
};

async function getCatalogueSafely(): Promise<{
  categories: CatalogCategory[];
  products: CatalogueProduct[];
  isFallback: boolean;
}> {
  try {
    const [categories, products] = await Promise.all([listCategories(), listProducts()]);

    if (products.length > 0) {
      return { categories, products, isFallback: false };
    }
  } catch (error) {
    console.error("Failed to load the products catalogue", error);
  }

  return {
    categories: [],
    products: POPULAR_PRODUCTS.filter((product) => FALLBACK_PRODUCT_SLUGS.has(product.slug)).map((product) => ({
      id: `fallback-${product.slug}`,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
    })),
    isFallback: true,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q = "" } = await searchParams;
  const searchQuery = q.trim().toLowerCase();
  const { categories, products, isFallback } = await getCatalogueSafely();
  const availableCategories = categories.filter((item) =>
    products.some((product) => product.categoryId === item.id),
  );
  const filteredProducts = products.filter((product) => {
    const matchesCategory = isFallback || !category || product.categorySlug === category;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery) ||
      product.categoryName?.toLowerCase().includes(searchQuery) ||
      product.shortDescription?.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q.trim()) params.set("q", q.trim());
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <main className="bg-gradient-to-b from-brand-soft/35 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Our Products &amp; Services</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            All Products &amp; Services
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore Excelprint’s complete range of printing, branding, signage and custom production solutions.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <form action="/products" method="get" className="relative">
            {category && <input type="hidden" name="category" value={category} />}
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search products and services"
              aria-label="Search products and services"
              className="h-12 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </form>
        </div>

        {availableCategories.length > 0 && (
          <nav aria-label="Product categories" className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href={categoryHref()}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                !category
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-brand/40 hover:text-brand",
              )}
            >
              All
            </Link>
            {availableCategories.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat.slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  category === cat.slug
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-white text-muted-foreground hover:border-brand/40 hover:text-brand",
                )}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-10">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand/30 bg-white/70 px-6 py-20 text-center">
              <p className="text-lg font-semibold text-foreground">No matching products or services</p>
              <p className="mt-2 text-sm text-muted-foreground">Try another search or browse all categories.</p>
              <Link href="/products" className="mt-5 inline-flex font-semibold text-brand hover:underline">
                View all products and services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
