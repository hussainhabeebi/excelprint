import type { StaffRole } from "@/lib/orders/constants";
import type { CurrentStaff, CurrentUser } from "./current-user";

/**
 * Coarse-grained section access per role (spec section 37 — "users should
 * only see information required by their role"). Fine-grained permissions
 * live in the permissions/role_permissions tables for admin-configurable
 * cases; this map covers the fixed set of admin sections that always exist.
 */
const ROLE_SECTIONS: Record<StaffRole, readonly string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "dashboard",
    "orders",
    "products",
    "pricing",
    "customers",
    "quotes",
    "seo",
    "content",
    "reports",
  ],
  DESIGNER: ["design-queue", "artwork", "proofs"],
  PRODUCTION: ["production-queue"],
  ACCOUNTING: ["payments", "invoices", "refunds", "reports"],
  CUSTOMER_SUPPORT: ["orders", "customers", "quotes"],
};

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function staffHasSection(staff: CurrentStaff, section: string): boolean {
  return staff.roles.some((role) => {
    const sections = ROLE_SECTIONS[role];
    return sections.includes("*") || sections.includes(section);
  });
}

export function staffHasRole(staff: CurrentStaff, ...allowed: StaffRole[]): boolean {
  return staff.roles.some((role) => allowed.includes(role));
}

/** Throws ForbiddenError unless the current user is staff with access to `section`. */
export function requireStaffSection(user: CurrentUser, section: string): CurrentStaff {
  if (!user || user.type !== "staff") throw new ForbiddenError("Staff login required.");
  if (!staffHasSection(user, section)) throw new ForbiddenError();
  return user;
}

export function requireStaffRole(user: CurrentUser, ...allowed: StaffRole[]): CurrentStaff {
  if (!user || user.type !== "staff") throw new ForbiddenError("Staff login required.");
  if (!staffHasRole(user, ...allowed)) throw new ForbiddenError();
  return user;
}
