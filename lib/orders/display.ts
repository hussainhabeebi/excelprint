import type { OrderStatus, PaymentStatus } from "./constants";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  AWAITING_ARTWORK: "Awaiting Artwork",
  DESIGN_REQUIRED: "Design Required",
  DESIGN_IN_PROGRESS: "Design In Progress",
  AWAITING_APPROVAL: "Awaiting Your Approval",
  CHANGES_REQUESTED: "Changes Requested",
  APPROVED: "Approved",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAID: "Paid",
  QUEUED_FOR_PRINT: "Queued for Print",
  PRINTING: "Printing",
  FINISHING: "Finishing",
  QUALITY_CHECK: "Quality Check",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PENDING: "Payment Pending",
  PAID: "Paid",
  PARTIALLY_REFUNDED: "Partially Refunded",
  REFUNDED: "Refunded",
  FAILED: "Payment Failed",
};

type BadgeVariant = "default" | "brand" | "secondary" | "outline" | "success" | "warning" | "destructive";

export function orderStatusBadgeVariant(status: OrderStatus): BadgeVariant {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELLED") return "destructive";
  if (status === "CHANGES_REQUESTED") return "warning";
  return "brand";
}
