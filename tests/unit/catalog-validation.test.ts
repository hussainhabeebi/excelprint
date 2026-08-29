import { describe, expect, it } from "vitest";
import { categoryInputSchema, productInputSchema } from "@/lib/validation/catalog";

describe("categoryInputSchema", () => {
  it("accepts a valid category", () => {
    const result = categoryInputSchema.safeParse({
      name: "Business Printing",
      slug: "business-printing",
      sortOrder: 0,
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it.each(["Business Printing", "business_printing", "-leading-hyphen", "trailing-hyphen-", "double--hyphen"])(
    "rejects slug %s",
    (slug) => {
      const result = categoryInputSchema.safeParse({ name: "X", slug, sortOrder: 0, isActive: true });
      expect(result.success).toBe(false);
    },
  );
});

describe("productInputSchema", () => {
  it("requires a category", () => {
    const result = productInputSchema.safeParse({
      categoryId: "",
      name: "Business Cards",
      slug: "business-cards",
      startingPriceCents: 4500,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative starting price", () => {
    const result = productInputSchema.safeParse({
      categoryId: "cat_1",
      name: "Business Cards",
      slug: "business-cards",
      startingPriceCents: -100,
    });
    expect(result.success).toBe(false);
  });

  it("defaults currency and production time when omitted", () => {
    const result = productInputSchema.safeParse({
      categoryId: "cat_1",
      name: "Business Cards",
      slug: "business-cards",
      startingPriceCents: 4500,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("AED");
      expect(result.data.productionTimeStandardDays).toBe(3);
      expect(result.data.purchaseMode).toBe("CONFIGURABLE");
    }
  });

  it("accepts quote-only products", () => {
    const result = productInputSchema.safeParse({
      categoryId: "cat_1",
      name: "Laser Engraving",
      slug: "laser-engraving",
      purchaseMode: "QUOTE_ONLY",
      startingPriceCents: 0,
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.purchaseMode).toBe("QUOTE_ONLY");
  });

  it("rejects unknown purchase modes", () => {
    const result = productInputSchema.safeParse({
      categoryId: "cat_1",
      name: "Laser Engraving",
      slug: "laser-engraving",
      purchaseMode: "OFFLINE_ONLY",
      startingPriceCents: 0,
    });

    expect(result.success).toBe(false);
  });
});
