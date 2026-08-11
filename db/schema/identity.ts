import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, softDelete, timestamps } from "./helpers";
import { STAFF_ROLES } from "@/lib/orders/constants";

/** Staff / admin accounts. Customers are a separate table (see customers below) —
 * the storefront and the back office are different trust boundaries. */
export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  status: text("status", { enum: ["ACTIVE", "DISABLED"] }).notNull().default("ACTIVE"),
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp_ms" }),
  ...timestamps,
  ...softDelete,
}, (t) => [uniqueIndex("users_email_idx").on(t.email)]);

export const roles = sqliteTable("roles", {
  id: id(),
  name: text("name", { enum: STAFF_ROLES }).notNull(),
  description: text("description"),
}, (t) => [uniqueIndex("roles_name_idx").on(t.name)]);

export const permissions = sqliteTable("permissions", {
  id: id(),
  key: text("key").notNull(),
  description: text("description"),
}, (t) => [uniqueIndex("permissions_key_idx").on(t.key)]);

export const rolePermissions = sqliteTable("role_permissions", {
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })]);

export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.userId, t.roleId] })]);

/** Session tokens for BOTH staff and customer logins. We store only a SHA-256
 * hash of the token (never the raw token) so a DB read can't be replayed into
 * a live session — see lib/auth/session.ts. */
export const userSessions = sqliteTable("user_sessions", {
  id: id(),
  tokenHash: text("token_hash").notNull(),
  subjectType: text("subject_type", { enum: ["STAFF", "CUSTOMER"] }).notNull(),
  subjectId: text("subject_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (t) => [uniqueIndex("user_sessions_token_hash_idx").on(t.tokenHash)]);

export const customers = sqliteTable("customers", {
  id: id(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp_ms" }),
  marketingOptIn: integer("marketing_opt_in", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["ACTIVE", "DISABLED"] }).notNull().default("ACTIVE"),
  ...timestamps,
  ...softDelete,
}, (t) => [uniqueIndex("customers_email_idx").on(t.email)]);

export const companies = sqliteTable("companies", {
  id: id(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  trn: text("trn"),
  ...timestamps,
});

export const addresses = sqliteTable("addresses", {
  id: id(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  label: text("label"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  emirate: text("emirate"),
  country: text("country").notNull().default("AE"),
  postalCode: text("postal_code"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});
