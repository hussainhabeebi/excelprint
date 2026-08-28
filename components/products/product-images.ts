export interface ProductImage {
  src: string;
  alt: string;
}

export const PRODUCT_IMAGES: Record<string, ProductImage> = {
  "business-cards": {
    src: "/products/business-cards.jpg",
    alt: "Premium custom-printed business cards",
  },
  flyers: {
    src: "/products/flyers.jpg",
    alt: "Colour marketing flyers printed on premium paper",
  },
  brochures: {
    src: "/products/brochers.jpg",
    alt: "Professionally printed folded brochures",
  },
  stamps: {
    src: "/products/stamps.jpg",
    alt: "Custom self-inking business stamps",
  },
  stickers: {
    src: "/products/stickers.jpg",
    alt: "Custom printed stickers and product labels",
  },
  banners: {
    src: "/products/banners.jpg",
    alt: "Large-format custom printed advertising banners",
  },
  "roll-up-banners": {
    src: "/products/roll-up-banners.jpg",
    alt: "Portable roll-up banner stands for exhibitions",
  },
  packaging: {
    src: "/products/packaging.jpg",
    alt: "Custom printed product packaging and boxes",
  },
};
