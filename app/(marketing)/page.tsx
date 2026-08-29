import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ProductCard } from "@/components/products/product-card";
import { CatalogProductCard } from "@/components/products/catalog-product-card";
import { Button } from "@/components/ui/button";
import { POPULAR_PRODUCTS, TRUST_BADGES } from "@/lib/config/popular-products";
import { listProducts } from "@/lib/catalog/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Excel Printing Ajman | Custom Printing, Branding & Design",
  description:
    "Configure and order business cards, flyers, banners, stamps, packaging and more. Design, approve and pay online — printed and delivered in Ajman, UAE.",
};

const HOMEPAGE_FALLBACK_PRODUCT_SLUGS = new Set([
  "business-cards",
  "flyers",
  "brochures",
  "stamps",
  "stickers",
  "banners",
  "roll-up-banners",
  "packaging",
]);

async function getFeaturedProductsSafely() {
  try {
    return await listProducts({ featuredOnly: true, limit: 8 });
  } catch (error) {
    // The homepage has a perfectly good placeholder catalog to fall back to
    // (e.g. before migrations/seed data exist, or a transient D1 issue) —
    // never let a catalog read take down the entire homepage.
    console.error("Failed to load featured products for homepage", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProductsSafely();

  return (
    <>
      <Hero />

      <section className="trust-ticker border-y border-white/10 bg-black text-white" aria-label="Excelprint benefits">
        <div className="trust-ticker-viewport overflow-hidden" tabIndex={0}>
          <div className="trust-ticker-track flex w-max">
            {[false, true].map((isDuplicate) => (
              <div
                key={isDuplicate ? "duplicate" : "primary"}
                className="trust-ticker-group flex shrink-0 items-center"
                aria-hidden={isDuplicate ? "true" : undefined}
              >
                {TRUST_BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex shrink-0 items-center gap-2 px-5 py-3 text-xs font-medium tracking-wide sm:px-8 sm:text-sm lg:px-10"
                  >
                    <badge.icon className="size-4 shrink-0 text-sky-400" aria-hidden="true" />
                    <span className="whitespace-nowrap">{badge.label}</span>
                    <span className="ml-3 size-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Popular products</h2>
            <p className="mt-2 text-muted-foreground">Configure specs, pricing updates instantly.</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/products">
              View all products
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.length > 0
            ? featuredProducts.map((product) => <CatalogProductCard key={product.id} product={product} />)
            : // No products in the database yet (nothing seeded/added in admin) — fall back to
              // the illustrative placeholder catalog so the homepage never looks broken.
              POPULAR_PRODUCTS.filter((product) => HOMEPAGE_FALLBACK_PRODUCT_SLUGS.has(product.slug)).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/products">
              View all products
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Not sure what you need?</h2>
          <p className="max-w-xl text-primary-foreground/80">
            Tell us about your job and we&apos;ll put together a custom quote — no automated pricing required.
          </p>
          <Button asChild size="lg" variant="brand" className="mt-2">
            <Link href="/quote">Request Custom Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
