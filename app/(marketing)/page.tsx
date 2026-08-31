import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { PrintingCapabilities } from "@/components/marketing/printing-capabilities";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ProductGridReveal } from "@/components/marketing/product-grid-reveal";
import { WhyChooseExcelprint } from "@/components/marketing/why-choose-excelprint";
import { ContactExcelprint } from "@/components/marketing/contact-excelprint";
import { ProductIllustration } from "@/components/products/product-illustration";
import { PRODUCT_IMAGES } from "@/components/products/product-images";
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

function HomepageProductCard({
  product,
}: {
  product: { slug: string; name: string; categoryName?: string };
}) {
  const productImage = PRODUCT_IMAGES[product.slug];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {productImage ? (
          <Image
            src={productImage.src}
            alt={productImage.alt}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 430px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <ProductIllustration slug={product.slug} className="size-full" />
        )}
      </div>
      <div className="flex items-end justify-between gap-3 p-4 sm:p-5">
        <span className="min-w-0">
          {product.categoryName && (
            <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {product.categoryName}
            </span>
          )}
          <span className={`${product.categoryName ? "mt-1" : ""} block text-base font-semibold leading-snug text-foreground`}>
            {product.name}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand transition-colors duration-300 group-hover:text-brand-deep sm:text-sm">
          <span>View Product Details</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
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
                    <badge.icon className="size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                    <span className="whitespace-nowrap">{badge.label}</span>
                    <span className="ml-3 size-1.5 shrink-0 rounded-full bg-brand-bright" aria-hidden="true" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PrintingCapabilities />

      <ProcessSteps />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-5 text-center">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Our products &amp; services</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Everything You Need, Printed Right</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our complete range of printing, branding and custom production services.
              </p>
            </div>
            <Button asChild variant="brandOutline" className="shrink-0">
              <Link href="/products">
                View all products
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <ProductGridReveal>
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => <HomepageProductCard key={product.id} product={product} />)
              : // No products in the database yet (nothing seeded/added in admin) — fall back to
                // the illustrative placeholder catalog so the homepage never looks broken.
                POPULAR_PRODUCTS.filter((product) => HOMEPAGE_FALLBACK_PRODUCT_SLUGS.has(product.slug)).map((product) => (
                  <HomepageProductCard key={product.slug} product={product} />
                ))}
          </ProductGridReveal>
        </div>
      </section>

      <WhyChooseExcelprint />

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

      <ContactExcelprint />
    </>
  );
}
