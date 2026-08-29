import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductIllustration } from "@/components/products/product-illustration";
import { PRODUCT_IMAGES } from "@/components/products/product-images";
import type { PopularProduct } from "@/lib/config/popular-products";

export function ProductCard({ product }: { product: PopularProduct }) {
  const productImage = PRODUCT_IMAGES[product.slug];

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
      <Card className="h-full overflow-hidden border-slate-200 py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
        {productImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
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
          <h3 className="text-base font-semibold leading-snug text-slate-950">{product.name}</h3>
          <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
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
