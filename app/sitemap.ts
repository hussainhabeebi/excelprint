import type { MetadataRoute } from "next";

/**
 * Static routes only for now. Phase 11 (SEO) extends this with product
 * pages, category pages, and seo_pages/blog_posts rows queried from D1.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://excelprintajman.com";
  const staticRoutes = [
    "",
    "/products",
    "/quote",
    "/printing-services-ajman",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/shipping-policy",
    "/cookie-policy",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
