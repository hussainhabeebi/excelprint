import type { ConfiguratorSelections } from "@/lib/pricing/configurator";
import type { DesignMethod } from "@/lib/orders/constants";

export interface CartItemDisplayLine {
  label: string;
  value: string;
}

/** Shape stored in cart_items.configuration (JSON). */
export interface CartItemConfiguration {
  selections: ConfiguratorSelections;
  displayLines: CartItemDisplayLine[];
}

export interface CartItemView {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  configuration: CartItemConfiguration;
  designMethod: DesignMethod | null;
  unitPriceCents: number;
  totalPriceCents: number;
}
