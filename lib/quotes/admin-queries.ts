import "server-only";
import { and, desc, eq, like, or } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { quotes } from "@/db/schema";
import type { QuoteStatus } from "@/lib/orders/constants";

export interface AdminQuoteListFilters {
  status?: QuoteStatus;
  search?: string;
}

export async function listQuotesForAdmin(filters: AdminQuoteListFilters = {}) {
  const db = getDb();

  const conditions = [];
  if (filters.status) conditions.push(eq(quotes.status, filters.status));
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(like(quotes.quoteNumber, term), like(quotes.email, term), like(quotes.customerName, term)));
  }

  return db
    .select()
    .from(quotes)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(quotes.createdAt))
    .limit(100);
}

export async function getQuoteForAdmin(quoteId: string) {
  const db = getDb();
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1);
  return quote ?? null;
}
