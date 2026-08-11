import { integer, text } from "drizzle-orm/sqlite-core";

/** Shared column helpers so every table stays consistent. */

export const id = () => text("id").primaryKey();

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};

/** Add alongside `timestamps` only for business records that must be
 * soft-deleted rather than hard-deleted (see AGENTS.md data retention rules). */
export const softDelete = {
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
};

export const money = (name: string) => integer(name).notNull().default(0);
