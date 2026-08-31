import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductIllustration } from "@/components/products/product-illustration";
import { PRODUCT_IMAGES } from "@/components/products/product-images";
import type { CatalogProductSummary } from "@/lib/catalog/types";

type CatalogueCardProduct = Pick<CatalogProductSummary, "id" | "name" | "slug" | "shortDescription"> & {
  categoryName?: string | null;
};

export function CatalogProductCard({ product }: { product: CatalogueCardProduct }) {
  const productImage = PRODUCT_IMAGES[product.slug];

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`View details for ${product.name}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <Card className="h-full overflow-hidden rounded-2xl border-border bg-white py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
        {productImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={productImage.src}
              alt={productImage.alt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
        ) : (
          <ProductIllustration slug={product.slug} className="aspect-[4/3] w-full" />
        )}
        <div className="flex min-h-48 flex-1 flex-col p-5">
          {product.categoryName && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{product.categoryName}</p>
          )}
          <h2 className="mt-1.5 text-lg font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-brand">
            {product.name}
          </h2>
          {product.shortDescription && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
            <span className="text-sm font-semibold text-brand">View Details</span>
            <ArrowRight className="size-4 text-brand transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
