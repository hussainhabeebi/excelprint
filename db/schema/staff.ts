import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id } from "./helpers";
import { orderItems } from "./orders";
import { users } from "./identity";

export const staffAssignments = sqliteTable("staff_assignments", {
  id: id(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().references(() => users.id),
  role: text("role", { enum: ["DESIGNER", "PRODUCTION"] }).notNull(),
  assignedAt: integer("assigned_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  unassignedAt: integer("unassigned_at", { mode: "timestamp_ms" }),
});
