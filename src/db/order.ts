import type { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  bigint,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const ordersTable = mysqlTable("orders", {
  id: bigint({ mode: "number", unsigned: true })
    .autoincrement()
    .notNull()
    .primaryKey(),
  crew_id: varchar("crew_id", { length: 64 }),
  user_id: varchar("user_id", { length: 64 }).notNull(),
  cart_id: bigint({ mode: "number", unsigned: true }).notNull(),
  delivered_at: timestamp("delivered_at"),
  status_code: int("status_code").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deleted_at: timestamp("deleted_at"),
});

export const ordersSelectSchema = createSelectSchema(ordersTable);
export const ordersInsertSchema = createInsertSchema(ordersTable);
export type OrdersInsert = z.infer<typeof ordersInsertSchema>;
export type OrdersSelect = z.infer<typeof ordersSelectSchema>;
