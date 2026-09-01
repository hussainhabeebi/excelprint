import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { CompanyCatalogueCard } from "@/components/products/company-catalogue-card";
import { CatalogueGridReveal } from "@/components/products/catalogue-grid-reveal";
import { listProducts } from "@/lib/catalog/queries";
import { cn } from "@/lib/utils";
import type { CatalogProductSummary } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products & Services",
  description: "Explore Excelprint’s complete range of printing, branding, signage and custom production solutions.",
};

const OWNER_CATEGORIES = [
  { key: "business-printing", name: "Business Printing", items: [
    { name: "Books", slug: "books" }, { name: "Invoice Books", slug: "invoice-books" },
    { name: "Business Cards", slug: "business-cards" },
  ] },
  { key: "marketing-printing", name: "Marketing Printing", items: [
    { name: "Flyers", slug: "flyers" }, { name: "Posters", slug: "posters" },
    { name: "Menus", slug: "menus" }, { name: "Brochures", slug: "brochures" },
    { name: "Stickers", slug: "stickers" },
  ] },
  { key: "corporate-identification", name: "Corporate & Identification", items: [
    { name: "Name Badges", slug: "name-badges" }, { name: "ID Cards", slug: "id-cards" },
  ] },
  { key: "signage-large-format", name: "Signage & Large Format", items: [
    { name: "Banners", slug: "banners" }, { name: "Roll-up Banners", slug: "roll-up-banners" },
    { name: "Flex & 3D Sign Boards", slug: "flex-3d-sign-boards" },
  ] },
  { key: "stamps-seals", name: "Stamps & Seals", items: [
    { name: "Rubber Stamps", slug: "rubber-stamps" }, { name: "Self-Inking Stamps", slug: "self-inking-stamps" },
    { name: "Date Stamps", slug: "date-stamps" }, { name: "Company Seals", slug: "company-seals" },
    { name: "Pocket Stamps", slug: "pocket-stamps" },
  ] },
  { key: "engraving-custom-works", name: "Engraving & Custom Works", items: [
    { name: "Laser Engraving", slug: "laser-engraving" }, { name: "Acid Etching", slug: "acid-etching" },
    { name: "Stencil & Vinyl Cutting", slug: "stencil-vinyl-cutting" }, { name: "Acrylic Jobs", slug: "acrylic-jobs" },
  ] },
  { key: "awards-recognition", name: "Awards & Recognition", items: [
    { name: "Awards", slug: "awards" }, { name: "Plaques", slug: "plaques" }, { name: "Trophies", slug: "trophies" },
  ] },
  { key: "packaging", name: "Packaging", items: [{ name: "Packaging", slug: "packaging" }] },
] as const;

async function getActiveProductsSafely(): Promise<CatalogProductSummary[]> {
  try {
    return await listProducts();
  } catch (error) {
    console.error("Failed to load active catalogue links", error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const activeProducts = await getActiveProductsSafely();
  const activeBySlug = new Map(activeProducts.map((product) => [product.slug, product]));

  const groups = OWNER_CATEGORIES.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const activeProduct = activeBySlug.get(item.slug);
      return {
        ...item,
        categoryKey: group.key,
        categoryName: group.name,
        shortDescription: activeProduct?.shortDescription ?? null,
        href: activeProduct ? `/product/${activeProduct.slug}` : undefined,
      };
    }).filter((item) =>
      (!query || item.name.toLowerCase().includes(query) || item.categoryName.toLowerCase().includes(query) || item.shortDescription?.toLowerCase().includes(query)) &&
      (!category || item.categoryKey === category),
    ),
  })).filter((group) => group.items.length > 0);

  const categoryHref = (key?: string) => {
    const params = new URLSearchParams();
    if (key) params.set("category", key);
    if (q.trim()) params.set("q", q.trim());
    const search = params.toString();
    return search ? `/products?${search}` : "/products";
  };

  return (
    <div className="bg-gradient-to-b from-brand-soft/35 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Our Products &amp; Services</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">All Products &amp; Services</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore Excelprint’s complete range of printing, branding, signage and custom production solutions.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <form action="/products" method="get" className="relative">
            {category && <input type="hidden" name="category" value={category} />}
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" name="q" defaultValue={q} placeholder="Search products and services" aria-label="Search products and services"
              className="h-12 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </form>
        </div>

        <nav aria-label="Product categories" className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href={categoryHref()} className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
            !category ? "border-brand bg-brand text-brand-foreground" : "border-border bg-white text-muted-foreground hover:border-brand/40 hover:text-brand",
          )}>All</Link>
          {OWNER_CATEGORIES.map((group) => (
            <Link key={group.key} href={categoryHref(group.key)} className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              category === group.key ? "border-brand bg-brand text-brand-foreground" : "border-border bg-white text-muted-foreground hover:border-brand/40 hover:text-brand",
            )}>{group.name}</Link>
          ))}
        </nav>

        <div className="mt-10">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand/30 bg-white/70 px-6 py-20 text-center">
              <p className="text-lg font-semibold text-foreground">No matching products or services</p>
              <p className="mt-2 text-sm text-muted-foreground">Try another search or browse all categories.</p>
              <Link href="/products" className="mt-5 inline-flex font-semibold text-brand hover:underline">View all products and services</Link>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-14">
              {groups.map((group) => (
                <section key={group.key} aria-labelledby={`category-${group.key}`}>
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-brand/15 pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Product category</p>
                      <h2 id={`category-${group.key}`} className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{group.name}</h2>
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">{group.items.length} {group.items.length === 1 ? "item" : "items"}</span>
                  </div>
                  <CatalogueGridReveal>
                    {group.items.map((item) => <CompanyCatalogueCard key={item.slug} item={item} />)}
                  </CatalogueGridReveal>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
