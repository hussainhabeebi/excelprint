import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { quotes } from "@/db/schema";
import { writeAuditLog } from "@/lib/security/audit";
import type { QuoteStatus } from "@/lib/orders/constants";

export class QuoteAdminError extends Error {}

export async function updateQuoteAsStaff(
  quoteId: string,
  staffId: string,
  input: { status: QuoteStatus; quotedPriceCents?: number },
): Promise<void> {
  const db = getDb();
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1);
  if (!quote) throw new QuoteAdminError("Quote not found.");

  await db
    .update(quotes)
    .set({
      status: input.status,
      quotedPriceCents: input.quotedPriceCents ?? quote.quotedPriceCents,
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, quoteId));

  await writeAuditLog({
    actorType: "STAFF",
    actorId: staffId,
    action: "QUOTE_UPDATED",
    entityType: "quote",
    entityId: quoteId,
    oldValue: { status: quote.status, quotedPriceCents: quote.quotedPriceCents },
    newValue: { status: input.status, quotedPriceCents: input.quotedPriceCents ?? quote.quotedPriceCents },
  });
}
