import { ORDER_STATUS_TRANSITIONS, type OrderStatus } from "./constants";

export class InvalidOrderTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Order cannot transition from ${from} to ${to}`);
    this.name = "InvalidOrderTransitionError";
  }
}

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Validates a requested order status change.
 *
 * This does not write to the database — callers must persist the new
 * status and an order_status_history row in the same transaction. See
 * AGENTS.md: every order state change must be logged.
 */
export function assertValidOrderTransition(from: OrderStatus, to: OrderStatus): void {
  if (from === to) return;
  if (!canTransitionOrder(from, to)) {
    throw new InvalidOrderTransitionError(from, to);
  }
}
