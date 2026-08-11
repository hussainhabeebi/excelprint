import "server-only";
import { getDb } from "@/lib/db/client";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import { createSession, revokeSession, type CreatedSession } from "./session";
import { writeAuditLog } from "@/lib/security/audit";
import type { RegisterCustomerInput } from "@/lib/validation/auth";

export class AuthError extends Error {}

export async function registerCustomer(
  input: RegisterCustomerInput,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<CreatedSession> {
  const db = getDb();

  const [existing] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, input.email)).limit(1);
  if (existing) {
    throw new AuthError("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const id = crypto.randomUUID();

  await db.insert(customers).values({
    id,
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    marketingOptIn: input.marketingOptIn,
  });

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: id,
    action: "CUSTOMER_REGISTERED",
    entityType: "customer",
    entityId: id,
    ipAddress: meta.ipAddress,
  });

  // TODO(Phase 6/notifications): enqueue an email-verification notification
  // via lib/notifications once the notifications worker exists.

  return createSession("CUSTOMER", id, meta);
}

export async function authenticateCustomer(
  email: string,
  password: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<CreatedSession> {
  const db = getDb();
  const [customer] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);

  if (!customer || !customer.passwordHash || customer.status !== "ACTIVE") {
    throw new AuthError("Invalid email or password.");
  }

  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) {
    throw new AuthError("Invalid email or password.");
  }

  return createSession("CUSTOMER", customer.id, meta);
}

export async function logoutCustomer(token: string): Promise<void> {
  await revokeSession(token);
}
