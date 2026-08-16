import { z } from "zod";

export const designRequestInputSchema = z.object({
  companyName: z.string().trim().max(200).optional(),
  contentText: z.string().trim().max(3000).optional(),
  contactInfo: z.string().trim().max(300).optional(),
  preferredColors: z.string().trim().max(300).optional(),
  designNotes: z.string().trim().max(2000).optional(),
  stylePreference: z.enum(["CORPORATE", "MINIMAL", "LUXURY", "MODERN", "BOLD", "ELEGANT", "CREATIVE"]).optional(),
});
export type DesignRequestInput = z.infer<typeof designRequestInputSchema>;
