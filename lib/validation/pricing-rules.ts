import { z } from "zod";

const PRICING_RULE_TYPES = [
  "MATERIAL",
  "PRINTING",
  "FINISH",
  "ADDON",
  "DESIGN_FEE",
  "URGENCY",
  "DELIVERY",
  "DISCOUNT",
  "CUSTOM",
] as const;

export const pricingRuleInputSchema = z.object({
  productId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(200),
  ruleType: z.enum(PRICING_RULE_TYPES),
  modifierType: z.enum(["FIXED", "PERCENT"]),
  amountCents: z.coerce.number().int().default(0),
  amountPercent: z.coerce.number().default(0),
  appliesTo: z
    .string()
    .trim()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;
      try {
        return JSON.parse(val);
      } catch {
        ctx.addIssue({ code: "custom", message: "Applies-to must be valid JSON." });
        return z.NEVER;
      }
    }),
  priority: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});
export type PricingRuleInput = z.infer<typeof pricingRuleInputSchema>;
