import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DEFAULT_PRODUCT_ICON, ICONS_BY_SLUG } from "@/lib/catalog/icon";
import { formatMoneyAed } from "@/lib/utils";
import type { CatalogProductSummary } from "@/lib/catalog/types";

export function CatalogProductCard({ product }: { product: CatalogProductSummary }) {
  const Icon = ICONS_BY_SLUG[product.slug] ?? DEFAULT_PRODUCT_ICON;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary">
          {/* Product photography upload isn't built yet (R2 upload arrives with
           * the artwork phase) — every seeded product falls back to an icon. */}
          <Icon className="size-12 text-muted-foreground/60 transition-colors group-hover:text-brand" strokeWidth={1.5} />
        </div>
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
