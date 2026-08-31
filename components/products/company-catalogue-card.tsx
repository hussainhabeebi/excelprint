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
    <Card className={`h-full overflow-hidden rounded-2xl border-border bg-white py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${item.href ? "group-hover:-translate-y-1 group-hover:border-brand/50 group-hover:shadow-lg" : ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-soft/40">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${item.href ? "group-hover:scale-[1.035]" : ""}`} />
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
        <h3 className={`mt-1.5 text-lg font-semibold leading-snug text-foreground transition-colors duration-300 ${item.href ? "group-hover:text-brand" : ""}`}>{item.name}</h3>
        {item.shortDescription && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.shortDescription}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          {item.href ? (
            <><span className="text-sm font-semibold text-brand">View Details</span><ArrowRight className="size-4 text-brand transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" /></>
          ) : <span className="text-xs font-medium text-muted-foreground">Details coming soon</span>}
        </div>
      </div>
    </Card>
  );

  if (!item.href) return <div className="h-full">{card}</div>;
  return <Link href={item.href} aria-label={`View details for ${item.name}`} className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{card}</Link>;
}
