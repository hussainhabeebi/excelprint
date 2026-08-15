import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/catalog/queries";
import { DEFAULT_PRODUCT_ICON, ICONS_BY_SLUG } from "@/lib/catalog/icon";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.metaTitle ?? `${product.name} Printing`,
    description: product.metaDescription ?? product.shortDescription ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const Icon = ICONS_BY_SLUG[product.slug] ?? DEFAULT_PRODUCT_ICON;
  const requirements = product.artworkRequirements;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          All products
        </Link>
        {" / "}
        <Link href={`/products?category=${product.categorySlug}`} className="hover:text-foreground">
          {product.categoryName}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-secondary">
          <Icon className="size-24 text-muted-foreground/50" strokeWidth={1.25} />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          {product.shortDescription && <p className="mt-2 text-lg text-muted-foreground">{product.shortDescription}</p>}

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Starting from</span>
            <span className="text-2xl font-semibold">{formatMoneyAed(product.startingPriceCents)}</span>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            Standard production: {product.productionTimeStandardDays} day
            {product.productionTimeStandardDays === 1 ? "" : "s"}
            {product.productionTimeExpressDays != null && (
              <> · Express: {product.productionTimeExpressDays} day{product.productionTimeExpressDays === 1 ? "" : "s"}</>
            )}
          </p>

          <Button asChild size="lg" variant="brand" className="mt-8 w-full sm:w-auto">
            <Link href={`/configure/${product.slug}`}>
              Configure &amp; See Price
              <ArrowRight />
            </Link>
          </Button>

          {product.description && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
            </div>
          )}

          {requirements && (
            <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                <CheckCircle2 className="size-4 text-brand" />
                Artwork Requirements
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {requirements.format && (
                  <>
                    <dt className="text-muted-foreground">Format</dt>
                    <dd>{requirements.format}</dd>
                  </>
                )}
                {requirements.resolutionDpi && (
                  <>
                    <dt className="text-muted-foreground">Resolution</dt>
                    <dd>{requirements.resolutionDpi} DPI</dd>
                  </>
                )}
                {requirements.colorProfile && (
                  <>
                    <dt className="text-muted-foreground">Color profile</dt>
                    <dd>{requirements.colorProfile}</dd>
                  </>
                )}
                {requirements.bleedMm != null && (
                  <>
                    <dt className="text-muted-foreground">Bleed</dt>
                    <dd>{requirements.bleedMm} mm</dd>
                  </>
                )}
                {requirements.safeMarginMm != null && (
                  <>
                    <dt className="text-muted-foreground">Safe margin</dt>
                    <dd>{requirements.safeMarginMm} mm</dd>
                  </>
                )}
                {requirements.fontRule && (
                  <>
                    <dt className="text-muted-foreground">Fonts</dt>
                    <dd>{requirements.fontRule}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
