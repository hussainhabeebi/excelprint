import "server-only";
import { getDb } from "@/lib/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";
import { createSession, type CreatedSession } from "./session";
import { AuthError } from "./customer-auth";

export async function authenticateStaff(
  email: string,
  password: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<CreatedSession> {
  const db = getDb();
  const [staff] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!staff || staff.status !== "ACTIVE") {
    throw new AuthError("Invalid email or password.");
  }

  const valid = await verifyPassword(password, staff.passwordHash);
  if (!valid) {
    throw new AuthError("Invalid email or password.");
  }

  return createSession("STAFF", staff.id, meta);
}
