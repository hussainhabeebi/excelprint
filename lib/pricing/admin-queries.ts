import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { pricingRules, products } from "@/db/schema";

export async function listPricingRules() {
  const db = getDb();
  return db
    .select({
      rule: pricingRules,
      productName: products.name,
    })
    .from(pricingRules)
    .leftJoin(products, eq(pricingRules.productId, products.id))
    .orderBy(desc(pricingRules.priority), desc(pricingRules.createdAt));
}

export async function getPricingRule(id: string) {
  const db = getDb();
  const [rule] = await db.select().from(pricingRules).where(eq(pricingRules.id, id)).limit(1);
  return rule ?? null;
}
