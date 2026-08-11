import "server-only";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db/client";
import { customers, roles, userRoles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE_NAME, resolveSession } from "./session";
import type { StaffRole } from "@/lib/orders/constants";

export interface CurrentCustomer {
  type: "customer";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CurrentStaff {
  type: "staff";
  id: string;
  email: string;
  name: string;
  roles: StaffRole[];
}

export type CurrentUser = CurrentCustomer | CurrentStaff | null;

/**
 * Resolves the logged-in customer or staff member from the session cookie.
 * Call this at the top of every server component/route handler that needs
 * identity — never trust a client-supplied user id.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await resolveSession(token);
  if (!session) return null;

  const db = getDb();

  if (session.subjectType === "CUSTOMER") {
    const [customer] = await db.select().from(customers).where(eq(customers.id, session.subjectId)).limit(1);
    if (!customer || customer.status !== "ACTIVE") return null;
    return {
      type: "customer",
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    };
  }

  const [staff] = await db.select().from(users).where(eq(users.id, session.subjectId)).limit(1);
  if (!staff || staff.status !== "ACTIVE") return null;

  const assignedRoles = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, staff.id));

  return {
    type: "staff",
    id: staff.id,
    email: staff.email,
    name: staff.name,
    roles: assignedRoles.map((r) => r.name as StaffRole),
  };
}
