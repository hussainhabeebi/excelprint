import "server-only";
import { getDb } from "@/lib/db/client";
import { quotes } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import type { QuoteRequestInput } from "@/lib/validation/quotes";

function generateQuoteNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `QT${stamp}${random}`;
}

export async function createQuoteRequest(input: Omit<QuoteRequestInput, "turnstileToken">): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  const quoteNumber = generateQuoteNumber();

  await db.insert(quotes).values({
    id,
    quoteNumber,
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    company: input.company,
    productDescription: input.productDescription,
    quantity: input.quantity,
    dimensions: input.dimensions,
    material: input.material,
    deadline: input.deadline,
    description: input.description,
    status: "NEW",
  });

  await writeAuditLog({
    actorType: "SYSTEM",
    action: "QUOTE_REQUEST_CREATED",
    entityType: "quote",
    entityId: id,
  });

  return quoteNumber;
}
