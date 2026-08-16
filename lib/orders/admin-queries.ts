import "server-only";
import { and, desc, eq, like, or } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  addresses,
  customers,
  deliveries,
  deliveryMethods,
  orderItems,
  orders,
  orderStatusHistory,
} from "@/db/schema";
import type { OrderStatus } from "./constants";

export interface AdminOrderListFilters {
  status?: OrderStatus;
  search?: string;
}

export async function listOrdersForAdmin(filters: AdminOrderListFilters = {}) {
  const db = getDb();

  const conditions = [];
  if (filters.status) conditions.push(eq(orders.status, filters.status));
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(like(orders.orderNumber, term), like(customers.email, term)));
  }

  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      totalCents: orders.totalCents,
      placedAt: orders.placedAt,
      createdAt: orders.createdAt,
      customerEmail: customers.email,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(100);
}

export async function getOrderForAdmin(orderId: string) {
  const db = getDb();
  const [order] = await db
    .select({
      order: orders,
      customerEmail: customers.email,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
      customerPhone: customers.phone,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  const [delivery] = await db
    .select({
      status: deliveries.status,
      trackingReference: deliveries.trackingReference,
      methodName: deliveryMethods.name,
      addressLine1: addresses.line1,
      addressLine2: addresses.line2,
      addressCity: addresses.city,
      addressEmirate: addresses.emirate,
    })
    .from(deliveries)
    .innerJoin(deliveryMethods, eq(deliveries.deliveryMethodId, deliveryMethods.id))
    .leftJoin(addresses, eq(deliveries.addressId, addresses.id))
    .where(eq(deliveries.orderId, orderId))
    .limit(1);

  const history = await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, orderId))
    .orderBy(desc(orderStatusHistory.createdAt));

  return {
    order: order.order,
    customer: {
      email: order.customerEmail,
      firstName: order.customerFirstName,
      lastName: order.customerLastName,
      phone: order.customerPhone,
    },
    items,
    delivery: delivery ?? null,
    history,
  };
}
