import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductIllustration } from "@/components/products/product-illustration";
import { formatMoneyAed } from "@/lib/utils";
import type { CatalogProductSummary } from "@/lib/catalog/types";

export function CatalogProductCard({ product }: { product: CatalogProductSummary }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        {/* Falls back to an illustrated tile until real product photography
         * is uploaded — R2-backed image serving lands with the artwork
         * phase, at which point product.primaryImageKey takes over here. */}
        <ProductIllustration slug={product.slug} className="aspect-[4/3] w-full" />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.categoryName}</p>
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          {product.shortDescription && <p className="text-sm text-muted-foreground">{product.shortDescription}</p>}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div>
              <p className="text-sm text-muted-foreground">
                From <span className="font-semibold text-foreground">{formatMoneyAed(product.startingPriceCents)}</span>
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {product.productionTimeStandardDays} day{product.productionTimeStandardDays === 1 ? "" : "s"}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
              Configure
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
