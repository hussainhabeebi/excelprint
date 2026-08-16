import "server-only";
import { getDb } from "@/lib/db/client";
import { designRequestFiles, designRequests } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import type { DesignRequestInput } from "@/lib/validation/design";

export async function createDesignRequest(
  orderItemId: string,
  customerId: string,
  input: DesignRequestInput,
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();

  await db.insert(designRequests).values({
    id,
    orderItemId,
    requestedByCustomerId: customerId,
    companyName: input.companyName,
    contentText: input.contentText,
    contactInfo: input.contactInfo,
    preferredColors: input.preferredColors,
    designNotes: input.designNotes,
    stylePreference: input.stylePreference,
    status: "NEW",
  });

  await writeAuditLog({
    actorType: "CUSTOMER",
    actorId: customerId,
    action: "DESIGN_REQUEST_CREATED",
    entityType: "design_request",
    entityId: id,
    newValue: { orderItemId },
  });

  return id;
}

export async function addDesignRequestFile(designRequestId: string, fileKey: string, fileName: string, kind: "REFERENCE" | "LOGO") {
  const db = getDb();
  await db.insert(designRequestFiles).values({
    id: crypto.randomUUID(),
    designRequestId,
    fileKey,
    fileName,
    kind,
  });
}
