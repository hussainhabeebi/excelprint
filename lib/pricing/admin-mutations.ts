import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { pricingRules } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import type { PricingRuleInput } from "@/lib/validation/pricing-rules";

export class PricingRuleError extends Error {}

export async function createPricingRule(input: PricingRuleInput, actorId: string) {
  const db = getDb();
  const id = crypto.randomUUID();

  await db.insert(pricingRules).values({
    id,
    productId: input.productId,
    name: input.name,
    ruleType: input.ruleType,
    modifierType: input.modifierType,
    amountCents: input.amountCents,
    amountPercent: input.amountPercent,
    appliesTo: input.appliesTo,
    priority: input.priority,
    isActive: input.isActive,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
  });

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "PRICING_RULE_CREATED",
    entityType: "pricing_rule",
    entityId: id,
    newValue: input,
  });

  return id;
}

export async function updatePricingRule(id: string, input: PricingRuleInput, actorId: string) {
  const db = getDb();
  const [existing] = await db.select().from(pricingRules).where(eq(pricingRules.id, id)).limit(1);
  if (!existing) throw new PricingRuleError("Pricing rule not found.");

  await db
    .update(pricingRules)
    .set({
      productId: input.productId,
      name: input.name,
      ruleType: input.ruleType,
      modifierType: input.modifierType,
      amountCents: input.amountCents,
      amountPercent: input.amountPercent,
      appliesTo: input.appliesTo,
      priority: input.priority,
      isActive: input.isActive,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      updatedAt: new Date(),
    })
    .where(eq(pricingRules.id, id));

  await writeAuditLog({
    actorType: "STAFF",
    actorId,
    action: "PRICING_RULE_UPDATED",
    entityType: "pricing_rule",
    entityId: id,
    oldValue: existing,
    newValue: input,
  });
}
