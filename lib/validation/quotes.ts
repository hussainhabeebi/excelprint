import { z } from "zod";

export const quoteRequestInputSchema = z.object({
  customerName: z.string().trim().min(1, "Please enter your name.").max(200),
  phone: z.string().trim().min(1, "Please enter a phone number.").max(30),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional(),
  productDescription: z.string().trim().min(1, "Tell us what you need printed.").max(2000),
  quantity: z.coerce.number().int().positive().optional(),
  dimensions: z.string().trim().max(200).optional(),
  material: z.string().trim().max(200).optional(),
  deadline: z.coerce.date().optional(),
  description: z.string().trim().max(3000).optional(),
  turnstileToken: z.string().min(1, "Please complete the verification challenge."),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestInputSchema>;
