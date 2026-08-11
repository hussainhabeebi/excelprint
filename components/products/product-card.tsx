import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PopularProduct } from "@/lib/config/popular-products";

export function ProductCard({ product }: { product: PopularProduct }) {
  const Icon = product.icon;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary">
          <Icon className="size-12 text-muted-foreground/60 transition-colors group-hover:text-brand" strokeWidth={1.5} />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <div>
              {product.startingPriceAed > 0 ? (
                <p className="text-sm text-muted-foreground">
                  From <span className="font-semibold text-foreground">AED {product.startingPriceAed}</span>
                </p>
              ) : (
                <p className="text-sm font-semibold text-foreground">Get a quote</p>
              )}
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {product.productionTime}
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
