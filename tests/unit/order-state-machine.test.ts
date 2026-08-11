import { describe, expect, it } from "vitest";
import { assertValidOrderTransition, canTransitionOrder, InvalidOrderTransitionError } from "@/lib/orders/state-machine";

describe("order state machine", () => {
  it("allows a valid forward transition", () => {
    expect(canTransitionOrder("PAID", "QUEUED_FOR_PRINT")).toBe(true);
    expect(() => assertValidOrderTransition("PAID", "QUEUED_FOR_PRINT")).not.toThrow();
  });

  it("rejects skipping states", () => {
    expect(canTransitionOrder("DRAFT", "PAID")).toBe(false);
    expect(() => assertValidOrderTransition("DRAFT", "PAID")).toThrow(InvalidOrderTransitionError);
  });

  it("rejects transitions out of terminal states", () => {
    expect(canTransitionOrder("COMPLETED", "CANCELLED")).toBe(false);
    expect(canTransitionOrder("CANCELLED", "DRAFT")).toBe(false);
  });

  it("treats a same-state transition as a no-op, not an error", () => {
    expect(() => assertValidOrderTransition("PRINTING", "PRINTING")).not.toThrow();
  });

  it("allows cancellation from every non-terminal state", () => {
    const nonTerminal = [
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
    ] as const;
    for (const status of nonTerminal) {
      expect(canTransitionOrder(status, "CANCELLED")).toBe(true);
    }
  });
});
