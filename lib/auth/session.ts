import { getDb } from "@/lib/db/client";
import { userSessions } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "excelprint_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type SessionSubjectType = "STAFF" | "CUSTOMER";

/**
 * We store only a SHA-256 hash of the session token in D1. The raw token
 * lives solely in the httpOnly cookie — a database read (backup, replica
 * lag, admin query) can never be replayed into a live session.
 */
async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!);
}

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export async function createSession(
  subjectType: SessionSubjectType,
  subjectId: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<CreatedSession> {
  const token = generateToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const db = getDb();
  await db.insert(userSessions).values({
    id: crypto.randomUUID(),
    tokenHash,
    subjectType,
    subjectId,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    expiresAt,
  });

  return { token, expiresAt };
}

export interface ResolvedSession {
  subjectType: SessionSubjectType;
  subjectId: string;
}

export async function resolveSession(token: string): Promise<ResolvedSession | null> {
  const tokenHash = await hashToken(token);
  const db = getDb();
  const [session] = await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.tokenHash, tokenHash), gt(userSessions.expiresAt, new Date())))
    .limit(1);

  if (!session) return null;
  return { subjectType: session.subjectType as SessionSubjectType, subjectId: session.subjectId };
}

export async function revokeSession(token: string): Promise<void> {
  const tokenHash = await hashToken(token);
  const db = getDb();
  await db.delete(userSessions).where(eq(userSessions.tokenHash, tokenHash));
}
