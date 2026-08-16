import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { deliveryMethods } from "@/db/schema";

export async function listActiveDeliveryMethods() {
  const db = getDb();
  return db
    .select()
    .from(deliveryMethods)
    .where(eq(deliveryMethods.isActive, true))
    .orderBy(asc(deliveryMethods.sortOrder));
}

export async function getDeliveryMethod(id: string) {
  const db = getDb();
  const [method] = await db.select().from(deliveryMethods).where(eq(deliveryMethods.id, id)).limit(1);
  return method ?? null;
}
