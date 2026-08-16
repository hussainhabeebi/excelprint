import { z } from "zod";

export const proofChangeRequestSchema = z.object({
  comment: z.string().trim().min(1, "Tell us what needs to change.").max(3000),
});
export type ProofChangeRequestInput = z.infer<typeof proofChangeRequestSchema>;
