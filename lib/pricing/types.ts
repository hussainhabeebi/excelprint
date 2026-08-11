export type ModifierType = "FIXED" | "PERCENT";

export interface PriceModifier {
  id: string;
  label: string;
  type: ModifierType;
  /** Fils (AED cents) for FIXED, ignored for PERCENT. */
  amountCents: number;
  /** 0-100 for PERCENT, ignored for FIXED. */
  amountPercent: number;
}

export interface PricingLineItem {
  key: string;
  label: string;
  amountCents: number;
}

export interface PricingInput {
  /** Unit price resolved from the product's quantity tier for the chosen quantity. */
  baseUnitPriceCents: number;
  quantity: number;
  materialModifiers: PriceModifier[];
  printingModifiers: PriceModifier[];
  finishingModifiers: PriceModifier[];
  addonModifiers: PriceModifier[];
  designFeeCents: number;
  urgencyFeeCents: number;
  deliveryFeeCents: number;
  /** Percentage discount (coupon or customer-specific), applied after fees, before VAT. */
  discountCents: number;
  vatPercent: number;
}

export interface PricingBreakdown {
  baseCents: number;
  materialCents: number;
  printingCents: number;
  finishingCents: number;
  addonCents: number;
  designFeeCents: number;
  urgencyFeeCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  vatCents: number;
  subtotalCents: number;
  totalCents: number;
  lineItems: PricingLineItem[];
}
