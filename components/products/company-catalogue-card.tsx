import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, BookOpen, Box, Factory, IdCard, Megaphone, PackageCheck, Stamp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PRODUCT_IMAGES } from "@/components/products/product-images";

interface CompanyCatalogueItem {
  name: string;
  slug: string;
  categoryKey: string;
  categoryName: string;
  shortDescription: string | null;
  href?: string;
}

const CATEGORY_ICONS = {
  "business-printing": BookOpen,
  "marketing-printing": Megaphone,
  "corporate-identification": IdCard,
  "signage-large-format": Factory,
  "stamps-seals": Stamp,
  "engraving-custom-works": BadgeCheck,
  "awards-recognition": Award,
  packaging: PackageCheck,
} as const;

export function CompanyCatalogueCard({ item }: { item: CompanyCatalogueItem }) {
  const image = PRODUCT_IMAGES[item.slug];
  const Icon = CATEGORY_ICONS[item.categoryKey as keyof typeof CATEGORY_ICONS] ?? Box;
  const card = (
    <Card className="h-full overflow-hidden rounded-2xl border-border bg-white py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-brand/70 group-hover:shadow-xl group-focus-visible:-translate-y-1.5 group-focus-visible:border-brand/70 group-focus-visible:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-soft/40">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none" />
        ) : (
          <div className="flex size-full items-center justify-center" aria-hidden="true">
            <div className="flex size-20 items-center justify-center rounded-full border border-brand/15 bg-white/75 text-brand">
              <Icon className="size-9" strokeWidth={1.5} />
            </div>
          </div>
        )}
      </div>
      <div className="flex min-h-44 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{item.categoryName}</p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand">{item.name}</h3>
        {item.shortDescription && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.shortDescription}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          {item.href ? (
            <><span className="text-sm font-semibold text-brand transition-colors duration-300 group-hover:text-brand-deep group-focus-visible:text-brand-deep">View Product Details</span><ArrowRight className="size-4 text-brand transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-brand-deep group-focus-visible:translate-x-1 group-focus-visible:text-brand-deep motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" /></>
          ) : (
            <span className="flex items-center gap-1 text-sm font-semibold text-brand" aria-disabled="true">
              View Product Details
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  if (!item.href) return <div className="group h-full">{card}</div>;
  return <Link href={item.href} aria-label={`View details for ${item.name}`} className="group block h-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{card}</Link>;
}
