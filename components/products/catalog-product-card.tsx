import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductIllustration } from "@/components/products/product-illustration";
import { formatMoneyAed } from "@/lib/utils";
import type { CatalogProductSummary } from "@/lib/catalog/types";

const PRODUCT_IMAGES: Record<string, { src: string; alt: string }> = {
  "business-cards": {
    src: "/products/business-cards.jpg",
    alt: "Premium custom-printed business cards",
  },
  flyers: {
    src: "/products/flyers.jpg",
    alt: "Colour marketing flyers printed on premium paper",
  },
  brochures: {
    src: "/products/brochers.jpg",
    alt: "Professionally printed folded brochures",
  },
  stamps: {
    src: "/products/stamps.jpg",
    alt: "Custom self-inking business stamps",
  },
  stickers: {
    src: "/products/stickers.jpg",
    alt: "Custom printed stickers and product labels",
  },
  banners: {
    src: "/products/banners.jpg",
    alt: "Large-format custom printed advertising banners",
  },
  "roll-up-banners": {
    src: "/products/roll-up-banners.jpg",
    alt: "Portable roll-up banner stands for exhibitions",
  },
  packaging: {
    src: "/products/packaging.jpg",
    alt: "Custom printed product packaging and boxes",
  },
};

export function CatalogProductCard({ product }: { product: CatalogProductSummary }) {
  const productImage = PRODUCT_IMAGES[product.slug];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        {productImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={productImage.src}
              alt={productImage.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <ProductIllustration slug={product.slug} className="aspect-[4/3] w-full" />
        )}
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
