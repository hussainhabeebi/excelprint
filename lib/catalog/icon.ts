import type { LucideIcon } from "lucide-react";
import {
  Award,
  Banknote,
  BookOpen,
  Boxes,
  CreditCard,
  FileText,
  Gift,
  IdCard,
  Image as ImageIcon,
  Layers,
  Mail,
  Menu as MenuIcon,
  Notebook,
  Package,
  ScrollText,
  Sparkles,
  Sticker,
  Stamp,
  Tag,
} from "lucide-react";

/**
 * Placeholder visual treatment for products without a real photo yet
 * (product photography upload isn't built — R2 upload UI arrives with the
 * artwork phase). Keyed by slug so it stays visually consistent with the
 * Phase 1 homepage cards; falls back to a generic package icon.
 */
export const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  "business-cards": CreditCard,
  flyers: FileText,
  brochures: BookOpen,
  stamps: Stamp,
  stickers: Sticker,
  letterheads: ScrollText,
  envelopes: Mail,
  banners: ImageIcon,
  "roll-up-banners": Layers,
  posters: ImageIcon,
  certificates: Award,
  invitations: Gift,
  menus: MenuIcon,
  notebooks: Notebook,
  packaging: Package,
  labels: Tag,
  "ncr-books": Banknote,
  "id-cards": IdCard,
  "corporate-stationery": Boxes,
  "custom-printing": Sparkles,
};

export const DEFAULT_PRODUCT_ICON: LucideIcon = Package;
