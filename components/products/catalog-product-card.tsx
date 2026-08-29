import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductIllustration } from "@/components/products/product-illustration";
import { PRODUCT_IMAGES } from "@/components/products/product-images";
import { formatMoneyAed } from "@/lib/utils";
import type { CatalogProductSummary } from "@/lib/catalog/types";

export function CatalogProductCard({ product }: { product: CatalogProductSummary }) {
  const productImage = PRODUCT_IMAGES[product.slug];

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
      <Card className="h-full overflow-hidden border-border py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
        {productImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={productImage.src}
              alt={productImage.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
        ) : (
          <ProductIllustration slug={product.slug} className="aspect-[4/3] w-full" />
        )}
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{product.categoryName}</p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground">{product.name}</h3>
          {product.shortDescription && (
            <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                From <span className="font-semibold text-foreground">{formatMoneyAed(product.startingPriceCents)}</span>
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {product.productionTimeStandardDays} day{product.productionTimeStandardDays === 1 ? "" : "s"}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors">
              Configure
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
