import { z } from "zod";

export const registerCustomerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(200),
  marketingOptIn: z.boolean().optional().default(false),
  turnstileToken: z.string().min(1, "Please complete the verification challenge."),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(200),
  turnstileToken: z.string().min(1, "Please complete the verification challenge."),
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
