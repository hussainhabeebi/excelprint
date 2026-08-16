import { z } from "zod";

export const addressInputSchema = z.object({
  label: z.string().trim().max(60).optional(),
  line1: z.string().trim().min(1, "Address is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  emirate: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(20).optional(),
});
export type AddressInput = z.infer<typeof addressInputSchema>;

export const placeOrderSchema = z.object({
  deliveryMethodId: z.string().trim().min(1, "Choose a delivery method"),
  deliveryAddressId: z.string().trim().min(1).optional(),
  newAddress: addressInputSchema.optional(),
  notesCustomer: z.string().trim().max(1000).optional(),
});
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
