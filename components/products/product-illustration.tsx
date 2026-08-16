import { DEFAULT_PRODUCT_ICON, ICONS_BY_SLUG } from "@/lib/catalog/icon";
import { cn } from "@/lib/utils";

const TINTS = [
  { bg: "bg-indigo-50 dark:bg-indigo-950/40", icon: "text-indigo-600 dark:text-indigo-400", dot: "#6366F1" },
  { bg: "bg-sky-50 dark:bg-sky-950/40", icon: "text-sky-600 dark:text-sky-400", dot: "#22D3EE" },
  { bg: "bg-rose-50 dark:bg-rose-950/40", icon: "text-rose-600 dark:text-rose-400", dot: "#EC4899" },
  { bg: "bg-amber-50 dark:bg-amber-950/40", icon: "text-amber-600 dark:text-amber-400", dot: "#FACC15" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/40", icon: "text-emerald-600 dark:text-emerald-400", dot: "#10B981" },
  { bg: "bg-violet-50 dark:bg-violet-950/40", icon: "text-violet-600 dark:text-violet-400", dot: "#8B5CF6" },
] as const;

function tintForSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

interface ProductIllustrationProps {
  slug: string;
  className?: string;
  iconClassName?: string;
}

/**
 * A brand-consistent illustrated tile standing in for real product
 * photography, which doesn't exist yet (no photoshoot / uploaded assets).
 * Deterministic per slug (same product always renders the same tint) so
 * the catalog reads as a coherent set rather than random colors. Echoes
 * the logo's CMYK-dot flourish rather than using stock imagery.
 */
export function ProductIllustration({ slug, className, iconClassName }: ProductIllustrationProps) {
  const Icon = ICONS_BY_SLUG[slug] ?? DEFAULT_PRODUCT_ICON;
  const tint = tintForSlug(slug);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", tint.bg, className)}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="85%" cy="18%" r="3" fill={tint.dot} opacity="0.9" />
        <circle cx="90%" cy="14%" r="3" fill={tint.dot} opacity="0.5" />
      </svg>
      <Icon className={cn("size-12 relative", tint.icon, iconClassName)} strokeWidth={1.5} />
    </div>
  );
}
