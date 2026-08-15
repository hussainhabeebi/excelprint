import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slugSchema,
  description: z.string().trim().max(2000).optional(),
  parentId: z.string().trim().min(1).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const productInputSchema = z.object({
  categoryId: z.string().trim().min(1, "Select a category"),
  name: z.string().trim().min(1).max(200),
  slug: slugSchema,
  description: z.string().trim().max(5000).optional(),
  shortDescription: z.string().trim().max(300).optional(),
  startingPriceCents: z.coerce.number().int().min(0),
  currency: z.string().trim().length(3).default("AED"),
  productionTimeStandardDays: z.coerce.number().int().min(0).default(3),
  productionTimeExpressDays: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
});
export type ProductInput = z.infer<typeof productInputSchema>;
