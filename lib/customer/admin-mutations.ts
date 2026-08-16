import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { customers } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";

export class CustomerAdminError extends Error {}

export async function setCustomerStatus(
  customerId: string,
  staffId: string,
  status: "ACTIVE" | "DISABLED",
): Promise<void> {
  const db = getDb();
  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) throw new CustomerAdminError("Customer not found.");

  await db.update(customers).set({ status, updatedAt: new Date() }).where(eq(customers.id, customerId));

  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "CUSTOMER_STATUS_CHANGED",
    entityType: "customer",
    entityId: customerId,
    oldValue: { status: customer.status },
    newValue: { status },
  });
}
