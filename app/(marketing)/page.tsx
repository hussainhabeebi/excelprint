import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { MobileStickyCta } from "@/components/marketing/mobile-sticky-cta";
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

export default async function HomePage() {
  const featuredProducts = await listProducts({ featuredOnly: true, limit: 8 });

  return (
    <>
      <Hero />

      <section className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className="size-4 text-brand" />
              {badge.label}
            </div>
          ))}
        </div>
      </section>

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
              POPULAR_PRODUCTS.map((product) => <ProductCard key={product.slug} product={product} />)}
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

      <ProcessSteps />

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

      <MobileStickyCta />
    </>
  );
}
