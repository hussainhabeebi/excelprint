import "server-only";
import { getDb } from "@/lib/db/client";
import { auditLogs } from "@/db/schema";

interface WriteAuditLogInput {
  actorType: "CUSTOMER" | "STAFF" | "SYSTEM";
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
}

/**
 * The only sanctioned way to write to audit_logs — every significant
 * mutation (price change, status change, artwork upload, proof approval,
 * payment status change, refund, role change) must call this. See spec
 * section 38 and AGENTS.md.
 */
export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  const db = getDb();
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    actorType: input.actorType,
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    oldValue: input.oldValue ?? null,
    newValue: input.newValue ?? null,
    ipAddress: input.ipAddress,
  });
}
