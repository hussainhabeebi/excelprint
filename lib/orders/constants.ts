/**
 * Canonical status enums for the platform's state machines.
 *
 * These are the single source of truth — do not redefine these lists
 * elsewhere. DB columns store the string values directly (SQLite/D1 has
 * no native enum type); Zod schemas and Drizzle `text({ enum })` typings
 * both derive from these arrays so the DB, API, and UI can never drift
 * out of sync.
 */

export const ORDER_STATUSES = [
  "DRAFT",
  "AWAITING_ARTWORK",
  "DESIGN_REQUIRED",
  "DESIGN_IN_PROGRESS",
  "AWAITING_APPROVAL",
  "CHANGES_REQUESTED",
  "APPROVED",
  "AWAITING_PAYMENT",
  "PAID",
  "QUEUED_FOR_PRINT",
  "PRINTING",
  "FINISHING",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Allowed forward transitions. Enforced centrally in
 * lib/orders/state-machine.ts — never mutate order.status directly from a
 * route handler or admin action.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ["AWAITING_ARTWORK", "CANCELLED"],
  AWAITING_ARTWORK: ["DESIGN_REQUIRED", "AWAITING_APPROVAL", "CANCELLED"],
  DESIGN_REQUIRED: ["DESIGN_IN_PROGRESS", "CANCELLED"],
  DESIGN_IN_PROGRESS: ["AWAITING_APPROVAL", "CANCELLED"],
  AWAITING_APPROVAL: ["CHANGES_REQUESTED", "APPROVED", "CANCELLED"],
  CHANGES_REQUESTED: ["DESIGN_IN_PROGRESS", "CANCELLED"],
  APPROVED: ["AWAITING_PAYMENT", "CANCELLED"],
  AWAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["QUEUED_FOR_PRINT", "CANCELLED"],
  QUEUED_FOR_PRINT: ["PRINTING", "CANCELLED"],
  PRINTING: ["FINISHING", "CANCELLED"],
  FINISHING: ["QUALITY_CHECK"],
  QUALITY_CHECK: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "PRINTING"],
  READY_FOR_PICKUP: ["COMPLETED"],
  OUT_FOR_DELIVERY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const ARTWORK_STATUSES = [
  "ARTWORK_REQUIRED",
  "ARTWORK_RECEIVED",
  "DESIGN_IN_PROGRESS",
  "PROOF_READY",
  "CHANGE_REQUESTED",
  "REVISION_IN_PROGRESS",
  "FINAL_PROOF_READY",
  "APPROVED",
  "PRINT_READY",
] as const;
export type ArtworkStatus = (typeof ARTWORK_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PENDING",
  "PAID",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
  "FAILED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const QUOTE_STATUSES = [
  "NEW",
  "REVIEWING",
  "QUOTED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const ARTWORK_SOURCES = ["CUSTOMER_UPLOAD", "DESIGNER_REVISION", "AI_GENERATION"] as const;
export type ArtworkSource = (typeof ARTWORK_SOURCES)[number];

export const DESIGN_METHODS = ["UPLOAD", "REQUEST_DESIGN", "AI_GENERATE"] as const;
export type DesignMethod = (typeof DESIGN_METHODS)[number];

export const STAFF_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "DESIGNER",
  "PRODUCTION",
  "ACCOUNTING",
  "CUSTOMER_SUPPORT",
] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const AI_GENERATION_STATUSES = ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"] as const;
export type AiGenerationStatus = (typeof AI_GENERATION_STATUSES)[number];

export const DELIVERY_METHOD_TYPES = ["PICKUP", "LOCAL_DELIVERY", "COURIER"] as const;
export type DeliveryMethodType = (typeof DELIVERY_METHOD_TYPES)[number];
