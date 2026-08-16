import "server-only";
import { and, count, desc, eq, like, or, sum } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { addresses, customers, orders } from "@/db/schema";

export interface AdminCustomerListFilters {
  search?: string;
}

export async function listCustomersForAdmin(filters: AdminCustomerListFilters = {}) {
  const db = getDb();

  const conditions = [];
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(like(customers.email, term), like(customers.firstName, term), like(customers.lastName, term)));
  }

  const rows = await db
    .select({
      id: customers.id,
      email: customers.email,
      firstName: customers.firstName,
      lastName: customers.lastName,
      phone: customers.phone,
      status: customers.status,
      createdAt: customers.createdAt,
      orderCount: count(orders.id),
      totalSpentCents: sum(orders.totalCents),
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(customers.id)
    .orderBy(desc(customers.createdAt))
    .limit(100);

  return rows.map((row) => ({ ...row, totalSpentCents: Number(row.totalSpentCents ?? 0) }));
}

export async function getCustomerForAdmin(customerId: string) {
  const db = getDb();
  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) return null;

  const customerAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.customerId, customerId))
    .orderBy(desc(addresses.createdAt));

  const customerOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      totalCents: orders.totalCents,
      placedAt: orders.placedAt,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));

  return { customer, addresses: customerAddresses, orders: customerOrders };
}
