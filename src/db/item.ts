import type { z } from "@hono/zod-openapi";
import { mysqlTable, timestamp, bigint, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { number } from "zod";

export const itemsTable = mysqlTable("items", {
  id: bigint({ mode: "number", unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: bigint({ mode: "number", unsigned: true }).notNull(),
  store_id: varchar("store_id", { length: 64 }).notNull(),
  img_url: varchar("img_url", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});

export const itemsSelectSchema = createSelectSchema(itemsTable);
export const itemsInsertSchema = createInsertSchema(itemsTable);

export type ItemsInsert = z.infer<typeof itemsInsertSchema>;
