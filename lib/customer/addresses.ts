import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { addresses } from "@/db/schema";
import type { AddressInput } from "@/lib/validation/checkout";

export async function listAddresses(customerId: string) {
  const db = getDb();
  return db.select().from(addresses).where(eq(addresses.customerId, customerId)).orderBy(addresses.createdAt);
}

export async function getAddress(customerId: string, addressId: string) {
  const db = getDb();
  const [address] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.customerId, customerId)))
    .limit(1);
  return address ?? null;
}

export async function createAddress(customerId: string, input: AddressInput) {
  const db = getDb();
  const id = crypto.randomUUID();

  const existing = await listAddresses(customerId);

  await db.insert(addresses).values({
    id,
    customerId,
    label: input.label,
    line1: input.line1,
    line2: input.line2,
    city: input.city,
    emirate: input.emirate,
    postalCode: input.postalCode,
    isDefault: existing.length === 0,
  });

  return id;
}
