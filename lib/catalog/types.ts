export interface ArtworkRequirements {
  format?: string;
  resolutionDpi?: number;
  colorProfile?: string;
  bleedMm?: number;
  safeMarginMm?: number;
  fontRule?: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CatalogProductSummary {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  startingPriceCents: number;
  currency: string;
  productionTimeStandardDays: number;
  isFeatured: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  primaryImageKey: string | null;
}

export interface CatalogProductDetail extends CatalogProductSummary {
  description: string | null;
  productionTimeExpressDays: number | null;
  artworkRequirements: ArtworkRequirements | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images: { imageKey: string; alt: string | null; isPrimary: boolean }[];
}
