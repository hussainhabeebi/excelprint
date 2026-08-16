import type { LucideIcon } from "lucide-react";
import { Award, BadgeCheck, Sparkles } from "lucide-react";

/**
 * Placeholder catalog for the Phase 1 homepage only. This is example data,
 * not official Excel Printing pricing (spec section 43/50) — Phase 2
 * replaces this with a live query against the `products` table, seeded
 * from db/seed, whenever featured products exist there. Prices are
 * illustrative starting points in AED. Product imagery is resolved by
 * slug via components/products/product-illustration.tsx, not stored here.
 */
export interface PopularProduct {
  slug: string;
  name: string;
  shortDescription: string;
  startingPriceAed: number;
  productionTime: string;
}

export const POPULAR_PRODUCTS: PopularProduct[] = [
  { slug: "business-cards", name: "Business Cards", shortDescription: "Premium matte, gloss or soft-touch finishes.", startingPriceAed: 45, productionTime: "2-3 days" },
  { slug: "flyers", name: "Flyers", shortDescription: "Eye-catching flyers for promotions and events.", startingPriceAed: 60, productionTime: "2-3 days" },
  { slug: "brochures", name: "Brochures", shortDescription: "Bi-fold and tri-fold brochures that sell.", startingPriceAed: 120, productionTime: "3-4 days" },
  { slug: "stamps", name: "Stamps", shortDescription: "Self-inking company and signature stamps.", startingPriceAed: 35, productionTime: "1-2 days" },
  { slug: "stickers", name: "Stickers", shortDescription: "Die-cut, vinyl and transparent stickers.", startingPriceAed: 40, productionTime: "2-3 days" },
  { slug: "letterheads", name: "Letterheads", shortDescription: "Professional letterheads for correspondence.", startingPriceAed: 90, productionTime: "2-3 days" },
  { slug: "envelopes", name: "Envelopes", shortDescription: "Branded envelopes in multiple sizes.", startingPriceAed: 85, productionTime: "3-4 days" },
  { slug: "banners", name: "Banners", shortDescription: "Large-format banners for indoor and outdoor use.", startingPriceAed: 150, productionTime: "2-3 days" },
  { slug: "roll-up-banners", name: "Roll-up Banners", shortDescription: "Portable stands for events and exhibitions.", startingPriceAed: 250, productionTime: "3-4 days" },
  { slug: "posters", name: "Posters", shortDescription: "Vivid posters in a range of sizes.", startingPriceAed: 55, productionTime: "2-3 days" },
  { slug: "certificates", name: "Certificates", shortDescription: "Premium-stock certificates and awards.", startingPriceAed: 65, productionTime: "2-3 days" },
  { slug: "invitations", name: "Invitations", shortDescription: "Elegant invitations for every occasion.", startingPriceAed: 75, productionTime: "3-4 days" },
  { slug: "menus", name: "Menus", shortDescription: "Durable, laminated restaurant menus.", startingPriceAed: 95, productionTime: "3-4 days" },
  { slug: "notebooks", name: "Notebooks", shortDescription: "Branded notebooks and diaries.", startingPriceAed: 110, productionTime: "4-5 days" },
  { slug: "packaging", name: "Packaging", shortDescription: "Custom boxes, bags and sleeves.", startingPriceAed: 200, productionTime: "5-7 days" },
  { slug: "labels", name: "Labels", shortDescription: "Product and packaging labels.", startingPriceAed: 50, productionTime: "2-3 days" },
  { slug: "ncr-books", name: "NCR Books", shortDescription: "Duplicate and triplicate carbonless books.", startingPriceAed: 130, productionTime: "3-5 days" },
  { slug: "id-cards", name: "ID Cards", shortDescription: "PVC staff and membership ID cards.", startingPriceAed: 25, productionTime: "2-3 days" },
  { slug: "corporate-stationery", name: "Corporate Stationery", shortDescription: "Complete branded stationery sets.", startingPriceAed: 300, productionTime: "5-7 days" },
  { slug: "custom-printing", name: "Custom Printing", shortDescription: "Anything else — tell us what you need.", startingPriceAed: 0, productionTime: "Varies" },
];

export const TRUST_BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: BadgeCheck, label: "Print-ready proof before production" },
  { icon: Sparkles, label: "AI design drafts in seconds" },
  { icon: Award, label: "Trusted by Ajman businesses" },
];
